"use client"
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MessageCircle, Send, Phone, Share2, Plus } from "lucide-react";
import { useState, useCallback, useEffect } from "react";

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  color: string;
  href: string;
  shadow: string;
}

const ACTIONS: ActionItem[] = [
  { icon: <MessageCircle size={22} />, label: "واتساب", color: "bg-[#25D366]", shadow: "shadow-[#25D366]/20", href: "https://wa.me/+971589915968" },
  { icon: <Send size={22} />, label: "تليجرام", color: "bg-[#0088cc]", shadow: "shadow-[#0088cc]/20", href: "#" },
  { icon: <Phone size={22} />, label: "اتصال", color: "bg-blue-600", shadow: "shadow-blue-600/20", href: "tel:+971589915968" },
];

const menuVariants: Variants = {
  initial: { opacity: 0, scale: 0.5, y: 50 },
  animate: { 
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25, staggerChildren: 0.08, delayChildren: 0.1 }
  },
  exit: { 
    opacity: 0, scale: 0.5, y: 50,
    transition: { duration: 0.3, ease: "anticipate", staggerChildren: 0.05, staggerDirection: -1 } 
  }
};

const itemVariants: Variants = {
  initial: { y: 20, opacity: 0, filter: "blur(5px)" },
  animate: { y: 0, opacity: 1, filter: "blur(0px)" },
  exit: { y: 10, opacity: 0, filter: "blur(5px)" }
};

export default function FloatingLaunch() {
  const [isExpanded, setIsExpanded] = useState(false);

  const triggerHaptic = useCallback((intensity: number | number[] = 15) => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(intensity);
    }
  }, []);

  const toggleMenu = () => {
    triggerHaptic(isExpanded ? 10 : [15, 5, 15]);
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-8 left-8 z-[1000] md:hidden flex flex-col items-center select-none">
      
      {/* Dynamic Overlay - Spotlight Effect */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1]"
          />
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-4 mb-6"
          >
            {ACTIONS.map((action) => (
              <motion.a
                key={action.label}
                href={action.href}
                variants={itemVariants}
                target="_blank"
                rel="noopener noreferrer"
                className={`${action.color} ${action.shadow} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl relative group transition-transform active:scale-90`}
                onClick={() => triggerHaptic(10)}
              >
                {action.icon}
                {/* Tooltip Label */}
                <span className="absolute left-full ml-4 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-[10px] text-white font-cairo opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {action.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        onClick={toggleMenu}
        whileTap={{ scale: 0.92 }}
        className="relative w-16 h-16 outline-none"
      >
        {/* Animated Glow Rings */}
        {!isExpanded && (
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 border-2 border-purple-500 rounded-[1.8rem] z-0"
          />
        )}

        {/* Main Body */}
        <div className="relative z-10 w-full h-full bg-[#0D0D0E] border border-white/10 rounded-[1.8rem] flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Neon Gradient Mesh */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-transparent to-blue-500/20 opacity-50" />
          
          <motion.div 
            animate={{ rotate: isExpanded ? 135 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative z-20"
          >
            {isExpanded ? (
              <Plus size={28} className="text-white" />
            ) : (
              <div className="flex flex-col items-center">
                 <span className="text-xl font-black text-white font-cairo tracking-tighter italic">M</span>
                 <div className="w-1 h-1 bg-purple-500 rounded-full mt-[-4px] animate-pulse" />
              </div>
            )}
          </motion.div>

          {/* Liquid Fill Effect */}
          <motion.div 
            animate={{ y: isExpanded ? 0 : 80 }}
            className="absolute inset-0 bg-gradient-to-t from-purple-500/40 via-purple-500/10 to-transparent pointer-events-none"
          />
        </div>

        {/* Floating Indicator */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -right-1 -top-1 bg-white text-black text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase z-30 shadow-white/20 shadow-lg"
            >
              Live
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}