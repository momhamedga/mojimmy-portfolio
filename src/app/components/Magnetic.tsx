"use client"
import React from 'react'
import { motion } from 'framer-motion';
import { useMagneticPointer } from '../hooks/useMagneticPointer';

// 1. تعريف الـ Types بدقة عشان الـ Build يعدي بسلام
interface MagneticProps {
    children: React.ReactNode;
    intensity?: number; // قوة الجذب (الافتراضي 0.6)
}

export default function Magnetic({ children, intensity = 0.6 }: MagneticProps) {
    // Springs بإعدادات Physics سينمائية + تتبّع ماوس مجمّع بـ rAF لمنع Layout Thrash
    const { ref, x, y, handleMouseMove, reset } = useMagneticPointer(intensity, { stiffness: 150, damping: 15, mass: 0.1 });

    // Haptic Feedback للموبايل (Tactile Experience)
    const triggerHaptic = () => {
        if (typeof window !== "undefined" && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={reset}
            onTouchStart={triggerHaptic}
            style={{
                position: "relative",
                display: "inline-block",
                x, y
            }}
            whileTap={{
                scale: 0.95,
                transition: { duration: 0.1 }
            }}
            className="will-change-transform cursor-pointer" // Will-change لتحسين أداء الـ GPU
        >
            {children}
        </motion.div>
    )
}
