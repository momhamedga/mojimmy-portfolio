import type { NextConfig } from "next";

/**
 * لا إعداد صور خارجية: نطاق flagcdn.com كان موجودًا حصريًا لأعلام الدول داخل
 * بطاقات "آراء العملاء" المحذوفة في 5B.8. لم يبقَ في المشروع أي استخدام
 * لـnext/image ولا أي مصدر صورة خارجي.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
