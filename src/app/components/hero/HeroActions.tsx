"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export const HeroActions = ({ onStartProject }: { onStartProject: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="flex flex-col sm:flex-row gap-5 mt-12"
    >
      <button
        onClick={onStartProject}
        className="group relative px-10 py-4 rounded-full bg-white text-black font-bold font-cairo overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      >
        <span className="relative z-10">ابدأ مشروعك الآن</span>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
      
      <Link href="#projects">
        <button className="px-10 py-4 rounded-full border border-white/10 text-white font-cairo  font-medium backdrop-blur-md bg-white/[0.02] hover:bg-white/[0.08] transition-all hover:border-white/20">
          مشاهدة أعمالي
        </button>
      </Link>
    </motion.div>
  );
};