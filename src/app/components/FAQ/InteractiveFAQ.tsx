"use client"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  MessageCircle, User, Send, CheckCheck, 
  Wifi, Search, Info, MoreVertical 
} from "lucide-react";
import { FAQ_DATA } from "@/src/constants/faq-data";

export default function InteractiveFAQ() {
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // عمل Scroll تلقائي لآخر الرد عند تفعيله
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [activeTab, isTyping]);

  const handleSelectQuestion = (index: number) => {
    if (activeTab === index) return;
    setActiveTab(null);
    setIsTyping(true);
    
    // محاكاة تأخير الرد لزيادة الواقعية
    setTimeout(() => {
      setActiveTab(index);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <section id="faq" className="py-24 md:py-32 relative overflow-hidden selection:bg-purple-500/30">
      {/* تأثيرات إضاءة خلفية خلف الشات */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-right mb-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-purple-400 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Support Bot v2.0
          </motion.div>
          <h2 className="text-4xl md:text-7xl font-black text-white font-arabic leading-tight tracking-tighter">
            دردشة <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-400 via-pink-500 to-purple-600">ذكية</span>
          </h2>
        </div>

        {/* Chat Container */}
        <div className="bg-[#050505] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[750px] relative transition-all duration-500 hover:border-white/20">
          
          {/* Custom Scrollbar Styles - مدمجة داخل المكون */}
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(168, 85, 247, 0.2);
              border-radius: 20px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(168, 85, 247, 0.5);
            }
            /* إخفاء الـ Highlight الأزرق في الموبايل */
            * { -webkit-tap-highlight-color: transparent; }
          `}</style>

          {/* Chat Header */}
          <div className="p-5 md:p-7 border-b border-white/5 bg-white/[0.01] backdrop-blur-md flex items-center justify-between flex-row-reverse relative z-20">
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="relative group cursor-help">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-black text-white italic text-xl shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                  M
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-[#050505]" />
              </div>
              <div className="text-right">
                <h4 className="text-white font-bold text-base md:text-lg tracking-wide">MoJimmy Bot</h4>
                <div className="flex items-center justify-end gap-1.5 text-green-500/80 text-[10px] md:text-xs">
                  <span className="font-arabic">متاح للإجابة</span>
                  <Wifi size={12} className="animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button className="p-3 rounded-xl bg-white/[0.03] text-gray-500 hover:text-white transition-all"><Search size={18} /></button>
               <button className="p-3 rounded-xl bg-white/[0.03] text-gray-500 hover:text-white transition-all"><MoreVertical size={18} /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-5 md:p-10 space-y-12 custom-scrollbar scroll-smooth relative"
          >
            <LayoutGroup>
              {FAQ_DATA.map((item, index) => (
                <div key={index} className="flex flex-col gap-6">
                  {/* User Question */}
                  <motion.div 
                    layout
                    onClick={() => handleSelectQuestion(index)}
                    whileTap={{ scale: 0.98, opacity: 0.8 }}
                    className="flex flex-row-reverse items-start gap-4 cursor-pointer group self-end max-w-[92%] md:max-w-[75%]"
                  >
                    <div className="flex flex-col items-end gap-2">
                      <div className={`p-5 rounded-[2rem] rounded-br-none text-right transition-all duration-500 border shadow-lg ${activeTab === index ? 'bg-white text-black border-white' : 'bg-[#111] text-gray-300 border-white/5 group-hover:border-purple-500/30'}`}>
                        <p className="text-sm md:text-base font-arabic font-bold leading-relaxed">{item.question}</p>
                      </div>
                      <div className="flex items-center gap-2 px-2">
                         <span className="text-[9px] text-gray-600 font-mono tracking-tighter uppercase">{item.timestamp}</span>
                         <div className="w-1 h-1 rounded-full bg-gray-800" />
                         <span className="text-[9px] text-gray-500 font-arabic">أنت</span>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-500 shrink-0 group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-all">
                      <User size={16} />
                    </div>
                  </motion.div>

                  {/* Bot Response */}
                  <AnimatePresence mode="wait">
                    {activeTab === index && (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-start gap-4 self-start max-w-[95%] md:max-w-[85%]"
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white text-xs font-black italic shrink-0 shadow-xl shadow-purple-950/20 border border-white/10">
                          M
                        </div>
                        <div className="flex flex-col items-start gap-2">
                          <div className="p-6 rounded-[2.2rem] rounded-tl-none bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-purple-500/20 text-gray-100 shadow-2xl relative overflow-hidden group">
                            {/* تأثير خلفية خافت داخل الفقاعة */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full" />
                            <p className="text-sm md:text-base font-arabic leading-loose font-medium relative z-10">
                              {item.answer}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 px-3">
                            <div className="flex items-center gap-1">
                               <CheckCheck size={14} className="text-blue-500" />
                               <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Seen</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-800" />
                            <button className="text-[9px] text-purple-400 hover:underline font-arabic">نسخ الإجابة</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </LayoutGroup>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 bg-purple-500/5 border border-purple-500/10 w-fit px-5 py-3 rounded-full"
                >
                  <div className="flex gap-1.5">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  </div>
                  <span className="text-[10px] text-purple-300 font-arabic font-medium">جاري معالجة طلبك...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Fake Input Bar */}
          <div className="p-6 md:p-8 bg-black/40 backdrop-blur-xl border-t border-white/5 relative z-20">
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="flex-1 group relative">
                <div className="absolute inset-0 bg-purple-500/5 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative h-14 bg-white/[0.02] border border-white/10 rounded-2xl px-6 flex items-center justify-end text-gray-500 text-xs md:text-sm font-arabic transition-all group-focus-within:border-purple-500/40">
                  <span className="opacity-60 italic">اضغط على أي سؤال بالأعلى للبدء...</span>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)" }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg transition-all"
              >
                <Send size={22} className="rotate-180" />
              </motion.button>
            </div>
            
            {/* Quick Tips */}
            <div className="mt-4 flex justify-center gap-6">
                <div className="flex items-center gap-1.5 text-[9px] text-gray-600">
                    <Info size={10} />
                    <span className="font-arabic">ردود فورية مدعومة ببياناتي</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}