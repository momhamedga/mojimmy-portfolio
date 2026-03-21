"use client"
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// تعريف الأنواع لضمان استقرار TypeScript
interface Dimension {
    width: number;
    height: number;
}

export default function Preloader() {
    const [progress, setProgress] = useState<number>(0);
    const [dimension, setDimension] = useState<Dimension>({ width: 0, height: 0 });
    const [isActive, setIsActive] = useState<boolean>(true);

    useEffect(() => {
        // تحديث الأبعاد بأمان في المتصفح
        const handleResize = () => {
            setDimension({ 
                width: window.innerWidth, 
                height: window.innerHeight 
            });
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsActive(false), 500);
                    return 100;
                }
                return prev + 1;
            });
        }, 20); // سرعة محسنة للموبايل

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // حساب مسارات الستارة - استخدام useMemo للأداء
    const paths = useMemo(() => {
        const { width, height } = dimension;
        if (width === 0) return { initial: "", target: "" };
        
        return {
            initial: `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height + 300} 0 ${height} L0 0`,
            target: `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height} 0 ${height} L0 0`
        };
    }, [dimension]);

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
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020202] overflow-hidden touch-none"
                >
                    {dimension.width > 0 && (
                        <>
                            {/* توهج النيون الخلفي */}
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    opacity: [0.2, 0.4, 0.2] 
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute w-48 h-48 md:w-80 md:h-80 bg-purple-600/10 blur-[80px] md:blur-[120px] rounded-full"
                            />

                            <div className="relative flex flex-col items-center">
                                {/* لودر الدائرة */}
                                <svg className="w-24 h-24 md:w-40 md:h-40 rotate-[-90deg]">
                                    <circle
                                        cx="50%" cy="50%" r="45%"
                                        className="stroke-white/5 fill-none"
                                        strokeWidth="2"
                                    />
                                    <motion.circle
                                        cx="50%" cy="50%" r="45%"
                                        className="stroke-purple-500 fill-none"
                                        strokeWidth="2"
                                        strokeDasharray="100"
                                        animate={{ strokeDashoffset: 100 - progress }}
                                        transition={{ duration: 0.1 }}
                                        style={{ strokeLinecap: 'round' }}
                                    />
                                </svg>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl md:text-3xl font-black text-white tabular-nums">
                                        {progress}%
                                    </span>
                                </div>
                            </div>

                            {/* اسم البراند بتأثير الإضاءة التتابعية */}
                            <div className="mt-12 text-center" dir="ltr">
                                <motion.h1 className="text-3xl md:text-6xl font-black tracking-[0.2em] text-white flex justify-center gap-1 md:gap-2">
                                    {"MOJIMMY".split("").map((char, index) => (
                                        <motion.span
                                            key={index}
                                            animate={{ 
                                                color: progress > (index * 14) ? "#a855f7" : "#333333",
                                                textShadow: progress > (index * 14) 
                                                    ? "0 0 15px rgba(168,85,247,0.6)" 
                                                    : "none"
                                            }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </motion.h1>
                                <p className="mt-4 text-[8px] md:text-[10px] uppercase tracking-[0.6em] text-white/30">
                                    جاري تحميل التجربة
                                </p>
                            </div>

                            {/* الستارة SVG - المحرك الأساسي للخروج الفخم */}
                            <svg className="absolute top-0 w-full h-[calc(100%+300px)] -z-10 pointer-events-none">
                                <motion.path
                                    variants={{
                                        initial: { d: paths.initial },
                                        exit: { d: paths.target, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }
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
    );
}