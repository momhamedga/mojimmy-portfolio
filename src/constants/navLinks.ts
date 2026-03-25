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
    name: "عني", 
    href: "about", 
    number: "03" 
  },
  { 
    id: 4, 
    name: "الخدمات", 
    href: "services", 
    number: "04" 
  },

  { 
    id: 5, 
    name: "رحلة العمل", 
    href: "process", 
    number: "06" 
  },
  { 
    id: 6, 
    name: "الآراء", 
    href: "testimonials", 
    number: "07" 
  },
  { 
    id: 7, 
    name: "الأسئلة", 
    href: "faq", 
    number: "08" 
  },
  { 
    id: 8, 
    name: "تواصل معي", 
    href: "contact", 
    number: "09" 
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