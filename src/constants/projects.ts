import { Project } from "../types/project";

/**
 * مصدر الحقيقة الوحيد للمشاريع — تقرؤه الصفحة الرئيسية ومسارات دراسات
 * الحالة وخريطة الموقع معًا، فلا نسخة ثانية تتخلّف عن الأولى.
 *
 * قرار هجاء: عنوان المشروع الرابع يكتب «jusoor» بينما استضافته المنشورة
 * تكتب «josour». الـslug يتبع العنوان المعروض لأنه ما يقرؤه الزائر، ورابط
 * الموقع الحيّ يبقى كما هو حرفًا بحرف — لا يُعاد تسميته من هنا.
 */

export const PROJECTS: Project[] = [
  {
    id: "01",
    slug: "british-academy",
    title: "BRITISH ACADEMY",
    category: "منصة تعليمية",
    description:
      "نظام متكامل بأداء فائق وسرعة البرق، مع لوحة تحكم كاملة وتقنيات رهيبة لإدارة المؤسسات التعليمية.",
    color: "oklch(0.6 0.2 250)", // أزرق ملكي ساطع
    tags: ["Next.js 16", "React 19", "Neon", "TypeScript"],
    link: "https://britishacademy-ss.online",
  },
  {
    id: "02",
    slug: "icfb-academy",
    title: "ICFB ACADEMY",
    category: "منصة تدريب",
    description:
      "نظام متكامل لإدارة الأكاديميات التدريبية، مبني بأحدث تقنيات الويب لضمان تجربة مستخدم سلسة.",
    color: "oklch(0.65 0.3 20)", // أحمر/ياقوتي نيون
    tags: ["Next.js 16", "AI Integration", "Tailwind v4"],
    link: "https://icfb.site",
  },
  {
    id: "03",
    slug: "hh-lawyer",
    title: "HH LAWYER",
    category: "موقع مهني",
    description:
      "مكتب المحامي حسين الحارثي، وجهتكم الموثوقة للعدالة والاستشارات القانونية المتكاملة.",
    color: "oklch(0.65 0.15 80)", // ذهبي قانوني فخم
    tags: ["Legal Tech", "SEO 2026", "Dark Mode", "Next", "React"],
    link: "https://hhlawyer.vercel.app",
  },
  {
    id: "04",
    slug: "jusoor-international",
    title: "jusoor international consulting",
    category: "موقع استشارات",
    description: "منظومة جسور انترناشيونال للأستشارات الإدارية المتكاملة مع لوحات تحكم متطورة.",
    color: "oklch(0.7 0.25 95)", // برتقالي رياضي طاقة (Energy Orange)
    tags: ["Next", "Motion Graphics", "React", "TypeScript"],
    link: "https://josour-international.vercel.app",
  },
  {
    id: "05",
    slug: "jawharat-al-danat",
    title: "JAWHARAT AL DANAT",
    category: "موقع أعمال وفعاليات",
    // الوصف يصف الموقع لا يروّج للشركة: القطاعان والثنائية اللغوية ولوحة
    // التحكم كلها متحقَّقة من مصدر المشروع ومن الصفحة المنشورة.
    description:
      "موقع ثنائي اللغة لقطاعَي العناية بالسيارات وتنظيم الفعاليات، مع مدونة ولوحة تحكم إدارية.",
    color: "oklch(0.68 0.16 165)", // أخضر زمردي — درجة غير مستخدمة في البطاقات الأربع
    tags: ["Next.js 16", "React 19", "Prisma", "Tailwind v4"],
    link: "https://jawharat-al-danat.vercel.app/",
  },
];
