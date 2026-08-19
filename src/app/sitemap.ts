import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/site";

/**
 * الموقع صفحة واحدة: الجذر هو العنوان الوحيد القابل للفهرسة.
 * لا نخترع مسارات وهمية، ولا نضع changeFrequency أو priority تجميليين —
 * محركات البحث تتجاهلهما غالبًا، وقيمتهما هنا صفر.
 *
 * lastModified يُحسب وقت البناء، وهو أصدق ما يمكن قوله بلا CMS أو مصدر تواريخ.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL, // نفس تمثيل canonical بالضبط — بلا شرطة مائلة زائدة
      lastModified: new Date(),
    },
  ];
}
