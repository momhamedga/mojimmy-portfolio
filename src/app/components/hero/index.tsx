"use client";
import { useState } from "react";
import { HeroContent } from "./HeroContent";
import { HeroActions } from "./HeroActions";
import { AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

const StartProjectModal = dynamic(() => import("../ProjectModal/StartProjectModal"), { ssr: false });

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20">
      {/* تأثير إضاءة علوي خفيف (Ambient Light) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center">
        <HeroContent />
        <HeroActions onStartProject={() => setIsModalOpen(true)} />
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <StartProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}