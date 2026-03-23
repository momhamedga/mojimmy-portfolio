"use client"
import { useState } from "react";
import { HeroContent } from "./HeroContent"; // تأكد من مسارها
import { HeroActions } from "./HeroActions";
import { AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

const StartProjectModal = dynamic(() => import("../ProjectModal/StartProjectModal"), { ssr: false });

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center">
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