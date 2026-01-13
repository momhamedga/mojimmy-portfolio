"use client"
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import MagneticButton from "./MagneticButton";
import Magnetic from "./Magnetic";

const navLinks = [
  { name: "الرئيسية", href: "home" },
  { name: "المشاريع", href: "projects" },
  { name: "الخدمات", href: "services" },
  { name: "الخبرة", href: "experience" },
  { name: "الأراء", href: "testimonials" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { scrollY } = useScroll();

  // 1. وظيفة السكرول الناعم مع Offset دقيق
  const handleScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; 
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      
      setIsOpen(false);
    }
  };

  // 2. نظام الـ Scroll Spy المطور (Most Visible Section)
useEffect(() => {
    const sectionIds = ["home", "about", "projects", "services", "experience", "testimonials", "contact"];
    
    // 1. تحقق فوري بمجرد تحميل الصفحة (قبل السكرول)
    const currentHash = window.location.hash.replace("#", "");
    if (window.scrollY < 100) {
      setActiveSection("home");
      window.history.replaceState(null, "", "#home");
    } else if (currentHash) {
      setActiveSection(currentHash);
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      
      if (visibleEntries.length > 0) {
        const mostVisible = visibleEntries.reduce((prev, current) => 
          (current.intersectionRatio > prev.intersectionRatio) ? current : prev
        );

        const id = mostVisible.target.id;
        setActiveSection(id);
        window.history.replaceState(null, "", `#${id}`);
      } else if (window.scrollY < 100) {
        setActiveSection("home");
        window.history.replaceState(null, "", "#home");
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-10% 0px -40% 0px", // عدلنا المارجن قليلاً ليكون أسرع في التقاط الهيرو
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
    });

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);
  // 3. التحكم في ظهور واختفاء النافبار عند السكرول
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true); // إخفاء عند النزول
    } else {
      setHidden(false); // إظهار عند الصعود
    }
    setIsFloating(latest > 50); // تحويل لشكل الكبسولة بعد سكرول بسيط
  });

  return (
    <>
      <motion.nav
        dir="rtl"
        variants={{ visible: { y: 0 }, hidden: { y: -120 } }}
        animate={hidden && !isOpen ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] pt-6 px-6 flex justify-center"
      >
        <div 
          className={`flex items-center justify-between transition-all duration-500 ease-in-out px-8 py-3 rounded-full border
            ${isFloating 
              ? "w-full md:w-[850px] bg-black/40 backdrop-blur-xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]" 
              : "w-full bg-transparent border-transparent py-5"}`}
        >
          {/* Logo - أضفنا aria-label */}
          <a 
            href="#home" 
            onClick={(e) => handleScroll(e, "home")} 
            className="cursor-pointer"
            aria-label="Mojimmy Home" 
          >
            <div className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-[360deg] transition-transform duration-700">
                <span className="text-white font-black text-xl italic">M</span> 
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-pink-500 transition-all duration-300">
                Mojimmy<span className="text-pink-500">.</span> 
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <Magnetic key={link.name}>
                  <a 
                    href={`#${link.href}`}
                    onClick={(e) => handleScroll(e, link.href)}
                    className={`text-[15px] font-bold transition-all duration-300 relative group px-2
                      ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.span 
                        layoutId="activeNav"
                        className="absolute -bottom-1 right-0 h-0.5 w-full bg-gradient-to-r from-blue-600 to-pink-500"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </Magnetic>
              );
            })}
            
            <MagneticButton>
              <a href="#contact" onClick={(e) => handleScroll(e, "contact")} className="mr-4">
                <button 
                  aria-label="Contact Me"
                  className={`px-6 py-2.5 rounded-full text-sm font-extrabold transition-all 
                    ${activeSection === "contact" 
                      ? "bg-white text-black" 
                      : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white"}`}>
                  تواصل معي
                </button>
              </a>
            </MagneticButton>
          </div>

          {/* Mobile Toggle - أضفنا aria-label هنا أيضاً */}
          <button 
            className="md:hidden text-white p-2" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} className="text-purple-400" />}
          </button>
        </div>
      </motion.nav>
      {/* ... (بقية الـ Mobile Menu Overlay) */}
    </>
  );
}