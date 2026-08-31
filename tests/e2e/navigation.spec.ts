import { expect, test } from "@playwright/test";
import { NAV_SECTIONS, collectHealth, waitForHydration } from "./_helpers";

const MOBILE = { width: 390, height: 844 };

/**
 * انتظار سكون التمرير — قائم على الإطارات لا على الزمن.
 *
 * نقر التنقّل يبدأ حركة Lenis مدّتها ١٫٢ ثانية. الضغط على الرجوع أثناءها
 * يجعل حركة Lenis تكمل إلى هدفها القديم فتدهس الاستعادة الفورية. المستخدم
 * الحقيقي يقرأ القسم ثم يرجع، وهذا ما يحاكيه الانتظار هنا.
 *
 * لا مهلة ثابتة: نراقب `scrollY` عبر الإطارات ونعود حين يثبت فعلًا.
 */
async function waitForScrollSettled(page: import("@playwright/test").Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let last = window.scrollY;
        let stable = 0;
        const tick = () => {
          const y = window.scrollY;
          if (y === last) {
            if (++stable >= 4) return resolve();
          } else {
            stable = 0;
            last = y;
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
  );
}

/**
 * القسم مستقرّ عند إزاحة التنقّل، لا "ظاهر جزئيًا" فحسب.
 *
 * `toBeInViewport` وحده ضعيف هنا: قسم المشاريع وحده ٣١٤٠px، فيبقى جزء منه
 * مرئيًا حتى بلا أي تمرير، فيمرّ التأكيد بينما الصفحة لم تتحرّك إطلاقًا.
 * قياس المسافة من أعلى النافذة يثبت الوصول فعلًا.
 */
async function expectSectionAnchored(page: import("@playwright/test").Page, id: string) {
  await expect
    .poll(
      () => page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top)),
      { timeout: 10_000 },
    )
    .toBeLessThan(140);
  await expect
    .poll(() => page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBeGreaterThan(-140);
}

test.describe("E3 — desktop navigation, hash and active state", () => {
  test("each primary link scrolls to its section, sets the hash and marks itself current", async ({
    page,
  }) => {
    const health = collectHealth(page);
    await page.goto("/");
    await waitForHydration(page);

    const nav = page.getByRole("navigation", { name: "التنقل الرئيسي" });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link")).toHaveCount(NAV_SECTIONS.length);

    for (const id of NAV_SECTIONS) {
      const link = nav.locator(`a[href="#${id}"]`);
      await link.click();

      await page.waitForURL(new RegExp(`#${id}$`));
      // الحالة النشطة يقودها المراقب، وهو لا يحسم إلا بعد أن يستقر التمرير.
      // بلا هذا الانتظار تُقاس `aria-current` بينما حركة Lenis ما زالت جارية،
      // فتظهر رفرفة تحت الحِمل — رُصدت فعلًا في تشغيل استقرار سابق.
      await waitForScrollSettled(page);
      await expectSectionAnchored(page, id);
      await expect(link).toHaveAttribute("aria-current", "true");
    }

    expect(health.pageErrors).toEqual([]);
  });
});

test.describe("E4 — direct hash entry", () => {
  for (const id of ["projects", "contact"] as const) {
    test(`landing directly on #${id} shows that section`, async ({ page }) => {
      const health = collectHealth(page);
      await page.goto(`/#${id}`);
      await waitForHydration(page);

      // نفس التأكيد الأقوى المستخدم في E3/E5: استقرار ثم قياس المسافة من
      // أعلى النافذة. `toBeInViewport` بمهلته الافتراضية كان يرفرف تحت الحِمل
      // لأن القفزة إلى الهاش والترطيب يتأخّران معًا حين ينشغل الجهاز.
      await waitForScrollSettled(page);
      await expectSectionAnchored(page, id);
      expect(page.url()).toContain(`#${id}`);
      expect(health.pageErrors).toEqual([]);
    });
  }
});

test.describe("E5 — history navigation restores hash and viewport", () => {
  test("multi-step back and forward return to each section", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);

    const nav = page.getByRole("navigation", { name: "التنقل الرئيسي" });
    const go = async (id: string) => {
      await nav.locator(`a[href="#${id}"]`).click();
      await page.waitForURL(new RegExp(`#${id}$`));
      await expectSectionAnchored(page, id);
      // حركة Lenis يجب أن تكتمل قبل أي تنقّل في التاريخ
      await waitForScrollSettled(page);
    };

    // مسار ملاحة متعمّد: كل نقرة تكتب سجلًا حقيقيًا بـpushState
    await go("projects");
    await go("about");
    await go("services");

    // الرجوع خطوتين، ثم التقدّم خطوتين — الهاش **والعرض** معًا في كل خطوة
    const step = async (
      move: "back" | "forward",
      id: string,
      { current }: { current: boolean } = { current: true },
    ) => {
      if (move === "back") await page.goBack();
      else await page.goForward();

      await page.waitForURL(new RegExp(`#${id}$`));
      await waitForScrollSettled(page);
      await expectSectionAnchored(page, id);
      if (current) {
        await expect(nav.locator(`a[href="#${id}"]`)).toHaveAttribute("aria-current", "true");
      }
    };

    await step("back", "about");
    await step("back", "projects");
    await step("forward", "about");
    await step("forward", "services");

    // المكدّس سليم بعد الذهاب والإياب: التقدّم لم يعد متاحًا بعد آخر سجل،
    // ولا تكون الاستعادة قد أنشأت سجلات جديدة تُفسد الموضع.
    await page.goBack();
    await page.waitForURL(/#about$/);
    await waitForScrollSettled(page);
    await expectSectionAnchored(page, "about");
  });

  test("history wins over a navigation animation that is still running", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);
    const nav = page.getByRole("navigation", { name: "التنقل الرئيسي" });

    // سجلّ نظيف: ننتقل إلى المشاريع وندع الحركة تكتمل
    await nav.locator('a[href="#projects"]').click();
    await page.waitForURL(/#projects$/);
    await waitForScrollSettled(page);

    // ثم ننتقل إلى "عني" و**لا** ننتظر: حركة Lenis ما زالت جارية عمدًا
    await nav.locator('a[href="#about"]').click();
    await page.waitForURL(/#about$/);

    // الرجوع في منتصف الحركة — هنا كان العنوان يقول #projects بينما تُكمل
    // الحركة القديمة وتستقر على "عني". التاريخ يجب أن يفوز.
    await page.goBack();
    await page.waitForURL(/#projects$/);
    await waitForScrollSettled(page);

    await expectSectionAnchored(page, "projects");
    // والوجهة التي بطلت يجب ألّا تكون هي المستقرة
    const aboutTop = await page
      .locator("#about")
      .evaluate((el) => Math.round(el.getBoundingClientRect().top));
    expect(Math.abs(aboutTop)).toBeGreaterThan(140);
    await expect(nav.locator('a[href="#projects"]')).toHaveAttribute("aria-current", "true");

    // والتقدّم كذلك، دون انتظار استقرار الاستعادة
    await page.goForward();
    await page.waitForURL(/#about$/);
    await waitForScrollSettled(page);

    await expectSectionAnchored(page, "about");
    await expect(nav.locator('a[href="#about"]')).toHaveAttribute("aria-current", "true");

    // ولا سجلات إضافية: الرجوع مرة واحدة يعود للمشاريع لا لحالة وسيطة
    await page.goBack();
    await page.waitForURL(/#projects$/);
    await waitForScrollSettled(page);
    await expectSectionAnchored(page, "projects");
  });

  test("back to a plain URL with no hash returns to the top", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);
    expect(new URL(page.url()).hash).toBe("");

    await page
      .getByRole("navigation", { name: "التنقل الرئيسي" })
      .locator('a[href="#faq"]')
      .click();
    await page.waitForURL(/#faq$/);
    await expectSectionAnchored(page, "faq");
    await waitForScrollSettled(page);

    await page.goBack();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(100);
    await expect(page.locator("#home")).toBeInViewport();
  });
});

test.describe("E6 — contact is tracked but is not a primary nav item", () => {
  test("no desktop nav link claims current while contact is active", async ({ page }) => {
    await page.goto("/#contact");
    await waitForHydration(page);
    await expect(page.locator("#contact")).toBeInViewport();

    // التواصل مقصود ألّا يكون رابطًا رئيسيًا: ستة روابط فقط، وليس فيها
    // #contact. فبينما يتتبّعه الهاش، يجب ألّا يدّعي أي رابط أنه الحالي.
    const nav = page.getByRole("navigation", { name: "التنقل الرئيسي" });
    await expect(nav.locator('a[href="#contact"]')).toHaveCount(0);
    await expect(nav.locator("a[aria-current]")).toHaveCount(0);
  });
});

test.describe("E7 — mobile dock", () => {
  test.use({ viewport: MOBILE });

  test("dock is visible and tracks the active section", async ({ page }) => {
    const health = collectHealth(page);
    await page.goto("/");
    await waitForHydration(page);

    const dock = page.getByRole("navigation", { name: "تنقّل سريع" });
    await expect(dock).toBeVisible();

    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.waitForURL(/#projects$/);
    await expect(dock.locator("[aria-current='true']")).toHaveCount(1);

    expect(health.pageErrors).toEqual([]);
  });
});

test.describe("E8 — mobile menu keyboard and ARIA", () => {
  test.use({ viewport: MOBILE });

  test("toggle exposes expanded state and a real controlled region", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);

    const toggle = page.getByRole("button", { name: "فتح القائمة" });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    const controls = await toggle.getAttribute("aria-controls");
    expect(controls).toBeTruthy();

    // تفعيل بلوحة المفاتيح لا بالفأرة: الزر يجب أن يكون قابلًا للتركيز والتشغيل
    await toggle.focus();
    await expect(toggle).toBeFocused();
    await page.keyboard.press("Enter");

    const opened = page.getByRole("button", { name: "إغلاق القائمة" });
    await expect(opened).toHaveAttribute("aria-expanded", "true");
    // المرجع المُعلَن في aria-controls يجب أن يوجد فعلًا عند الفتح
    await expect(page.locator(`#${controls}`)).toHaveCount(1);

    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "فتح القائمة" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
