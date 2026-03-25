"use client"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  User, Send, CheckCheck, 
  Wifi, Search, MoreVertical 
} from "lucide-react";
import { FAQ_DATA } from "@/src/constants/faq-data";
import { cn } from "@/src/lib/utils";

export default function InteractiveFAQ() {
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLDivElement>(null); // Ref للـ Typing Indicator

  // Auto-scroll محسّن: بيعتمد على الـ MutationObserver لمراقبة تغييرات الـ DOM مباشرة
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    });

    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const handleSelectQuestion = (index: number) => {
    if (activeTab === index) return;

    // إظهار الـ Typing Indicator يدوياً بدون Re-render
    if (typingRef.current) typingRef.current.style.display = 'flex';

    setTimeout(() => {
      setActiveTab(index);
      // إخفاء الـ Typing Indicator
      if (typingRef.current) typingRef.current.style.display = 'none';
    }, 1000);
  };

  return (
    <section id="faq" className="py-28 md:py-48 relative overflow-hidden bg-transparent selection:bg-purple-500/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.03),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-right mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 text-purple-400 text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Neural Support Engine v2.6
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-black text-white font-cairo leading-none tracking-tighter">
            دردشة <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-400 via-pink-500 to-blue-500">فورية</span>
          </h2>
        </div>

        {/* Chat Interface Shell */}
        <div className="border border-white/[0.08] rounded-[2.5rem] shadow-2xl flex flex-col h-[700px] relative overflow-hidden backdrop-blur-3xl transform-gpu">
          
          {/* Header Bar */}
          <div className="p-6 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between flex-row-reverse z-20">
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-black text-white italic text-xl">M</div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-[#080808]" />
              </div>
              <div className="text-right">
                <h4 className="text-white font-bold font-cairo">MoJimmy Intelligence</h4>
                <div className="flex items-center justify-end gap-1.5 text-green-500/80 text-[10px] font-bold">
                  <span className="uppercase tracking-widest">Online</span>
                  <Wifi size={10} className="animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
     <div 
  ref={scrollRef}
  className={cn(
    "flex-1 overflow-y-auto p-6 md:p-10 space-y-8 relative",
    "scrollbar-none touch-pan-y antialiased", // منع ظهور السكرول التقليدي وتحسين التاتش
    "overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none]" // دعم فايرفوكس وIE
  )}
  style={{ 
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch', // تفعيل الـ Momentum Scroll في iOS
    willChange: 'scroll-position'     // تنبيه الـ GPU للاستعداد
  }}
>
            <LayoutGroup>
              {FAQ_DATA.map((item, index) => (
                <div key={index} className="flex flex-col gap-6">
                  {/* User Question */}
                  <motion.div 
                    layout
                    onClick={() => handleSelectQuestion(index)}
                    className={cn(
                      "flex flex-row-reverse items-start gap-3 cursor-pointer self-end max-w-[85%] transition-all duration-500",
                      activeTab !== index && activeTab !== null && "opacity-40"
                    )}
                  >
                    <div className={cn(
                      "p-5 rounded-[2rem] rounded-br-none text-right border transition-all duration-500",
                      activeTab === index 
                        ? 'bg-white text-black border-white shadow-xl scale-105' 
                        : 'bg-white/[0.03] text-white/70 border-white/[0.05]'
                    )}>
                      <p className="text-sm md:text-base font-bold font-cairo">{item.question}</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/40 shrink-0 uppercase text-[10px] font-black">Me</div>
                  </motion.div>

                  {/* Bot Reply */}
                  <AnimatePresence mode="popLayout">
                    {activeTab === index && (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-start gap-4 self-start max-w-[90%]"
                      >
                        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white text-xs font-black italic shrink-0">M</div>
                        <div className="flex flex-col items-start gap-2">
                          <div className="p-6 rounded-[2rem] rounded-tl-none bg-white/[0.03] border border-white/[0.05] text-white/90">
                            <p className="text-sm md:text-base font-cairo leading-relaxed">{item.answer}</p>
                          </div>
                          <div className="flex items-center gap-2 px-2">
                             <CheckCheck size={14} className="text-blue-500" />
                             <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest italic">Verified Solution</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </LayoutGroup>

            {/* Typing Indicator - Controlled by Ref for zero-rerender performance */}
            <div 
              ref={typingRef}
              style={{ display: 'none' }}
              className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] p-3 rounded-2xl w-fit"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">Computing Response...</span>
            </div>
          </div>

          {/* Fake Input Bar */}
          <div className="p-6 bg-black/40 border-t border-white/[0.05] backdrop-blur-xl">
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="flex-1 h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 flex items-center justify-end text-white/20 text-xs font-cairo italic">
                اختر سؤالاً للحصول على إجابة فورية...
              </div>
              <button className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-all">
                <Send size={20} className="rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}