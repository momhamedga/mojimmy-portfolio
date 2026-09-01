import type { Browser, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import {
  collectHealth,
  ensureProjectImagesDecoded,
  waitForFonts,
  waitForHydration,
  waitForScrollSettled,
} from "./_helpers";

/**
 * الانحدار البصري — Chromium على Linux وحده هو المرجع.
 *
 * المراجع تُولَّد في CI على ubuntu-latest بأمر صريح، وتُراجَع يدويًا قبل
 * الالتزام. تشغيل هذا الملف على ويندوز يُنتج ملفات `-win32` لا سلطة لها
 * ويجب حذفها؛ الغرض محليًا هو التحقّق من الآليات لا إنشاء مراجع.
 *
 * لا إرسال للنموذج هنا إطلاقًا: لا مزوّد، ولا بريد، ولا طلب إنتاج.
 */

const SHOT = {
  animations: "disabled",
  caret: "hide",
  scale: "css",
} as const;

type Theme = "dark" | "light";

/**
 * الثيم يُضبط قبل التنقّل لا بالنقر على الزر.
 *
 * النقر يشغّل حركة أيقونة framer وانتقال الثيم، فتصبح اللحظة التي تُلتقط فيها
 * الصورة مرتبطة بتوقيت الحركة. الكتابة المسبقة في التخزين تجعل الصفحة تُصيَّر
 * بالثيم المطلوب من أول إطار.
 */
async function openPage(
  browser: Browser,
  { width, height, theme }: { width: number; height: number; theme: Theme },
): Promise<{ page: Page; close: () => Promise<void> }> {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  await context.addInitScript((value) => {
    window.localStorage.setItem("theme", value as string);
  }, theme);

  const page = await context.newPage();
  return { page, close: () => context.close() };
}

/**
 * إطار عرض أطول من أي قسم — لالتقاط الأقسام في مرور واحد.
 *
 * Playwright يلتقط العنصر الأطول من الإطار على عدّة مرورات مع تمرير بينها،
 * وهذا وحده مصدر عدم الحتمية الذي رصدناه: لقطتان متتاليتان لـ`#projects`
 * (٣٣٩٨px داخل إطار ٨٤٤px) اختلفتا في ~٩٬٠٠٠–١٣٬٧٠٠ بكسل. تحديد مواضع
 * الاختلاف أرجعها إلى صور `loading="lazy" decoding="async"` وإلى حواف
 * تنعيم النص — أي إلى آليّة الالتقاط نفسها لا إلى التطبيق: القسم مكوّن
 * خادم بصفر جافاسكربت، ولا يحوي عنصر `.reveal` واحدًا.
 *
 * بإطار أطول من القسم يصبح الالتقاط مرورًا واحدًا، فتتطابق ثلاث لقطات
 * بايتًا ببايت على المقاسات الثلاثة. الارتفاع لا يغيّر التخطيط: ارتفاع
 * القسم المقيس واحد في الحالتين (٣٣٩٨/٤٣٣١/٣١٤١) لأن لا شيء فيه يعتمد على
 * وحدات vh. العرض وحده هو ما يحرّك التصميم المستجيب، وهو محفوظ كما هو.
 */
const SECTION_VIEWPORT_HEIGHT = 6000;

/** صفحة لالتقاط قسم كامل في مرور واحد. */
async function openSectionPage(
  browser: Browser,
  { width, theme }: { width: number; theme: Theme },
) {
  return openPage(browser, { width, height: SECTION_VIEWPORT_HEIGHT, theme });
}

/**
 * القسم أقصر من الإطار فعلًا — وإلّا عاد الالتقاط متعدّد المرورات صامتًا.
 *
 * بلا هذا التأكيد قد ينمو قسم يومًا ما فوق الإطار فتعود الرفرفة بلا سبب
 * ظاهر. الفشل هنا صريح ويقول ما يجب تغييره.
 */
async function expectSinglePass(page: Page, id: string) {
  const height = await page
    .locator(`#${id}`)
    .evaluate((el) => Math.ceil(el.getBoundingClientRect().height));
  expect(height, `#${id} أطول من إطار اللقطة — ارفع SECTION_VIEWPORT_HEIGHT`).toBeLessThan(
    SECTION_VIEWPORT_HEIGHT,
  );
}

/**
 * ترويسة الموقع — لا `page.locator("header")`.
 *
 * في الصفحة ترويستان: ترويسة التنقّل الثابتة وترويسة عنوان قسم المشاريع.
 * المحدّد بالوسم وحده يطابق اثنين، و`toHaveScreenshot` لا يبلغ عن ذلك
 * كانتهاك وضع صارم بل يسقط بـ`TypeError: ... Received undefined` — وهو
 * بالضبط الخطأ الذي رُصد في Phase 5A. الدور `banner` لا يصلح بديلًا: كلتا
 * الترويستين داخل حاويات تُلغيه، فعددهما صفر. الربط بالتنقّل الرئيسي يحدّد
 * الترويسة بمعناها لا بصنف تنسيقي قابل للتغيير.
 */
function mainHeader(page: Page) {
  return page
    .locator("header")
    .filter({ has: page.getByRole("navigation", { name: "التنقل الرئيسي" }) });
}

/** كل ما يجب أن يستقرّ قبل أي لقطة. */
async function settle(page: Page, theme: Theme) {
  await waitForHydration(page);
  await waitForFonts(page);
  await expect(page.locator("html")).toHaveClass(theme === "dark" ? /dark/ : /^(?!.*dark).*$/);
  await waitForScrollSettled(page);
}

/** يمرّر إلى قسم ثم ينتظر سكون Lenis — بلا أي مهلة ثابتة. */
async function scrollToSection(page: Page, id: string) {
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await waitForScrollSettled(page);
}

test.describe("visual regression @visual", () => {
  // ── Hero ─────────────────────────────────────────────────────────────
  for (const vp of [
    { label: "390", width: 390, height: 844, theme: "dark" as const },
    { label: "768", width: 768, height: 1024, theme: "dark" as const },
    { label: "1440", width: 1440, height: 900, theme: "dark" as const },
    { label: "1440", width: 1440, height: 900, theme: "light" as const },
  ]) {
    test(`hero ${vp.label} ${vp.theme} @visual`, async ({ browser }) => {
      const { page, close } = await openPage(browser, vp);
      try {
        const health = collectHealth(page);
        await page.goto("/");
        await settle(page, vp.theme);

        await expect(page.locator("#home")).toHaveScreenshot(
          `hero-${vp.label}-${vp.theme}.png`,
          SHOT,
        );
        expect(health.actionPosts).toHaveLength(0);
      } finally {
        await close();
      }
    });
  }

  // ── Navbar ───────────────────────────────────────────────────────────
  for (const theme of ["dark", "light"] as const) {
    test(`navbar 1440 ${theme} @visual`, async ({ browser }) => {
      const { page, close } = await openPage(browser, { width: 1440, height: 900, theme });
      try {
        await page.goto("/");
        await settle(page, theme);

        // حالة نشطة مقصودة لا عرضية: ننتقل إلى المشاريع فيصبح aria-current
        // عليها، والشريط في حالته العائمة بعد التمرير.
        await page
          .getByRole("navigation", { name: "التنقل الرئيسي" })
          .locator('a[href="#projects"]')
          .click();
        await page.waitForURL(/#projects$/);
        await waitForScrollSettled(page);
        await expect(
          page.getByRole("navigation", { name: "التنقل الرئيسي" }).locator('a[href="#projects"]'),
        ).toHaveAttribute("aria-current", "true");

        await expect(mainHeader(page)).toHaveScreenshot(`navbar-1440-${theme}.png`, SHOT);
      } finally {
        await close();
      }
    });
  }

  // ── Mobile navigation ────────────────────────────────────────────────
  test("mobile nav 390 dark @visual", async ({ browser }) => {
    const { page, close } = await openPage(browser, { width: 390, height: 844, theme: "dark" });
    try {
      await page.goto("/");
      await settle(page, "dark");

      // الشريط العلوي والسفلي كلاهما ثابت، فلقطة إطار العرض تضمّهما معًا.
      await scrollToSection(page, "projects");
      await expect(
        page.getByRole("navigation", { name: "تنقّل سريع" }).locator("[aria-current='true']"),
      ).toHaveCount(1);

      await expect(page).toHaveScreenshot("mobile-nav-390-dark.png", SHOT);
    } finally {
      await close();
    }
  });

  test("mobile menu open 390 dark @visual", async ({ browser }) => {
    const { page, close } = await openPage(browser, { width: 390, height: 844, theme: "dark" });
    try {
      await page.goto("/");
      await settle(page, "dark");

      // فتح حقيقي عبر الزر، والانتظار على الحالة المعلنة لا على مدّة
      await page.getByRole("button", { name: "فتح القائمة" }).click();
      const closeButton = page.getByRole("button", { name: "إغلاق القائمة" });
      await expect(closeButton).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByRole("navigation", { name: "قائمة التنقل للجوال" })).toBeVisible();

      // لا استثناء هنا بعد — السياسة الصارمة نفسها كبقية اللقطات.
      //
      // هذه اللقطة وحدها غير حتمية عبر المُشغِّلات: شهادة على خمسة مُشغِّلات
      // مستقلة أعطت ١٣ و١٣ و١٥ و٢٤ و٣٧ بكسلًا مختلفًا (بينما نجحت السبع عشرة
      // الأخرى بصفر على الخمسة جميعًا). الضجيج محصور في مربّع ٢٣×٨١ عند
      // y=730..810 و x=340..362 — زرّ الشريط السفلي النشط، إذ يعيد
      // `backdrop-filter` أخذ عيّنة من لوحة القائمة الزجاجية خلفه.
      //
      // ميزانية بكسل واحد جُرّبت وأسقطتها الشهادة، والمقاس يتجاوز سقف
      // الثلاثة المسموح، فلا تُرفع. القرار (إخفاء المنطقة أم استبدال اللقطة)
      // مؤجَّل لصاحب المشروع.
      await expect(page).toHaveScreenshot("mobile-menu-open-390-dark.png", SHOT);
    } finally {
      await close();
    }
  });

  // ── Projects ─────────────────────────────────────────────────────────
  for (const vp of [
    { label: "390", width: 390, theme: "dark" as const },
    { label: "768", width: 768, theme: "dark" as const },
    { label: "1440", width: 1440, theme: "dark" as const },
    { label: "1440", width: 1440, theme: "light" as const },
  ]) {
    test(`projects ${vp.label} ${vp.theme} @visual`, async ({ browser }) => {
      const { page, close } = await openSectionPage(browser, vp);
      try {
        await page.goto("/");
        await settle(page, vp.theme);

        await expect(page.locator("#projects article")).toHaveCount(5);
        await ensureProjectImagesDecoded(page);
        await scrollToSection(page, "projects");
        await expectSinglePass(page, "projects");

        await expect(page.locator("#projects")).toHaveScreenshot(
          `projects-${vp.label}-${vp.theme}.png`,
          SHOT,
        );
      } finally {
        await close();
      }
    });
  }

  // ── About / Services ─────────────────────────────────────────────────
  for (const id of ["about", "services"] as const) {
    test(`${id} 1440 dark @visual`, async ({ browser }) => {
      const { page, close } = await openSectionPage(browser, { width: 1440, theme: "dark" });
      try {
        await page.goto("/");
        await settle(page, "dark");
        await scrollToSection(page, id);
        await expectSinglePass(page, id);

        await expect(page.locator(`#${id}`)).toHaveScreenshot(`${id}-1440-dark.png`, SHOT);
      } finally {
        await close();
      }
    });
  }

  // ── Contact ──────────────────────────────────────────────────────────
  for (const vp of [
    { label: "1440", width: 1440 },
    { label: "390", width: 390 },
  ]) {
    test(`contact ${vp.label} dark @visual`, async ({ browser }) => {
      const { page, close } = await openSectionPage(browser, { ...vp, theme: "dark" });
      try {
        const health = collectHealth(page);
        await page.goto("/");
        await settle(page, "dark");
        await scrollToSection(page, "contact");
        await expectSinglePass(page, "contact");

        await expect(page.locator("form")).toBeVisible();
        await expect(page.locator("#contact")).toHaveScreenshot(
          `contact-${vp.label}-dark.png`,
          SHOT,
        );

        // نموذج فارغ لا يُرسَل: صفر طلبات
        expect(health.actionPosts).toHaveLength(0);
        expect(health.allPosts).toHaveLength(0);
      } finally {
        await close();
      }
    });
  }

  test("contact validation 390 dark @visual", async ({ browser }) => {
    const { page, close } = await openSectionPage(browser, { width: 390, theme: "dark" });
    try {
      const health = collectHealth(page);
      await page.goto("/");
      await settle(page, "dark");
      await scrollToSection(page, "contact");

      // تحقّق المتصفح وحده — نفس المسار الذي أثبتت E12 أنه لا يرسل شيئًا.
      // لا إرسال صالح، ولا حقل فخ، ولا حدّ معدّل، ولا مزوّد.
      await page.getByLabel("الاسم").fill("A");
      await page.getByLabel("البريد الإلكتروني").fill("nope");
      await page.getByLabel("تفاصيل المشروع").fill("قصير");
      await page.getByRole("button", { name: "إرسال الرسالة" }).click();

      await expect(page.getByText("أخبرني ما اسمك الكريم؟")).toBeVisible();
      await expect(page.getByText("البريد الإلكتروني غير دقيق")).toBeVisible();
      await expect(page.getByText("مساحة الرسالة قصيرة جداً، أخبرني بالمزيد..")).toBeVisible();

      // المرجع يجب أن يوثّق حقولًا محتفظة بما كُتب فيها، لا حقولًا فارغة.
      // المرجع الأول وثّق الفراغ لأن React كان يمسح النموذج بعد كل محاولة
      // فاشلة؛ التأكيد هنا يمنع تجميد ذلك العطب في صورة معتمدة مرة أخرى.
      await expect(page.getByLabel("الاسم")).toHaveValue("A");
      await expect(page.getByLabel("البريد الإلكتروني")).toHaveValue("nope");
      await expect(page.getByLabel("تفاصيل المشروع")).toHaveValue("قصير");

      // الحارس: تحقّق المتصفح أوقف الإرسال، فلا طلب غادر الصفحة
      expect(health.actionPosts).toHaveLength(0);
      expect(health.allPosts).toHaveLength(0);

      await waitForScrollSettled(page);
      await expectSinglePass(page, "contact");
      await expect(page.locator("#contact")).toHaveScreenshot(
        "contact-validation-390-dark.png",
        SHOT,
      );
    } finally {
      await close();
    }
  });

  // ── Footer ───────────────────────────────────────────────────────────
  test("footer 1440 dark @visual", async ({ browser }) => {
    const { page, close } = await openSectionPage(browser, { width: 1440, theme: "dark" });
    try {
      await page.goto("/");
      await settle(page, "dark");
      await scrollToSection(page, "footer");
      await expectSinglePass(page, "footer");

      await expect(page.locator("#footer")).toHaveScreenshot("footer-1440-dark.png", SHOT);
    } finally {
      await close();
    }
  });
});
