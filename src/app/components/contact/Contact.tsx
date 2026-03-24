"use client"
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Zap, User, Mail, MessageSquare, ArrowLeft } from "lucide-react"; 
import Magnetic from "../Magnetic";
import ContactInput from "./ContactInput";

export default function Contact() {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  };

  const handleAction = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "أخبرني ما اسمك؟";
    if (!email || !email.includes("@")) newErrors.email = "البريد الإلكتروني غير دقيق";
    if (!message) newErrors.message = "مساحة الرسالة فارغة";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerHaptic(200);
      return;
    }

    setErrors({});
    startTransition(async () => {
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            // الكي بتاعك رجعتهولك هنا يا محمود عشان يشتغل فوراً
            access_key: "b02db0d8-32b5-41cc-b422-6bc4440cdcd5", 
            name, 
            email, 
            message,
          }),
        });

        const result = await response.json();
        if (result.success) {
          setIsSuccess(true);
          triggerHaptic([50, 30, 50]);
        } else {
          // لو السيرفر رد بخطأ (مثلاً الكي غلط)
          console.error("Submission failed:", result.message);
          alert("خطأ من السيرفر: " + result.message);
        }
      } catch (error) {
        triggerHaptic(200);
        console.error("Network error:", error);
        alert("تحقق من اتصالك بالشبكة");
      }
    });
  };

  return (
    <section id="contact" dir="rtl" className="py-24 md:py-48 relative min-h-screen flex items-center overflow-hidden  selection:bg-purple-500/30">
      
      {/* Background Dynamics */}
      <div className="absolute inset-0 pointer-events-none transform-gpu">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -right-20 w-[400px] md:w-[800px] h-[400px] bg-purple-600/20 blur-[150px] rounded-full" 
        />
        <div className="absolute bottom-1/4 -left-20 w-[400px] md:w-[800px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="contact-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(15px)" }}
              className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center"
            >
              <div className="space-y-8 text-center lg:text-right order-2 lg:order-1">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 text-purple-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]"
                >
                  <Zap size={14} className="fill-current animate-pulse" />
                  <span>Available for New Projects</span>
                </motion.div>
                
                <h2 className="text-6xl md:text-9xl font-black text-white leading-[0.85] font-cairo tracking-tighter antialiased">
                  دعنا نبني <br /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 italic">مستقبلك</span>
                </h2>
                
                <p className="text-gray-400 text-xl md:text-2xl max-w-lg mx-auto lg:mx-0 font-cairo leading-relaxed opacity-80">
                  حول فكرتك إلى واقع ملموس. أنا لا أصمم مواقع فقط، أنا أصنع تجارب سينمائية لا تُنسى.
                </p>
              </div>

              <motion.div className="relative group order-1 lg:order-2">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-30 transition duration-1000" />
                <form action={handleAction} className="relative bg-[#080808]/80 backdrop-blur-3xl p-8 md:p-14 rounded-[3rem] border border-white/[0.08] shadow-2xl space-y-6 overflow-hidden">
                  <ContactInput icon={User} name="name" placeholder="ما هو اسمك؟" focusedField={focusedField} setFocusedField={setFocusedField} error={errors.name} />
                  <ContactInput icon={Mail} name="email" type="email" placeholder="بريدك الإلكتروني" focusedField={focusedField} setFocusedField={setFocusedField} error={errors.email} />
                  <ContactInput icon={MessageSquare} name="message" isTextArea placeholder="ما هي تفاصيل مشروعك الحلم؟" focusedField={focusedField} setFocusedField={setFocusedField} error={errors.message} />

                  <div className="pt-6">
                    <Magnetic>
                      <button 
                        type="submit"
                        disabled={isPending}
                        className="group relative w-full py-6 px-10 bg-white text-black rounded-3xl font-black font-cairo text-2xl overflow-hidden shadow-2xl transition-all duration-500 transform-gpu active:scale-95 disabled:opacity-50"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] group-hover:animate-gradient-x" />
                        
                        <span className="relative z-10 flex items-center justify-center gap-4 group-hover:text-white transition-colors duration-500 font-black tracking-tighter">
                          {isPending ? (
                            <span className="flex items-center gap-3">
                               <span className="w-6 h-6 border-4 border-current border-t-transparent rounded-full animate-spin" />
                               جاري الإرسال...
                            </span>
                          ) : (
                            <>
                              <span>أرسل الآن</span>
                              <Send size={26} className="group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform duration-700 ease-in-out rotate-180" />
                            </>
                          )}
                        </span>
                      </button>
                    </Magnetic>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto bg-white/[0.02] backdrop-blur-3xl p-16 rounded-[4rem] border border-white/10 text-center space-y-10 shadow-2xl"
            >
              <div className="relative w-40 h-40 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-3xl opacity-40 animate-pulse" />
                <div className="relative w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                  <CheckCircle2 size={70} className="text-white" />
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-5xl font-black text-white font-cairo leading-tight italic">وصلت بنجاح!</h3>
                <p className="text-gray-400 text-xl font-cairo leading-relaxed">سأقوم بمراجعة طلبك والرد عليك شخصياً في أقل من 24 ساعة.</p>
              </div>

              <button 
                onClick={() => { setIsSuccess(false); triggerHaptic(15); }}
                className="w-full py-5 rounded-2xl border border-white/10 text-gray-400 hover:bg-white hover:text-black transition-all font-black font-cairo text-lg flex items-center justify-center gap-4 group"
              >
                <ArrowLeft size={20} className="group-hover:translate-x-2 transition-transform" />
                العودة للنموذج
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}