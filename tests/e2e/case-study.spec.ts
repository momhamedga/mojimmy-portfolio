import { expect, test } from "@playwright/test";

import { PROJECTS } from "@/constants/projects";
import { hasPublishableCaseStudy, publishableCaseStudies } from "@/lib/case-study";
import type { Project } from "@/types/project";

/**
 * أساس مسارات دراسات الحالة (Phase 8B).
 *
 * الجوهر المحروس هنا ليس أن الصفحات تعمل، بل أنها **لا** تُنشر قبل أوانها:
 * لا مشروع اليوم يملك سردًا معتمدًا، فكل مسار تحت /projects يجب أن يعيد 404.
 * لو انقلب أحدها إلى 200 بمحتوى ضحل لسقط هذا الملف.
 */

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** حمولة اختبار محلية — لا تُضاف إلى بيانات الإنتاج ولا تُصدَّر منها. */
function fixture(overrides: Partial<Project> = {}): Project {
  return {
    id: "99",
    slug: "fixture-project",
    title: "Fixture",
    description: "وصف اختباري.",
    color: "oklch(0.6 0.2 250)",
    tags: ["Next.js"],
    link: "https://example.com",
    ...overrides,
  };
}

test.describe("E17 — case study data invariants", () => {
  test("slugs are unique, URL-safe and never the display ordinal", () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(slugs).toHaveLength(5);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(SLUG_PATTERN);
    // «01» وأخواتها معرّفات عرض لا عناوين
    for (const project of PROJECTS) expect(project.slug).not.toBe(project.id);
  });

  test("live project links are untouched by the slug work", () => {
    expect(PROJECTS.map((p) => p.link)).toEqual([
      "https://britishacademy-ss.online",
      "https://icfb.site",
      "https://hhlawyer.vercel.app",
      "https://josour-international.vercel.app",
      "https://jawharat-al-danat.vercel.app/",
    ]);
  });
});

test.describe("E18 — publishability gate", () => {
  test("no production project is publishable yet", () => {
    expect(publishableCaseStudies()).toHaveLength(0);
    for (const project of PROJECTS) expect(hasPublishableCaseStudy(project)).toBe(false);
  });

  test("title, description, tags and a link are not a case study", () => {
    expect(hasPublishableCaseStudy(fixture())).toBe(false);
    expect(hasPublishableCaseStudy(fixture({ caseStudy: {} }))).toBe(false);
    expect(hasPublishableCaseStudy(fixture({ caseStudy: { role: "مطوّر" } }))).toBe(false);
  });

  test("empty or whitespace sections cannot pass the gate", () => {
    const hollow = fixture({
      caseStudy: {
        role: "مطوّر",
        challenge: { heading: "التحدي", body: ["   "] },
        solution: { heading: "الحل", body: [] },
      },
    });
    expect(hasPublishableCaseStudy(hollow)).toBe(false);
  });

  test("role plus two narrated sections is publishable", () => {
    const real = fixture({
      caseStudy: {
        role: "مطوّر الواجهة والخادم",
        challenge: { heading: "التحدي", body: ["نص حقيقي يصف المشكلة."] },
        solution: { heading: "الحل", body: ["نص حقيقي يصف الحل."] },
      },
    });
    expect(hasPublishableCaseStudy(real)).toBe(true);
  });
});

test.describe("E19 — case study routes", () => {
  test("every known slug returns 404 while unpublished", async ({ page }) => {
    for (const project of PROJECTS) {
      const response = await page.request.get(`/projects/${project.slug}`);
      expect(response.status(), `/projects/${project.slug}`).toBe(404);
    }
  });

  test("an unknown slug returns 404, never a soft 200", async ({ page }) => {
    const response = await page.request.get("/projects/not-real");
    expect(response.status()).toBe(404);
  });

  test("the homepage is unaffected", async ({ page }) => {
    const response = await page.request.get("/");
    expect(response.status()).toBe(200);
  });
});

test.describe("E20 — sitemap reflects publishable pages only", () => {
  test("one URL, no case studies, no hashes, no lastmod", async ({ page }) => {
    const response = await page.request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();

    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locations).toHaveLength(1);
    expect(locations[0]).toMatch(/^https:\/\/www\.mohamedjimmy\.com$/);
    expect(xml).not.toContain("/projects/");
    expect(xml).not.toContain("#");
    expect(xml.toLowerCase()).not.toContain("lastmod");
  });
});
