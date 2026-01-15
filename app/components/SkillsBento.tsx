"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ... (نفس الـ Interface و TechIcon بدون تغيير كبير في المنطق)

const TechIcon = ({ name, icon, radius, duration, angle, color }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute"
      animate={{ rotate: [angle, angle + 360] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      style={{
        width: radius * 2,
        height: radius * 2,
        top: `calc(50% - ${radius}px)`,
        left: `calc(50% - ${radius}px)`,
        pointerEvents: "none",
      }}
    >
      <motion.div
        className="absolute top-1/2 right-0 pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "clamp(40px, 8vw, 60px)", // حجم الأيقونة يتصغر في الموبايل
          height: "clamp(40px, 8vw, 60px)",
          marginRight: "clamp(-30px, -4vw, -20px)",
          marginTop: "clamp(-30px, -4vw, -20px)",
        }}
      >
        <motion.div
          animate={{ rotate: [-(angle), -(angle + 360)] }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
          style={{
            borderColor: isHovered ? color : "rgba(255,255,255,0.1)",
            boxShadow: isHovered ? `0 0 25px ${color}60` : "none",
            backgroundColor: "#0a0a0a"
          }}
          className="w-full h-full rounded-xl md:rounded-2xl border flex items-center justify-center text-lg md:text-2xl cursor-pointer backdrop-blur-xl transition-colors duration-300"
        >
          <span>{icon}</span>
          {/* Tooltip مخفي في الموبايل لتقليل الازدحام إلا عند الضغط */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ backgroundColor: color }}
                className="absolute -top-10 text-white text-[8px] md:text-[10px] font-bold px-2 py-1 rounded z-[100]"
              >
                {name}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default function TechStack() {
  // استخدام State لتحديد أنصاف الأقطار بناءً على حجم الشاشة
  const [dimensions, setDimensions] = useState({ inner: 120, outer: 220 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDimensions({ inner: 80, outer: 150 }); // قيم أصغر للموبايل
      } else {
        setDimensions({ inner: 120, outer: 220 }); // القيم الأصلية للديسكتوب
      }
    };

    handleResize(); // تشغيل عند التحميل
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stacks = [
    { name: "React", icon: "⚛️", radius: dimensions.inner, duration: 20, angle: 0, color: "#61DAFB" },
    { name: "Next.js", icon: "▲", radius: dimensions.inner, duration: 20, angle: 120, color: "#9370DB" },
    { name: "Node.js", icon: "🟢", radius: dimensions.inner, duration: 20, angle: 240, color: "#339933" },
    { name: "TypeScript", icon: "TS", radius: dimensions.outer, duration: 30, angle: 0, color: "#3178C6" },
    { name: "Tailwind", icon: "🌊", radius: dimensions.outer, duration: 30, angle: 90, color: "#38BDF8" },
    { name: "Framer", icon: "✨", radius: dimensions.outer, duration: 30, angle: 180, color: "#E911BE" },
    { name: "Git", icon: "🐙", radius: dimensions.outer, duration: 30, angle: 270, color: "#F05032" },
  ];

  return (
    <section className="relative h-[500px] md:h-[850px] w-full flex items-center justify-center overflow-hidden bg-transparent">
      {/* المدارات البصرية */}
      {[dimensions.inner, dimensions.outer].map((r) => (
        <div 
          key={r} 
          className="absolute border border-white/5 rounded-full pointer-events-none" 
          style={{ width: r * 2, height: r * 2 }} 
        />
      ))}

      {/* المركز (Logo) */}
      <div className="relative z-10 w-24 h-24 md:w-40 md:h-40 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center backdrop-blur-3xl">
        <div className="text-center">
          <span className="text-white font-black text-lg md:text-3xl tracking-tighter block">MoJimmy</span>
          <div className="w-8 h-0.5 md:w-12 md:h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mx-auto mt-1 md:mt-2 rounded-full opacity-50" />
        </div>
      </div>

      {stacks.map((tech, i) => (
        <TechIcon key={`${tech.name}-${dimensions.inner}`} {...tech} />
      ))}
    </section>
  );
}