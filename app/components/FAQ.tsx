"use client"
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MessageCircle, User, Send, CheckCheck } from "lucide-react";

const faqData = [
  {
    question: "بتستغرق كام وقت عشان تخلص مشروع؟",
    answer: "حسب حجم المشروع، بس غالباً المواقع التعريفية بتاخد من أسبوع لـ 10 أيام، والأنظمة المعقدة من شهر لـ 3 شهور. دايماً بهتم بالجودة قبل أي حاجة."
  },
  {
    question: "إيه التقنيات اللي بتستخدمها؟",
    answer: "أنا متخصص في Next.js 15 و React مع Tailwind CSS. وللأنظمة المعقدة بستخدم Node.js و PostgreSQL مع Prisma."
  },
  {
    question: "هل بتقدم دعم فني بعد التسليم؟",
    answer: "أكيد! بوفر دعم فني مجاني لمدة شهر بعد الإطلاق عشان أتأكد إن كل حاجة ماشية تمام، وفي باقات للصيانة الدورية لو حابب."
  },
  {
    question: "إزاي نقدر نبدأ نشتغل مع بعض؟",
    answer: "تقدر تضغط على زر 'اتصل بي' أو تبعتلي رسالة هنا، وهرد عليك في أقل من 24 ساعة عشان نحدد ميعاد لمكالمة اكتشاف (Discovery Call)."
  }
];

export default function InteractiveFAQ() {
  const [activeTab, setActiveTab] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 bg-black relative overflow-hidden font-extrabold ">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* عنوان السكشن */}
        <div className="text-center mb-20 space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-400 text-xs font-mono"
          >
            <MessageCircle size={14} /> حوار مباشر
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-white font-arabic">
            أسئلة <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">متكررة</span>
          </h2>
        </div>

        {/* واجهة الشات */}
        <div className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* Header بتاع الشات */}
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-black text-white italic text-xl border border-white/20">
                  M
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d0d0d]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">MoJimmy</h4>
                <p className="text-green-500 text-[10px] font-mono">متصل الآن (بذكاء اصطناعي)</p>
              </div>
            </div>
          </div>

          {/* منطقة الرسائل */}
          <div className="p-6 md:p-10 space-y-8 min-h-[500px]">
            {faqData.map((item, index) => (
              <div key={index} className="space-y-4">
                {/* سؤال المستخدم */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  onClick={() => setActiveTab(index)}
                  className={`flex flex-row-reverse items-start gap-3 cursor-pointer group`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                    <User size={16} />
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl rounded-tr-none bg-white/5 border border-white/10 text-white text-sm md:text-base font-arabic transition-all ${activeTab === index ? 'border-purple-500/50 bg-purple-500/5' : ''}`}>
                    {item.question}
                  </div>
                </motion.div>

                {/* رد MoJimmy */}
                <AnimatePresence>
                  {activeTab === index && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white text-[10px] font-black italic">
                        M
                      </div>
                      <div className="max-w-[85%] space-y-2">
                        <div className="p-4 rounded-2xl rounded-tl-none bg-purple-600 text-white text-sm md:text-base font-arabic shadow-[0_10px_30px_-10px_rgba(147,51,234,0.5)]">
                          {item.answer}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-white/20 font-mono">
                          <CheckCheck size={12} className="text-blue-500" /> قرأت الآن
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Input وهمي للجمال */}
          <div className="p-6 border-t border-white/5 bg-white/[0.01] flex items-center gap-4">
            <div className="flex-1 h-12 bg-white/5 border border-white/10 rounded-full px-6 flex items-center text-white/20 text-sm font-arabic italic">
              اضغط على أي سؤال بالأعلى للدردشة...
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white opacity-50">
              <Send size={20} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}