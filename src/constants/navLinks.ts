// src/constants/navLinks.ts

export interface NavLink {
  id: number;
  name: string;
  href: string;
  number: string;
}

export const navLinks: NavLink[] = [
  { 
    id: 1, 
    name: "الرئيسية", 
    href: "home", 
    number: "01" 
  },
  { 
    id: 2, 
    name: "المشاريع", 
    href: "projects", 
    number: "02" 
  },
  { 
    id: 3, 
    name: "الخدمات", 
    href: "services", 
    number: "03" 
  },
  { 
    id: 4, 
    name: "الخبرة", 
    href: "experience", 
    number: "04" 
  },
  { 
    id: 5, 
    name: "الآراء", 
    href: "testimonials", 
    number: "05" 
  },
  { 
    id: 6, 
    name: "تواصل معي", 
    href: "contact", 
    number: "06" 
  },
];

// روابط التواصل الاجتماعي للإبداع في القائمة الجانبية
export const socialLinks = [
  { name: "Behance", href: "#", label: "BE" },
  { name: "LinkedIn", href: "#", label: "LN" },
  { name: "Instagram", href: "#", label: "IG" },
  { name: "X / Twitter", href: "#", label: "TW" },
];

// معلومات الموقع (أبوظبي)
export const siteConfig = {
  location: "أبوظبي، الإمارات",
  email: "hello@mojimmy.com",
  vibrationIntensity: {
    light: 8,
    medium: 15,
    strong: 25
  }
};