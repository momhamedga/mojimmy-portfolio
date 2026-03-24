"use client"
import { AnimatePresence, motion } from "framer-motion";

interface OptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const StepOption = ({ label, selected, onClick }: OptionProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-right p-6 rounded-[1.5rem] border transition-all duration-500 group relative overflow-hidden
        ${selected 
          ? "border-purple-500/50 bg-purple-500/10 text-white" 
          : "border-white/5 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:bg-white/[0.06]"}`}
    >
      <div className="flex items-center justify-between relative z-10">
        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${selected ? "bg-purple-500 shadow-[0_0_15px_#a855f7] scale-125" : "bg-white/10"}`} />
        <span className="font-cairo font-bold text-lg">{label}</span>
      </div>

      {/* تأثير لمعة سريعة عند الاختيار */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            layoutId="highlight"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-12"
            initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};