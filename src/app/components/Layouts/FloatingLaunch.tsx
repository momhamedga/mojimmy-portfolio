"use client"
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MessageCircle, Send, Phone } from "lucide-react";
import { useState, useCallback } from "react";

// 1. تعريف البيانات خارج المكون (Static Data)
interface ActionItem {
  icon: React.ReactNode;
  label: string;
  color: string;
  href: string;
}

const ACTIONS: ActionItem[] = [
  { icon: <MessageCircle size={22} />, label: "واتساب", color: "bg-[#25D366]", href: "https://wa.me/+971589915968" },
  { icon: <Send size={22} />, label: "تليجرام", color: "bg-[#0088cc]", href: "#" },
  { icon: <Phone size={22} />, label: "اتصال", color: "bg-blue-600", href: "#" },
];

const menuVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.8 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 500, 
      damping: 30,
      staggerChildren: 0.1 
    }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.8,
    transition: { duration: 0.2 } 
  }
};

const itemVariants: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 }
};

export default function FloatingLaunch() {
  const [isExpanded, setIsExpanded] = useState(false);

  // 2. دالة الاهتزاز (Haptic) محسنة للموبايل
  const triggerHaptic = useCallback((intensity: number | number[] = 15) => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(intensity);
    }
  }, []);

  const toggleMenu = () => {
    triggerHaptic(isExpanded ? 10 : [20, 10, 20]); // نمط اهتزاز مميز عند الفتح
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-8 left-8 z-[999] md:hidden flex flex-col items-center gap-4 select-none">
      
      {/* خيارات الاتصال السريعة */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-3 mb-2"
          >
            {ACTIONS.map((action, i) => (
              <motion.a
                key={action.label}
                href={action.href}
                variants={itemVariants}
                target="_blank"
                rel="noopener noreferrer"
                className={`${action.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/20 active:scale-90 transition-transform`}
                onClick={() => triggerHaptic(15)}
              >
                {action.icon}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* الزر الرئيسي */}
      <motion.button
        onClick={toggleMenu}
        whileTap={{ scale: 0.9 }}
        className="relative w-16 h-16 group outline-none"
        style={{ willChange: "transform" }}
      >
        {/* الهالة المشعة (Optimized Aura) */}
        <motion.div 
          animate={{ 
            scale: isExpanded ? 1.1 : [1, 1.15, 1],
            opacity: isExpanded ? 0.4 : [0.4, 0.7, 0.4] 
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 blur-2xl rounded-full pointer-events-none"
        />

        {/* جسم الزر الزجاجي (Glassmorphism) */}
        <div className="relative w-full h-full bg-[#121212] border border-white/10 rounded-[1.8rem] flex items-center justify-center overflow-hidden shadow-2xl">
            <motion.div 
              animate={{ rotate: isExpanded ? 135 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="z-10 flex items-center justify-center"
            >
              <span className="font-black text-2xl italic text-white tracking-tighter" style={{ textShadow: "0 0 10px rgba(168,85,247,0.8)" }}>
                M
              </span>
            </motion.div>

            {/* تأثير السائل الداخلي */}
            <motion.div 
              animate={{ y: isExpanded ? 0 : 80 }}
              className="absolute inset-0 bg-gradient-to-t from-purple-600/30 to-transparent pointer-events-none"
            />
        </div>

        {/* ملصق "Hot" */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute -right-1 -top-1 bg-gradient-to-r from-pink-600 to-purple-600 text-[9px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg z-20"
            >
              Hot
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}