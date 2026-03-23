"use client"
import { motion } from "framer-motion";

interface OptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const StepOption = ({ label, selected, onClick }: OptionProps) => {
  const handlePress = () => {
    // اهتزاز خفيف جداً عند الاختيار (Haptic Feedback)
    if (window.navigator.vibrate) window.navigator.vibrate(8);
    onClick();
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97, y: 1 }} // ضغطة خفيفة للأسفل لتعزيز الشعور بالفيزياء
      onClick={handlePress}
      className={`w-full text-right p-5 md:p-6 rounded-[1.8rem] border transition-all duration-700 flex items-center justify-between group relative overflow-hidden
        ${selected 
          ? "border-purple-500/40 bg-purple-500/10 text-white shadow-[0_15px_40px_rgba(168,85,247,0.1)]" 
          : "border-white/5 bg-white/[0.02] text-gray-500 hover:border-white/10 hover:bg-white/[0.04] hover:text-gray-300"}`}
    >
      {/* مؤشر الحالة (الدائرة الصغيرة) بتأثير Glow */}
      <div className="relative flex items-center justify-center">
         <div className={`w-2 h-2 rounded-full transition-all duration-700 z-10
           ${selected 
             ? "bg-purple-500 scale-[1.6] shadow-[0_0_20px_#a855f7]" 
             : "bg-white/10 group-hover:bg-white/30"}`} 
         />
         
         {/* تأثير الهالة (Glow) خلف الدائرة عند الاختيار */}
         {selected && (
            <motion.div 
              layoutId="dot-glow" // مهم جداً لجعل الـ Glow ينتقل بنعومة بين الخيارات
              className="absolute inset-0 bg-purple-500 blur-xl opacity-40 scale-[3]"
            />
         )}
      </div>

      <span className="font-cairo font-bold text-base md:text-[16px] tracking-wide leading-none transition-colors duration-500">
        {label}
      </span>

      {/* لمسة إبداعية: تأثير إضاءة خفيف يمر عند اختيار العنصر */}
      {selected && (
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12"
        />
      )}
    </motion.button>
  );
};