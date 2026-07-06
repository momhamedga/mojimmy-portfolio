"use client"
import { motion, Variants } from "framer-motion";
import { memo } from "react";

const containerVariants: Variants = {
  hover: {
    scale: 1.08,
    rotate: [0, -2, 2, 0],
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
      rotate: { duration: 0.5 }
    }
  },
  tap: { scale: 0.92 }
};

export const Logo = memo(() => {
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="relative cursor-pointer group select-none touch-none w-fit h-fit"
    >
      {/* الهالة الملونة عند الـ Hover */}
      <motion.div
        variants={{ hover: { opacity: 1, scale: 1.4 } }}
        initial={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 rounded-2xl blur-xl pointer-events-none"
        style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
      />

      {/* الإطار المتدرج (Gradient Ring) */}
      <motion.div
        variants={containerVariants}
        className="relative z-10 w-14 h-14 p-[1.5px] rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
      >
        <div className="relative w-full h-full bg-background rounded-[0.9rem] overflow-hidden flex items-center justify-center">
          {/* توهج داخلي هادئ */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--color-primary) 25%, transparent), transparent 65%)" }}
          />

          {/* حرف M بتدرج العلامة التجارية */}
          <span
            className="relative z-10 font-cairo text-2xl font-black tracking-tighter bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
          >
            M
          </span>

          {/* لمعة عابرة عند الـ Hover */}
          <motion.div
            variants={{ hover: { x: "150%" } }}
            initial={{ x: "-150%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-20 w-1/2 h-full bg-linear-to-r from-transparent via-foreground/10 to-transparent -skew-x-12"
          />
        </div>
      </motion.div>

      {/* نقطة النشاط */}
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.4, 0.8] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -bottom-1 -left-1 z-20"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-accent border-2 border-background shadow-[0_0_8px_var(--color-accent)]" />
      </motion.div>
    </motion.div>
  );
});

Logo.displayName = "Logo";
