"use client"
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useEffect } from "react";

export default function DynamicBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 28 });

  const background = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(147, 51, 234, 0.1), transparent 80%)`;

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMove = (e: MouseEvent) => {
      window.requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* الـ Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, 
          backgroundSize: '70px 70px' 
        }} 
      />
      {/* الـ Glow */}
      <motion.div className="absolute inset-0 transform-gpu" style={{ background }} />
    </div>
  );
}