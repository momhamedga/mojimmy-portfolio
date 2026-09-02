import type { Browser, Page, Response, TestInfo } from "@playwright/test";
import { expect, test } from "@playwright/test";
import {
  HONEYPOT_FIELD,
  clientIdentity,
  collectHealth,
  contactPayload,
  isProviderRequest,
  isServerAction,
  waitForHydration,
} from "./_helpers";

const SUBMIT = "إرسال الرسالة";
const NAME_TOO_LONG = "الاسم طويل جداً";
const RATE_LIMITED = "محاولات كثيرة، حاول مرة أخرى بعد قليل.";
const GENERIC_ERROR = "تعذر إرسال الرسالة الآن. حاول مرة أخرى لاحقًا.";

/**
 * صفحة بهوية عميل خاصة.
 *
 * حدّ المعدّل خريطة داخل ذاكرة الخادم مفتاحها عنوان العميل، والخادم عملية
 * واحدة لكل التشغيل. بلا هوية منفصلة يرث كل اختبار دلو الاختبار السابق.
 */
async function pageWithIdentity(
  browser: Browser,
  ip: string,
): Promise<{ page: Page; close: () => Promise<void> }> {
  const context = await browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": ip } });
  const page = await context.newPage();
  return { page, close: () => context.close() };
}

/** يملأ الحقول المرئية ثم يعيد الحمولة المستخدمة. */
async function fillForm(page: Page, values: { name: string; email: string; message: string }) {
  await page.getByLabel("الاسم").fill(values.name);
  await page.getByLabel("البريد الإلكتروني").fill(values.email);
  await page.getByLabel("تفاصيل المشروع").fill(values.message);
}

/** ينقر ويعود باستجابة الـServer Action نفسها — انتظار حتمي بلا مهل ثابتة. */
async function submitAndWait(page: Page): Promise<Response> {
  const [response] = await Promise.all([
    page.waitForResponse((res) => isServerAction(res.request())),
    page.getByRole("button", { name: SUBMIT }).click(),
  ]);
  return response;
}

/**
 * تنبيه النموذج وحده.
 *
 * Next يحقن #__next-route-announcer__ بـrole="alert" في كل صفحة، فالبحث
 * العام عن الدور يصطدم بعنصرين. التحديد داخل النموذج يعزل تنبيهنا وحده.
 */
function formAlert(page: Page) {
  return page.locator("form").getByRole("alert");
}

/**
 * دورة إرسال كاملة تنتهي بحالة مستقرة.
 *
 * `submitAndWait` يعود لحظة وصول الاستجابة، لكن React يُفرِغ حقول النموذج
 * **بعدها** عند انتهاء الـaction. إعادة التعبئة قبل ذلك تُمحى، فيُرسل النموذج
 * فارغًا ويحجبه تحقّق المتصفح فلا يصل الخادم طلب إطلاقًا. لذلك ننتظر خلوّ
 * الحقل — إشارة حتمية على أن React أنهى عمله — قبل أي محاولة تالية.
 */
async function submitAndSettle(
  page: Page,
  values: { name: string; email: string; message: string },
): Promise<void> {
  await fillForm(page, values);
  await submitAndWait(page);
  await expect(page.getByLabel("الاسم")).toHaveValue("");
}

/** حقل الفخ مخفي عن المستخدم عمدًا، فيُملأ برمجيًا كما يفعل البوت. */
async function fillHoneypot(page: Page, value: string): Promise<void> {
  await page.locator(`input[name="${HONEYPOT_FIELD}"]`).fill(value, { force: true });
}

/**
 * إرسال يصل لحدّ المعدّل بلا لمس المزوّد إطلاقًا.
 *
 * تحقّق العميل يفرض حدًّا أدنى للاسم فقط (٢ حرفًا) بينما الخادم يفرض حدًّا
 * أقصى (٨٠). فاسم من ٨١ حرفًا يعبر المتصفح، ويصل الخادم، ويمرّ بحقل الفخ،
 * **ويزيد عدّاد حدّ المعدّل**، ثم يسقط في Zod قبل أي استدعاء للمزوّد.
 */
function overlongNamePayload(testInfo: TestInfo) {
  const base = contactPayload(testInfo);
  return { ...base, name: "ط".repeat(81) };
}

test.describe("E12 — client validation blocks submission", () => {
  test("invalid name, email and message never reach the server", async ({ page }) => {
    const health = collectHealth(page);
    await page.goto("/");
    await expect(page.locator("form")).toBeVisible();
    await waitForHydration(page);

    await fillForm(page, { name: "A", email: "nope", message: "قصير" });
    await page.getByRole("button", { name: SUBMIT }).click();

    await expect(page.getByText("أخبرني ما اسمك الكريم؟")).toBeVisible();
    await expect(page.getByText("البريد الإلكتروني غير دقيق")).toBeVisible();
    await expect(page.getByText("مساحة الرسالة قصيرة جداً، أخبرني بالمزيد..")).toBeVisible();

    // الجوهر: تحقّق المتصفح أوقف الإرسال، فلا طلب غادر الصفحة أصلًا
    expect(health.actionPosts).toHaveLength(0);
    expect(health.consoleErrors).toEqual([]);

    // إعلان واحد مهذّب بعدد الحقول الراسبة — لا ثلاثة تنبيهات.
    // التركيز ينقل المستخدم لأول خطأ، وهذا السطر يخبره أن هناك غيره.
    const summary = page.locator('form [aria-live="polite"]');
    await expect(summary).toHaveCount(1);
    await expect(summary).toHaveText("3 حقول تحتاج إلى تصحيح");
    await expect(summary).toHaveClass(/sr-only/);

    // ما كتبه المستخدم يبقى كما هو.
    //
    // كان React 19 يعيد تعيين النموذج بعد اكتمال دالة الـaction مهما كانت
    // نتيجتها، فالخروج المبكر عند الخطأ كان يمسح الحقول الثلاثة. التأكيد
    // على القيم — لا على الرسائل وحدها — هو ما يمنع عودة العطب.
    await expect(page.getByLabel("الاسم")).toHaveValue("A");
    await expect(page.getByLabel("البريد الإلكتروني")).toHaveValue("nope");
    await expect(page.getByLabel("تفاصيل المشروع")).toHaveValue("قصير");
  });

  test("keyboard submission preserves values too, and one correction at a time", async ({
    page,
  }) => {
    const health = collectHealth(page);
    await page.goto("/");
    await expect(page.locator("form")).toBeVisible();
    await waitForHydration(page);

    await fillForm(page, { name: "A", email: "nope", message: "قصير" });

    // إرسال بلوحة المفاتيح لا بالنقر: مسار ثانٍ للحدث نفسه، ولو حُرس النقر
    // وحده لظلّ العطب حيًّا هنا.
    await page.getByLabel("الاسم").press("Enter");

    await expect(page.getByText("أخبرني ما اسمك الكريم؟")).toBeVisible();
    await expect(page.getByLabel("الاسم")).toHaveValue("A");
    await expect(page.getByLabel("البريد الإلكتروني")).toHaveValue("nope");
    await expect(page.getByLabel("تفاصيل المشروع")).toHaveValue("قصير");
    expect(health.allPosts).toHaveLength(0);

    // تصحيح حقل واحد: خطؤه يزول، وأخطاء البقية وقيمهم كما هي
    await page.getByLabel("الاسم").fill("مستخدم اختبار");
    await page.getByRole("button", { name: SUBMIT }).click();

    await expect(page.getByText("أخبرني ما اسمك الكريم؟")).toHaveCount(0);
    await expect(page.getByText("البريد الإلكتروني غير دقيق")).toBeVisible();
    await expect(page.getByText("مساحة الرسالة قصيرة جداً، أخبرني بالمزيد..")).toBeVisible();
    await expect(page.getByLabel("الاسم")).toHaveValue("مستخدم اختبار");
    await expect(page.getByLabel("البريد الإلكتروني")).toHaveValue("nope");
    await expect(page.getByLabel("تفاصيل المشروع")).toHaveValue("قصير");

    // ما دام التحقق في العميل راسبًا، لا طلب واحد يغادر الصفحة
    expect(health.allPosts).toHaveLength(0);
    expect(health.actionPosts).toHaveLength(0);
    expect(health.consoleErrors).toEqual([]);
  });
});

test.describe("E13 — honeypot success UI contract", () => {
  test("filled honeypot yields the success UI with exactly one request", async ({
    browser,
  }, testInfo) => {
    const { page, close } = await pageWithIdentity(browser, clientIdentity(testInfo));
    try {
      const health = collectHealth(page);
      await page.goto("/");
      await expect(page.locator("form")).toBeVisible();
      await waitForHydration(page);

      await fillForm(page, contactPayload(testInfo));
      await fillHoneypot(page, "e2e-bot");
      await submitAndWait(page);

      await expect(page.getByRole("status")).toBeVisible();
      await expect(page.getByText("تم الإرسال")).toBeVisible();

      expect(health.actionPosts).toHaveLength(1);
      // المتصفح لا يكلّم المزوّد إطلاقًا — النقل دائمًا عبر الـServer Action
      expect(health.allPosts.filter((r) => isProviderRequest(r.url()))).toHaveLength(0);
      expect(health.pageErrors).toEqual([]);
    } finally {
      await close();
    }
  });

  test("real Enter keypress submits exactly once", async ({ browser }, testInfo) => {
    const { page, close } = await pageWithIdentity(browser, clientIdentity(testInfo));
    try {
      const health = collectHealth(page);
      await page.goto("/");
      await expect(page.locator("form")).toBeVisible();
      await waitForHydration(page);

      await fillForm(page, contactPayload(testInfo));
      await fillHoneypot(page, "e2e-bot");

      // ضغطة مفتاح حقيقية عبر بروتوكول الإدخال، لا KeyboardEvent مُصنَّع:
      // الإرسال الضمني للنموذج لا يستجيب للأحداث المُصنَّعة.
      await page.getByLabel("الاسم").click();
      await Promise.all([
        page.waitForResponse((res) => isServerAction(res.request())),
        page.keyboard.press("Enter"),
      ]);

      await expect(page.getByRole("status")).toBeVisible();
      expect(health.actionPosts).toHaveLength(1);
    } finally {
      await close();
    }
  });
});

test.describe("E15 — same-tick double submit guard", () => {
  test("three synchronous clicks produce exactly one server call", async ({
    browser,
  }, testInfo) => {
    const { page, close } = await pageWithIdentity(browser, clientIdentity(testInfo));
    try {
      const health = collectHealth(page);
      await page.goto("/");
      await expect(page.locator("form")).toBeVisible();
      await waitForHydration(page);

      await fillForm(page, contactPayload(testInfo));
      await fillHoneypot(page, "e2e-bot");

      // النقرات الثلاث تُرسَل داخل نفس المهمة الدقيقة في المتصفح، فتُنفَّذ
      // handleAction ثلاث مرات قبل أن يُثبّت React أي إعادة تصيير. هذا هو
      // السباق نفسه الذي أصلحته Phase 3B؛ نقرات Playwright المتتالية مع
      // await بينها لا تُنتجه لأن كل واحدة تقع في مهمة مستقلة.
      await Promise.all([
        page.waitForResponse((res) => isServerAction(res.request())),
        page.evaluate(() => {
          const button = document.querySelector<HTMLButtonElement>('form button[type="submit"]');
          if (!button) throw new Error("submit button not found");
          button.click();
          button.click();
          button.click();
        }),
      ]);

      await expect(page.getByRole("status")).toBeVisible();
      expect(health.actionPosts).toHaveLength(1);
    } finally {
      await close();
    }
  });
});

test.describe("E16 — application rate limit and client isolation", () => {
  test("fourth submission from one identity is rate limited, without any provider call", async ({
    browser,
  }, testInfo) => {
    const ip = clientIdentity(testInfo);
    const { page, close } = await pageWithIdentity(browser, ip);
    try {
      const health = collectHealth(page);
      await page.goto("/");
      await expect(page.locator("form")).toBeVisible();
      await waitForHydration(page);

      const payload = overlongNamePayload(testInfo);

      // ثلاث محاولات تعبر حقل الفخ وتزيد العدّاد ثم تسقط في تحقّق الخادم
      for (let i = 0; i < 3; i++) {
        await submitAndSettle(page, payload);
        await expect(page.getByText(NAME_TOO_LONG)).toBeVisible();
      }

      // الرابعة تتجاوز الحدّ: ٣ في ٦٠ ثانية
      await submitAndSettle(page, payload);
      await expect(formAlert(page)).toHaveText(RATE_LIMITED);

      expect(health.actionPosts).toHaveLength(4);
      expect(health.pageErrors).toEqual([]);
    } finally {
      await close();
    }
  });

  test("a second identity does not inherit the first identity's limit", async ({
    browser,
  }, testInfo) => {
    // خمسة إرسالات وتحميلا صفحة في اختبار واحد — أثقل من أي اختبار آخر هنا،
    // ويتجاوز المهلة الافتراضية تحت التوازي. الإقرار بذلك أصدق من رفع المهلة
    // العامة وإخفاء البطء الحقيقي في بقية السويت.
    test.slow();

    const ipA = clientIdentity(testInfo, "::A");
    const ipB = clientIdentity(testInfo, "::B");
    const payload = overlongNamePayload(testInfo);

    // الهوية A: نستهلك دلوها بالكامل
    const a = await pageWithIdentity(browser, ipA);
    try {
      await a.page.goto("/");
      await expect(a.page.locator("form")).toBeVisible();
      await waitForHydration(a.page);
      // React يُفرِغ حقول النموذج غير المتحكَّم فيها بعد انتهاء الـaction،
      // فكل محاولة تحتاج إعادة تعبئة وإلا حجبها تحقّق المتصفح قبل الإرسال.
      for (let i = 0; i < 4; i++) {
        await submitAndSettle(a.page, payload);
      }
      await expect(formAlert(a.page)).toHaveText(RATE_LIMITED);
    } finally {
      await a.close();
    }

    // الهوية B: لو كانت الترويسة مهملة لورثت الحظر — يجب ألّا يحدث
    const b = await pageWithIdentity(browser, ipB);
    try {
      await b.page.goto("/");
      await expect(b.page.locator("form")).toBeVisible();
      await waitForHydration(b.page);
      await submitAndSettle(b.page, payload);

      await expect(b.page.getByText(NAME_TOO_LONG)).toBeVisible();
      await expect(formAlert(b.page)).toHaveCount(0);
    } finally {
      await b.close();
    }
  });
});

test.describe("E14 — provider failure surface", () => {
  // الاختبار الوحيد المسموح له بالوصول إلى مزوّد البريد، بمفتاح غير صالح
  // عمدًا. ميزانية التشغيل الكامل: استدعاء واحد. الوسم يسمح باستبعاده
  // أثناء تكرار الاستقرار حتى لا يتضاعف العدد.
  test("invalid provider key surfaces a generic error and leaks nothing @provider", async ({
    browser,
  }, testInfo) => {
    const { page, close } = await pageWithIdentity(browser, clientIdentity(testInfo));
    try {
      const health = collectHealth(page);
      await page.goto("/");
      await expect(page.locator("form")).toBeVisible();
      await waitForHydration(page);

      await fillForm(page, contactPayload(testInfo));
      await submitAndWait(page);

      const alert = formAlert(page);
      await expect(alert).toHaveText(GENERIC_ERROR);

      // لا تفاصيل مزوّد ولا رمز حالة ولا مفتاح في الواجهة
      const body = await page.locator("body").innerText();
      expect(body).not.toContain("resend");
      expect(body).not.toContain("RESEND_API_KEY");
      expect(body).not.toMatch(/re_[A-Za-z0-9]{16,}/);

      // النموذج ما زال صالحًا لإعادة المحاولة
      await expect(page.getByRole("button", { name: SUBMIT })).toBeEnabled();

      expect(health.actionPosts).toHaveLength(1);
      expect(health.pageErrors).toEqual([]);
    } finally {
      await close();
    }
  });
});
