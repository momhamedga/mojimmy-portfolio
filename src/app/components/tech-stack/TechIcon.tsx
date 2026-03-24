"use client"
import { motion, AnimatePresence } from "framer-motion";
import { useState, memo } from "react";

const TechIcon = memo(({ name, icon: Icon, radius, duration, angle, color }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 origin-center z-30 flex items-center justify-center pointer-events-none will-change-transform"
      initial={{ rotate: angle }}
      animate={{ rotate: angle + 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <motion.div 
        className="pointer-events-auto cursor-pointer"
        style={{ x: radius }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          animate={{ 
            rotate: -(angle + 360), // تصحيح الدوران عشان الأيقونة تفضل عدلة
            scale: isHovered ? 1.25 : 1,
            filter: isHovered ? `drop-shadow(0 0 15px ${color})` : "drop-shadow(0 0 0px transparent)"
          }}
          transition={{ duration, repeat: Infinity, ease: "linear", scale: { duration: 0.2, repeat: 0 } }}
          className="w-14 h-14 md:w-20 md:h-20 rounded-[1.5rem] border border-white/5 flex items-center justify-center backdrop-blur-2xl transition-colors duration-500"
          style={{ 
            background: isHovered ? `oklch(0.2 0.1 ${color.split(' ')[2]} / 0.4)` : "oklch(0.15 0 0 / 0.2)",
            borderColor: isHovered ? color : "oklch(1 0 0 / 0.05)",
          }}
        >
          {/* الأيقونة دلوقتى بقت دايناميك وتقبل Lucide Icons أو React Icons */}
          <Icon 
            size={isHovered ? 32 : 28} 
            className="transition-all duration-300" 
            style={{ color: isHovered ? color : "oklch(1 0 0 / 0.4)" }} 
          />
          
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-[10px] font-black tracking-widest z-[100] shadow-2xl glass-card border border-white/10"
                style={{ backgroundColor: `oklch(0.3 0.1 ${color.split(' ')[2]} / 0.8)` }}
              >
                {name}
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