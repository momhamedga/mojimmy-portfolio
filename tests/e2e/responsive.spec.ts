import { expect, test } from "@playwright/test";
import { collectHealth, waitForHydration } from "./_helpers";

const VIEWPORTS = [
  { label: "390 mobile", width: 390, height: 844, desktopNav: false },
  { label: "768 tablet", width: 768, height: 1024, desktopNav: false },
  { label: "1440 desktop", width: 1440, height: 900, desktopNav: true },
] as const;

test.describe("E17 — responsive layout stability", () => {
  for (const viewport of VIEWPORTS) {
    test(`${viewport.label}: renders without horizontal overflow and keeps contact usable`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();
      try {
        const health = collectHealth(page);
        await page.goto("/");
        await waitForHydration(page);

        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

        // الفيض الأفقي عيب متكرّر في التخطيطات المتجاوبة، ويقاس مباشرة
        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(overflow.scrollWidth).toBe(overflow.clientWidth);

        // وضع التنقّل الصحيح لكل مقاس
        const desktopNav = page.getByRole("navigation", { name: "التنقل الرئيسي" });
        if (viewport.desktopNav) {
          await expect(desktopNav).toBeVisible();
        } else {
          await expect(page.getByRole("button", { name: "فتح القائمة" })).toBeVisible();
        }

        // قسم التواصل قابل للاستخدام فعلًا: الحقول ظاهرة وقابلة للتحرير.
        // لا إرسال هنا — هذا اختبار تخطيط لا اختبار مسار.
        await page.locator("#contact").scrollIntoViewIfNeeded();
        await expect(page.getByLabel("الاسم")).toBeEditable();
        await expect(page.getByLabel("البريد الإلكتروني")).toBeEditable();
        await expect(page.getByLabel("تفاصيل المشروع")).toBeEditable();
        await expect(page.getByRole("button", { name: "إرسال الرسالة" })).toBeVisible();

        expect(health.consoleErrors).toEqual([]);
        expect(health.pageErrors).toEqual([]);
        expect(health.badResponses).toEqual([]);
      } finally {
        await context.close();
      }
    });
  }
});
