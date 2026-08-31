import { expect, test } from "@playwright/test";
import { collectHealth, waitForHydration } from "./_helpers";

const EXPECTED_PROJECTS = 5;

test.describe("E11 — projects showcase", () => {
  test("renders five rows with five decoded screenshots and safe external links", async ({
    page,
  }) => {
    const health = collectHealth(page);
    await page.goto("/#projects");
    await waitForHydration(page);

    const section = page.locator("#projects");
    await expect(section).toBeInViewport();

    const rows = section.locator("article");
    await expect(rows).toHaveCount(EXPECTED_PROJECTS);

    const images = section.locator("figure img");
    await expect(images).toHaveCount(EXPECTED_PROJECTS);

    for (let i = 0; i < EXPECTED_PROJECTS; i++) {
      const image = images.nth(i);

      // الصور كسولة، فندفعها إلى الرؤية أولًا ثم ننتظر فك التشفير فعليًا
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth), { timeout: 15_000 })
        .toBeGreaterThan(0);

      // نصّ بديل حقيقي لا سلسلة فارغة
      const alt = await image.getAttribute("alt");
      expect(alt?.trim().length ?? 0).toBeGreaterThan(0);
    }

    // كل صف يحمل تعليقًا وصفيًا تحت الصورة
    await expect(section.locator("figcaption")).toHaveCount(EXPECTED_PROJECTS);

    // الروابط الخارجية يجب ألّا تمنح الصفحة الهدف وصولًا لنافذتنا
    const externalLinks = section.locator('a[target="_blank"]');
    const externalCount = await externalLinks.count();
    expect(externalCount).toBeGreaterThan(0);
    for (let i = 0; i < externalCount; i++) {
      const rel = await externalLinks.nth(i).getAttribute("rel");
      expect(rel ?? "").toContain("noopener");
    }

    // القسم لا يوسّع الصفحة أفقيًا
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBe(overflow.clientWidth);

    expect(health.requestFailures).toEqual([]);
    expect(health.badResponses).toEqual([]);
    expect(health.pageErrors).toEqual([]);
  });
});
