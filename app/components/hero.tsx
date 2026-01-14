"use client"
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { MousePointerClick, Github, Linkedin } from "lucide-react";
import Magnetic from "./Magnetic";
import { useEffect, useState, useRef } from "react";

interface HeroProps {
  onStartProject: () => void;
}

export default function Hero({ onStartProject }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const background = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(147, 51, 234, 0.15), transparent 80%)`;

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    if (!sectionRef.current) return;
    const { left, top } = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }

  if (!mounted) return null;

  return (
    <section 
      ref={sectionRef}
      id="home"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* 1. طبقة الخلفية المحسنة */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{
               backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
               backgroundSize: '50px 50px'
             }} 
        />
        <motion.div className="absolute inset-0 z-0" style={{ background }} />
      </div>

      {/* 2. الحاوية الرئيسية بـ Max-Width لضمان عدم تشتت الأبعاد */}
      <div className="relative z-10 container mx-auto px-6 max-w-7xl flex flex-col items-center text-center">
        
        {/* Badge علوي بحجم متزن */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-blue-400 font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
            Frontend Master 🚀
          </span>
        </motion.div>

        {/* العنوان الرئيسي: استخدمنا أحجام نص ثابتة (Rem) بدلاً من vw لتجنب الـ Overflow */}
        <div className="flex flex-col gap-0 mb-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black text-white tracking-[ -0.05em] leading-[1.1] md:leading-[1]"
          >
            Crafting <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 italic px-2">
              Digital
            </span> <br />
            Experiences.
          </motion.h1>
        </div>

        {/* الوصف: عرض محدد لضمان عدم التشتت */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-xl text-base md:text-lg lg:text-xl font-medium font-arabic leading-relaxed opacity-90 px-4"
        >
          بناء واجهات برمجية تفاعلية تتجاوز التوقعات بلمسة فنية وكود نظيف.
        </motion.p>

        {/* الأزرار: محاذاة مرنة (Flex-Row في الشاشات الكبيرة) */}
        <div className="flex flex-col sm:flex-row gap-5 mt-12 items-center justify-center w-full">
          <Magnetic>
            <button 
              onClick={onStartProject}
              className="w-full sm:w-auto px-10 py-4 bg-white text-black rounded-full font-black text-lg hover:bg-transparent hover:text-white border border-white transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              ابدأ مشروعك 
              <MousePointerClick size={20} className="group-hover:rotate-12 transition-transform" />
            </button>
          </Magnetic>
          
          <div className="flex gap-4">
            {[
              { icon: <Github size={22} />, url: 'https://github.com/momhamedga' },
              { icon: <Linkedin size={22} />, url: 'https://linkedin.com' }
            ].map((social, i) => (
              <Magnetic key={i}>
                <button 
                  onClick={() => window.open(social.url, '_blank')}
                  className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/30 transition-all text-white"
                >
                  {social.icon}
                </button>
              </Magnetic>
            ))}
          </div>
        </div>
      </div>

      {/* مؤشر النزول الأسفل */}
      <motion.div 
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 flex flex-col items-center gap-2 opacity-20"
      >
        <span className="font-mono text-[8px] tracking-[0.4em] text-white uppercase">Scroll Down</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
}