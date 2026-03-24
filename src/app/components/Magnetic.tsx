"use client"
import React, { useRef } from 'react'
import { motion, useSpring } from 'framer-motion';

// 1. تعريف الـ Types بدقة عشان الـ Build يعدي بسلام
interface MagneticProps {
    children: React.ReactNode;
    intensity?: number; // قوة الجذب (الافتراضي 0.6)
}

export default function Magnetic({ children, intensity = 0.6 }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);

    // 2. استخدام Springs بإعدادات Physics سينمائية
    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        
        // حساب المسافة من المركز
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        
        // 3. تطبيق الـ Intensity (كل ما زاد الرقم زادت قوة الجذب)
        x.set(middleX * intensity);
        y.set(middleY * intensity);
    }

    const reset = () => {
        x.set(0);
        y.set(0);
    }

    // 4. Haptic Feedback للموبايل (Tactile Experience)
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