"use client"
import { motion, AnimatePresence } from "framer-motion";
import { useCustomCursor } from "../hooks/use-custom-cursor";

export default function CustomCursor() {
  const { mounted, isVisible, isMobile, hoverState, x, y, trailX, trailY } = useCustomCursor();

  if (!mounted || isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="relative w-full h-full will-change-transform"
          >
            {/* 1. الهالة الخارجية (The Modern Aura) */}
            <motion.div
              style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
              className="fixed top-0 left-0 flex items-center justify-center"
            >
              <motion.div
                animate={{
                  width: hoverState.active ? 80 : 45,
                  height: hoverState.active ? 80 : 45,
                  rotate: hoverState.active ? 180 : 0,
                  borderWidth: hoverState.active ? "1px" : "1px",
                  borderColor: hoverState.active ? "rgba(168, 85, 247, 0.5)" : "rgba(255, 255, 255, 0.1)"
                }}
                className="rounded-full border-dashed border-white/20 transition-colors duration-500"
              />
            </motion.div>

            {/* 2. النواة المركزية (The Core Dot) */}
            <motion.div
              style={{ x, y, translateX: "-50%", translateY: "-50%" }}
              className="fixed top-0 left-0 flex items-center justify-center mix-blend-difference"
            >
              <motion.div
                animate={{
                  scale: hoverState.active ? 2.5 : 1,
                  backgroundColor: hoverState.active ? "#fff" : "#fff",
                }}
                className="w-2.5 h-2.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center"
              >
                {hoverState.active && hoverState.text && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[3px] font-black text-black tracking-widest"
                  >
                    {hoverState.text}
                  </motion.span>
                )}
              </motion.div>
            </motion.div>

            {/* 3. تأثير الـ Glow الجانبي (Subtle Glow) */}
            <motion.div
              style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
              className="fixed top-0 left-0 w-20 h-20 bg-purple-500/10 blur-[40px] rounded-full -z-10"
              animate={{ opacity: hoverState.active ? 0.8 : 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}