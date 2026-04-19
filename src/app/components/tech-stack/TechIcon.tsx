"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, memo, useMemo } from "react";

const TechIcon = memo(({ name, icon: Icon, radius, duration, angle, color }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  // استخراج الـ Hue من اللون لو مبعوث OKLCH أو استخدام اللون كما هو
  const iconColor = isHovered ? color : "var(--color-primary)";

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 origin-center z-30 flex items-center justify-center pointer-events-none will-change-transform"
      initial={{ rotate: angle }}
      animate={{ rotate: angle + 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <div 
        className="pointer-events-auto cursor-pointer"
        style={{ transform: `translateX(${radius}px)` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          animate={{ 
            rotate: -(angle + 360), // تصحيح الدوران بدقة بكسل
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration, repeat: Infinity, ease: "linear", scale: { duration: 0.2, repeat: 0 } }}
          className="w-14 h-14 md:w-20 md:h-20 rounded-[1.8rem] border border-white/5 flex items-center justify-center backdrop-blur-2xl transition-all duration-500 shadow-2xl"
          style={{ 
            background: isHovered ? `oklch(0.2 0.1 285 / 0.4)` : "var(--color-glass)",
            borderColor: isHovered ? iconColor : "oklch(1 0 0 / 0.05)",
            boxShadow: isHovered ? `0 0 30px ${iconColor}44` : "none"
          }}
        >
          <Icon 
            size={isHovered ? 32 : 26} 
            className="transition-all duration-300" 
            style={{ color: isHovered ? iconColor : "oklch(1 0 0 / 0.4)" }} 
          />
          
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-[10px] font-black tracking-widest z-[100] whitespace-nowrap bg-black/80 backdrop-blur-md border border-white/10"
              >
                {name}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
});

TechIcon.displayName = "TechIcon";
export default TechIcon;