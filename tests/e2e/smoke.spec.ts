import { expect, test } from "@playwright/test";
import { API_KEY_SHAPE, SECTIONS, collectHealth, isProviderRequest } from "./_helpers";

test.describe("E1 — page load health", () => {
  test("loads cleanly with all sections, no errors and no secret exposure", async ({ page }) => {
    const health = collectHealth(page);

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    // العنوان الرئيسي هو مرشّح الـLCP — وجوده يعني أن الصفحة صُيّرت فعلًا
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    for (const id of SECTIONS) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }

    // النموذج جزيرة عميل: وجوده يثبت أن الترطيب حدث
    await expect(page.locator("form")).toBeVisible();
    await expect(page.getByRole("button", { name: "إرسال الرسالة" })).toBeVisible();

    // لا فيض أفقي
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBe(overflow.clientWidth);

    // لا مفتاح مزوّد في أي مكان يصل للمتصفح
    const html = await page.content();
    expect(API_KEY_SHAPE.test(html)).toBe(false);
    expect(html).not.toContain("RESEND_API_KEY");

    // ولا طلب مباشر من المتصفح للمزوّد
    const providerCalls = health.allPosts.filter((r) => isProviderRequest(r.url()));
    expect(providerCalls).toHaveLength(0);

    expect(health.consoleErrors).toEqual([]);
    expect(health.pageErrors).toEqual([]);
    expect(health.requestFailures).toEqual([]);
    expect(health.badResponses).toEqual([]);
  });

  test("no client script requests the mail provider directly", async ({ page }) => {
    const providerRequests: string[] = [];
    page.on("request", (req) => {
      if (isProviderRequest(req.url())) providerRequests.push(req.url());
    });

    await page.goto("/");
    await expect(page.locator("form")).toBeVisible();

    expect(providerRequests).toEqual([]);
  });

  test("renders under prefers-reduced-motion without errors", async ({ page }) => {
    const health = collectHealth(page);
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("#home")).toBeVisible();

    expect(health.consoleErrors).toEqual([]);
    expect(health.pageErrors).toEqual([]);
  });
});
