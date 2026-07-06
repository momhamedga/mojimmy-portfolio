"use client";

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import MobileScrollTop from './MobileScrollTop';

const SectionLoader = () => (
  <div className="w-full h-[40vh] flex items-center justify-center animate-pulse">
    <div className="w-12 h-px bg-foreground/10" />
  </div>
);

// تحميل الأقسام ديناميكياً (code-splitting) مع الحفاظ على الـ SSR للمحتوى والـ SEO
const Projects = dynamic(() => import("./projects"), { loading: SectionLoader });
const TechStack = dynamic(() => import("./tech-stack"), { loading: SectionLoader });
const About = dynamic(() => import("./about/About"), { loading: SectionLoader });
const Services = dynamic(() => import("./services"), { loading: SectionLoader });
const Testimonials = dynamic(() => import("./testimonials/Testimonials"), { loading: SectionLoader });
const ProcessSection = dynamic(() => import("./Process/ProcessSection"), { loading: SectionLoader });
const InteractiveFAQ = dynamic(() => import("./FAQ/InteractiveFAQ"), { loading: SectionLoader });
const Contact = dynamic(() => import("./contact/Contact"), { loading: SectionLoader });
const Footer = dynamic(() => import("./footer/Footer"));

export default function SectionsWrapper() {
  // المصفوفة هنا تبدأ بالـ Projects فقط (بدون الـ Hero تماماً)
  const sections = [
    { id: 'projects', Component: Projects },
    { id: 'tech', Component: TechStack },
    { id: 'about', Component: About },
    { id: 'services', Component: Services },
    { id: 'process', Component: ProcessSection },
    { id: 'testimonials', Component: Testimonials },
    { id: 'faq', Component: InteractiveFAQ },
    { id: 'contact', Component: Contact },
  ];

  return (
    <div className="flex flex-col w-full relative">
      {sections.map(({ id, Component }, index) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
          transition={{ duration: 0.7, delay: index * 0.03, ease: [0.21, 1, 0.36, 1] }}
          className="relative w-full block"
        >
          <Component />
        </motion.div>
      ))}
      <Footer />
      <MobileScrollTop />
    </div>
  );
}