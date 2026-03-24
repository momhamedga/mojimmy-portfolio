"use client"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  User, Send, CheckCheck, 
  Wifi, Search, Info, MoreVertical 
} from "lucide-react";
import { FAQ_DATA } from "@/src/constants/faq-data";
import { cn } from "@/src/lib/utils"; // اللي لسه مثبتينه يا بيه

export default function InteractiveFAQ() {
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ذكي: بيستهدف الفقاعة الجديدة بالضبط
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollHeight = scrollContainerRef.current.scrollHeight;
      scrollContainerRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth"
      });
    }
  }, [activeTab, isTyping]);

  const handleSelectQuestion = (index: number) => {
    if (activeTab === index || isTyping) return;
    setIsTyping(true);
    // تأخير واقعي يحسس اليوزر إن الـ Bot "بيفكر" فعلاً
    setTimeout(() => {
      setActiveTab(index);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <section id="faq" className="py-28 md:py-48 relative overflow-hidden  selection:bg-purple-500/30">
      {/* Background Glows Cinematic */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-r from-purple-600/10 via-transparent to-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header Cinematic */}
        <div className="text-right mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 text-purple-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]"
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

        {/* Chat Interface (The Ultra-Modern Shell) */}
        <div className="bg-[#080808] border border-white/[0.08] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[700px] md:h-[800px] relative backdrop-blur-3xl group transform-gpu">
          
          {/* Chat Header */}
          <div className="p-6 md:p-8 border-b border-white/[0.05] bg-white/[0.02] backdrop-blur-2xl flex items-center justify-between flex-row-reverse relative z-30">
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="relative group cursor-pointer">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.2rem] bg-gradient-to-tr from-purple-600 via-blue-600 to-emerald-500 flex items-center justify-center font-black text-white italic text-2xl shadow-2xl shadow-purple-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  M
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-[#080808] z-10" />
              </div>
              <div className="text-right">
                <h4 className="text-white font-black font-cairo text-lg md:text-xl tracking-tight">MoJimmy Intelligence</h4>
                <div className="flex items-center justify-end gap-1.5 text-green-500/80 text-[10px] font-bold">
                  <span className="font-cairo uppercase">Online Engine</span>
                  <Wifi size={12} className="animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <button className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"><Search size={18} /></button>
               <button className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"><MoreVertical size={18} /></button>
            </div>
          </div>

          {/* Messages Feed */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 scrollbar-hide scroll-smooth relative"
          >
            <LayoutGroup>
              {FAQ_DATA.map((item, index) => (
                <div key={index} className="flex flex-col gap-8">
                  {/* User Message (Question) */}
                  <motion.div 
                    layout
                    onClick={() => handleSelectQuestion(index)}
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "flex flex-row-reverse items-start gap-4 cursor-pointer self-end max-w-[90%] md:max-w-[80%] transition-opacity duration-500",
                      activeTab !== index && activeTab !== null && "opacity-40 hover:opacity-100"
                    )}
                  >
                    <div className="flex flex-col items-end gap-3">
                      <div className={cn(
                        "p-6 md:p-8 rounded-[2.5rem] rounded-br-none text-right border transition-all duration-700 shadow-2xl transform-gpu",
                        activeTab === index 
                          ? 'bg-white text-black border-white' 
                          : 'bg-[#121212] text-white/70 border-white/[0.05] hover:border-purple-500/40'
                      )}>
                        <p className="text-base md:text-lg font-bold font-cairo leading-relaxed">{item.question}</p>
                      </div>
                      <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] px-2">{item.timestamp} • You</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/40 shrink-0 group-hover:bg-purple-500/20 transition-all">
                      <User size={18} />
                    </div>
                  </motion.div>

                  {/* Bot Reply (Answer) */}
                  <AnimatePresence mode="wait">
                    {activeTab === index && (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="flex items-start gap-5 self-start max-w-[95%] md:max-w-[85%]"
                      >
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-700 to-indigo-800 flex items-center justify-center text-white text-sm font-black italic shrink-0 shadow-2xl border border-white/20 shadow-purple-500/20">
                          M
                        </div>
                        <div className="flex flex-col items-start gap-3">
                          <div className="p-8 md:p-10 rounded-[2.8rem] rounded-tl-none bg-gradient-to-br from-[#181818] to-[#0a0a0a] border border-white/[0.05] text-white/90 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden ring-1 ring-purple-500/10">
                            <p className="text-base md:text-xl font-cairo leading-[1.8] relative z-10 antialiased">
                              {item.answer}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 px-4">
                            <div className="flex items-center gap-1.5">
                               <CheckCheck size={16} className="text-blue-500" />
                               <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Delivered</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <button className="text-[10px] text-purple-400/60 hover:text-purple-400 font-black uppercase tracking-widest transition-colors">Copy Link</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </LayoutGroup>

            {/* Typing Indicator (The Neural Pulse) */}
            <AnimatePresence>
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-4 bg-purple-500/[0.03] border border-purple-500/10 w-fit px-6 py-4 rounded-full backdrop-blur-md"
                >
                  <div className="flex gap-2">
                    {[0, 0.2, 0.4].map((delay) => (
                      <motion.span 
                        key={delay}
                        animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }} 
                        transition={{ repeat: Infinity, duration: 1.2, delay }} 
                        className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-purple-400/80 font-black font-cairo uppercase tracking-widest">Neural Processing</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Bar (Visual Only) */}
          <div className="p-8 md:p-12 bg-black/80 backdrop-blur-3xl border-t border-white/[0.05] relative z-40">
            <div className="flex items-center gap-5 flex-row-reverse">
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-all duration-700" />
                <div className="relative h-16 bg-white/[0.02] border border-white/10 rounded-[1.5rem] px-8 flex items-center justify-end text-white/30 text-sm font-cairo transition-all group-hover:border-white/20 group-focus-within:border-purple-500/50">
                  <span className="italic opacity-60">اختر سؤالاً للحصول على إجابة ذكية...</span>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl transition-all"
              >
                <Send size={24} className="rotate-180" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}