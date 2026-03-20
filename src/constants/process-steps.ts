import { Lightbulb, PencilRuler, Code2, Rocket } from "lucide-react";
import React from "react";

export interface ProcessStep {
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  id: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "01",
    title: "الاكتشاف والتخطيط",
    desc: "نبدأ بفهم عميق لرؤيتك وتحويلها إلى خارطة طريق تقنية واضحة تضمن نجاح الاستثمار.",
    icon: Lightbulb,
    color: "#a855f7" // Purple
  },
  {
    id: "02",
    title: "التصميم والتجربة",
    desc: "بناء واجهات مستخدم ساحرة تركز على سيكولوجية المستخدم وجذب الانتباه من أول ثانية.",
    icon: PencilRuler,
    color: "#3b82f6" // Blue
  },
  {
    id: "03",
    title: "التطوير السحري",
    desc: "تحويل التصاميم إلى أكواد نظيفة، سريعة، وقابلة للتوسع باستخدام أحدث تقنيات الـ Full-stack.",
    icon: Code2,
    color: "#ec4899" // Pink
  },
  {
    id: "04",
    title: "الإطلاق والاختبار",
    desc: "تأكد من أن كل تفصيلة تعمل بدقة 100% قبل خروج المشروع للنور مع دعم فني مستمر.",
    icon: Rocket,
    color: "#10b981" // Emerald
  }
];