"use client"
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils"; //

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

  return (
    <div className="relative w-full group">
      <motion.div 
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        className={cn(
          "flex items-start gap-5 p-6 rounded-3xl border transition-all duration-700 bg-white/[0.02] backdrop-blur-2xl relative overflow-hidden",
          isFocused ? "border-purple-500 bg-white/[0.05] shadow-[0_0_40px_rgba(168,85,247,0.1)]" : "border-white/[0.08]",
          error && "border-red-500/50"
        )}
      >
        <Icon 
          size={22} 
          className={cn(
            "mt-1 transition-colors duration-500",
            isFocused ? "text-purple-400" : "text-gray-600"
          )} 
        />
        
        {isTextArea ? (
          <textarea
            name={name}
            rows={5}
            onFocus={() => setFocusedField(name)}
            onBlur={(e) => !e.target.value && setFocusedField(null)}
            className="w-full bg-transparent text-white text-lg md:text-xl outline-none resize-none placeholder:text-white/20 font-cairo font-medium antialiased"
            placeholder={placeholder}
            spellCheck="false"
          />
        ) : (
          <input
            name={name}
            type={type}
            autoComplete="off"
            onFocus={() => setFocusedField(name)}
            onBlur={(e) => !e.target.value && setFocusedField(null)}
            className="w-full bg-transparent text-white text-lg md:text-xl outline-none placeholder:text-white/20 font-cairo font-medium antialiased h-full"
            placeholder={placeholder}
          />
        )}

        {/* Focus Gradient Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-700 pointer-events-none",
          isFocused && "opacity-100"
        )} />
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -bottom-7 right-4 text-red-400 text-xs flex items-center gap-2 font-black font-cairo z-20"
          >
            <AlertCircle size={14} /> 
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}