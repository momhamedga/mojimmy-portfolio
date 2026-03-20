"use client"
import React, { useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function Magnetic({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    // استخدام الـ Springs بدلاً من useState العادي لجعل الحركة أسلس بـ 10 مرات
    const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
    const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        if (!ref.current) return;

        const { height, width, left, top } = ref.current.getBoundingClientRect();
        
        // حساب مركز العنصر بالنسبة لمكان الماوس
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        
        // تحريك العنصر (تقسيم على 2.5 ليكون التأثير واضح ومسيطر عليه)
        x.set(middleX / 2.5);
        y.set(middleY / 2.5);
    }

    const reset = () => {
        x.set(0);
        y.set(0);
    }

    // وظيفة الاهتزاز للموبايل عند اللمس المطول أو الضغط
    const triggerHaptic = () => {
        if (typeof window !== "undefined" && window.navigator.vibrate) {
            window.navigator.vibrate(10); // اهتزاز خفيف جداً (Tactile)
        }
    }

    return (
        <motion.div
            style={{ 
                position: "relative",
                display: "inline-block", // لضمان أن الحاوية تأخذ حجم المحتوى فقط
                x, y 
            }}
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={reset}
            // --- لمسات إبداعية للموبايل ---
            whileTap={{ 
                scale: 0.92, // تأثير الانضغاط
                rotate: [0, -1, 1, 0], // اهتزازة بسيطة جداً عند اللمس
                transition: { duration: 0.2 }
            }}
            onTouchStart={triggerHaptic} // اهتزاز بمجرد لمس الإصبع للزر
            className="cursor-pointer"
        >
            {children}
        </motion.div>
    )
}