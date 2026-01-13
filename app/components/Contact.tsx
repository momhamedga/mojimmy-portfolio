"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Sparkles, ArrowLeft, AlertCircle } from "lucide-react"; 
import Magnetic from "./Magnetic"; // تأكدي أن المسار صحيح

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  async function handleSubmit(event: any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const newErrors: { [key: string]: string } = {};
    const email = formData.get("email") as string;

    if (!formData.get("name")) newErrors.name = "أخبرني باسمك الكريم";
    if (!email) {
      newErrors.email = "أحتاج بريدك للإجابة عليك";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "هذا البريد يبدو غير صحيح";
    }
    if (!formData.get("message")) newErrors.message = "لا تترك المساحة فارغة";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); 
    setIsSubmitting(true);
    // تأكدي من استبدال الـ Key بالخاص بك إذا تغير
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
    } catch (e) { 
      console.error(e);
      setErrors({ server: "حدث خطأ ما، يرجى المحاولة لاحقاً" });
    } finally { 
      setIsSubmitting(false); 
    }
  }

  return (
    <section id="contact" dir="rtl" className="py-32 bg-transparent relative min-h-screen flex items-center overflow-hidden">
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
              >
                <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 font-mono text-[10px] uppercase tracking-widest"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    لديك فكرة؟ لنناقشها
                  </motion.div>
                  
                  <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter">
                    لنصنع <br /> <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 via-purple-500 to-pink-500">شيئاً مذهلاً</span>
                  </h2>
                  <p className="text-gray-400 text-xl max-w-md font-medium leading-relaxed border-r-2 border-white/5 pr-6">
                    أنا لا أبني مجرد مواقع، أنا أبني تجارب رقمية تترك أثراً. كيف يمكنني مساعدتك اليوم؟
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-10 bg-white/[0.01] p-8 md:p-12 rounded-[3rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden group/form">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 blur-[60px] -z-10 group-hover/form:bg-blue-500/10 transition-all duration-700" />
                  
                  {[
                    { name: "name", label: "اسمك الكريم", type: "text" },
                    { name: "email", label: "البريد الإلكتروني", type: "email" }
                  ].map((field) => (
                    <div key={field.name} className="relative">
                      <input
                        name={field.name}
                        type={field.type}
                        autoComplete="off"
                        onFocus={() => {setFocusedField(field.name); setErrors({...errors, [field.name]: ""})}}
                        onBlur={(e) => !e.target.value && setFocusedField(null)}
                        className={`w-full bg-transparent border-b-2 py-4 text-white text-xl outline-none transition-all duration-500 ${errors[field.name] ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500'}`}
                        placeholder=" "
                      />
                      <label className={`absolute right-0 transition-all duration-300 pointer-events-none ${focusedField === field.name ? "-top-6 text-sm text-blue-400 font-bold" : "top-4 text-xl text-gray-500"}`}>
                        {field.label}
                      </label>
                      <AnimatePresence>
                        {errors[field.name] && (
                          <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2 flex items-center gap-1 font-bold">
                            <AlertCircle size={14} /> {errors[field.name]}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  <div className="relative">
                    <textarea
                      name="message"
                      rows={3}
                      onFocus={() => {setFocusedField("message"); setErrors({...errors, message: ""})}}
                      onBlur={(e) => !e.target.value && setFocusedField(null)}
                      className={`w-full bg-transparent border-b-2 py-4 text-white text-xl outline-none transition-all duration-500 resize-none ${errors.message ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500'}`}
                      placeholder=" "
                    />
                    <label className={`absolute right-0 transition-all duration-300 pointer-events-none ${focusedField === "message" ? "-top-6 text-sm text-blue-400 font-bold" : "top-4 text-xl text-gray-500"}`}>
                      أخبرني عن مشروعك...
                    </label>
                    <AnimatePresence>
                      {errors.message && (
                        <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2 flex items-center gap-1 font-bold">
                          <AlertCircle size={14} /> {errors.message}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <Magnetic>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full py-6 bg-white text-black rounded-2xl font-black text-2xl overflow-hidden hover:bg-blue-500 hover:text-white transition-all duration-500 active:scale-95 disabled:opacity-50"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-4">
                        {isSubmitting ? "يتم الآن الإرسال..." : "أرسل الرسالة"} 
                        <Send size={24} className="group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform" />
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
                className="flex flex-col items-center text-center space-y-10"
              >
                <div className="relative">
                   <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", damping: 12 }}
                    className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.4)]"
                   >
                     <CheckCircle2 size={60} className="text-white" />
                   </motion.div>
                   <Sparkles className="absolute -top-4 -right-4 text-yellow-400 w-10 h-10 animate-bounce" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter">تم الإرسال بنجاح!</h3>
                  <p className="text-gray-400 text-2xl max-w-md mx-auto leading-relaxed">شكراً لك، سأطلع على رسالتك وأرد عليك في أقرب وقت ممكن.</p>
                </div>
                <button onClick={() => setIsSuccess(false)} className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-sm border-b border-blue-500/20 pb-1">
                  <ArrowLeft size={18} /> العودة للنموذج
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}