import { expect, test } from "@playwright/test";
import {
  NAV_SECTIONS,
  SECTIONS,
  collectHealth,
  expectSectionAnchored,
  waitForHydration,
  waitForScrollSettled,
} from "./_helpers";

/**
 * فحص توافق مضغوط لـFirefox وWebKit.
 *
 * ليس نسخة ثانية من السويت الكاملة: المحرّكات الأخرى تُشغَّل لالتقاط أعطال
 * المحرّك نفسه — تصيير، تمرير، تاريخ، ثيم — لا لإعادة تغطية منطق التطبيق
 * الذي يغطّيه Chromium بتفصيل. لا إرسال للنموذج هنا إطلاقًا.
 */

test.describe("cross-browser essentials", () => {
  test("renders every section and stays runtime-clean @cross-browser", async ({ page }) => {
    const health = collectHealth(page);

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await waitForHydration(page);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const id of SECTIONS) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }

    // المشاريع خمسة صفوف، ونموذج التواصل مُصيَّر — بلا أي إرسال
    await expect(page.locator("#projects article")).toHaveCount(5);
    await expect(page.locator("form")).toBeVisible();
    await expect(page.getByRole("button", { name: "إرسال الرسالة" })).toBeVisible();

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBe(overflow.clientWidth);

    expect(health.consoleErrors).toEqual([]);
    expect(health.pageErrors).toEqual([]);
    expect(health.requestFailures).toEqual([]);
    expect(health.badResponses).toEqual([]);
    // لا طلب كتابة واحد: الفحص قراءة فقط
    expect(health.actionPosts).toHaveLength(0);
  });

  test("navigation, hash and history behave per engine @cross-browser", async ({ page }) => {
    const health = collectHealth(page);
    await page.goto("/");
    await waitForHydration(page);

    const nav = page.getByRole("navigation", { name: "التنقل الرئيسي" });
    await expect(nav.getByRole("link")).toHaveCount(NAV_SECTIONS.length);

    const go = async (id: string) => {
      await nav.locator(`a[href="#${id}"]`).click();
      await page.waitForURL(new RegExp(`#${id}$`));
      await waitForScrollSettled(page);
      await expectSectionAnchored(page, id);
      await expect(nav.locator(`a[href="#${id}"]`)).toHaveAttribute("aria-current", "true");
    };

    await go("projects");
    await go("about");

    // تسلسل مستقرّ عادي — لا مسابقة متعمّدة لحركة Lenis هنا.
    // Phase 4B غيّرت history.scrollRestoration واستعادة popstate، فهذه
    // أهم نقطة يجب التأكد من عملها على كل محرّك.
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

    expect(health.pageErrors).toEqual([]);
    expect(health.actionPosts).toHaveLength(0);
  });

  test("theme toggles and restores @cross-browser", async ({ page }) => {
    const health = collectHealth(page);
    await page.goto("/");
    await waitForHydration(page);

    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);

    /**
     * `aria-pressed` هو المزامن الصحيح هنا.
     *
     * الزر يشتقّ من `resolvedTheme` ثلاثة أشياء معًا: ما يفعله عند النقر،
     * واسمه المعلن، و`aria-pressed`. الانتظار على الاسم وحده لا يكفي لأن
     * أيقونة framer تُستبدل بحركة، والنقرة الثانية قد تسبق استقرار الحالة —
     * وهي رفرفة رُصدت على Firefox تحت الحِمل. الانتظار على `aria-pressed`
     * يربط الاختبار بمصدر الحقيقة نفسه الذي تقرأه دالة النقر.
     */
    const toggle = page.getByRole("button", { name: /التبديل للوضع/ });
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    await toggle.click();
    await expect(html).not.toHaveClass(/dark/);
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(await page.evaluate(() => window.localStorage.getItem("theme"))).toBe("light");

    await toggle.click();
    await expect(html).toHaveClass(/dark/);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    expect(health.consoleErrors).toEqual([]);
    expect(health.pageErrors).toEqual([]);
  });
});
