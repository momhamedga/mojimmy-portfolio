"use client"
import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Dimension {
    width: number;
    height: number;
}

export default function Preloader() {
    const [dimension, setDimension] = useState<Dimension>({ width: 0, height: 0 });
    const [isActive, setIsActive] = useState<boolean>(true);
    
    // 1. Refs للأداء العالي (بدون Re-renders للأرقام)
    const progressTextRef = useRef<HTMLSpanElement>(null);
    const progressCircleRef = useRef<SVGCircleElement>(null);
    const progressVal = useRef(0);

    useEffect(() => {
        const handleResize = () => {
            setDimension({ width: window.innerWidth, height: window.innerHeight });
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        // 2. محرك البروجرس بـ useRef
        const updateProgress = () => {
            if (progressVal.current >= 100) {
                setTimeout(() => setIsActive(false), 800);
                return;
            }

            // سرعة متغيرة (Smart Slow-down)
            const increment = progressVal.current > 80 ? 0.3 : 1.2;
            progressVal.current += increment;

            // تحديث الـ DOM مباشرة (أسرع بـ 100 مرة من الـ State)
            if (progressTextRef.current) {
                progressTextRef.current.innerText = Math.floor(progressVal.current).toString();
            }
            if (progressCircleRef.current) {
                const offset = 100 - progressVal.current;
                progressCircleRef.current.style.strokeDashoffset = offset.toString();
            }

            requestAnimationFrame(updateProgress);
        };

        const animationFrame = requestAnimationFrame(updateProgress);

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const paths = useMemo(() => {
        const { width, height } = dimension;
        if (width === 0) return { initial: "", target: "" };
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
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#020202] overflow-hidden"
                >
                    {dimension.width > 0 && (
                        <>
                            <div className="relative flex flex-col items-center">
                                {/* Circular Progress - Ultra-Thin */}
                                <div className="relative w-32 h-32 md:w-48 md:h-48">
                                    <svg className="w-full h-full rotate-[-90deg]">
                                        <circle
                                            cx="50%" cy="50%" r="48%"
                                            className="stroke-white/[0.03] fill-none"
                                            strokeWidth="1"
                                        />
                                        <circle
                                            ref={progressCircleRef}
                                            cx="50%" cy="50%" r="48%"
                                            className="stroke-purple-500 fill-none transition-all duration-150 ease-out"
                                            strokeWidth="2"
                                            strokeDasharray="100"
                                            strokeDashoffset="100"
                                            style={{ 
                                                strokeLinecap: 'round',
                                                filter: 'drop-shadow(0 0 12px rgba(168,85,247,0.6))'
                                            }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span 
                                            ref={progressTextRef}
                                            className="text-2xl md:text-5xl font-black text-white tabular-nums tracking-tighter"
                                        >
                                            0
                                        </span>
                                    </div>
                                </div>

                                {/* Brand Reveal */}
                                <div className="mt-16 text-center" dir="ltr">
                                    <h1 className="text-4xl md:text-7xl font-black tracking-[0.2em] text-white opacity-20">
                                        MOJIMMY
                                    </h1>
                                    <p className="mt-4 text-[10px] uppercase tracking-[0.5em] text-purple-500 font-bold animate-pulse">
                                        Architecting the Future
                                    </p>
                                </div>
                            </div>

                            {/* The SVG Curtain Exit */}
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