"use client"
import { motion } from "framer-motion";
import Link from "next/link";

export const HeroActions = ({ onStartProject }: { onStartProject: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="flex flex-col sm:flex-row items-center gap-4 mt-12 w-full sm:w-auto px-4"
    >
      {/* زر ابدأ مشروعك - التأثير المغناطيسي للموبايل */}
      <motion.button
        onClick={onStartProject}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }} // تأثير الضغط الحقيقي
        className="relative group overflow-hidden px-8 py-4 rounded-full bg-white text-black font-bold text-sm w-full sm:w-64 transition-all"
      >
        <span className="relative z-10">ابدأ مشروعك الآن</span>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-200 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </motion.button>

      {/* زر مشاهدة الأعمال - بتصميم Ghost مفرغ */}
      |<Link href={"#projects"}>
            <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-4 rounded-full border border-white/10 text-white font-medium text-sm w-full sm:w-64 backdrop-blur-md transition-all flex items-center justify-center gap-2"
      >
        <span>مشاهدة أعمالي</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180 group-hover:-translate-x-1 transition-transform">
          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
      </Link>
    </motion.div>
  );
};