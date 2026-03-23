"use client"
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface Props {
  icon: any;
  name: string;
  placeholder: string;
  type?: string;
  isTextArea?: boolean;
  focusedField: string | null;
  setFocusedField: (name: string | null) => void;
  error?: string;
}

export default function ContactInput({ icon: Icon, name, placeholder, type = "text", isTextArea, focusedField, setFocusedField, error }: Props) {
  const isFocused = focusedField === name;

  // وظيفة للاهتزاز الخفيف عند التفاعل (لمسة الموبايل)
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(10); 
    }
  };

  return (
    <div className="relative w-full group mb-6">
      <motion.div 
        onClick={triggerHaptic}
        animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
        className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-500 bg-white/[0.02] backdrop-blur-md
        ${isFocused ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] bg-white/[0.05]' : 'border-white/10'}
        ${error ? 'border-red-500/50' : ''}`}
      >
        <Icon 
          size={20} 
          className={`mt-1 transition-colors duration-500 ${isFocused ? 'text-purple-400' : 'text-gray-500'}`} 
        />
        
        {isTextArea ? (
          <textarea
            name={name}
            rows={4}
            onFocus={() => { setFocusedField(name); triggerHaptic(); }}
            onBlur={(e) => !e.target.value && setFocusedField(null)}
            className="w-full bg-transparent text-white text-base md:text-lg outline-none resize-none placeholder:text-gray-600 font-cairo "
            placeholder={placeholder}
            spellCheck="false"
          />
        ) : (
          <input
            name={name}
            type={type}
            autoComplete="off"
            onFocus={() => { setFocusedField(name); triggerHaptic(); }}
            onBlur={(e) => !e.target.value && setFocusedField(null)}
            className="w-full bg-transparent text-white text-base md:text-lg outline-none placeholder:text-gray-600 font-cairo "
            placeholder={placeholder}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10, x: 10 }} 
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -bottom-6 right-2 text-red-400 text-[11px] flex items-center gap-1 font-bold font-cairo  z-20"
          >
            <AlertCircle size={12} /> 
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}