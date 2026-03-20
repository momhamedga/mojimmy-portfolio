export interface LabExperiment {
  id: string;
  title: string;
  category: string;
  code: string;
  previewText: string;
  gradient: string;
  defaultValues: Record<string, any>; // القيم اللي المستخدم هيغيرها
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: "01",
    title: "الجاذبية المغناطيسية",
    category: "Interactive UI",
    code: "const strength = 0.3;\nconst radius = 150;",
    previewText: "جرب تحريك الدائرة وشوف إزاي بتنجذب لمكان الماوس بقوة متغيرة.",
    gradient: "from-purple-600 to-blue-600",
    defaultValues: { strength: 0.3, radius: 150 }
  },
  {
    id: "02",
    title: "تموجات الطاقة",
    category: "Shaders",
    code: "const frequency = 10;\nconst speed = 2;",
    previewText: "تحكم في سرعة وتردد الأمواج الضوئية.",
    gradient: "from-emerald-500 to-cyan-500",
    defaultValues: { frequency: 10, speed: 2 }
  }
];