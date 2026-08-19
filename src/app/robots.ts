import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/site";

/**
 * لا قواعد staging مثبّتة هنا: الموقع صفحة واحدة عامة بالكامل، ولا توجد
 * مسارات إدارة أو مصادقة تستدعي استثناءً. المنع الوحيد هو مسارات Next
 * الداخلية التي لا قيمة لفهرستها.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
