"use client"
import { motion, AnimatePresence } from "framer-motion";
import { useState, memo } from "react";

const TechIcon = memo(({ name, icon, radius, duration, angle, color }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 origin-center z-30 flex items-center justify-center pointer-events-none"
      initial={{ rotate: angle }}
      animate={{ rotate: angle + 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <motion.div 
        className="pointer-events-auto cursor-pointer"
        style={{ x: radius }} // دفع الأيقونة للخارج بناءً على نصف القطر
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setTimeout(() => setIsHovered(false), 1500)}
      >
        <motion.div
          animate={{ 
            rotate: -(angle + 360), // الحفاظ على استقامة الأيقونة
            scale: isHovered ? 1.2 : 1 
          }}
          transition={{ duration, repeat: Infinity, ease: "linear", scale: { duration: 0.2, repeat: 0 } }}
          className="w-[50px] h-[50px] md:w-[65px] md:h-[65px] rounded-2xl border-2 flex items-center justify-center backdrop-blur-3xl"
          style={{ 
            borderColor: isHovered ? color : "rgba(255,255,255,0.08)",
            background: "rgba(10, 10, 10, 0.8)",
            boxShadow: isHovered ? `0 0 30px ${color}40` : "none"
          }}
        >
          <span className="text-xl md:text-2xl">{icon}</span>
          
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.8 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-lg text-white text-[10px] font-bold z-[100] shadow-2xl"
                style={{ backgroundColor: color }}
              >
                {name}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" style={{ backgroundColor: color }} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

TechIcon.displayName = "TechIcon";
export default TechIcon;