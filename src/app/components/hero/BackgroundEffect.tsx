import { motion, useMotionTemplate, MotionValue } from "framer-motion";
import { memo } from "react";

interface Props {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}

export const BackgroundEffect = memo(({ springX, springY }: Props) => {
  const background = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(147, 51, 234, 0.12), transparent 80%)`;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" 
           style={{ backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <motion.div className="absolute inset-0" style={{ background }} />
    </div>
  );
});

BackgroundEffect.displayName = "BackgroundEffect";