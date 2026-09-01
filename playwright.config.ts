import { defineConfig, devices } from "@playwright/test";

/**
 * إعداد Playwright — تشغيل محلي على Chromium فقط (Phase 4B).
 *
 * الاختبارات تعمل على بناء إنتاج حقيقي (`next build` + `next start`) لا على
 * `next dev`: الهدف اختبار ما يصل للمستخدم فعلًا، بما فيه Server Actions
 * المبنية والـprerendering، لا سلوك التطوير.
 *
 * سلامة البريد — أهم سطر في هذا الملف:
 * `RESEND_API_KEY` يُمرَّر كقيمة **غير فارغة وغير صالحة** عمدًا. قياس Phase 3
 * أثبت أن القيمة الفارغة ليست عزلًا: Next يعيد تحميل `.env.local` فوقها
 * فيُرسل بريد حقيقي. أما القيمة المضبوطة مسبقًا في بيئة العملية فيحترمها
 * `@next/env` ولا يستبدلها — تحقّقنا من ذلك سلوكيًا قبل كتابة هذا الملف.
 *
 * PORT يُمرَّر عبر نفس كائن `env`. فإذا كان الخادم يستمع على 3100 بدل 3000
 * الافتراضي، فذلك دليل تشغيلي أن `env` وصل للعملية الابنة — ومعه المفتاح.
 */
const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

/** الموقع المنشور — للفحص السطحي للقراءة فقط. */
const PRODUCTION_URL = "https://www.mohamedjimmy.com";

/** مفتاح مزوّد غير صالح عمدًا: يعبر فحص «المفتاح موجود» ثم يرفضه المزوّد. */
const INVALID_RESEND_KEY = "re_e2eINVALID_donotuse_0000";

/**
 * عتبة المقارنة البصرية — ٠٫٠٢٥، مقيسة لا مختارة.
 *
 * المشكلة المقيسة: صور ubuntu-latest متطابقة بايتيًا على المُشغِّل الواحد
 * (١٨/١٨ × ٣ عند صفر) لكنها تنزاح أحيانًا بين مُشغِّلين مستقلين. الانزياح
 * متقطّع لا حتمي: مسح عبر ثلاثة مُشغِّلات مستقلة (صور نظام واحدة) مرّ عند
 * صفر، بينما تولّدت في 5B.2 مجموعتان من مُشغِّلين مختلفين تختلفان فعلًا.
 *
 * المعايرة جرت على الانزياح المرصود نفسه لا على تخمين، بمقارِن Playwright
 * ذاته: القائمة الزجاجية تسقط عند ٠ و٠٫٠٠١ (٢٧ بكسل) وتتناقص تدريجيًا —
 * ٠٫٠٠٥ ← ١١، ٠٫٠١ ← ٥، ٠٫٠٢ ← ١، ٠٫٠٢٢ ← ١ — ثم تمرّ عند ٠٫٠٢٣. أي أن
 * الحدّ المقيس بالضبط هو ٠٫٠٢٣، و٠٫٠٢٥ أصغر قيمة في سُلّم المرشّحات تعلوه
 * بهامش ضئيل. (`projects-1440-light` يمرّ حتى عند صفر: بكسلاه يصنّفهما
 * pixelmatch تنعيمَ حواف فيتجاوزهما.)
 *
 * العتبة لا تُخفي تغيّرًا حقيقيًا — أُثبت ذلك بالحقن لا بالثقة: إزاحة عنصر
 * واحد ١px تسقط بـ١٦٤ بكسل، و٢px بـ٢٥٦، وتغيير لون سطح بـ٢٧٬١٠٢. الفصل بين
 * الضجيج (صفر يتجاوز) والتغيّر الحقيقي (مئات) واسع لا حدّي.
 *
 * ما بقي صفرًا: `maxDiffPixels` و`maxDiffPixelRatio`. لا مسامحة بالعدد
 * إطلاقًا — العتبة تصف كم يجوز أن يختلف البكسل لونًا، لا كم بكسلًا يجوز أن
 * يختلف. `PW_VISUAL_THRESHOLD` يبقى لإعادة المعايرة عند تغيّر البيئة.
 */
const DEFAULT_VISUAL_THRESHOLD = 0.025;

function resolveVisualThreshold(): number {
  const raw = process.env.PW_VISUAL_THRESHOLD;
  if (raw === undefined || raw === "") return DEFAULT_VISUAL_THRESHOLD;

  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`PW_VISUAL_THRESHOLD غير صالحة: "${raw}". المتوقع عدد بين 0 و 1 (مثلًا 0.01).`);
  }
  return value;
}

const VISUAL_THRESHOLD = resolveVisualThreshold();

/**
 * تشغيل الإنتاج لا يبني خادمًا محليًا.
 *
 * إعداد `webServer` في Playwright عام لا لكل مشروع، فبلا هذا الحارس كان فحص
 * الإنتاج يبني الموقع ويشغّله محليًا بلا داعٍ. نستدلّ على المشروع المطلوب من
 * سطر الأوامر مباشرةً — بلا سكربت وسيط ولا متغيّر بيئة يجب تذكّره — مع قبول
 * متغيّر صريح أيضًا لمن يفضّله.
 */
const IS_PRODUCTION_RUN =
  !!process.env.PW_PRODUCTION || process.argv.some((arg) => arg.includes("production-smoke"));

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // محليًا صفر إعادة محاولة: أي رفرفة يجب أن تظهر لا أن تُبتلع،
  // وإعادة المحاولة قد تضاعف استدعاء المزوّد في اختبار الفشل.
  retries: 0,

  /**
   * أربعة عمّال لا اثنا عشر.
   *
   * الافتراضي نصف الأنوية (ستة هنا)، فتنطلق ست نسخ Chromium معًا على خادم
   * Next واحد وصفحة ثقيلة الخطوط. القياس أظهر أزمنة ١٨٫٨–٢٣٫٥ ثانية مقابل
   * مهلة ثلاثين — هامش ضيق يتحوّل رفرفةً عند أول انشغال للجهاز. تقليل
   * التوازي يعالج السبب، ورفع المهلة يعطي هامشًا صادقًا: التعليقات الحقيقية
   * ما زالت تفشل لأن كل انتظار هنا مشروط بحالة، لا بمدّة.
   */
  workers: 4,
  timeout: 60_000,

  reporter: [["list"], ["html", { open: "never" }]],

  /**
   * مقارنة بصرية بلا أي تسامح — صفر بكسل مختلف، وصفر عتبة لونية.
   *
   * القياس أثبت أن هذا ممكن فعلًا لا طموحًا: لقطة `#projects` الخام (٣١٤١px،
   * أطول من إطار العرض) تختلف بايتيًا بين تشغيل وآخر، لأن Playwright يلتقط
   * العناصر الأطول من الإطار على أكثر من مرور. لكن `toHaveScreenshot` يعيد
   * الالتقاط حتى تتطابق لقطتان متتاليتان **قبل** المقارنة، فيستهلك هذا
   * التذبذب في مصدره. ثلاث مقارنات متتالية على صفر تسامح نجحت ١٨/١٨.
   *
   * لذلك لا نرفع عدد البكسلات المسموح: `maxDiffPixels` و`maxDiffPixelRatio`
   * يبقيان صفرًا مهما جرى — لا مسامحة بالعدد إطلاقًا. العتبة اللونية وحدها
   * معايَرة، وتفصيل قياسها فوق عند `DEFAULT_VISUAL_THRESHOLD`.
   */
  expect: {
    toHaveScreenshot: {
      threshold: VISUAL_THRESHOLD,
      maxDiffPixels: 0,
      maxDiffPixelRatio: 0,
    },
  },

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },

  projects: [
    {
      // السويت الوظيفية الكاملة محليًا. تستبعد وسمَي الإنتاج والتوافق:
      // الأول لئلا يلمس الموقع المنشور إطلاقًا، والثاني لأنه تكرار لما
      // تغطّيه هذه السويت أصلًا بتفصيل أكبر.
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      grepInvert: /@production|@webkit-production|@cross-browser|@visual/,
    },
    {
      /**
       * الانحدار البصري — مشروع منفصل عمدًا.
       *
       * لا يعمل ضمن `npm run test:e2e`: المراجع سلطتها Linux وحدها، فتشغيله
       * تلقائيًا على ويندوز يُنتج فشلًا لا معنى له أو ملفات `-win32` لا قيمة
       * لها. الاستدعاء صريح دائمًا.
       *
       * `deviceScaleFactor: 1` مثبَّت هنا لا موروثًا: كثافة البكسل جزء من
       * هوية المرجع، وتغيّرها يُبطل كل الصور دفعةً واحدة.
       */
      name: "visual",
      use: {
        ...devices["Desktop Chrome"],
        deviceScaleFactor: 1,
        /**
         * تصيير برمجي مفروض — شرط الحتمية لا تفضيل أداء.
         *
         * القياس على ويندوز أظهر أن أسطح `backdrop-filter` (القائمة الزجاجية
         * وبطاقة التواصل) تتذبذب بين إطار وآخر بفارق ١ إلى ٨ درجات في قناة
         * لونية واحدة — ٤٬١٩٤ بكسل عند ±١ وذيل حتى ±٨. المصدر ترقيم بطاقة
         * الرسوم عند تركيب الضبابية، لا التطبيق: الشجرة ساكنة تمامًا بين
         * اللقطتين.
         *
         * Chromium على ubuntu بلا رأس يرسم برمجيًا أصلًا، فالمراجع المولّدة
         * هناك حتمية. تثبيت المسار نفسه محليًا يجعل ما نراه على ويندوز أقرب
         * لما تراه CI، ويمنع «يمرّ محليًا ويسقط في CI» والعكس.
         */
        launchOptions: {
          args: ["--disable-gpu", "--force-color-profile=srgb"],
        },
      },
      grep: /@visual/,
    },
    {
      // فحص توافق مضغوط فقط — لا السويت الكاملة على كل محرّك
      name: "firefox-smoke",
      use: { ...devices["Desktop Firefox"] },
      grep: /@cross-browser/,
    },
    {
      /**
       * فحص الإنتاج — قراءة فقط.
       *
       * `grep` على الوسم وحده: الصفحة الرئيسية تحمل نموذج Server Action،
       * فلا يجوز أن تتسرّب إليها اختبارات التواصل بأي حال.
       */
      name: "chromium-production-smoke",
      use: { ...devices["Desktop Chrome"], baseURL: PRODUCTION_URL },
      grep: /@production/,
    },
    {
      /**
       * WebKit يعمل على الإنتاج فقط، لا على الخادم المحلي.
       *
       * سياسة الأمان تحوي `upgrade-insecure-requests`، والخادم المحلي يقدّم
       * HTTP على 127.0.0.1. يطبّق WebKit الترقية على الحلقة المحلية — بخلاف
       * Chromium وFirefox — فتُطلب حزم الجافاسكربت عبر HTTPS وتفشل بخطأ SSL
       * فلا تُرطَّب الصفحة. قياس Phase 4C أثبت الطرفين: محليًا لا يعمل، وعلى
       * الإنتاج (HTTPS) يعمل بلا خطأ واحد. القيد بيئة اختبار لا عيب توافق،
       * ولا يبرّر تعديل السياسة ولا إضافة HTTPS محلي.
       *
       * الوسم لا يتقاطع نصًّا مع `@production`: لا يوجد فيه «@» يسبق
       * «production» مباشرةً، فلا يلتقط أحد المشروعين اختبارات الآخر.
       */
      name: "webkit-production-smoke",
      use: { ...devices["Desktop Safari"], baseURL: PRODUCTION_URL },
      grep: /@webkit-production/,
    },
  ],

  // لا خادم محلي في تشغيل الإنتاج — الموقع المنشور هو الهدف
  ...(IS_PRODUCTION_RUN
    ? {}
    : {
        webServer: {
          command: "npm run build && npm run start",
          url: BASE_URL,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
          stdout: "pipe" as const,
          stderr: "pipe" as const,
          env: {
            PORT: String(PORT),
            RESEND_API_KEY: INVALID_RESEND_KEY,
          },
        },
      }),
});
