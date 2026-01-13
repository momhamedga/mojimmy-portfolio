"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "ما هي التقنيات التي تستخدمها في مشاريعك؟",
    answer: "أعتمد بشكل أساسي على Next.js 15 و React مع Tailwind CSS للتنسيق، و Framer Motion للتحريك، و TypeScript لضمان كود قوي واحترافي."
  },
  {
    question: "كم يستغرق بناء موقع بورتفوليو احترافي؟",
    answer: "يعتمد ذلك على المتطلبات، ولكن عادة ما يستغرق من أسبوع إلى أسبوعين للوصول إلى هذه الدرجة من الفخامة والـ Polishing."
  },
  {
    question: "هل تقدم خدمات الصيانة بعد انتهاء المشروع؟",
    answer: "بالتأكيد، أوفر دعماً فنياً كاملاً لضمان عمل الموقع بأفضل كفاءة وتحديث التقنيات المستخدمة باستمرار."
  }
];

export default function FAQ() {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 bg-transparent relative overflow-hidden" dir="rtl">
      <div className="container mx-auto px-6">
        
        {/* عنوان السكشن بتنسيق UHD */}
        <div className="max-w-3xl mb-24">
          <motion.h2 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter"
          >
            أسئلة <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              متكررة
            </span>
          </motion.h2>
          <p className="text-gray-500 text-xl font-medium border-r-2 border-purple-500/30 pr-4">كل ما تحتاج معرفته عن كيفية العمل معاً.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              layout // إضافة خاصية Layout للحركة الناعمة
              className={`border transition-all duration-500 rounded-[2.5rem] overflow-hidden backdrop-blur-md ${
                activeId === index 
                ? "border-purple-500/30 bg-white/[0.04] shadow-[0_20px_40px_rgba(0,0,0,0.3)]" 
                : "border-white/5 bg-white/[0.01] hover:bg-white/[0.02]"
              }`}
            >
              <button
                onClick={() => setActiveId(activeId === index ? null : index)}
                className="w-full p-8 md:p-10 flex items-center justify-between text-right transition-all group"
              >
                <span className={`text-xl md:text-3xl font-bold tracking-tight transition-colors duration-300 ${
                  activeId === index ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}>
                  {faq.question}
                </span>
                
                <motion.div
                  animate={{ 
                    rotate: activeId === index ? 45 : 0, 
                    backgroundColor: activeId === index ? "rgba(168, 85, 247, 0.2)" : "rgba(255, 255, 255, 0.05)" 
                  }}
                  className="p-3 rounded-full text-white"
                >
                  <Plus size={24} />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeId === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="px-10 pb-10 text-gray-400 text-lg md:text-xl leading-relaxed border-t border-white/5 pt-6 font-medium">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}