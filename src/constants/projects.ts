import { Project } from "../types/project";

export const PROJECTS: Project[] = [
  { 
    id: "01",
    title: " BRITISH ACADEMY ", 
    description: "نظام   متكامل بأداء فائق وسرعة البرق،  مع لوحة تحكم كامله وتقنيات رهيبة  .", 
    size: "md:col-span-2 md:row-span-2", 
    gradient: "from-blue-600 to-indigo-900",
    tags: ["Next.js 15", "React 19", "neon", "resend", "Typescript","Tailwind"],
    link: "https://britishacademy-ss.online/"
  },
  { 
    id: "02",
    title: "استوديو الذكاء", 
    description: "منصة إبداعية لتوليد الصور الفنية باستخدام أقوى نماذج الذكاء الاصطناعي.", 
    size: "col-span-1 row-span-1", 
    gradient: "from-purple-600 to-pink-600",
    tags: ["OpenAI", "React"],
    link: "#"
  },
  { 
    id: "03",
    title: "تطبيق فينتك", 
    description: "حلول مالية ذكية لإدارة المحافظ الرقمية والعملات المشفرة بأمان.", 
    size: "col-span-1 row-span-1", 
    gradient: "from-cyan-500 to-blue-600",
    tags: ["Web3", "TypeScript"],
    link: "#"
  },
  { 
    id: "04",
    title: "بوابة البيانات", 
    description: "لوحة تحكم ذكية تحول الأرقام المعقدة إلى قصص بصرية مفهومة.", 
    size: "md:col-span-2 md:row-span-1", 
    gradient: "from-orange-500 to-red-600",
    tags: ["D3.js", "Firebase"],
    link: "#"
  },
];