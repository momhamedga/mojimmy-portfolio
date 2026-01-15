"use client"
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, memo } from "react";
import { Beaker, Terminal, Play, Sparkles, Copy, Check } from "lucide-react";

// نقل البيانات خارج المكون لمنع إعادة التعريف
const experiments = [
  {
    id: 1,
    title: "Magnetic Button Logic",
    language: "TS",
    code: `const moveBtn = (e) => {
  const { x, y } = getMousePos(e);
  setPos({ x: x * 0.2, y: y * 0.2 });
};`,
    preview: "تأثير مغناطيسي يتبع الماوس بسلاسة.",
    color: "from-purple-500 to-blue-500"
  },
  {
    id: 2,
    title: "AI Prompt Streamer",
    language: "React",
    code: `useEffect(() => {
  const interval = setInterval(() => {
    setChars(p => p + text[i]);
  }, 50);
}, []);`,
    preview: "محاكاة كتابة الذكاء الاصطناعي.",
    color: "from-emerald-500 to-cyan-500"
  },
  {
    id: 3,
    title: "Glassy Shader Math",
    language: "GLSL",
    code: `float noise = snoise(vUv * 10.0);
gl_FragColor = vec4(vec3(noise), 1.0);`,
    preview: "خوارزمية تشويش بصري زجاجي.",
    color: "from-pink-500 to-orange-500"
  }
];

// مكون فرعي للأداء العالي (Sidebar Item)
const SidebarItem = memo(({ exp, isSelected, onClick }: any) => (
  <motion.div
    onClick={() => onClick(exp)}
    whileTap={{ scale: 0.98 }}
    className={`p-5 rounded-2xl cursor-pointer border transition-all duration-300 group ${
      isSelected ? "bg-white/10 border-purple-500/40 shadow-lg shadow-purple-500/5" : "bg-white/[0.02] border-white/5 hover:bg-white/5"
    }`}
  >
    <div className="flex justify-between items-center flex-row-reverse mb-1">
      <span className="text-[9px] font-mono text-gray-500 tracking-widest">{exp.language}</span>
      {isSelected && <Sparkles size={12} className="text-purple-400" />}
    </div>
    <h4 className="text-sm font-bold text-white text-right">{exp.title}</h4>
  </motion.div>
));

SidebarItem.displayName = "SidebarItem";

export default function CodeLaboratory() {
  const [selected, setSelected] = useState(experiments[0]);
  const [copied, setCopied] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // تحسين أداء النسخ
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(selected.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [selected.code]);

  // تحسين أداء تتبع الماوس باستخدام useCallback
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (selected.id !== 1) return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    setMousePos({
      x: (clientX - left - width / 2) * 0.25,
      y: (clientY - top - height / 2) * 0.25
    });
  }, [selected.id]);

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden font-arabic" dir="rtl">
      {/* شبكة خلفية خفيفة جداً (CSS Only) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-16 tracking-tighter">
          THE CODE <span className="text-purple-500">LAB</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            {experiments.map((exp) => (
              <SidebarItem 
                key={exp.id} 
                exp={exp} 
                isSelected={selected.id === exp.id} 
                onClick={setSelected} 
              />
            ))}
          </div>

          {/* Main Lab Window */}
          <div className="lg:col-span-8 bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
            {/* Window Top Bar */}
            <div className="p-4 bg-white/5 flex items-center justify-between flex-row-reverse border-b border-white/5">
              <div className="flex gap-1.5">
                {[1, 2, 3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/10" />)}
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
                <span className="text-[10px] font-mono text-gray-500">{selected.title.toLowerCase()}.ts</span>
              </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
              {/* Code Side */}
              <div className="p-6 font-mono text-[13px] bg-black/20 border-l border-white/5" dir="ltr">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-purple-400/90 leading-relaxed"
                  >
                    <code>{selected.code}</code>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Interaction Side */}
              <div 
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
                className="p-8 flex flex-col items-center justify-center relative bg-gradient-to-br from-transparent to-purple-500/5 min-h-[300px]"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected.id}
                    style={{ x: mousePos.x, y: mousePos.y }}
                    className="relative z-10 p-6 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl text-center"
                  >
                    <Play className="text-white mx-auto mb-3 opacity-50" size={20} />
                    <p className="text-white text-[11px] leading-relaxed opacity-80">{selected.preview}</p>
                  </motion.div>
                </AnimatePresence>
                {/* Glow Effect (GPU Accelerated) */}
                <div className={`absolute w-24 h-24 rounded-full bg-gradient-to-br ${selected.color} blur-[50px] opacity-10`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}