"use client"
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Dimension {
    width: number;
    height: number;
}

export default function Preloader() {
    const [progress, setProgress] = useState<number>(0);
    const [dimension, setDimension] = useState<Dimension>({ width: 0, height: 0 });
    const [isActive, setIsActive] = useState<boolean>(true);

    useEffect(() => {
        const handleResize = () => {
            setDimension({ 
                width: window.innerWidth, 
                height: window.innerHeight 
            });
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        // Smart Progress: بيبدأ سريع ويبطأ في الآخر عشان يدي إيحاء بالـ Real-time Processing
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsActive(false), 800);
                    return 100;
                }
                const increment = prev > 80 ? 0.5 : 1.5; // تباطؤ عند النهاية
                return Math.min(prev + increment, 100);
            });
        }, 15);

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const paths = useMemo(() => {
        const { width, height } = dimension;
        if (width === 0) return { initial: "", target: "" };
        
        // منحنى الستارة السفلي (Bezier Curve) ليعطي إحساس السوائل
        return {
            initial: `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height + 350} 0 ${height} L0 0`,
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
                            transition: { duration: 1, ease: [0.85, 0, 0.15, 1], delay: 0.2 } 
                        }
                    }}
                    initial="initial"
                    exit="exit"
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#020202] overflow-hidden touch-none"
                >
                    {dimension.width > 0 && (
                        <>
                            {/* Ambient Glow - هالة ضوئية تتحرك مع البروجرس */}
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.1, 0.2, 0.1],
                                    rotate: [0, 90, 180]
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none"
                            />

                            <div className="relative flex flex-col items-center">
                                {/* Circular Progress - Ultra-Thin Design */}
                                <div className="relative w-32 h-32 md:w-48 md:h-48">
                                    <svg className="w-full h-full rotate-[-90deg]">
                                        <circle
                                            cx="50%" cy="50%" r="48%"
                                            className="stroke-white/[0.03] fill-none"
                                            strokeWidth="1"
                                        />
                                        <motion.circle
                                            cx="50%" cy="50%" r="48%"
                                            className="stroke-purple-500 fill-none"
                                            strokeWidth="2"
                                            strokeDasharray="100"
                                            animate={{ strokeDashoffset: 100 - progress }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            style={{ 
                                                strokeLinecap: 'round',
                                                filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.5))'
                                            }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.span 
                                            key={Math.floor(progress)}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-2xl md:text-4xl font-black text-white tabular-nums tracking-tighter"
                                        >
                                            {Math.floor(progress)}
                                        </motion.span>
                                    </div>
                                </div>

                                {/* Brand Reveal */}
                                <div className="mt-16 text-center overflow-hidden" dir="ltr">
                                    <motion.h1 className="text-4xl md:text-7xl font-black tracking-[0.25em] text-white flex justify-center gap-2">
                                        {"MOJIMMY".split("").map((char, index) => (
                                            <motion.span
                                                key={index}
                                                animate={{ 
                                                    color: progress > (index * 14.2) ? "#fff" : "#1a1a1a",
                                                    y: progress > (index * 14.2) ? 0 : 20,
                                                    opacity: progress > (index * 14.2) ? 1 : 0.2
                                                }}
                                                transition={{ duration: 0.5, ease: "backOut" }}
                                            >
                                                {char}
                                            </motion.span>
                                        ))}
                                    </motion.h1>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-4 mx-auto"
                                    />
                                    <p className="mt-6 text-[9px] uppercase tracking-[0.8em] text-white/20 font-light">
                                        Digital Architecture loading
                                    </p>
                                </div>
                            </div>

                            {/* The SVG Curtain - The Grand Exit */}
                            <svg className="absolute top-0 w-full h-[calc(100%+350px)] -z-10 pointer-events-none">
                                <motion.path
                                    variants={{
                                        initial: { d: paths.initial },
                                        exit: { 
                                            d: paths.target, 
                                            transition: { duration: 0.8, ease: [0.85, 0, 0.15, 1] } 
                                        }
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