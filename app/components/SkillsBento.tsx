"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TechIconProps {
  name: string;
  icon: string;
  radius: number;
  duration: number;
  angle: number; 
  color: string;
}

const TechIcon = ({ name, icon, radius, duration, angle, color }: TechIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute"
      // دوران الحاوية بالكامل حول المركز
      animate={{ 
        rotate: [angle, angle + 360] 
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: "linear" 
      }}
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
          width: 60,
          height: 60,
          marginRight: -30, 
          marginTop: -30,
        }}
      >
        <motion.div
          // تدوير الأيقونة عكس اتجاه المدار لتبقى معتدلة أمام العين
          animate={{ rotate: [-(angle), -(angle + 360)] }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
          style={{
            borderColor: isHovered ? color : "rgba(255,255,255,0.1)",
            boxShadow: isHovered ? `0 0 25px ${color}60` : "none",
            backgroundColor: "#0a0a0a"
          }}
          className="w-full h-full rounded-2xl border flex items-center justify-center text-2xl cursor-pointer backdrop-blur-xl relative transition-colors duration-300"
        >
          <span>{icon}</span>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 5 }}
                style={{ backgroundColor: color }}
                className="absolute -top-12 text-white text-[10px] font-bold px-3 py-1.5 rounded shadow-2xl whitespace-nowrap z-[100]"
              >
                {name}
                <div style={{ backgroundColor: color }} className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default function TechStack() {
  const stacks = [
    // المدار الداخلي (Radius: 120) - توزيع 360/3 = 120 درجة
    { name: "React", icon: "⚛️", radius: 120, duration: 20, angle: 0, color: "#61DAFB" },
    { name: "Next.js", icon: "▲", radius: 120, duration: 20, angle: 120, color: "#9370DB" },
    { name: "Node.js", icon: "🟢", radius: 120, duration: 20, angle: 240, color: "#339933" },
    
    // المدار الخارجي (Radius: 220) - توزيع 360/4 = 90 درجة
    { name: "TypeScript", icon: "TS", radius: 220, duration: 30, angle: 0, color: "#3178C6" },
    { name: "Tailwind", icon: "🌊", radius: 220, duration: 30, angle: 90, color: "#38BDF8" },
    { name: "Framer", icon: "✨", radius: 220, duration: 30, angle: 180, color: "#E911BE" },
    { name: "Git", icon: "🐙", radius: 220, duration: 30, angle: 270, color: "#F05032" },
  ];

  return (
    <section className="relative h-[650px] md:h-[850px] w-full flex items-center justify-center overflow-hidden bg-transparent">
      {/* المدارات البصرية الثابتة */}
      {[120, 220].map((r) => (
        <div 
          key={r} 
          className="absolute border border-white/5 rounded-full pointer-events-none" 
          style={{ width: r * 2, height: r * 2 }} 
        />
      ))}

      {/* المركز (Brand Logo) */}
      <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center backdrop-blur-3xl shadow-[0_0_50px_rgba(255,255,255,0.05)]">
        <div className="text-center group cursor-default">
          <span className="text-white font-black text-2xl md:text-3xl tracking-tighter block group-hover:scale-110 transition-transform">MoJimmy</span>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mx-auto mt-2 rounded-full opacity-50" />
        </div>
      </div>

      {/* رسم الأيقونات بناءً على المصفوفة */}
      {stacks.map((tech, i) => (
        <TechIcon key={i} {...tech} />
      ))}
    </section>
  );
}