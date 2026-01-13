"use client"
import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  
  // استخدام useMotionValue للحصول على السرعة
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const mouseX = useSpring(rawMouseX, { stiffness: 400, damping: 30 });
  const mouseY = useSpring(rawMouseY, { stiffness: 400, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      rawMouseX.set(e.clientX);
      rawMouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // فحص لو العنصر هو كارت مشروع
      if (target.closest('.project-card')) {
        setIsHovered(true);
        setCursorText("VIEW");
      } else if (
        ["A", "BUTTON"].includes(target.tagName) || 
        target.closest('button') || 
        target.closest('a')
      ) {
        setIsHovered(true);
        setCursorText("");
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [rawMouseX, rawMouseY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:flex"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovered ? 90 : 40,
          height: isHovered ? 90 : 40,
          backgroundColor: isHovered ? "white" : "transparent",
          border: isHovered ? "none" : "1px solid rgba(255, 255, 255, 0.4)",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      >
        {/* نص يظهر جوه الماوس عند الهوفر على المشاريع */}
        {cursorText && (
          <motion.span 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-black text-black tracking-tighter"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* النقطة المركزية النيون */}
      {!isHovered && (
        <motion.div
          className="fixed top-0 left-0 w-1 h-1 bg-purple-500 rounded-full pointer-events-none z-[9999] hidden md:block"
          style={{
            x: mouseX,
            y: mouseY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
      )}
    </>
  );
}