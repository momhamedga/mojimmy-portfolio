"use client";

import dynamic from 'next/dynamic';

// دالة مساعدة لتسهيل الاستدعاء ومنع التكرار
const SectionLoader = () => <div className="w-full h-20 bg-transparent" />;

// 1. استدعاء السكاشن ديناميكياً مع تعطيل الـ SSR لضمان ظهور اللودينج
const Projects = dynamic(() => import("./projects"), { 
  ssr: false, 
  loading: () => <SectionLoader /> 
});

const TechStack = dynamic(() => import("./tech-stack"), { 
  ssr: false, 
  loading: () => <SectionLoader /> 
});

const About = dynamic(() => import("./about/About"), { 
  ssr: false, 
  loading: () => <SectionLoader /> 
});

const Services = dynamic(() => import("./services"), { 
  ssr: false, 
  loading: () => <SectionLoader /> 
});

const CodeLaboratory = dynamic(() => import("./lab/CodeLaboratory"), { 
  ssr: false, 
  loading: () => <SectionLoader /> 
});

const Testimonials = dynamic(() => import("./testimonials/Testimonials"), { 
  ssr: false, 
  loading: () => <SectionLoader /> 
});

const ProcessSection = dynamic(() => import("./Process/ProcessSection"), { 
  ssr: false, 
  loading: () => <SectionLoader /> 
});

const InteractiveFAQ = dynamic(() => import("./FAQ/InteractiveFAQ"), { 
  ssr: false, 
  loading: () => <SectionLoader /> 
});

const Contact = dynamic(() => import("./contact/Contact"), { 
  ssr: false, 
  loading: () => <SectionLoader /> 
});

const Footer = dynamic(() => import("./footer/Footer"), { 
  ssr: false 
});

export default function SectionsWrapper() {
  return (
    <div className="flex flex-col w-full">
      <Projects />
      <TechStack />
      <About />
      <Services />
      <CodeLaboratory />
      <Testimonials />
      <ProcessSection />
      <InteractiveFAQ />
      <Contact />
      <Footer />
    </div>
  );
}