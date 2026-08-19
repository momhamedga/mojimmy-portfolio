interface ExpertiseGroup {
  id: string;
  title: string;
  /** أدوات أو مجالات — نصوص بسيطة تُعرض كـchips، ليست عناصر تفاعلية */
  items: string[];
}

/**
 * ثلاث مجموعات خبرة تدعم المقدمة في قسم "عني".
 *
 * الفرق عن قسم الخدمات: هذه **خبرة** (ما أتقنه)، لا **خدمة** (ما أقدّمه للعميل).
 * لذلك بلا أوصاف تسويقية ولا دعوات لاتخاذ إجراء.
 *
 * حلّت محل TECH_STACK القديم: ذاك كان جدار شعارات (7 تقنيات بأيقونات وألوان)
 * في قسم مستقل، وكان يكرّر ما تقوله وسوم المشاريع وتقنيات الخدمات.
 */
export const EXPERTISE: ExpertiseGroup[] = [
  {
    id: "01",
    title: "واجهات وتطبيقات ويب",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "02",
    title: "أنظمة ولوحات تحكم",
    items: ["Node.js", "Express", "PostgreSQL", "Neon", "Prisma"],
  },
  {
    id: "03",
    title: "الأداء وجودة التجربة",
    items: ["Core Web Vitals", "Accessibility", "Technical SEO"],
  },
];
