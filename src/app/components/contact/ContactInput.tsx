"use client"
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useState } from "react";

interface Props {
  icon: any;
  name: string;
  placeholder: string;
  type?: string;
  isTextArea?: boolean;
  error?: string;
}

export default function ContactInput({ icon: Icon, name, placeholder, type = "text", isTextArea, error }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full flex flex-col gap-2 group/field"> 
      <motion.div 
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        className={cn(
          "relative flex items-start gap-4 p-6 rounded-[2rem] border transition-all duration-500 bg-white/[0.02] backdrop-blur-3xl",
          isFocused 
            ? "border-primary bg-white/[0.05] shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)]" 
            : "border-white/[0.05] hover:border-white/10",
          error ? "border-red-500/50" : ""
        )}
      >
        <div className="flex-shrink-0 pt-1.5 transition-colors duration-500">
          <Icon 
            size={18} 
            className={cn(
              "transition-all duration-500",
              isFocused ? "text-primary scale-110 rotate-[-10deg]" : "text-gray-600"
            )} 
          />
        </div>
        
        {isTextArea ? (
          <textarea
            name={name}
            rows={4}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent text-white text-lg outline-none resize-none placeholder:text-white/10 font-cairo font-medium"
            placeholder={placeholder}
          />
        ) : (
          <input
            name={name}
            type={type}
            autoComplete="off"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent text-white text-lg outline-none placeholder:text-white/10 font-cairo font-medium h-full"
            placeholder={placeholder}
          />
        )}

        {/* Decorative Side Edge */}
        <div className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 w-[3px] bg-primary transition-all duration-500 rounded-l-full",
          isFocused ? "h-1/2 opacity-100" : "h-0 opacity-0"
        )} />
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 text-red-400 font-cairo font-bold text-xs px-4"
          >
            <AlertCircle size={12} /> 
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ); 
}