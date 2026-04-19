"use client";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useEffect, useRef, memo } from "react";
import { 
  Send, CheckCheck, 
  Wifi, ShieldCheck 
} from "lucide-react";
import { FAQ_DATA } from "@/src/constants/faq-data";
import { cn } from "@/src/lib/utils";

export default function InteractiveFAQ() {
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLDivElement>(null);

  // Auto-scroll الذكي المراقب لتغييرات المحتوى
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

    // تفعيل الـ Typing Indicator
    if (typingRef.current) typingRef.current.style.display = 'flex';

    setTimeout(() => {
      setActiveTab(index);
      if (typingRef.current) typingRef.current.style.display = 'none';
    }, 800);
  };

  return (
    <section id="faq" className="py-28 md:py-48 relative overflow-hidden ">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--color-primary-transparent),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-right mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            chatFaq
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-black text-white font-cairo leading-none tracking-tighter">
            دردشة <span className="text-primary italic">فورية</span>
          </h2>
        </div>

        {/* Chat Interface Shell */}
        <div className="border border-white/[0.08] rounded-[3rem] shadow-2xl flex flex-col h-[650px] relative overflow-hidden bg-glass backdrop-blur-3xl transform-gpu">
          
          {/* Header Bar */}
          <div className="p-6 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between flex-row-reverse z-20">
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-black text-black italic text-xl">M</div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-background" />
              </div>
              <div className="text-right">
                <h4 className="text-white font-bold font-cairo text-sm md:text-base">MoJimmy AI</h4>
                <div className="flex items-center justify-end gap-1.5 text-green-500/80 text-[10px] font-bold">
                  <span className="uppercase tracking-widest">Active Now</span>
                  <Wifi size={10} className="animate-pulse" />
                </div>
              </div>
            </div>
            <ShieldCheck size={20} className="text-white/20" />
          </div>

          {/* Messages Feed */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-none overscroll-contain"
            style={{ scrollBehavior: 'smooth' }}
          >
            <LayoutGroup>
              {FAQ_DATA.map((item, index) => (
                <div key={index} className="flex flex-col gap-6">
                  {/* User Question Card */}
                  <motion.div 
                    layout
                    onClick={() => handleSelectQuestion(index)}
                    className={cn(
                      "flex flex-row-reverse items-start gap-3 cursor-pointer self-end max-w-[85%] transition-all duration-500",
                      activeTab !== index && activeTab !== null && "opacity-40 grayscale-[0.5]"
                    )}
                  >
                    <div className={cn(
                      "p-5 rounded-[1.8rem] rounded-br-none text-right border transition-all duration-500",
                      activeTab === index 
                        ? 'bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.1)]' 
                        : 'bg-white/[0.03] text-white/70 border-white/[0.05] hover:bg-white/[0.06]'
                    )}>
                      <p className="text-sm md:text-base font-bold font-cairo leading-snug">{item.question}</p>
                    </div>
                  </motion.div>

                  {/* Bot Reply Card */}
                  <AnimatePresence mode="popLayout">
                    {activeTab === index && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-start gap-3 self-start max-w-[90%]"
                      >
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-black text-[10px] font-black shrink-0">M</div>
                        <div className="flex flex-col items-start gap-2">
                          <div className="p-6 rounded-[1.8rem] rounded-tl-none bg-white/[0.03] border border-white/[0.05] text-white/90 shadow-2xl">
                            <p className="text-sm md:text-base font-cairo leading-relaxed">{item.answer}</p>
                          </div>
                          <div className="flex items-center gap-2 px-2">
                             <CheckCheck size={14} className="text-primary" />
                             <span className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em]">Solution Delivered</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </LayoutGroup>

            {/* Typing Indicator */}
            <div 
              ref={typingRef}
              style={{ display: 'none' }}
              className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] p-3 px-5 rounded-2xl w-fit"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-[9px] text-primary/80 font-black uppercase tracking-widest">AI is thinking...</span>
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="p-6 bg-white/[0.01] border-t border-white/[0.05]">
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="flex-1 h-14 bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 flex items-center justify-end text-white/20 text-xs font-cairo italic">
                اختر سؤالاً للحصول على إجابة فورية...
              </div>
              <button className="w-14 h-14 rounded-2xl bg-primary text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                <Send size={20} className="rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}