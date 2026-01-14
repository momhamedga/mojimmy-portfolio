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
     <AnimatePresence>
  {isOpen && (
    <>
      {/* 1. الخلفية الضبابية (The Magic Veil) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-md md:hidden"
      />

      {/* 2. القائمة الرئيسية (The Fluid Panel) */}
      <motion.div
        initial={{ x: "100%", borderTopLeftRadius: "100px", borderBottomLeftRadius: "100px" }}
        animate={{ x: 0, borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px" }}
        exit={{ x: "100%", borderTopLeftRadius: "100px", borderBottomLeftRadius: "100px" }}
        transition={{ type: "spring", damping: 25, stiffness: 150 }}
        className="fixed top-0 right-0 bottom-0 w-[85%] z-[100] bg-[#080808]/90 border-l border-white/10 p-8 flex flex-col justify-between md:hidden shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
      >
        {/* النقوش الخلفية البسيطة */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
             <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600 rounded-full blur-[100px]" />
        </div>

        <div className="relative mt-20">
          <div className="flex flex-col gap-6">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i, ease: [0.215, 0.61, 0.355, 1] }}
                href={`#${link.href}`}
                onClick={(e) => handleScroll(e, link.href)}
                className="group relative inline-block py-2"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-purple-500/50">0{i + 1}</span>
                  <span className={`text-5xl font-black tracking-tighter uppercase transition-all duration-300 
                    ${activeSection === link.href 
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 scale-110 origin-right" 
                      : "text-white hover:text-purple-400"}`}>
                    {link.name}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Footer القائمة (Socials & Button) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative border-t border-white/10 pt-8"
        >
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mb-6">Let's Create Magic</p>
          <button
            onClick={(e) => handleScroll(e, "contact")}
            className="w-full py-5 bg-white text-black rounded-2xl font-black text-xl hover:bg-purple-600 hover:text-white transition-all active:scale-95"
          >
            تواصل الآن
          </button>
        </motion.div>
      </motion.div>
    </>
  )}
</AnimatePresence>
    </>
  );
}