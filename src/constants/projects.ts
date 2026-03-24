// src/data/projects.ts
import { Project } from "../types/project";

export const PROJECTS: Project[] = [
  { 
    id: "01",
    title: "BRITISH ACADEMY", 
    description: "نظام متكامل بأداء فائق وسرعة البرق، مع لوحة تحكم كاملة وتقنيات رهيبة لإدارة المؤسسات التعليمية.", 
    color: "oklch(0.6 0.2 250)", // أزرق ملكي ساطع
    tags: ["Next.js 16", "React 19", "Neon", "TypeScript"],
    link: "https://britishacademy-ss.online"
  },
  { 
    id: "02",
    title: "ICFB ACADEMY", 
    description: "نظام متكامل لإدارة الأكاديميات التدريبية، مبني بأحدث تقنيات الويب لضمان تجربة مستخدم سلسة.", 
    color: "oklch(0.65 0.3 20)", // أحمر/ياقوتي نيون
    tags: ["Next.js 16", "AI Integration", "Tailwind v4"],
    link: "https://icfb.site"
  },
  { 
    id: "03", 
    title: "HH LAWYER", 
    description: "مكتب المحامي حسين الحارثي، وجهتكم الموثوقة للعدالة والاستشارات القانونية المتكاملة.", 
    color: "oklch(0.75 0.15 80)", // ذهبي قانوني فخم
    tags: ["Legal Tech", "SEO 2026", "Dark Mode"],
    link: "https://hhlawyer.vercel.app"
  },
  { 
    id: "04",
    title: "CAPTAIN AHMED", 
    description: "موقع رياضي ذكي يولد تمارين مخصصة باستخدام الذكاء الاصطناعي مع لوحات تحكم متطورة.", 
    color: "oklch(0.7 0.25 45)", // برتقالي رياضي طاقة (Energy Orange)
    tags: ["Fitness AI", "Motion Graphics", "Supabase"],
    link: "https://kabtinahmedelebendary.online"
  },
];