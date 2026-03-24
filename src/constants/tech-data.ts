import { 
  RiReactjsLine, 
  RiNextjsFill, 
  RiNodejsLine, 
  RiTailwindCssFill 
} from "react-icons/ri";
import { 
  SiTypescript, 
  SiFramer, 
  SiGithub 
} from "react-icons/si";

export const TECH_STACK = [
  // المدار الداخلي (Inner Orbit) - التقنيات الأساسية
  { 
    name: "React 19", 
    icon: RiReactjsLine, 
    level: "inner", 
    angle: 0, 
    color: "oklch(0.67 0.15 230)" // أزرق ريأكت نيون
  },
  { 
    name: "Next.js 16", 
    icon: RiNextjsFill, 
    level: "inner", 
    angle: 120, 
    color: "oklch(0.95 0 0)" // أبيض ناصع
  },
  { 
    name: "Node.js", 
    icon: RiNodejsLine, 
    level: "inner", 
    angle: 240, 
    color: "oklch(0.75 0.15 140)" // أخضر نود
  },

  // المدار الخارجي (Outer Orbit) - الأدوات المساعدة
  { 
    name: "TypeScript", 
    icon: SiTypescript, 
    level: "outer", 
    angle: 0, 
    color: "oklch(0.6 0.18 250)" // أزرق تي بي سكريبت
  },
  { 
    name: "Tailwind v4", 
    icon: RiTailwindCssFill, 
    level: "outer", 
    angle: 90, 
    color: "oklch(0.7 0.15 210)" // سماوي تيلويند
  },
  { 
    name: "Framer Motion", 
    icon: SiFramer, 
    level: "outer", 
    angle: 180, 
    color: "oklch(0.65 0.25 330)" // وردي فريمر نيون
  },
  { 
    name: "Git Systems", 
    icon: SiGithub, 
    level: "outer", 
    angle: 270, 
    color: "oklch(0.9 0.05 250)" // رمادي فاتح
  },
];