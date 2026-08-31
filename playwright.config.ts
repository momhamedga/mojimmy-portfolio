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

/** مفتاح مزوّد غير صالح عمدًا: يعبر فحص «المفتاح موجود» ثم يرفضه المزوّد. */
const INVALID_RESEND_KEY = "re_e2eINVALID_donotuse_0000";

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
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run build && npm run start",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      PORT: String(PORT),
      RESEND_API_KEY: INVALID_RESEND_KEY,
    },
  },
});
