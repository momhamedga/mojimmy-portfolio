"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Sparkles, AlertCircle, Mail, User, MessageSquare } from "lucide-react"; 
import Magnetic from "./Magnetic";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  async function handleSubmit(event: any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const newErrors: { [key: string]: string } = {};
    if (!formData.get("name")) newErrors.name = "أخبرني باسمك الكريم";
    if (!formData.get("email")) newErrors.email = "أحتاج بريدك للإجابة عليك";
    if (!formData.get("message")) newErrors.message = "لا تترك المساحة فارغة";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); 
    setIsSubmitting(true);
    formData.append("access_key", "b02db0d8-32b5-41cc-b422-6bc4440cdcd5");
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: json
      });
      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        event.target.reset();
      }
    } catch (e) { console.error(e); } 
    finally { setIsSubmitting(false); }
  }

  return (
    <section id="contact" dir="rtl" className="py-32 bg-transparent relative min-h-screen flex items-center overflow-hidden">
      
      {/* 1. التوهج الخلفي - تم ضبطه ليكون خفيفاً حتى لا يحجب الـ Grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
              >
                {/* الجزء الأيمن: النصوص */}
                <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-purple-400 font-mono text-[10px] tracking-widest uppercase"
                  >
                    <Sparkles size={16} className="animate-spin-slow" />
                    <span>متاح للمشاريع الجديدة</span>
                  </motion.div>
                  
                  <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter italic">
                    هل أنت <br /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                        جاهز للبدء؟
                    </span>
                  </h2>
                  
                  <div className="space-y-6">
                    <p className="text-gray-400 text-xl max-w-md font-medium leading-relaxed">
                      حوّل فكرتك إلى واقع رقمي يتنفس. سأقوم بالرد عليك خلال أقل من 24 ساعة.
                    </p>
                    
                    <div className="pt-8 flex flex-col gap-4">
                        <div className="flex items-center gap-4 group cursor-pointer w-fit">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                <Mail className="text-gray-400 group-hover:text-purple-400" size={20} />
                            </div>
                            <span className="text-gray-300 font-mono group-hover:text-white transition-colors">hello@mojimmy.com</span>
                        </div>
                    </div>
                  </div>
                </div>

                {/* الجزء الأيسر: الفورم */}
                <div className="relative group">
                  {/* توهج ديناميكي يتغير لونه حسب الحقل المختار */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${focusedField === 'email' ? 'from-blue-500' : focusedField === 'message' ? 'from-pink-500' : 'from-purple-500'} to-transparent rounded-[3rem] blur opacity-10 transition duration-1000`} />
                  
                  <form 
                    onSubmit={handleSubmit} 
                    noValidate 
                    className="relative space-y-8 bg-white/[0.02] p-10 md:p-14 rounded-[3rem] border border-white/10 backdrop-blur-md"
                  >
                    {/* حقل الاسم */}
                    <div className="relative">
                      <div className={`flex items-center gap-4 border-b transition-all duration-500 ${focusedField === 'name' ? 'border-purple-500' : 'border-white/10'}`}>
                        <User size={18} className={focusedField === 'name' ? 'text-purple-500' : 'text-gray-500'} />
                        <input
                          name="name"
                          type="text"
                          autoComplete="off"
                          onFocus={() => {setFocusedField("name"); setErrors({...errors, name: ""})}}
                          onBlur={(e) => !e.target.value && setFocusedField(null)}
                          className="w-full bg-transparent py-5 text-white text-lg outline-none placeholder:text-gray-700 font-medium"
                          placeholder="ما هو اسمك؟"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.name && (
                          <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="absolute -bottom-6 right-0 text-red-400 text-[10px] flex items-center gap-1 font-bold">
                            <AlertCircle size={12} /> {errors.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* حقل الايميل */}
                    <div className="relative">
                      <div className={`flex items-center gap-4 border-b transition-all duration-500 ${focusedField === 'email' ? 'border-blue-500' : 'border-white/10'}`}>
                        <Mail size={18} className={focusedField === 'email' ? 'text-blue-500' : 'text-gray-500'} />
                        <input
                          name="email"
                          type="email"
                          autoComplete="off"
                          onFocus={() => {setFocusedField("email"); setErrors({...errors, email: ""})}}
                          onBlur={(e) => !e.target.value && setFocusedField(null)}
                          className="w-full bg-transparent py-5 text-white text-lg outline-none placeholder:text-gray-700 font-medium"
                          placeholder="بريدك الإلكتروني"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="absolute -bottom-6 right-0 text-red-400 text-[10px] flex items-center gap-1 font-bold">
                            <AlertCircle size={12} /> {errors.email}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* حقل الرسالة */}
                    <div className="relative">
                      <div className={`flex items-start gap-4 border-b transition-all duration-500 ${focusedField === 'message' ? 'border-pink-500' : 'border-white/10'}`}>
                        <MessageSquare size={18} className={`mt-6 ${focusedField === 'message' ? 'text-pink-500' : 'text-gray-500'}`} />
                        <textarea
                          name="message"
                          rows={3}
                          onFocus={() => {setFocusedField("message"); setErrors({...errors, message: ""})}}
                          onBlur={(e) => !e.target.value && setFocusedField(null)}
                          className="w-full bg-transparent py-5 text-white text-lg outline-none resize-none placeholder:text-gray-700 font-medium"
                          placeholder="احكِ لي عن مشروعك المذهل..."
                        />
                      </div>
                    </div>

                    <Magnetic>
                      <button 
                        disabled={isSubmitting}
                        className="group relative w-full py-6 bg-white text-black rounded-2xl font-black text-xl overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors duration-500">
                          {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب الآن"} 
                          <Send size={22} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-500" />
                        </span>
                      </button>
                    </Magnetic>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center space-y-10 py-20"
              >
                <div className="relative">
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        transition={{ type: "spring", damping: 12 }}
                        className="w-40 h-40 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.3)]"
                    >
                      <CheckCircle2 size={80} className="text-white" />
                    </motion.div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-6xl font-black text-white italic tracking-tighter">وصلت الرسالة!</h3>
                  <p className="text-gray-400 text-2xl max-w-md mx-auto">أشكرك على ثقتك. سأقوم بمراجعة طلبك والرد عليك قريباً.</p>
                </div>

                <button 
                    onClick={() => setIsSuccess(false)} 
                    className="px-8 py-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all font-bold text-xs uppercase tracking-widest"
                >
                  العودة للخلف
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}