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
      grepInvert: /@production|@webkit-production|@cross-browser/,
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
