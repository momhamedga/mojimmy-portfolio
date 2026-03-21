"use client"
import { useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Zap, ArrowLeft } from "lucide-react";
import { Logo } from "./Logo"; 
import { navLinks } from "@/src/constants/navLinks";
import Link from "next/link";

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
    if (latest > 80 !== isFloating) setIsFloating(latest > 80);
  });

  const handleClose = useCallback(() => {
    triggerHaptic(10);
    setIsOpen(false);
  }, []);

  return (
    <>
      <motion.nav 
        dir="rtl"
        className="fixed top-0 left-0 right-0 z-[100] p-4 md:p-8 flex justify-between items-center pointer-events-none"
      >
        <div className="pointer-events-auto"><Logo /></div>
        <div className="pointer-events-auto">
          <AnimatePresence>
            {!isOpen && (
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => { setIsOpen(true); triggerHaptic(20); }}
                className={`group flex items-center gap-3 py-2 px-4 rounded-full border transition-all duration-500
                  ${isFloating ? "bg-white text-black border-black shadow-lg" : "bg-black/50 text-white border-white/10 backdrop-blur-md"}`}
              >
                <span className="text-xs font-bold tracking-widest">القائمة</span>
                <Menu size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-[1000] flex flex-col md:flex-row bg-[#080808] overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* الجانب الأيمن: المحتوى التعريفي (يظهر في الكمبيوتر بجمالية) */}
            <div className="hidden md:flex w-5/12 bg-[#0c0c0c] p-20 flex-col justify-between border-l border-white/5" dir="rtl">
              <div className="space-y-6">
          
                <h2 className="text-4xl font-bold text-white leading-tight">
                  نصمم للمستقبل، <br/> ونبني <span className="text-purple-500">التجربة.</span>
                </h2>
                <p className="text-gray-500 text-sm max-w-xs leading-loose">
                  من قلب أبوظبي، نقدم حلولاً رقمية تجمع بين الفن والكفاءة البرمجية.
                </p>
              </div>
              <div className="text-[10px] text-white/20 font-bold tracking-[0.5em]">
                أبوظبي • الإمارات
              </div>
            </div>

            {/* الجانب الأيسر: الروابط (تركيز كامل) */}
            <div className="flex-1 bg-[#0c0c0c]   p-8 md:p-24 flex flex-col relative" dir="rtl">
              {/* زر الإغلاق */}
              <button 
                onClick={handleClose}
                className="self-end flex items-center gap-2 text-white/50 hover:text-white transition-colors group mb-12"
              >
                <span className="text-xs font-bold">رجوع</span>
                <div className="p-3 rounded-full border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                  <X size={20} />
                </div>
              </button>

              <nav className="flex flex-col space-y-4 md:space-y-6">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.name}
                    href={`#${link.href}`}
                    onClick={() => { triggerHaptic(5); handleClose(); }}
                    className="group flex items-center gap-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className="flex items-center gap-6"
                    >
                      <span className="text-xs font-mono text-white/20 group-hover:text-blue-500 transition-colors">
                        0{i + 1}
                      </span>
                      <h1 className="text-4xl md:text-6xl font-bold text-white/40 group-hover:text-white transition-all duration-300">
                        {link.name}
                      </h1>
                      <ArrowLeft className="text-blue-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" size={24} />
                    </motion.div>
                  </Link>
                ))}
              </nav>

              {/* فوتر الموبايل */}
              <div className="mt-auto md:hidden pt-10 border-t border-white/5">
                <p className="text-xs text-gray-600 mb-2">تواصل معنا</p>
                <div className="flex gap-4 text-[10px] font-bold text-white/40">
                  <span>واتساب</span> • <span>لينكدإن</span> • <span>بهانس</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}