import { 
  Layout, 
  Code2, 
  Smartphone, 
  Rocket, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Zap 
} from "lucide-react";
import { ReactNode } from "react";

export interface Service {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  icon: ReactNode;
  color: string;
  tech: string[];
}

export const SERVICES: Service[] = [
  {
    id: "01",
    title: "UI/UX ARCHITECTURE",
    arabicTitle: "هندسة تجربة المستخدم",
    description: "نبتكر واجهات تفاعلية تدمج بين الجمال والوظيفية، مع التركيز الكامل على رحلة المستخدم وسلوكياته الرقمية.",
    icon: <Layout size={32} strokeWidth={1.5} />,
    color: "#a855f7",
    tech: ["Figma", "Framer", "Design Systems"]
  },
  {
    id: "02",
    title: "FULLSTACK SYSTEMS",
    arabicTitle: "تطوير النظم المتكاملة",
    description: "بناء منصات ويب متطورة باستخدام Next.js 16، نضمن لك سرعة استجابة فائقة وبنية تحتية برمجية صلبة.",
    icon: <Code2 size={32} strokeWidth={1.5} />,
    color: "#3b82f6",
    tech: ["Next.js 16", "TypeScript", "PostgreSQL"]
  },
  {
    id: "03",
    title: "MOBILE ECOSYSTEMS",
    arabicTitle: "تطبيقات الهواتف الذكية",
    description: "نصمم تطبيقات جوال Native توفر تجربة مستخدم سلسة، مع استغلال كامل لقدرات العتاد في iOS و Android.",
    icon: <Smartphone size={32} strokeWidth={1.5} />,
    color: "#ec4899",
    tech: ["React Native", "Expo", "Supabase"]
  },
  {
    id: "04",
    title: "AI & AUTOMATION",
    arabicTitle: "الذكاء الاصطناعي والأتمتة",
    description: "دمج حلول الذكاء الاصطناعي لرفع كفاءة أعمالك، من ربط نماذج LLM إلى بناء أدوات تحليل البيانات التنبؤية.",
    icon: <Cpu size={32} strokeWidth={1.5} />,
    color: "#8b5cf6",
    tech: ["OpenAI API", "Python", "LangChain"]
  },
  {
    id: "05",
    title: "SEO & PERFORMANCE",
    arabicTitle: "النمو الرقمي والأداء",
    description: "تحسين ظهورك في محركات البحث من خلال تقنيات السرعة القصوى (Vitals) وهيكلة البيانات المتقدمة.",
    icon: <Rocket size={32} strokeWidth={1.5} />,
    color: "#10b981",
    tech: ["SEO Core Vitals", "Analytics", "SSR"]
  },
  {
    id: "06",
    title: "CLOUD SECURITY",
    arabicTitle: "الأمن السحابي",
    description: "تأمين بياناتك بأعلى معايير التشفير العالمية، مع بناء بوابات دفع وحماية ضد الهجمات السيبرانية.",
    icon: <ShieldCheck size={32} strokeWidth={1.5} />,
    color: "#f59e0b",
    tech: ["Auth.js", "SSL/TLS", "Edge Functions"]
  }
];