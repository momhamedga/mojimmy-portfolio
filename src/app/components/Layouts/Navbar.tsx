"use client"
import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring } from "framer-motion";
import { Menu, X, Zap, MapPin, Globe } from "lucide-react";
import { Logo } from "./Logo"; 
import { navLinks } from "@/src/constants/navLinks";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const { scrollY } = useScroll();

  const triggerHaptic = (intensity = 15) => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(intensity);
    }
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsFloating(latest > 80);
  });

  const handleClose = () => {
    triggerHaptic(10);
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav 
        dir="rtl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] p-4 md:p-8 flex justify-between items-center pointer-events-none"
      >
        <div className="pointer-events-auto">
          <Logo />
        </div>

        <div className="pointer-events-auto flex items-center gap-4">
          <AnimatePresence>
            {!isOpen && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setIsOpen(true); triggerHaptic(20); }}
                // الزر الآن زجاجي بحدود ملونة تشبه اللوجو
                className={`flex items-center gap-3 p-1.5 pr-6 rounded-full border border-white/20 backdrop-blur-2xl transition-all duration-500 shadow-[0_10px_30px_rgba(168,85,247,0.2)]
                  ${isFloating ? "bg-white text-black border-purple-200" : "bg-black/40 text-white"}`}
              >
                <span className="text-xs font-black uppercase tracking-[0.2em] hidden md:block">القائمة</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                  ${isFloating ? "bg-gradient-to-tr from-blue-600 to-purple-600 text-white" : "bg-white text-black"}`}>
                  <Menu size={20} />
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-[1000] flex md:flex-row flex-col overflow-hidden"
            initial={{ clipPath: "circle(0% at 92% 8%)" }}
            animate={{ clipPath: "circle(150% at 92% 8%)" }}
            exit={{ clipPath: "circle(0% at 92% 8%)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* 1. الخلفية المنبعثة (Emanating Background) */}
            <div className="absolute inset-0 bg-[#050505] -z-10">
              {/* دوائر لونية سائلة تتحرك في الخلفية */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  x: [0, 50, 0],
                  y: [0, -30, 0] 
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full" 
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1],
                  x: [0, -40, 0],
                  y: [0, 60, 0] 
                }}
                transition={{ duration: 12, repeat: Infinity, delay: 1 }}
                className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-600/15 blur-[150px] rounded-full" 
              />
              {/* تأثير الحبيبات (Noise) ليصبح المظهر زجاجياً فاخراً */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none" />
            </div>

            {/* الجانب الأيسر (الكمبيوتر) - منشور زجاجي داكن */}
            <div className="hidden md:flex w-1/3 border-l border-white/10 p-20 flex-col justify-between backdrop-blur-md bg-white/[0.02]">
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">نحن هنا في أبوظبي</span>
                </motion.div>
                <h2 className="text-5xl font-black text-white leading-tight">
                  نحول <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">الخيال</span> <br/> إلى واقع رقمي.
                </h2>
              </div>
              
              <div className="space-y-8 border-t border-white/5 pt-10">
                <div className="flex gap-8">
                  {['TW', 'IG', 'BE', 'LN'].map((s, i) => (
                    <motion.span 
                      key={s} 
                      whileHover={{ y: -5, color: "#a855f7" }}
                      className="text-sm text-gray-500 cursor-pointer font-black transition-colors"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* الجانب الأيمن (الروابط) */}
            <motion.div 
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(_, info) => info.offset.y > 100 && handleClose()}
              className="flex-1 p-8 md:p-24 flex flex-col justify-center relative"
            >
              {/* زر الإغلاق المطور - نيون */}
              <motion.button 
                whileHover={{ rotate: 90, scale: 1.1 }}
                onClick={handleClose}
                className="absolute top-12 left-12 w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:text-pink-500 hover:border-pink-500/50 transition-all duration-500 hidden md:flex"
              >
                <X size={32} strokeWidth={1.5} />
              </motion.button>

              <nav className="space-y-2 md:space-y-4" dir="rtl">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * i }}
                    className="group relative"
                  >
                    <a 
                      href={`#${link.href}`}
                      onClick={() => { triggerHaptic(5); handleClose(); }}
                      className="inline-block py-2"
                    >
                      <div className="flex items-center gap-6">
                        {/* أرقام نيون تظهر عند التحويم */}
                        <span className="text-sm font-mono text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500 font-bold">
                          {link.number}
                        </span>
                        <h1 className="text-6xl md:text-[7rem] font-black text-white/10 group-hover:text-white transition-all duration-700 tracking-tighter group-hover:pl-8">
                          {link.name}
                        </h1>
                      </div>
                    </a>
                    {/* خط سائل ملون يظهر تحت الرابط */}
                    <motion.div 
                      className="absolute bottom-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 w-0 group-hover:w-full transition-all duration-700"
                    />
                  </motion.div>
                ))}
              </nav>

              {/* الموبايل فوتر - تأثير النيون */}
              <div className="mt-auto md:hidden pt-10 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">المقر الرئيسي</p>
                    <p className="text-2xl text-white font-black font-arabic tracking-tighter">أبوظبي</p>
                  </div>
                  {/* أيقونة Zap مشعة بنفس أسلوب اللوجو */}
                  <motion.div 
                    animate={{ 
                      boxShadow: ["0 0 20px rgba(168,85,247,0.2)", "0 0 40px rgba(168,85,247,0.5)", "0 0 20px rgba(168,85,247,0.2)"] 
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-pink-600 rounded-2xl flex items-center justify-center"
                  >
                    <Zap size={28} className="text-white fill-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}