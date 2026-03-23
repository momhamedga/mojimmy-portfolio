"use client"
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Sparkles, Mail, User, MessageSquare, ArrowLeft, Zap } from "lucide-react"; 
import Magnetic from "../Magnetic";
import ContactInput from "./ContactInput";

export default function Contact() {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const triggerHapticSuccess = () => {
    if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50, 30, 80]);
  };

  const triggerHapticError = () => {
    if (window.navigator.vibrate) window.navigator.vibrate(200);
  };

  const handleAction = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "أخبرني ما اسمك؟";
    if (!email || !email.includes("@")) newErrors.email = "هذا البريد يبدو غير صحيح";
    if (!message) newErrors.message = "لا تترك مساحة الرسالة فارغة";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerHapticError();
      return;
    }

    setErrors({});
    startTransition(async () => {
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            access_key: "b02db0d8-32b5-41cc-b422-6bc4440cdcd5",
            name, email, message,
          }),
        });

        const result = await response.json();
        if (result.success) {
          setIsSuccess(true);
          triggerHapticSuccess();
        }
      } catch (error) {
        triggerHapticError();
        alert("تحقق من اتصالك بالشبكة");
      }
    });
  };

  return (
    <section id="contact" dir="rtl" className="py-20  relative min-h-screen flex items-center overflow-hidden selection:bg-purple-500/30">
      
      {/* Background Dynamics */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 -right-20 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-600/20 blur-[120px] rounded-full" 
        />
        <div className="absolute bottom-1/4 -left-20 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="contact-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center"
            >
              <div className="space-y-6 text-center lg:text-right">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-cairo  uppercase tracking-widest"
                >
                  <Zap size={14} className="fill-current" />
                  <span>متصل الآن ومستعد للبدء</span>
                </motion.div>
                
                <h2 className="text-6xl md:text-8xl font-black text-white leading-tight font-cairo  tracking-tight">
                  دعنا نبني <br /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">مستقبلك الرقمي</span>
                </h2>
                
                <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto lg:mx-0 font-cairo  leading-relaxed">
                  حول فكرتك إلى واقع ملموس. أنا لا أصمم مواقع فقط، أنا أصنع تجارب لا تُنسى.
                </p>
              </div>

              <motion.div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <form action={handleAction} className="relative bg-[#0c0c0c] p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4">
                  <ContactInput icon={User} name="name" placeholder="ما هو اسمك؟" focusedField={focusedField} setFocusedField={setFocusedField} error={errors.name} />
                  <ContactInput icon={Mail} name="email" type="email" placeholder="بريدك الإلكتروني" focusedField={focusedField} setFocusedField={setFocusedField} error={errors.email} />
                  <ContactInput icon={MessageSquare} name="message" isTextArea placeholder="ما هي تفاصيل مشروعك الحلم؟" focusedField={focusedField} setFocusedField={setFocusedField} error={errors.message} />

                  <div className="pt-4">
                    <Magnetic>
  <button 
  disabled={isPending}
  className="
    group relative 
    /* تكبير المساحة: زيادة العرض والارتفاع ليكون مريحاً للعين */
    w-full max-w-md mx-auto py-5 md:py-6 px-10
    bg-white text-black rounded-2xl md:rounded-[2rem] 
    font-cairo  text-xl md:text-2xl 
    overflow-hidden 
    /* تحسين الظل: إضافة ظل أبيض خفيف ليعطي عمقاً */
    shadow-[0_0_20px_rgba(255,255,255,0.1)]
    hover:shadow-[0_0_30px_rgba(147,51,234,0.3)]
    
    select-none touch-manipulation
    active:scale-[0.96] 
    transition-all duration-500 
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center
  "
>
  {/* الخلفية المتحركة بقوة أكبر */}
  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] group-hover:animate-gradient-x" />
  
  <span className="relative z-10 flex items-center justify-center gap-4 group-hover:text-white transition-colors duration-500 font-cairo  tracking-tighter">
    {isPending ? (
      <span className="flex items-center gap-3">
         <span className="w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
         جاري الإرسال
      </span>
    ) : (
      <>
        <span className="mb-1">أرسل الآن</span>
        <Send 
          size={24} 
          className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500 ease-out" 
        />
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
              className="max-w-md mx-auto bg-white/5 backdrop-blur-3xl p-12 rounded-[3rem] border border-white/10 text-center space-y-8"
            >
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)]">
                <CheckCircle2 size={60} className="text-white" />
                <motion.div 
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-purple-500" 
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-white font-cairo ">وصلت رسالتك بنجاح!</h3>
                <p className="text-gray-400 text-lg font-cairo ">سأقوم بمراجعة طلبك والرد عليك شخصياً في أقل من 24 ساعة.</p>
              </div>

              <button 
                onClick={() => { setIsSuccess(false); if(window.navigator.vibrate) window.navigator.vibrate(10); }}
                className="w-full py-4 rounded-xl border border-white/10 text-gray-300   hover:bg-white hover:text-black transition-all font-cairo  flex items-center justify-center gap-2 group"
              >
                <ArrowLeft size={18} className="group-hover:translate-x-2 transition-transform" />
                العودة للنموذج
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}