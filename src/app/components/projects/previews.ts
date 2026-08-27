import type { StaticImageData } from "next/image";

import britishAcademy from "@/assets/projects/01-british-academy.webp";
import icfbAcademy from "@/assets/projects/02-icfb-academy.webp";
import hhLawyer from "@/assets/projects/03-hh-lawyer.webp";
import jusoorInternational from "@/assets/projects/04-jusoor-international.webp";
import jawharatAlDanat from "@/assets/projects/05-jawharat-al-danat.webp";

/**
 * معاينات حقيقية ملتقطة من الصفحات المنشورة نفسها بعرض 1400×875، لا رسومًا
 * تخيّلية ولا صور مخزون ولا واجهات معاد بناؤها بـCSS. الاستيراد ثابت فيأتي
 * العرض والارتفاع من الملف نفسه، فلا يحدث أي إزاحة تخطيط عند التحميل.
 *
 * المفتاح هو project.id نفسه، فلا يحتاج نموذج البيانات إلى حقل جديد.
 */
export const PROJECT_PREVIEWS: Record<string, StaticImageData> = {
  "01": britishAcademy,
  "02": icfbAcademy,
  "03": hhLawyer,
  "04": jusoorInternational,
  "05": jawharatAlDanat,
};
