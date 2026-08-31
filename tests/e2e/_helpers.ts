import type { Page, Request, TestInfo } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * أدوات مشتركة لاختبارات E2E.
 *
 * لا أسرار هنا، ولا بيانات عشوائية: كل قيمة مشتقّة حتميًا من عنوان الاختبار،
 * فالفشل قابل لإعادة الإنتاج بحرفية والبصمات لا تتصادم بين الاختبارات.
 */

/** تجزئة FNV-1a — صغيرة وحتمية، تكفي لاشتقاق هوية ثابتة من نص. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * ملح خاص بكل عملية worker.
 *
 * الهوية الثابتة تمامًا تكفي داخل التشغيل الواحد، لكنها تنكسر عند تشغيل
 * السويت مرتين خلال ستين ثانية: الخادم يُعاد استخدامه، فيرث التشغيل الثاني
 * دلو حدّ المعدّل الممتلئ من الأول. الملح يجعل الهوية ثابتة **داخل** التشغيل
 * ومختلفة **بين** التشغيلات، وهو ما تحتاجه إعادة التشغيل المتتالية.
 */
const RUN_SALT = hash(`${process.pid}:${Date.now()}`);

/**
 * عنوان عميل خاص بكل اختبار.
 *
 * حدّ المعدّل في التطبيق خريطة داخل الذاكرة مفتاحها عنوان العميل، وهي مشتركة
 * بين كل الاختبارات لأن الخادم عملية واحدة. بلا هوية منفصلة لكل اختبار تصبح
 * الاختبارات مقترنة بترتيب التشغيل ويسقط `fullyParallel`.
 *
 * الاشتقاق من `workerIndex` وحده لا يكفي: عدة اختبارات تتشارك نفس الـworker.
 * لذلك ندمج الملح مع الـworker مع تجزئة عنوان الاختبار الكامل.
 *
 * النطاق 10.0.0.0/8 خاص (RFC 1918) ولا يخرج من الجهاز إطلاقًا.
 */
export function clientIdentity(testInfo: TestInfo, suffix = ""): string {
  const h = hash(
    `${RUN_SALT}::${testInfo.workerIndex}::${testInfo.titlePath.join(" > ")}${suffix}`,
  );
  const b = (h >>> 16) & 0xff;
  const c = (h >>> 8) & 0xff;
  const d = h & 0xff;
  // نتجنّب .0 و .255 حتى يبقى العنوان شكلًا صالحًا
  return `10.${b}.${c}.${Math.max(1, Math.min(254, d))}`;
}

/**
 * انتظار الترطيب قبل أي تفاعل.
 *
 * ضروري لا تجميلي: حقول النموذج غير متحكَّم فيها، فالكتابة فيها قبل أن
 * يُرطّب React الشجرة تُمحى عند الترطيب، فيُرسل النموذج فارغًا ويحجبه تحقّق
 * المتصفح فلا يصل الخادم طلب أصلًا.
 *
 * `data-motion` يكتبه HeroMotionGate داخل useEffect، فوجوده دليل قاطع على أن
 * جافاسكربت العميل عملت — إشارة حتمية بلا مهلة ثابتة.
 */
export async function waitForHydration(page: Page): Promise<void> {
  // مهلة صريحة سخية: القياس أظهر أن الترطيب في Firefox يستغرق نحو ٩٠٠ms
  // منفردًا، ويتجاوز المهلة الافتراضية (خمس ثوانٍ) تحت التوازي. الانتظار
  // مشروط بالحالة لا بالمدّة، فالمهلة سقف أمان لا وسيلة لإخفاء بطء.
  await expect(page.locator("#home")).toHaveAttribute("data-motion", /^(running|paused)$/, {
    timeout: 30_000,
  });
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

/**
 * حمولة تواصل اصطناعية فريدة لكل اختبار.
 *
 * الفرادة ضرورية لسبب أمني لا تجميلي: الخادم يمنع التكرار ببصمة
 * sha256(email + message) لتسعين ثانية، فحمولة مشتركة تجعل اختبارًا يبتلع
 * إرسال اختبار آخر. النطاق example.com محجوز (RFC 2606) فلا يصل بريدًا حقيقيًا.
 */
export function contactPayload(testInfo: TestInfo, suffix = ""): ContactPayload {
  const id = hash(testInfo.titlePath.join(" > ") + suffix).toString(36);
  return {
    name: "مستخدم اختبار",
    email: `e2e-${id}@example.com`,
    message: `رسالة اختبار آلي للتحقّق من مسار التواصل. المعرّف ${id}`,
  };
}

/** اسم حقل الفخ — مطابق لـHONEYPOT_FIELD في مصدر التطبيق. */
export const HONEYPOT_FIELD = "contact_ref";

/** استدعاء Server Action يُعرَف بترويسة next-action لا بالمسار وحده. */
export function isServerAction(request: Request): boolean {
  const headers = request.headers();
  return request.method() === "POST" && typeof headers["next-action"] === "string";
}

export interface HealthReport {
  consoleErrors: string[];
  pageErrors: string[];
  requestFailures: string[];
  badResponses: string[];
  actionPosts: Request[];
  allPosts: Request[];
}

/**
 * جامع صحّة سلبي: يستمع فقط ولا يغيّر سلوك الصفحة.
 *
 * يُستدعى قبل التنقّل حتى لا تفوته أحداث التحميل الأولى.
 */
export function collectHealth(page: Page): HealthReport {
  const report: HealthReport = {
    consoleErrors: [],
    pageErrors: [],
    requestFailures: [],
    badResponses: [],
    actionPosts: [],
    allPosts: [],
  };

  page.on("console", (msg) => {
    if (msg.type() === "error") report.consoleErrors.push(msg.text().slice(0, 200));
  });
  page.on("pageerror", (err) => {
    report.pageErrors.push(String(err.message).slice(0, 200));
  });
  page.on("requestfailed", (req) => {
    const failure = req.failure();
    // الإلغاء ليس فشلًا: يحدث طبيعيًا عند التنقّل أثناء تحميل مورد
    if (failure && !/ERR_ABORTED/.test(failure.errorText)) {
      report.requestFailures.push(`${failure.errorText} ${req.url().slice(0, 120)}`);
    }
  });
  page.on("response", (res) => {
    if (res.status() >= 400) report.badResponses.push(`${res.status()} ${res.url().slice(0, 120)}`);
  });
  page.on("request", (req) => {
    if (req.method() === "POST") {
      report.allPosts.push(req);
      if (isServerAction(req)) report.actionPosts.push(req);
    }
  });

  return report;
}

/** أقسام الصفحة الواحدة كما يعرّفها التطبيق. */
export const SECTIONS = [
  "home",
  "projects",
  "about",
  "services",
  "process",
  "faq",
  "contact",
] as const;

/** روابط التنقّل الرئيسية — ستة، والتواصل ليس منها عمدًا. */
export const NAV_SECTIONS = ["home", "projects", "about", "services", "process", "faq"] as const;

/** استضافات المزوّد التي يجب ألّا يلمسها المتصفح إطلاقًا. */
export function isProviderRequest(url: string): boolean {
  return /resend\.com/i.test(url);
}

/** هل في الصفحة نص يشبه مفتاح مزوّد؟ يُستخدم للتأكيد لا للطباعة. */
export const API_KEY_SHAPE = /re_[A-Za-z0-9]{16,}/;

/** الطرق التي تُغيّر حالة الخادم — ممنوعة تمامًا على الإنتاج. */
const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * حارس القراءة فقط.
 *
 * الصفحة الرئيسية تحمل نموذج Server Action، فأي طلب كتابة نحو الإنتاج يعني
 * أننا لمسنا مسار التواصل الحقيقي. الحارس يسجّل كل طريقة كتابة ليؤكَّد أنها
 * صفر، بدل الاكتفاء بنيّة عدم الإرسال.
 */
export function collectWriteRequests(page: Page): string[] {
  const writes: string[] = [];
  page.on("request", (req) => {
    if (WRITE_METHODS.has(req.method())) writes.push(`${req.method()} ${req.url().slice(0, 120)}`);
  });
  return writes;
}

/**
 * انتظار سكون التمرير — قائم على الإطارات لا على الزمن.
 *
 * نقر التنقّل يبدأ حركة Lenis، والقياس قبل اكتمالها يلتقط موضعًا عابرًا.
 */
export async function waitForScrollSettled(page: Page): Promise<void> {
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
 * بوّابة الخطوط قبل أي لقطة.
 *
 * Cairo مستضاف ذاتيًا عبر next/font بـ`display: swap`، فالتبديل ممكن نظريًا
 * ولو كان القياس يُظهر جهوزية فورية. اللقطة قبل الجهوزية تُثبّت خطًا احتياطيًا
 * في المرجع فتفشل كل مقارنة لاحقة.
 */
export async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready);
  const status = await page.evaluate(() => document.fonts.status);
  expect(status).toBe("loaded");
}

/**
 * كل صور المشاريع داخل نطاق اللقطة فُكَّت شفرتها فعلًا.
 *
 * الصور كسولة، ولقطة قبل فكّ الشفرة تُثبّت فراغًا مكان الصورة في المرجع.
 */
export async function ensureProjectImagesDecoded(page: Page, expected = 5): Promise<void> {
  const images = page.locator("#projects figure img");
  await expect(images).toHaveCount(expected);
  for (let i = 0; i < expected; i++) {
    const image = images.nth(i);
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth), { timeout: 20_000 })
      .toBeGreaterThan(0);
  }
  await expect
    .poll(() =>
      images.evaluateAll((els) =>
        (els as HTMLImageElement[]).every((el) => el.complete && el.naturalWidth > 0),
      ),
    )
    .toBe(true);
}

/**
 * القسم مستقرّ عند إزاحة التنقّل، لا "ظاهر جزئيًا" فحسب.
 *
 * قسم المشاريع وحده ٣١٤٠px، فيبقى جزء منه مرئيًا بلا أي تمرير — لذلك تُقاس
 * المسافة من أعلى النافذة بدل الاكتفاء بالظهور.
 */
export async function expectSectionAnchored(page: Page, id: string): Promise<void> {
  const top = () =>
    page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top));
  await expect.poll(top, { timeout: 15_000 }).toBeLessThan(140);
  await expect.poll(top).toBeGreaterThan(-140);
}
