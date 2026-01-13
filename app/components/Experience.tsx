"use client"
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    year: "2024 - الآن",
    title: "مطور واجهات أمامية Senior",
    company: "شركة Tech Solutions",
    desc: "قيادة فريق تطوير الواجهات لبناء منصات تجارة إلكترونية ضخمة باستخدام Next.js و Tailwind CSS.",
  },
  {
    year: "2022 - 2024",
    title: "مطور Full Stack",
    company: "Creative Agency",
    desc: "تطوير لوحات تحكم معقدة وربطها بـ APIs متطورة مع التركيز على تجربة المستخدم.",
  },
  {
    year: "2020 - 2022",
    title: "مطور ويب جونيور",
    company: "Freelance",
    desc: "بدأت رحلتي في عالم الويب بتنفيذ مشاريع مبتكرة للعملاء حول العالم.",
  },
];

export default function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="experience" dir="rtl" className="py-40 relative">
      <div className="container mx-auto px-6">
        <h2 className="text-6xl md:text-8xl font-black text-white mb-32 text-center">
          مساري <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">المهني</span>
        </h2>

        <div ref={ref} className="relative max-w-4xl mx-auto">
          {/* الخط العمودي المتحرك */}
          <motion.div
            style={{ scaleY }}
            className="absolute right-0 md:right-1/2 top-0 w-1 h-full bg-gradient-to-b from-blue-600 via-purple-600 to-pink-500 origin-top shadow-[0_0_15px_rgba(147,51,234,0.5)]"
          />

          <div className="space-y-24">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center justify-between w-full`}
              >
                {/* المحتوى */}
                <div className="w-full md:w-[45%] p-8 rounded-[2rem] bg-[#080808] border border-white/5 hover:border-purple-500/30 transition-all group">
                  <span className="text-pink-500 font-mono text-sm mb-2 block">{exp.year}</span>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{exp.title}</h3>
                  <h4 className="text-purple-400 mb-4">{exp.company}</h4>
                  <p className="text-gray-400 leading-relaxed">{exp.desc}</p>
                </div>

                {/* النقطة المركزية */}
                <div className="absolute right-[-8px] md:right-[calc(50%-8px)] w-4 h-4 rounded-full bg-white shadow-[0_0_10px_white] z-10" />
                
                {/* مساحة فارغة للجهة المقابلة */}
                <div className="hidden md:block w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}