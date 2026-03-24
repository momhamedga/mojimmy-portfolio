"use client";

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// دالة مساعدة بلمسة سينمائية (Blur Loading) بدل مجرد Div فارغ
const SectionLoader = () => (
  <div className="w-full h-[40vh] flex items-center justify-center bg-[#020203]/50 animate-pulse">
    <div className="w-12 h-[1px] bg-white/10" />
  </div>
);

// 1. التقسيم الذكي: السكاشن اللي فوق الـ Fold (زي Projects) يفضل تكون SSR إذا أمكن
// لكن بما إننا شغالين Framer Motion تقيل، الـ Dynamic هو الأضمن للأداء
const Projects = dynamic(() => import("./projects"), { ssr: false, loading: SectionLoader });
const TechStack = dynamic(() => import("./tech-stack"), { ssr: false, loading: SectionLoader });
const About = dynamic(() => import("./about/About"), { ssr: false, loading: SectionLoader });
const Services = dynamic(() => import("./services"), { ssr: false, loading: SectionLoader });
const CodeLaboratory = dynamic(() => import("./lab/CodeLaboratory"), { ssr: false, loading: SectionLoader });
const Testimonials = dynamic(() => import("./testimonials/Testimonials"), { ssr: false, loading: SectionLoader });
const ProcessSection = dynamic(() => import("./Process/ProcessSection"), { ssr: false, loading: SectionLoader });
const InteractiveFAQ = dynamic(() => import("./FAQ/InteractiveFAQ"), { ssr: false, loading: SectionLoader });
const Contact = dynamic(() => import("./contact/Contact"), { ssr: false, loading: SectionLoader });
const Footer = dynamic(() => import("./footer/Footer"), { ssr: false });

export default function SectionsWrapper() {
  // مصفوفة السكاشن لتسهيل عملية الـ Mapping وإضافة الـ Reveal Animation
  const sections = [
    { id: 'projects', Component: Projects },
    { id: 'tech', Component: TechStack },
    { id: 'about', Component: About },
    { id: 'services', Component: Services },
    { id: 'lab', Component: CodeLaboratory },
    { id: 'process', Component: ProcessSection },
    { id: 'testimonials', Component: Testimonials },
    { id: 'faq', Component: InteractiveFAQ },
    { id: 'contact', Component: Contact },
  ];

  return (
    <main className="flex flex-col w-full relative ">
      {sections.map(({ id, Component }, index) => (
        <motion.section
          key={id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.05, // Stagger effect خفيف جداً
            ease: [0.21, 1, 0.36, 1] 
          }}
          className="relative w-full"
        >
          <Component />
        </motion.section>
      ))}
      <Footer />
    </main>
  );
}