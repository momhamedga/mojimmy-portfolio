"use client"
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Github, Terminal, X } from "lucide-react";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  // مصفوفة المشاريع - استخدمتها هنا عشان نربط البحث
  const projects = useMemo(() => [
    { title: "E-Commerce OS", tag: "Next.js 15", link: "#projects" },
    { title: "AI Studio", tag: "OpenAI", link: "#projects" },
    { title: "Fintech App", tag: "Web3", link: "#projects" },
  ], []);

  // دالة الفتح والغلق
  const togglePalette = useCallback(() => setIsOpen(prev => !prev), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        togglePalette();
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [togglePalette]);

  // فلترة النتائج
  const filteredItems = projects.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );
// 1. أضف حالة للتحكم في العنصر المختار بالأسهم
const [selectedIndex, setSelectedIndex] = useState(0);

// 2. دالة التنفيذ (Action Handler)
const executeAction = useCallback((action: any) => {
  if (action.type === "scroll") {
    const element = document.getElementById(action.target);
    element?.scrollIntoView({ behavior: "smooth" });
  } else if (action.type === "link") {
    window.open(action.url, "_blank");
  }
  setIsOpen(false); // اقفل اللوحة بعد التنفيذ
}, []);

// 3. دعم الأسهم في الكيبورد
useEffect(() => {
  const handleArrows = (e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      executeAction(filteredItems[selectedIndex]);
    }
  };
  window.addEventListener("keydown", handleArrows);
  return () => window.removeEventListener("keydown", handleArrows);
}, [isOpen, filteredItems, selectedIndex, executeAction]);
  return (
    <>
      {/* زر عائم للموبايل (عشان مفيش Ctrl+K) */}
      <button 
        onClick={togglePalette}
        className="fixed bottom-6 right-6 z-[100] p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white md:hidden active:scale-90 transition-transform"
      >
        <Terminal size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-start justify-center pt-[15vh] px-4 sm:px-0">
            {/* الخلفية (Overlay) - محسنة لسفاري */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md supports-[backdrop-filter]:bg-black/20"
            />

            {/* الحاوية الرئيسية */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="flex items-center px-4 py-4 border-b border-white/5">
                <Search className="text-white/40 mr-3" size={20} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="تبحث عن ماذا يا MoJimmy؟"
                  className="flex-1 bg-transparent border-none outline-none text-white text-base placeholder:text-white/20"
                />
                <kbd className="hidden md:block bg-white/5 px-2 py-1 rounded text-[10px] text-white/40 border border-white/10">ESC</kbd>
                <button onClick={() => setIsOpen(false)} className="md:hidden text-white/40"><X size={20}/></button>
              </div>

              <div className="p-2 max-h-[60vh] overflow-y-auto scrollbar-hide">
                <div className="px-2 py-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">المشاريع المقترحة</div>
             {filteredItems.map((item, i) => (
  <motion.div
    key={i}
    onMouseEnter={() => setSelectedIndex(i)} // عشان الماوس والأسهم يشتغلوا مع بعض
    onClick={() => executeAction(item)}
    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all duration-200 ${
      selectedIndex === i 
        ? "bg-white/10 translate-x-1 border-l-2 border-blue-500" 
        : "hover:bg-white/5"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg transition-colors ${
        selectedIndex === i ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/60"
      }`}>
        <Globe size={18} />
      </div>
      <span className={`font-medium transition-colors ${
        selectedIndex === i ? "text-white" : "text-white/70"
      }`}>
        {item.title}
      </span>
    </div>
    
    {/* علامة Enter تظهر فقط للعنصر المختار */}
    {selectedIndex === i && (
      <motion.span 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="text-[10px] text-white/20 italic"
      >
        Press Enter ↵
      </motion.span>
    )}
  </motion.div>
))}

                <div className="mt-4 px-2 py-2 text-[10px] font-bold text-white/20 uppercase tracking-widest border-t border-white/5">روابط سريعة</div>
                <div className="grid grid-cols-2 gap-2 p-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer text-white/60 hover:text-white transition-all border border-transparent hover:border-white/5">
                    <Github size={18} /> <span>GitHub</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer text-white/60 hover:text-white transition-all border border-transparent hover:border-white/5">
                    <Terminal size={18} /> <span>Resume</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-white/[0.02] px-4 py-3 flex items-center justify-between border-t border-white/5 md:flex hidden">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/30"><span className="bg-white/10 px-1.5 py-0.5 rounded">↑↓</span> للتنقل</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/30"><span className="bg-white/10 px-1.5 py-0.5 rounded">↵</span> للاختيار</div>
                </div>
                <div className="text-[10px] text-blue-500/50 font-mono">MoJimmy OS v1.0</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
