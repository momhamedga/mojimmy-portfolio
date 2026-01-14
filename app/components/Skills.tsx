"use client"
import { motion } from "framer-motion";

const skills = [
  "Next.js 15", "React", "TypeScript", "Tailwind", 
  "Framer", "Three.js", "Node.js", "MongoDB", "Prisma",
  "UI/UX", "GitHub", "Upwork"
];

export default function Skills() {
  return (
    <section className="py-24 relative overflow-hidden bg-transparent" id="skills">
      
      {/* 1. العنوان الخلفي العملاق - بـ opacity منخفض جداً لعدم حجب الـ Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.015] select-none z-0">
        <h2 className="text-[25vw] md:text-[20vw] font-black tracking-tighter text-white">
          TECH STACK
        </h2>
      </div>

      {/* 2. حاوية المحتوى الرئيسي */}
      <div className="container mx-auto px-6 mb-16 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block"
        >
          <span className="text-blue-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] mb-4 block">
            My Arsenal
          </span>
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-none">
            التقنيات التي <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">أتقنها</span>
          </h2>
        </motion.div>
      </div>

      {/* 3. حاوية الأشرطة المتحركة */}
      <div className="relative flex flex-col gap-6 select-none z-10">
        
        {/* الصف الأول - يسار */}
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="flex flex-nowrap gap-6 py-4"
          >
            {[...skills, ...skills].map((skill, index) => (
              <SkillBadge key={index} text={skill} />
            ))}
          </motion.div>
        </div>

        {/* الصف الثاني - يمين */}
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <motion.div 
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex flex-nowrap gap-6 py-4"
          >
            {[...skills.slice().reverse(), ...skills].map((skill, index) => (
              <SkillBadge key={index} text={skill} isReverse />
            ))}
          </motion.div>
        </div>
      </div>

      {/* 4. الـ Glow الخلفي - تم تحسينه ليكون ناعم ولا يقطع الـ Grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-blue-600/10 blur-[150px] rounded-full z-0 pointer-events-none" />
    </section>
  );
}

function SkillBadge({ text, isReverse = false }: { text: string, isReverse?: boolean }) {
  return (
    <div className="group relative">
      {/* عرض موحد تماماً - تم تقليل الـ Backdrop Blur لتحسين رؤية الـ Grid خلفه */}
      <div className="w-44 md:w-56 h-20 md:h-24 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md flex flex-col items-center justify-center gap-2 transition-all duration-500 group-hover:bg-white/[0.08] group-hover:border-blue-500/40 group-hover:-translate-y-2">
        
        {/* النقطة المضيئة */}
        <div className={`w-1 h-1 rounded-full ${isReverse ? 'bg-purple-500' : 'bg-blue-500'} shadow-[0_0_8px_currentColor]`} />
        
        <span className="text-base md:text-xl font-bold text-gray-300 group-hover:text-white transition-colors uppercase tracking-tight">
          {text}
        </span>

        {/* خط توهج سفل عند الهوفر */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-all duration-500" />
      </div>
    </div>
  );
}