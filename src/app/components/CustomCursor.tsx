"use client"
import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  
  // الموقع الأساسي للماوس
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // إعدادات حركة "الذيل" (Trail) - نقاط متعددة تتبع بعضها
  const points = 5; // عدد النقاط التي تشكل الذيل
  const tails = Array.from({ length: points }).map(() => ({
    x: useSpring(mouseX, { stiffness: 100, damping: 20, mass: 0.1 }),
    y: useSpring(mouseY, { stiffness: 100, damping: 20, mass: 0.1 })
  }));

  // كرسر القائد (الرأس) - حركة سريعة جداً
  const mainX = useSpring(mouseX, { stiffness: 1000, damping: 50 });
  const mainY = useSpring(mouseY, { stiffness: 1000, damping: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // تحديث نقاط الذيل بتأخير بسيط لخلق تأثير السائل
      tails.forEach((point, i) => {
        setTimeout(() => {
          point.x.set(e.clientX);
          point.y.set(e.clientY);
        }, i * 20); // تأخير متزايد لكل نقطة
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.project-card')) {
        setIsHovered(true);
        setCursorText("EXPLORE");
      } else if (target.closest('a, button')) {
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
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] hidden md:block">
      
      {/* تأثير الذيل السائل (Liquid Trail) */}
      {tails.map((point, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 rounded-full bg-purple-500/20 blur-[2px]"
          style={{
            x: point.x,
            y: point.y,
            translateX: "-50%",
            translateY: "-50%",
            width: 20 - i * 3, // يصغر الحجم تدريجياً
            height: 20 - i * 3,
            opacity: 1 - i * 0.2, // يختفي تدريجياً
          }}
        />
      ))}

      {/* الكرسر الرئيسي (العدسة) */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center mix-blend-difference"
        style={{
          x: mainX,
          y: mainY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {/* حلقة متفاعلة تنكمش وتتمدد */}
        <motion.div
          animate={{
            width: isHovered ? 100 : 15,
            height: isHovered ? 100 : 15,
            borderRadius: isHovered ? "30%" : "50%", // يتحول لشكل مربع مدور عند الهوفر
            rotate: isHovered ? 90 : 0
          }}
          className="border border-purple-400/50 flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: isHovered ? "rgba(168, 85, 247, 0.1)" : "transparent"
          }}
        >
          {isHovered && cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[8px] font-black text-purple-300 tracking-[0.3em] rotate-[-90deg]"
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>

        {/* النقطة المركزية (اللب) */}
        <motion.div 
          animate={{ scale: isHovered ? 0 : 1 }}
          className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_15px_white]" 
        />
      </motion.div>

      {/* تأثير "التشويش" الرقمي خلف الماوس */}
      <motion.div
        className="fixed top-0 left-0 w-[1px] h-20 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-20"
        style={{
          x: mainX,
          y: mainY,
          translateX: "-50%",
          translateY: "-50%",
          rotate: useTransform(mouseX, (v) => v % 360) // دوران خفيف مع الحركة
        }}
      />
    </div>
  );
}