"use client"
import { motion, AnimatePresence } from "framer-motion";
import { Zap, MessageCircle, Send, Phone } from "lucide-react";
import { useState } from "react";

export default function FloatingLaunch() {
  const [isExpanded, setIsExpanded] = useState(false);

  const triggerHaptic = (intensity = 15) => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(intensity);
    }
  };

  const toggleMenu = () => {
    triggerHaptic(isExpanded ? 10 : 25);
    setIsExpanded(!isExpanded);
  };

  const actions = [
    { icon: <MessageCircle size={22} />, label: "واتساب", color: "bg-[#25D366]", href: "https://wa.me/+971589915968" },
    { icon: <Send size={22} />, label: "تليجرام", color: "bg-[#0088cc]", href: "#" },
    { icon: <Phone size={22} />, label: "اتصال", color: "bg-blue-600", href: "#" },
  ];

  return (
    <div className="fixed bottom-8 left-8 z-[999] md:hidden flex flex-col items-center gap-4">
      {/* خيارات الاتصال السريعة */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            className="flex flex-col gap-3 mb-2"
          >
            {actions.map((action, i) => (
              <motion.a
                key={i}
                href={action.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`${action.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/20`}
                onClick={() => triggerHaptic(15)}
              >
                {action.icon}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* الزر الرئيسي المشع */}
      <motion.button
        onClick={toggleMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-18 h-18 group"
      >
        {/* الهالة المشعة (Glowing Aura) */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5] 
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 blur-2xl rounded-full"
        />

        {/* جسم الزر الزجاجي */}
        <div className="relative w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center overflow-hidden shadow-2xl border border-white/20 shadow-purple-500/40">
           <motion.div 
             animate={{ rotate: isExpanded ? 180 : 0 }}
             className="z-10"
           >
                {/* 4. حرف M بتأثير الـ Neon المشع */}
      <div className="relative z-20 w-full h-full flex items-center justify-center">
        <motion.span 
          variants={{
            hover: { scale: 1.15, textShadow: "0 0 15px #fff, 0 0 20px #a855f7" }
          }}
          className="font-black text-3xl italic tracking-tighter text-white transition-all duration-500"
          style={{
             textShadow: "0 0 5px #a855f7" // توهج نيون خفيف افتراضي
          }}
        >
          M
        </motion.span>
      </div>
           </motion.div>

           {/* السائل الداخلي الذي يظهر عند الفتح */}
           <motion.div 
             animate={{ y: isExpanded ? 0 : 100 }}
             className="absolute inset-0 bg-gradient-to-t from-purple-100 to-transparent opacity-50"
           />
        </div>

        {/* ملصق "ابدأ" صغير */}
        {!isExpanded && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute -right-2 -top-2 bg-pink-500 text-[10px] font-black text-white px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg"
          >
            Hot
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}