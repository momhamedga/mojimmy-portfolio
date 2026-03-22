// src/data/projects.ts
import { Project } from "../types/project";

export const PROJECTS: Project[] = [
  { 
    id: "01",
    title: "BRITISH ACADEMY", 
    description: "نظام متكامل بأداء فائق وسرعة البرق، مع لوحة تحكم كاملة وتقنيات رهيبة لإدارة المؤسسات التعليمية.", 
    size: "md:col-span-2 md:row-span-2", 
    gradient: "from-blue-600 to-indigo-900", // ألوان Tailwind قياسية
    tags: ["Next.js 15", "React 19", "Neon", "Resend", "TypeScript", "Tailwind"],
    link: "https://britishacademy-ss.online"
  },
  { 
    id: "02",
    title: "ICFB ACADEMY", 
    description: "نظام متكامل لإدارة الأكاديميات التدريبية، مبني بأحدث تقنيات الويب لضمان تجربة مستخدم سلسة.", 
    size: "col-span-1 row-span-1", 
    gradient: "from-[#003366] to-[#E63946]", // HEX Colors
    tags: ["Next.js 15", "React 19", "Neon", "Resend", "TypeScript", "Tailwind"],
    link: "https://icfb.site"
  },
  { 
    id: "03", 
    title: "HH LAWYER", 
    description: "مكتب المحامي وكاتب العدل حسين الحارثي، وجهتكم الموثوقة للعدالة والاستشارات القانونية المتكاملة.", 
    size: "col-span-1 row-span-1", 
    gradient: "from-amber-500 to-stone-900", // Tailwind Colors
    tags: ["Next.js 15", "React 19", "Neon", "Resend", "TypeScript", "Tailwind"],
    link: "https://hhlawyer.vercel.app"
  },
  { 
    id: "04",
    title: "CAPTAIN AHMED", 
    description: "موقع رياضي ذكي يولد تمارين مخصصة باستخدام الذكاء الاصطناعي مع لوحات تحكم متطورة.", 
    size: "col-span-1 row-span-1", 
    // تم تعديلها لتكون متوافقة مع دالة الاستخراج (استخدمنا HEX للبرتقالي بدلاً من rgba لضمان قوة اللون)
    gradient: "from-[#F97316] to-[#7C2D12]", 
    tags: ["Next.js 15", "React 19", "AI Integration", "Neon", "TypeScript", "Tailwind"],
    link: "https://kabtinahmedelebendary.online"
  },
];