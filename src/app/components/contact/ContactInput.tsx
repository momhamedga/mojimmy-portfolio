"use client"
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useRef, useState } from "react";

interface Props {
  icon: any;
  name: string;
  placeholder: string;
  type?: string;
  isTextArea?: boolean;
  error?: string;
}

export default function ContactInput({ icon: Icon, name, placeholder, type = "text", isTextArea, error }: Props) {
  // استخدام State داخلية فقط للـ UI المحلي (Focus) لمنع عمل Re-render للفورم كامل
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<any>(null);

  return (
    <div className="relative w-full flex flex-col gap-2 group/field"> 
      <motion.div 
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        className={cn(
          "relative flex items-start gap-4 p-5 md:p-6 rounded-[2rem] border transition-all duration-500 bg-white/[0.02] backdrop-blur-3xl overflow-hidden",
          isFocused 
            ? "border-purple-500 bg-white/[0.04] shadow-[0_0_50px_rgba(168,85,247,0.1)]" 
            : "border-white/[0.05] hover:border-white/10",
          error ? "border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.05)]" : ""
        )}
      >
        {/* Decorative Side Glow - Pure CSS Transition */}
        <div className={cn(
          "absolute inset-y-0 right-0 w-[2px] bg-purple-500 transition-all duration-700",
          isFocused ? "opacity-100 h-full" : "opacity-0 h-0"
        )} />

        <div className="flex-shrink-0 pt-1">
          <Icon 
            size={18} 
            className={cn(
              "transition-all duration-500",
              isFocused ? "text-purple-400 scale-110 rotate-[-10deg]" : "text-gray-600"
            )} 
          />
        </div>
        
        {isTextArea ? (
          <textarea
            ref={inputRef}
            name={name}
            rows={4}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent text-white text-base md:text-lg outline-none resize-none placeholder:text-white/10 font-cairo font-medium antialiased custom-scrollbar"
            placeholder={placeholder}
            spellCheck="false"
          />
        ) : (
          <input
            ref={inputRef}
            name={name}
            type={type}
            autoComplete="off"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent text-white text-base md:text-lg outline-none placeholder:text-white/10 font-cairo font-medium antialiased h-full"
            placeholder={placeholder}
          />
        )}

        {/* Cinematic Internal Glow - GPU Accelerated */}
        <AnimatePresence>
          {isFocused && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(168,85,247,0.05),transparent_50%)]"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error Logic */}
      <div className="min-h-[20px] px-4"> 
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-2 text-red-400 font-cairo font-black text-[10px] md:text-xs tracking-tighter"
            >
              <AlertCircle size={12} strokeWidth={3} /> 
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  ); 
}