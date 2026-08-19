import { Code2, LayoutDashboard, ShoppingBag, Gauge, Cpu } from "lucide-react";
import { ReactNode } from "react";

export interface Service {
  id: string;
  /** عنوان الخدمة كما يقرأه العميل. */
  arabicTitle: string;
  description: string;
  icon: ReactNode;
  color: string;
  tech: string[];
}

/**
 * خدمات حقيقية يفهمها العميل — لا قوائم تقنيات.
 * القاعدة: العنوان خدمة، والـtech هي الأدوات المستخدمة داخلها.
 * (React مهارة، «تطوير المواقع وتطبيقات الويب» خدمة.)
 */
export const SERVICES: Service[] = [
  {
    id: "01",
    arabicTitle: "تطوير المواقع وتطبيقات الويب",
    description:
      "أبني موقعك أو تطبيقك من الصفر بواجهة سريعة ومتجاوبة مع كل الشاشات، وكود منظّم يسهل تطويره لاحقًا.",
    icon: <Code2 size={32} strokeWidth={1.5} />,
    color: "#3b82f6",
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "02",
    arabicTitle: "تطوير الأنظمة ولوحات التحكم",
    description:
      "أطوّر أنظمة إدارة ولوحات تحكم متكاملة مع قواعد بيانات وواجهات برمجية، مبنية لتتوسّع مع نمو العمل.",
    icon: <LayoutDashboard size={32} strokeWidth={1.5} />,
    color: "#8b5cf6",
    tech: ["Node.js", "Express", "PostgreSQL", "Neon", "Prisma"],
  },
  {
    id: "03",
    arabicTitle: "المتاجر الإلكترونية و WooCommerce",
    description:
      "أجهّز متجرك على WooCommerce أو بواجهة مخصّصة، مع تركيز على وضوح رحلة الشراء وسرعة الصفحات.",
    icon: <ShoppingBag size={32} strokeWidth={1.5} />,
    color: "#f59e0b",
    tech: ["WooCommerce", "WordPress", "Next.js"],
  },
  {
    id: "04",
    arabicTitle: "تحسين الأداء و Technical SEO",
    description:
      "أراجع أداء الموقع وبنيته التقنية، وأعالج ما يبطئه أو يعيق أرشفته، مع الاهتمام بإتاحة الواجهة.",
    icon: <Gauge size={32} strokeWidth={1.5} />,
    color: "#10b981",
    tech: ["Core Web Vitals", "Technical SEO", "Accessibility"],
  },
  {
    id: "05",
    arabicTitle: "تكاملات الذكاء الاصطناعي",
    description:
      "أضيف مزايا ذكية داخل تطبيقك عبر ربط خدمات الذكاء الاصطناعي، وأتمتة الخطوات المتكرّرة في سير العمل.",
    icon: <Cpu size={32} strokeWidth={1.5} />,
    color: "#a855f7",
    tech: ["AI Integrations", "Automation", "Next.js"],
  },
];
