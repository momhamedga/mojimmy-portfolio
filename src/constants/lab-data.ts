// src/constants/lab-data.ts

export interface LabExperiment {
  id: string;
  title: string;
  category: string;
  code: string;
  previewText: string;
  color: string; // سنستخدم OKLCH هنا لتوحيد الهوية البصرية
  defaultValues: Record<string, number>;
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: "01",
    title: "الجاذبية المغناطيسية",
    category: "Neural Physics",
    code: `// Neural Gravity Engine v4.0
const strength = 0.3;
const mass = 0.5;
const friction = 0.02;

function calculateAttraction(point) {
  const force = (target - point) * strength;
  return force / mass;
}`,
    previewText: "محاكاة لقوة الجذب الفيزيائية باستخدام معادلات القصور الذاتي.",
    color: "oklch(0.7 0.2 285)", // بنفسجي نيون
    defaultValues: { 
      strength: 0.3, 
      mass: 0.5,
      friction: 0.1 
    }
  },
  {
    id: "02",
    title: "تموجات الطاقة السحابية",
    category: "Fluid Dynamics",
    code: `// High-Frequency Wave Processor
const frequency = 10;
const speed = 2;
const amplitude = 1.5;

export const waveLayer = {
  animate: {
    scale: [1, amplitude, 1],
    transition: { duration: 1/speed }
  }
};`,
    previewText: "توليد موجات جيبية (Sine Waves) تتفاعل مع الترددات الزمنية.",
    color: "oklch(0.7 0.2 150)", // أخضر زمردي نيون
    defaultValues: { 
      frequency: 10, 
      speed: 2,
      amplitude: 1.5
    }
  }
];