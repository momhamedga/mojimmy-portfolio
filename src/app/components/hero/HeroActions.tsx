"use client"
import { motion } from "framer-motion";
import Link from "next/link";

export const HeroActions = ({ onStartProject }: { onStartProject: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="flex flex-col sm:flex-row gap-4 mt-12"
    >
      <button
        onClick={onStartProject}
        className="px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform"
      >
        ابدأ مشروعك الآن
      </button>
      
      <Link href="#projects">
        <button className="px-8 py-4 rounded-full border border-white/10 text-white hover:bg-white/5 transition-all">
          مشاهدة أعمالي
        </button>
      </Link>
    </motion.div>
  );
};