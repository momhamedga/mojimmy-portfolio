"use client"
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { MousePointerClick, Github, Linkedin } from "lucide-react";
import Magnetic from "./Magnetic";
import { useEffect, useState } from "react";

interface HeroProps {
  onStartProject: () => void;
}

export default function Hero({ onStartProject }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const background = useMotionTemplate`radial-gradient(650px circle at ${springX}px ${springY}px, rgba(147, 51, 234, 0.15), transparent 80%)`;

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleMouseMove({ clientX, clientY, currentTarget }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  if (!mounted) return null;

  return (
    <section id="home"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-transparent"
    >
      {/* 1. الجسيمات - قللنا العدد قليلاً لزيادة الـ Performance */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 1200, 
              y: Math.random() * 800,
              opacity: Math.random() * 0.5 
            }}
            animate={{
              x: [null, Math.random() * 1200, Math.random() * -200],
              y: [null, Math.random() * 800, Math.random() * -100],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-blue-500 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="absolute inset-0 z-0 opacity-[0.1] pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
             backgroundSize: '50px 50px'
           }} 
      />

      <motion.div className="pointer-events-none absolute inset-0 z-0" style={{ background }} />

      <div className="relative z-10 container mx-auto px-6 text-center" >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black mb-8 text-blue-400 border border-blue-400/20 uppercase tracking-[0.3em] bg-blue-400/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
        >
          Frontend Master 🚀
        </motion.div>

        <div className="relative">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[8vw] font-black tracking-tighter leading-[0.9] text-white"
          >
            Crafting<br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent italic">
              Digital
            </span><br />
            Experiences.
          </motion.h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[130%] bg-white/[0.02] border border-white/[0.05] -z-10 rotate-[-1deg] rounded-[5rem] blur-2xl"></div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-2xl text-lg md:text-xl mt-10 mx-auto leading-relaxed font-medium"
        >
          بناء واجهات برمجية تفاعلية تتجاوز التوقعات بلمسة فنية وكود نظيف.
        </motion.p>

        <div className="flex flex-wrap gap-6 mt-12 justify-center items-center">
          <Magnetic>
            <button 
              onClick={onStartProject}
              aria-label="Start your project with Mojimmy"
              className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white rounded-full font-black text-lg hover:scale-105 transition-all shadow-[0_10px_40px_rgba(147,51,234,0.3)] flex items-center gap-3 group"
            >
              ابدأ مشروعك 
              <MousePointerClick size={20} className="group-hover:rotate-12 transition-transform" />
            </button>
          </Magnetic>
          
          <div className="flex gap-4">
             <Magnetic>
                <button 
                  onClick={() => window.open('https://github.com/momhamedga', '_blank')}
                  aria-label="Follow Mojimmy on GitHub"
                  className="bg-white/5 border border-white/10 p-4 rounded-full hover:bg-white/10 transition-all text-white"
                >
                  <Github size={22} />
                </button>
             </Magnetic>
             <Magnetic>
                <button 
                  onClick={() => window.open('https://linkedin.com', '_blank')}
                  aria-label="Connect with Mojimmy on LinkedIn"
                  className="bg-white/5 border border-white/10 p-4 rounded-full hover:bg-white/10 transition-all text-white"
                >
                  <Linkedin size={22} />
                </button>
             </Magnetic>
          </div>
        </div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 uppercase font-mono text-[10px] tracking-[0.5em]"
      >
        Scroll Down
      </motion.div>
    </section>
  );
}