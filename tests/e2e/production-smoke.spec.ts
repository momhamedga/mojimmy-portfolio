import { expect, test } from "@playwright/test";
import {
  API_KEY_SHAPE,
  SECTIONS,
  collectHealth,
  collectWriteRequests,
  expectSectionAnchored,
  isProviderRequest,
  waitForHydration,
  waitForScrollSettled,
} from "./_helpers";

/**
 * فحص الإنتاج — قراءة فقط، بلا استثناء.
 *
 * الصفحة الرئيسية تحمل نموذج Server Action موصولًا بمزوّد بريد حقيقي وبقاعدة
 * جدار حماية تحسب الطلبات. لذلك لا يُملأ النموذج ولا يُرسَل ولا يُضغط زر
 * الإرسال ولا يُلمس حقل الفخ. كل اختبار هنا يثبت بنفسه أن عدد طلبات الكتابة
 * صفر، فالسلامة مؤكَّدة بالقياس لا بالنيّة.
 */

const VIEWPORTS = [
  { label: "1440 desktop", width: 1440, height: 900, desktopNav: true },
  { label: "390 mobile", width: 390, height: 844, desktopNav: false },
] as const;

/**
 * تغطية WebKit — على الإنتاج وحده.
 *
 * اختبار واحد مضغوط: WebKit لا يُشغَّل محليًا لأن `upgrade-insecure-requests`
 * يرقّي طلبات الحلقة المحلية فتفشل، وهذا قيد بيئة لا عيب في الموقع. الإنتاج
 * على HTTPS، وهو المكان الذي يهمّ فيه سلوك Safari فعلًا.
 */
test(`production WebKit renders, navigates and stays read-only @webkit-production`, async ({
  page,
}) => {
  const health = collectHealth(page);
  const writes = collectWriteRequests(page);

  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await waitForHydration(page);

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  for (const id of SECTIONS) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await expect(page.locator("#projects article")).toHaveCount(5);

  // النموذج بالنظر فقط — بلا ملء ولا إرسال
  await expect(page.locator("form")).toBeVisible();
  await expect(page.getByRole("button", { name: "إرسال الرسالة" })).toBeVisible();

  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);
  await page.getByRole("button", { name: "التبديل للوضع الفاتح" }).click();
  await expect(html).not.toHaveClass(/dark/);
  await expect(page.getByRole("button", { name: "التبديل للوضع الداكن" })).toBeVisible();
  await page.getByRole("button", { name: "التبديل للوضع الداكن" }).click();
  await expect(html).toHaveClass(/dark/);

  // تسلسل التنقّل المستقرّ — أهم ما يجب تأكيده على Safari بعد تغييرات Phase 4B
  const nav = page.getByRole("navigation", { name: "التنقل الرئيسي" });
  for (const id of ["projects", "about"]) {
    await nav.locator(`a[href="#${id}"]`).click();
    await page.waitForURL(new RegExp(`#${id}$`));
    await waitForScrollSettled(page);
    await expectSectionAnchored(page, id);
    await expect(nav.locator(`a[href="#${id}"]`)).toHaveAttribute("aria-current", "true");
  }

  await page.goBack();
  await page.waitForURL(/#projects$/);
  await waitForScrollSettled(page);
  await expectSectionAnchored(page, "projects");
  await expect(nav.locator('a[href="#projects"]')).toHaveAttribute("aria-current", "true");

  await page.goForward();
  await page.waitForURL(/#about$/);
  await waitForScrollSettled(page);
  await expectSectionAnchored(page, "about");
  await expect(nav.locator('a[href="#about"]')).toHaveAttribute("aria-current", "true");

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(overflow.scrollWidth).toBe(overflow.clientWidth);

  expect(health.consoleErrors).toEqual([]);
  expect(health.pageErrors).toEqual([]);
  expect(health.requestFailures).toEqual([]);
  expect(health.badResponses).toEqual([]);
  expect(health.allPosts.filter((r) => isProviderRequest(r.url()))).toHaveLength(0);

  // الحارس الحاسم
  expect(writes).toEqual([]);
  expect(health.allPosts).toHaveLength(0);
});

for (const viewport of VIEWPORTS) {
  test(`production ${viewport.label} renders and stays read-only @production`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    try {
      const health = collectHealth(page);
      const writes = collectWriteRequests(page);

      const response = await page.goto("/");
      expect(response?.status()).toBe(200);
      await waitForHydration(page);

      // بنية الصفحة
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      for (const id of SECTIONS) {
        await expect(page.locator(`#${id}`)).toHaveCount(1);
      }
      await expect(page.locator("#projects article")).toHaveCount(5);

      // نموذج التواصل يُفحَص بالنظر فقط: يوجد، وحقوله وزرّه موجودة. لا ملء
      // ولا إرسال ولا ضغط مفاتيح داخله.
      await expect(page.locator("form")).toBeVisible();
      await expect(page.getByLabel("الاسم")).toBeVisible();
      await expect(page.getByLabel("البريد الإلكتروني")).toBeVisible();
      await expect(page.getByLabel("تفاصيل المشروع")).toBeVisible();
      await expect(page.getByRole("button", { name: "إرسال الرسالة" })).toBeVisible();

      // وضع التنقّل المناسب للمقاس
      if (viewport.desktopNav) {
        await expect(page.getByRole("navigation", { name: "التنقل الرئيسي" })).toBeVisible();
      } else {
        await expect(page.getByRole("button", { name: "فتح القائمة" })).toBeVisible();
        await expect(page.getByRole("navigation", { name: "تنقّل سريع" })).toBeVisible();
      }

      // الثيم
      const html = page.locator("html");
      await expect(html).toHaveClass(/dark/);
      await page.getByRole("button", { name: "التبديل للوضع الفاتح" }).click();
      await expect(html).not.toHaveClass(/dark/);
      await page.getByRole("button", { name: "التبديل للوضع الداكن" }).click();
      await expect(html).toHaveClass(/dark/);

      // تنقّل مستخدم عادي مستقرّ — على المقاس الكبير فقط، وبلا مسابقة
      if (viewport.desktopNav) {
        const nav = page.getByRole("navigation", { name: "التنقل الرئيسي" });
        for (const id of ["projects", "about"]) {
          await nav.locator(`a[href="#${id}"]`).click();
          await page.waitForURL(new RegExp(`#${id}$`));
          await waitForScrollSettled(page);
          await expectSectionAnchored(page, id);
        }

        await page.goBack();
        await page.waitForURL(/#projects$/);
        await waitForScrollSettled(page);
        await expectSectionAnchored(page, "projects");

        await page.goForward();
        await page.waitForURL(/#about$/);
        await waitForScrollSettled(page);
        await expectSectionAnchored(page, "about");
      } else {
        // على الجوال نكتفي بتمرير عادي والتأكد أن الشريط السفلي يتابع
        await page.locator("#projects").scrollIntoViewIfNeeded();
        await page.waitForURL(/#projects$/);
        await expect(
          page.getByRole("navigation", { name: "تنقّل سريع" }).locator("[aria-current='true']"),
        ).toHaveCount(1);
      }

      // لا فيض أفقي
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBe(overflow.clientWidth);

      // فحص أمني سطحي فقط — لا اختبار إساءة
      const content = await page.content();
      expect(API_KEY_SHAPE.test(content)).toBe(false);
      expect(content).not.toContain("RESEND_API_KEY");
      expect(health.allPosts.filter((r) => isProviderRequest(r.url()))).toHaveLength(0);

      // صحّة وقت التشغيل
      expect(health.consoleErrors).toEqual([]);
      expect(health.pageErrors).toEqual([]);
      expect(health.requestFailures).toEqual([]);
      expect(health.badResponses).toEqual([]);

      // الحارس الحاسم: صفر طلبات كتابة نحو الإنتاج
      expect(writes).toEqual([]);
      expect(health.allPosts).toHaveLength(0);
      expect(health.actionPosts).toHaveLength(0);
    } finally {
      await context.close();
    }
  });
}
