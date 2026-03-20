"use client"
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
    const [progress, setProgress] = useState(0);
    const [dimension, setDimension] = useState({ width: 0, height: 0 });
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        setDimension({ width: window.innerWidth, height: window.innerHeight });

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsActive(false), 500); // تأخير بسيط ليبدو التحميل مكتملاً
                    return 100;
                }
                return prev + 1;
            });
        }, 25); // سرعة متوازنة

        return () => clearInterval(interval);
    }, []);

    // رسم القوس الاحترافي للستارة (SVG Path)
    const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`
    const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`

    return (
        <AnimatePresence mode="wait">
            {isActive && (
                <motion.div
                    variants={{
                        initial: { top: 0 },
                        exit: { 
                            top: "-100vh", 
                            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } 
                        }
                    }}
                    initial="initial"
                    exit="exit"
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020202] overflow-hidden"
                >
                    {dimension.width > 0 && (
                        <>
                            {/* تأثير توهج خلفي ناعم يشبه اللوجو */}
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3] 
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full"
                            />

                            <div className="relative flex flex-col items-center">
                                {/* الدائرة المحيطة (مثل اللوجو) */}
                                <svg className="w-32 h-32 md:w-48 md:h-48 rotate-[-90deg]">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        className="stroke-white/5 fill-none"
                                        strokeWidth="2"
                                    />
                                    <motion.circle
                                        cx="50%"
                                        cy="50%"
                                        r="45%"
                                        className="stroke-purple-500 fill-none"
                                        strokeWidth="2"
                                        strokeDasharray="100"
                                        initial={{ strokeDashoffset: 100 }}
                                        animate={{ strokeDashoffset: 100 - progress }}
                                        style={{ strokeLinecap: 'round' }}
                                    />
                                </svg>

                                {/* الرقم في المنتصف بتصميم نيون */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.span 
                                        className="text-2xl md:text-4xl font-black text-white"
                                        key={progress}
                                    >
                                        {progress}%
                                    </motion.span>
                                </div>
                            </div>
{/* الاسم مع تأثير الكتابة المضيئة - تم إصلاح الاتجاه */}
                      <div className="mt-10 text-center px-6" dir="ltr">
    <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-7xl font-black tracking-[0.2em] text-white flex justify-center gap-1 md:gap-3"
    >
        {"MOJIMMY".split("").map((char, index) => (
            <motion.span
                key={index}
                initial={{ opacity: 0.2 }}
                animate={{ 
                    color: progress > (index * 14) ? "#a855f7" : "#ffffff",
                    opacity: progress > (index * 14) ? 1 : 0.2,
                    textShadow: progress > (index * 14) 
                        ? "0 0 20px rgba(168,85,247,0.8), 0 0 40px rgba(168,85,247,0.4)" 
                        : "none"
                }}
                transition={{ duration: 0.3 }}
            >
                {char}
            </motion.span>
        ))}
    </motion.h1>
    
    <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        className="mt-4 text-[10px] md:text-xs uppercase tracking-[0.5em] text-white font-light"
    >
        Experience is loading
    </motion.p>
</div>

                            {/* الستارة SVG الخلفية التي تنكمش للأعلى عند الخروج */}
                            <svg className="absolute top-0 w-full h-[calc(100%+300px)] -z-10">
                                <motion.path
                                    variants={{
                                        initial: { d: initialPath },
                                        exit: { d: targetPath, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }
                                    }}
                                    initial="initial"
                                    exit="exit"
                                    fill="#020202"
                                />
                            </svg>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}