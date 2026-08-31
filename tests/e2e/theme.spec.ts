import { expect, test } from "@playwright/test";
import { collectHealth, waitForHydration } from "./_helpers";

const TO_LIGHT = "التبديل للوضع الفاتح";
const TO_DARK = "التبديل للوضع الداكن";

/** next-themes يخزّن الاختيار تحت المفتاح الافتراضي "theme". */
function storedTheme(page: import("@playwright/test").Page) {
  return page.evaluate(() => window.localStorage.getItem("theme"));
}

test.describe("E9 — theme toggle and persistence", () => {
  test("toggling flips the document class, stores the choice and survives reload", async ({
    page,
  }) => {
    const health = collectHealth(page);
    await page.goto("/");
    await waitForHydration(page);

    const html = page.locator("html");
    // الافتراضي داكن، فالزر يعرض إجراء التبديل إلى الفاتح
    await expect(html).toHaveClass(/dark/);
    const toLight = page.getByRole("button", { name: TO_LIGHT });
    await expect(toLight).toBeVisible();

    await toLight.click();

    await expect(html).not.toHaveClass(/dark/);
    await expect(page.getByRole("button", { name: TO_DARK })).toBeVisible();
    expect(await storedTheme(page)).toBe("light");

    // الاختيار يجب أن ينجو من إعادة التحميل، وبلا وميض يسبق الترطيب
    await page.reload();
    await waitForHydration(page);
    await expect(html).not.toHaveClass(/dark/);
    expect(await storedTheme(page)).toBe("light");

    // والعودة إلى الداكن تعمل بنفس الطريقة
    await page.getByRole("button", { name: TO_DARK }).click();
    await expect(html).toHaveClass(/dark/);
    expect(await storedTheme(page)).toBe("dark");

    expect(health.consoleErrors).toEqual([]);
    expect(health.pageErrors).toEqual([]);
  });
});

test.describe("E10 — system colour scheme", () => {
  /**
   * السلوك الفعلي المقاس، لا المتوقَّع.
   *
   * المزوّد مضبوط على `defaultTheme="dark"` مع `enableSystem`. في next-themes
   * يفوز `defaultTheme` الصريح عند غياب اختيار مخزَّن، فالموقع يبدأ داكنًا
   * مهما كان تفضيل النظام. أُكِّد هذا لأنه القرار القائم فعلًا؛ تأكيد أن
   * التفضيل يقرّر كان سيفشل ويصف موقعًا غير هذا الموقع.
   */
  test("with no stored choice the site starts dark regardless of system preference", async ({
    browser,
  }) => {
    for (const scheme of ["dark", "light"] as const) {
      const context = await browser.newContext({ colorScheme: scheme });
      const page = await context.newPage();
      try {
        await page.goto("/");
        await waitForHydration(page);

        expect(await storedTheme(page)).toBeNull();
        await expect(page.locator("html")).toHaveClass(/dark/);
        // ويبقى التبديل اليدوي متاحًا فوق هذا الافتراضي
        await expect(page.getByRole("button", { name: TO_LIGHT })).toBeVisible();
      } finally {
        await context.close();
      }
    }
  });
});
