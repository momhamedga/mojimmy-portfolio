import { Lightbulb, PencilRuler, Code2, Rocket } from "lucide-react";
import React from "react";

export interface ProcessStep {
  title: string;
  desc: string;
  icon: React.ElementType;
  id: string;
}

/** أربع مراحل بصيغة المفرد، بلا مبالغة ولا ضمانات نتائج. */
export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "01",
    title: "الاكتشاف والتخطيط",
    desc: "أفهم الفكرة والهدف والجمهور، وأحدّد نطاق المشروع ومتطلباته قبل بدء التنفيذ.",
    icon: Lightbulb,
  },
  {
    id: "02",
    title: "التصميم والتجربة",
    desc: "أرسم تجربة الاستخدام وبنية الواجهة، وأختار الشكل الذي يخدم المحتوى لا العكس.",
    icon: PencilRuler,
  },
  {
    id: "03",
    title: "التطوير",
    desc: "أحوّل الخطة إلى منتج فعلي بكود نظيف ومنظّم، مع متابعة الأداء أثناء البناء لا بعده.",
    icon: Code2,
  },
  {
    id: "04",
    title: "الاختبار والإطلاق",
    desc: "أراجع الجودة والأداء والتجاوب على الأجهزة المختلفة، ثم أجهّز المشروع للإطلاق.",
    icon: Rocket,
  },
];
