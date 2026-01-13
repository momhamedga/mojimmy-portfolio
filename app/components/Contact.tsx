"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Sparkles, ArrowLeft, AlertCircle } from "lucide-react"; 
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
    <section id="contact" dir="rtl" className="py-24 bg-transparent relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} // تحسين الأداء: الحركة تحدث مرة واحدة فقط
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
              >
                {/* Left Side: Content */}
                <div className="space-y-6 text-right lg:text-right">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 font-mono text-[10px] uppercase tracking-widest"
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    هل لديك فكرة؟
                  </motion.div>
                  
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter">
                    لنصنع <br /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                       شيئاً مذهلاً
                    </span>
                  </h2>
                  <p className="text-gray-400 text-lg md:text-xl max-w-md font-medium leading-relaxed border-r-2 border-white/10 pr-6">
                    أنا لا أبني مجرد مواقع، أنا أبني تجارب رقمية تترك أثراً. كيف يمكنني مساعدتك اليوم؟
                  </p>
                </div>

                {/* Right Side: Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-8 bg-white/[0.03] p-8 md:p-12 rounded-[2.5rem] border border-white/10 backdrop-blur-xl relative shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] -z-10" />
                  
                  {[
                    { name: "name", label: "اسمك الكريم", type: "text" },
                    { name: "email", label: "البريد الإلكتروني", type: "email" }
                  ].map((field) => (
                    <div key={field.name} className="relative group">
                      <input
                        name={field.name}
                        type={field.type}
                        onFocus={() => {setFocusedField(field.name); setErrors({...errors, [field.name]: ""})}}
                        onBlur={(e) => !e.target.value && setFocusedField(null)}
                        className={`w-full bg-transparent border-b-2 py-4 text-white text-lg outline-none transition-all duration-500 ${errors[field.name] ? 'border-red-500/50' : 'border-white/10 focus:border-purple-500'}`}
                        placeholder=" "
                      />
                      <label className={`absolute right-0 transition-all duration-300 pointer-events-none ${focusedField === field.name ? "-top-4 text-xs text-purple-400 font-bold" : "top-4 text-lg text-gray-500"}`}>
                        {field.label}
                      </label>
                      <AnimatePresence>
                        {errors[field.name] && (
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[10px] mt-2 flex items-center gap-1 font-mono uppercase tracking-tighter">
                            <AlertCircle size={12} /> {errors[field.name]}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  <div className="relative group">
                    <textarea
                      name="message"
                      rows={2}
                      onFocus={() => {setFocusedField("message"); setErrors({...errors, message: ""})}}
                      onBlur={(e) => !e.target.value && setFocusedField(null)}
                      className={`w-full bg-transparent border-b-2 py-4 text-white text-lg outline-none transition-all duration-500 resize-none ${errors.message ? 'border-red-500/50' : 'border-white/10 focus:border-purple-500'}`}
                      placeholder=" "
                    />
                    <label className={`absolute right-0 transition-all duration-300 pointer-events-none ${focusedField === "message" ? "-top-4 text-xs text-purple-400 font-bold" : "top-4 text-lg text-gray-500"}`}>
                      أخبرني عن مشروعك...
                    </label>
                  </div>

                  <Magnetic>
                    <button 
                      disabled={isSubmitting}
                      className="group relative w-full py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white rounded-2xl font-black text-xl overflow-hidden shadow-xl hover:shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isSubmitting ? "يتم الآن الإرسال..." : "أرسل الرسالة"} 
                        <Send size={20} className="group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                    </button>
                  </Magnetic>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center space-y-8 py-20"
              >
                <div className="w-32 h-32 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                  <CheckCircle2 size={60} className="text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-5xl font-black text-white italic">تم الإرسال!</h3>
                  <p className="text-gray-400 text-xl">سأرد عليك في أقرب وقت ممكن.</p>
                </div>
                <button onClick={() => setIsSuccess(false)} className="text-purple-400 hover:text-white transition-colors underline underline-offset-8">
                  إرسال رسالة أخرى
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}