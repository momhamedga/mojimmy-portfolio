"use client"
import { useState, useEffect, useCallback, memo } from "react";
import { LAB_EXPERIMENTS } from "@/src/constants/lab-data";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, Code, Laptop, Smartphone, Zap, Eye, Binary } from "lucide-react";
import { LivePreview } from "./LivePreview";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ تعريف الـ Helper Function في نفس الملف لضمان التعرف عليها
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ إضافة Interfaces للـ TypeScript لمنع الـ Red Squiggles
interface Experiment {
  id: string;
  title: string;
  category: string;
  defaultValues: Record<string, number>;
  code: string;
}

export default function CodeLaboratory() {
  const [activeExp, setActiveExp] = useState<Experiment>(LAB_EXPERIMENTS[0]);
  const [userSettings, setUserSettings] = useState<Record<string, number>>(activeExp.defaultValues);

  useEffect(() => {
    setUserSettings(activeExp.defaultValues);
  }, [activeExp]);

  const handleControl = useCallback((key: string, val: number) => {
    setUserSettings(prev => ({ ...prev, [key]: val }));
  }, []);

  return (
    <section className="py-24 md:py-40 min-h-screen bg-transparent text-right" dir="rtl">
      <div className="container mx-auto px-6">
        
        {/* 1. Header */}
        <header className="mb-16 md:mb-24 relative">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[oklch(0.6_0.2_285_/_0.1)] border border-[oklch(0.6_0.2_285_/_0.2)] text-[oklch(0.7_0.2_285)] text-[10px] font-bold uppercase tracking-[0.3em] mb-8"
          >
            <Binary size={14} />
            <span>Interactive Lab v4.0</span>
          </motion.div>
          
          <h2 className="text-6xl md:text-[10rem] font-cairo font-black text-white mb-8 tracking-tighter leading-none">
            مختبر <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[oklch(0.7_0.2_285)] via-[oklch(0.7_0.2_250)] to-white opacity-90">
              المنطق.
            </span>
          </h2>
          <p className="text-white/40 text-lg md:text-3xl max-w-4xl font-cairo font-light leading-tight">
            تلاعب بالثوابت الفيزيائية للكود وشاهد النتيجة فوراً.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
          {/* 2. Controls Sidebar */}
          <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
            <div className="p-8 rounded-[3rem] bg-[oklch(0.15_0.02_0_/_0.4)] border border-white/5 backdrop-blur-3xl shadow-2xl relative group transform-gpu">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 rounded-2xl bg-white/[0.03] text-[oklch(0.7_0.2_285)] shadow-inner">
                  <Settings2 size={24} />
                </div>
                <span className="font-cairo font-bold text-2xl text-white">المعايير</span>
              </div>

              <div className="space-y-10">
                {Object.keys(userSettings).map((key) => (
                  <div key={key} className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-white/40 font-cairo text-sm font-bold uppercase tracking-widest">{key}</span>
                      <span className="px-3 py-1 rounded-lg bg-white/5 text-white font-mono text-xs border border-white/10">
                        {userSettings[key]}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" max="10" step="0.1"
                      value={userSettings[key]}
                      onChange={(e) => handleControl(key, parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-none accent-[oklch(0.7_0.2_285)]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
               {LAB_EXPERIMENTS.map((exp) => (
                 <ExperimentButton 
                    key={exp.id} 
                    exp={exp} 
                    isActive={activeExp.id === exp.id} 
                    onClick={() => setActiveExp(exp)} 
                 />
               ))}
            </div>
          </div>

          {/* 3. Preview & Code Area */}
          <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
             <div className="relative aspect-video w-full rounded-[4rem] overflow-hidden border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-black group transform-gpu">
                <LivePreview type={activeExp.id} settings={userSettings} />
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                    <div className="flex gap-4">
                      <StatusPill icon={<Laptop size={12}/>} text="60FPS STABLE" />
                      <StatusPill icon={<Smartphone size={12}/>} text="LOW LATENCY" />
                    </div>
                </div>
             </div>
             
             <motion.div layout className="rounded-[3rem] border border-white/5 bg-[oklch(0.12_0.02_0_/_0.8)] backdrop-blur-2xl overflow-hidden shadow-2xl">
                <div className="px-10 py-6 border-b border-white/5 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500/20" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                   </div>
                   <div className="flex items-center gap-3 text-white/30 font-mono text-xs">
                      <Code size={14} />
                      <span>{activeExp.id}.config.ts</span>
                   </div>
                </div>
                
                <div className="p-10 overflow-x-auto custom-scrollbar" dir="ltr">
                  <pre className="font-mono text-sm md:text-lg leading-relaxed text-white/70">
                    <code>
                      {activeExp.code.split('\n').map((line, i) => {
                        const [key] = line.split('=');
                        const cleanKey = key.replace('const', '').trim();
                        if (userSettings[cleanKey] !== undefined) {
                          return (
                            <motion.div key={i} animate={{ backgroundColor: ["rgba(255,255,255,0)", "rgba(255,255,255,0.05)", "rgba(255,255,255,0)"] }} className="py-0.5">
                              <span className="text-[oklch(0.7_0.2_330)] italic">const</span> {cleanKey} = <span className="text-[oklch(0.7_0.2_150)]">{userSettings[cleanKey]}</span>;
                            </motion.div>
                          );
                        }
                        return <div key={i} className="opacity-60">{line}</div>;
                      })}
                    </code>
                  </pre>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ✅ تحسين الـ Sub-components بالـ Types الصحيحة
// ✅ تعريف المكون باسم صريح لحل مشكلة eslint(react/display-name)
const ExperimentButton = memo(function ExperimentButton({ exp, isActive, onClick }: { 
  exp: any, 
  isActive: boolean, 
  onClick: () => void 
}) {
  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "p-6 rounded-[2rem] border transition-all duration-700 flex items-center justify-between group transform-gpu",
        isActive 
          ? "bg-white text-black border-white shadow-2xl" 
          : "bg-white/[0.02] text-white/40 border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
      )}
    >
      <div className="flex flex-col text-right">
        <span className={cn(
          "text-[9px] font-black uppercase tracking-widest mb-1",
          isActive ? "text-black/40" : "text-[oklch(0.7_0.2_285)]"
        )}>
          {exp.category}
        </span>
        <span className="text-xl font-cairo font-bold">{exp.title}</span>
      </div>
      
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500",
        isActive ? "bg-black text-white rotate-12" : "bg-white/5 text-white"
      )}>
        {isActive ? <Zap size={20} fill="currentColor" /> : <Eye size={20} />}
      </div>
    </motion.button>
  );
});

// إعطاء اسم للمكون يدويًا كخيار إضافي للأمان
ExperimentButton.displayName = "ExperimentButton";
const StatusPill = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 text-white font-mono text-[9px] tracking-tighter">
    {icon} {text}
  </div>
);