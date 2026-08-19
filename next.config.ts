import type { NextConfig } from "next";

/**
 * لا إعداد صور خارجية: نطاق flagcdn.com كان موجودًا حصريًا لأعلام الدول داخل
 * بطاقات "آراء العملاء" المحذوفة في 5B.8. لم يبقَ في المشروع أي استخدام
 * لـnext/image ولا أي مصدر صورة خارجي.
 */

const isDev = process.env.NODE_ENV === "development";

/**
 * سياسة أمان المحتوى — مبنية على جرد فعلي لما تحمّله الصفحة المنشورة،
 * لا على قالب جاهز. نتيجة الجرد: كل شيء من نفس الأصل، بلا أي طرف ثالث.
 *
 *   scripts  — كلها same-origin. لا CDN ولا تحليلات ولا وسوم خارجية.
 *   styles   — ملف CSS واحد same-origin + 61 سمة style مضمّنة.
 *   fonts    — next/font يستضيف Cairo ذاتيًا: صفر طلبات لـfonts.gstatic.
 *   images   — صفر وسوم <img>، لكن ملف CSS يحوي data:image/png واحدًا.
 *   connect  — صفر اتصالات خارجية. Resend يعمل على الخادم فقط، فلا يحتاج
 *              السماح لـapi.resend.com في المتصفح إطلاقًا.
 *   frames   — صفر iframes.  workers — صفر.  forms — نموذج واحد same-origin.
 *
 * 'unsafe-inline' في script-src ضرورة لا خيار: Next.js App Router يبثّ حمولة
 * RSC عبر وسوم <script> مضمّنة، ويضيف سكربت next-themes لمنع وميض السمة،
 * وثلاث كتل JSON-LD. البديل هو معمارية nonce تفرض عرضًا ديناميكيًا وتلغي
 * الـprerender الثابت الحالي — تغيير معماري خارج نطاق هذه المرحلة المحدودة.
 *
 * 'unsafe-eval' يُضاف في التطوير فقط لأن HMR يقيّم الوحدات وقت التشغيل.
 * لا يخرج إلى الإنتاج.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * قدرات المتصفح المعطّلة — الموقع لا يستخدم أيًا منها.
 * ملاحظة مقصودة: navigator.vibrate مستخدم فعلًا (اهتزاز خفيف في النموذج
 * والشريط السفلي)، ولا يُدرَج هنا حتى لا نعطّل ميزة قائمة.
 */
const permissionsPolicy = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "payment=()",
  "usb=()",
  "fullscreen=()",
  "browsing-topics=()",
].join(", ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // كل المسارات: الصفحات والأصول الثابتة وrobots وsitemap والأيقونة وصورة OG
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: permissionsPolicy },
          // دفاع متوافق مع المتصفحات القديمة، ومتسق مع frame-ancestors 'none'
          { key: "X-Frame-Options", value: "DENY" },
        ],
        // Strict-Transport-Security لا يُضاف هنا عمدًا: Vercel يرسله بالفعل
        // (max-age=63072000)، وإضافته ثانيةً تخاطر بترويسة مكرّرة أو متعارضة.
      },
    ];
  },
};

export default nextConfig;
