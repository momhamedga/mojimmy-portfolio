"use client"
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
    const [progress, setProgress] = useState(0);
    const [dimension, setDimension] = useState({width: 0, height: 0});

    useEffect(() => {
        setDimension({width: window.innerWidth, height: window.innerHeight});
        
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 30); // سرعة التحميل

        return () => clearInterval(interval);
    }, []);

    // رسم القوس الاحترافي للستارة
    const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width/2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`
    const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width/2} ${dimension.height} 0 ${dimension.height}  L0 0`

    return (
        <motion.div 
            variants={{initial: {top: 0}, exit: {top: "-100vh"}}} 
            initial="initial" 
            exit="exit" 
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#020202]"
        >
            {dimension.width > 0 && (
                <>
                    {/* الاسم بتدرج الألوان */}
                    <div className="relative overflow-hidden px-4">
                        <motion.h1 
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                            className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 py-4"
                        >
                            MO JIMMY {/* ضع اسمك هنا */}
                        </motion.h1>
                        
                        {/* خط التحميل المبدع تحت الاسم */}
                        <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transition-all duration-100" 
                             style={{ width: `${progress}%` }} 
                        />
                    </div>

                    {/* عداد صغير وأنيق بالجنب */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 font-mono text-gray-500 tracking-[0.3em] text-sm"
                    >
                        {progress < 10 ? `0${progress}` : progress}% LOADING
                    </motion.div>

                    {/* الستارة الخلفية */}
                    <svg className="absolute top-0 w-full h-[calc(100%+300px)] -z-10">
                        <motion.path 
                            variants={{
                                initial: { d: initialPath },
                                exit: { d: targetPath, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 } }
                            }} 
                            initial="initial" 
                            exit="exit" 
                            fill="#020202"
                        />
                    </svg>
                </>
            )}
        </motion.div>
    )
}