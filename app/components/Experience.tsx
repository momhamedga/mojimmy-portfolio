"use client"
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    year: "2024 - الآن",
    title: "مطور واجهات أمامية Senior",
    company: "شركة Tech Solutions",
    desc: "قيادة فريق تطوير الواجهات لبناء منصات تجارة إلكترونية ضخمة باستخدام Next.js و Tailwind CSS.",
    color: "#3b82f6"
  },
  {
    year: "2022 - 2024",
    title: "مطور Full Stack",
    company: "Creative Agency",
    desc: "تطوير لوحات تحكم معقدة وربطها بـ APIs متطورة مع التركيز على تجربة المستخدم.",
    color: "#a855f7"
  },
  {
    year: "2020 - 2022",
    title: "مطور ويب جونيور",
    company: "Freelance",
    desc: "بدأت رحلتي في عالم الويب بتنفيذ مشاريع مبتكرة للعملاء حول العالم.",
    color: "#ec4899"
  },
];

export default function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end end"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <section id="experience" dir="rtl" className="py-40 relative overflow-hidden">
      {/* لمسة إبداعية: إضاءة خلفية خافتة تتبع القسم */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-32"
        >
          <h2 className="text-6xl md:text-8xl font-black text-white leading-tight">
            مساري <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">المهني</span>
          </h2>
          <p className="text-gray-500 mt-4 font-mono tracking-widest uppercase text-sm">Experience Timeline</p>
        </motion.div>

        <div ref={ref} className="relative max-w-5xl mx-auto">
          {/* الخط العمودي الأساسي (باهت) */}
          <div className="absolute right-0 md:right-1/2 top-0 w-[2px] h-full bg-white/5 origin-top" />
          
          {/* الخط الملون المتحرك */}
          <motion.div
            style={{ scaleY }}
            className="absolute right-0 md:right-1/2 top-0 w-[2px] h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 origin-top will-change-transform z-10"
          />

          <div className="space-y-32">
            {experiences.map((exp, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`relative flex flex-col ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center justify-between w-full group`}
                >
                  {/* المحتوى مع تأثير Hover متطور */}
                  <div className="w-full md:w-[45%] p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] transition-all duration-500 group-hover:from-purple-500/40">
                    <div className="bg-[#0a0a0a] backdrop-blur-xl p-8 md:p-12 rounded-[2.4rem] h-full relative overflow-hidden">
                      {/* رقم خلفي ضخم */}
                      <span className="absolute -left-4 -top-4 text-9xl font-black text-white/[0.02] pointer-events-none">
                        0{index + 1}
                      </span>
                      
                      <span className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-pink-500 font-mono text-xs mb-6">
                        {exp.year}
                      </span>
                      
                      <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {exp.title}
                      </h3>
                      <h4 className="text-purple-400 font-medium mb-6 flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-purple-400" />
                        {exp.company}
                      </h4>
                      <p className="text-gray-400 leading-relaxed text-lg font-light">
                        {exp.desc}
                      </p>
                    </div>
                  </div>

                  {/* النقطة المركزية: تتحول لجوهرة متوهجة عند الوصول إليها */}
                  <div className="absolute right-[-7px] md:right-[calc(50%-7px)] top-1/2 -translate-y-1/2 z-20">
                    <motion.div 
                       whileInView={{ scale: [1, 1.5, 1], backgroundColor: ["#fff", exp.color, "#fff"] }}
                       className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] border-4 border-[#050505]"
                    />
                  </div>
                  
                  <div className="hidden md:block w-[45%]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}