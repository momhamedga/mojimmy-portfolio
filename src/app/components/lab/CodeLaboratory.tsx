"use client"
import { useState, useEffect } from "react";
import { LAB_EXPERIMENTS } from "@/src/constants/lab-data";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, Code, Laptop, Smartphone, Zap, Eye } from "lucide-react";
import { LivePreview } from "./LivePreview";

export default function CodeLaboratory() {
  const [activeExp, setActiveExp] = useState(LAB_EXPERIMENTS[0]);
  const [userSettings, setUserSettings] = useState(activeExp.defaultValues);

  // تحديث الإعدادات عند تغيير التجربة
  useEffect(() => {
    setUserSettings(activeExp.defaultValues);
  }, [activeExp]);

  const handleControl = (key: string, val: number) => {
    setUserSettings(prev => ({ ...prev, [key]: val }));
  };

  return (
    <section className="py-20 md:py-32 bg-[#050505] min-h-screen text-right selection:bg-purple-500/30" dir="rtl">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* الهيدر الإبداعي */}
        <header className="mb-12 md:mb-20 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs mb-6"
          >
            <Zap size={14} className="fill-current" />
            <span className="font-mono tracking-tighter uppercase">النسخة التجريبية v0.3</span>
          </motion.div>
          
          <h2 className="text-6xl md:text-9xl font-black text-white mb-6 tracking-tighter leading-none">
            مختبر <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-600 to-blue-500">الكود</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-2xl max-w-3xl leading-relaxed font-light">
            تفاعل مع المنطق البرمجي بشكل مباشر. قم بتعديل القيم وشاهد كيف يتحول الكود إلى فن بصري متحرك.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start">
          
          {/* لوحة التحكم (Sidebar) - مصممة للتاتش */}
          <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
            <div className="p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] border border-white/5 shadow-2xl relative overflow-hidden group">
              {/* زخرفة خلفية */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Settings2 size={20} className="text-purple-500" />
                  </div>
                  <span className="font-bold text-xl">لوحة التحكم</span>
                </div>
              </div>

              <div className="space-y-8">
                {Object.keys(userSettings).map((key) => (
                  <div key={key} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium text-sm capitalize">{key === 'strength' ? 'قوة الجذب' : key}</span>
                      <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 font-mono text-xs border border-purple-500/20">
                        {userSettings[key]}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="10" 
                      step="0.1"
                      value={userSettings[key]}
                      onChange={(e) => handleControl(key, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* أزرار اختيار التجارب - أزرار كبيرة للتاتش */}
            <div className="grid grid-cols-1 gap-3">
               {LAB_EXPERIMENTS.map(exp => (
                 <motion.button 
                  key={exp.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveExp(exp)}
                  className={`relative p-5 rounded-[1.5rem] border transition-all duration-500 flex items-center justify-between group ${
                    activeExp.id === exp.id 
                    ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
                    : "bg-white/5 text-white border-white/10 hover:border-white/20"
                  }`}
                 >
                   <div className="flex flex-col text-right">
                     <span className={`text-[10px] uppercase font-bold mb-1 ${activeExp.id === exp.id ? "text-black/50" : "text-purple-500"}`}>
                       {exp.category}
                     </span>
                     <span className="text-base font-black tracking-tight">{exp.title}</span>
                   </div>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeExp.id === exp.id ? "bg-black/5" : "bg-white/5"}`}>
                     {activeExp.id === exp.id ? <Zap size={18} fill="black" /> : <Eye size={18} />}
                   </div>
                 </motion.button>
               ))}
            </div>
          </div>

          {/* منطقة العرض والكود (Main Area) */}
          <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
             {/* منطقة الـ Live Preview */}
             <div className="relative aspect-square md:aspect-video w-full rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl bg-[#080808]">
                <LivePreview type={activeExp.id} settings={userSettings} />
                
                {/* علامات مائية جمالية */}
                <div className="absolute top-6 right-8 pointer-events-none flex items-center gap-4 opacity-20">
                   <div className="flex items-center gap-2 text-white font-mono text-[10px]">
                      <Laptop size={12} /> DESKTOP READY
                   </div>
                   <div className="flex items-center gap-2 text-white font-mono text-[10px]">
                      <Smartphone size={12} /> TOUCH OPTIMIZED
                   </div>
                </div>
             </div>
             
             {/* نافذة الكود المطورة */}
             <motion.div 
               layout
               className="rounded-[2rem] md:rounded-[3rem] border border-white/5 bg-[#0a0a0a] overflow-hidden"
             >
                <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center flex-row-reverse">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-emerald-500/10">
                      <Code size={16} className="text-emerald-500" />
                    </div>
                    <span className="text-xs font-mono text-gray-400 tracking-tighter">logic_processor.ts</span>
                  </div>
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-white/5" />
                     <div className="w-3 h-3 rounded-full bg-white/5" />
                  </div>
                </div>
                
                <div className="p-8 overflow-x-auto custom-scrollbar" dir="ltr">
                  <pre className="font-mono text-sm md:text-base leading-relaxed">
                    <code className="text-gray-500 italic block mb-4">// تحديث القيم في الوقت الفعلي:</code>
                    <code className="text-emerald-400/90">
                      {activeExp.code.split('\n').map((line, i) => {
                        const [key] = line.split('=');
                        const cleanKey = key.replace('const', '').trim();
                        if (userSettings[cleanKey] !== undefined) {
                          return (
                            <motion.span 
                              key={i} 
                              animate={{ backgroundColor: ["transparent", "rgba(16,185,129,0.1)", "transparent"] }}
                              className="block"
                            >
                              <span className="text-purple-500 font-bold px-1">const</span> 
                              {cleanKey} = <span className="text-orange-400 font-bold">{userSettings[cleanKey]}</span>;
                            </motion.span>
                          );
                        }
                        return <span key={i} className="block">{line}</span>;
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