import {
  Atom,      // React
  Terminal,  // Node.js
  Code2,     // TypeScript
  Move,      // Framer Motion
  Github     // Git Systems
} from "lucide-react";
import React from "react";

// 1. Custom Icon لـ Next.js 16 مصمم بـ SVG متوافق مع React 19 و TypeScript الصارم
const NextJsIcon = (props: React.ComponentPropsWithoutRef<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M16 8l-6 8h-.5v-4.5" />
    <path d="M13.5 8v4" />
  </svg>
);

// 2. Custom Icon لـ Tailwind CSS v4 مصمم بـ SVG متوافق مع أحدث معايير الأداء
const TailwindIcon = (props: React.ComponentPropsWithoutRef<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 6H4.5a2.5 2.5 0 000 5H12M12 18h7.5a2.5 2.5 0 000-5H12" />
    <path d="M12 6a3 3 0 013 3v9M12 18a3 3 0 01-3-3V6" />
  </svg>
);

interface TechItem {
  name: string;
  icon: React.ComponentType<React.ComponentPropsWithoutRef<"svg">>;
  color: string;
}

export const TECH_STACK: TechItem[] = [
  { name: "React 19", icon: Atom, color: "oklch(0.67 0.15 230)" }, // أزرق ريأكت
  // نستخدم توكِن الـ foreground بدل لون ثابت: شعار Next.js أساسًا أبيض/أسود حسب الوضع — والتوكِن بيعمل نفس الحاجة تلقائيًا
  { name: "Next.js 16", icon: NextJsIcon, color: "var(--color-foreground)" },
  { name: "Node.js", icon: Terminal, color: "oklch(0.75 0.15 140)" }, // أخضر نود
  { name: "TypeScript", icon: Code2, color: "oklch(0.6 0.18 250)" }, // أزرق تايبسكريبت
  { name: "Tailwind v4", icon: TailwindIcon, color: "oklch(0.7 0.15 210)" }, // سماوي تيلويند
  { name: "Framer Motion", icon: Move, color: "oklch(0.65 0.25 330)" }, // وردي فريمر
  { name: "Git Systems", icon: Github, color: "oklch(0.65 0.2 35)" }, // برتقالي جيت الحقيقي
];
