"use client"
import { useState, useTransition, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, User, Mail, MessageSquare, Sparkles } from "lucide-react"; 
import Magnetic from "../Magnetic";
import ContactInput from "./ContactInput";
import { cn } from "@/src/lib/utils";

export default function Contact() {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // استخدام useRef للتحكم في الفورم بدون Re-renders
  const formRef = useRef<HTMLFormElement>(null);

  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  }, []);

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
            access_key: "b02db0d8-32b5-41cc-b422-6bc4440cdcd5", 
            name, email, message,
          }),
        });

        const result = await response.json();
        if (result.success) {
          setIsSuccess(true);
          triggerHaptic([50, 30, 50]);
          formRef.current?.reset(); // تنظيف الفورم باستخدام الـ Ref
        }
      } catch (error) {
        triggerHaptic(200);
      }
    });
  };

  return (
    <section id="contact" dir="rtl" className="py-24 md:py-40 relative min-h-screen flex items-center overflow-hidden bg-transparent selection:bg-purple-500/30">
      
      {/* Dynamic Background - GPU Accelerated */}
      <div className="absolute inset-0 pointer-events-none transform-gpu">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.02),transparent_50%)]" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="form-layout"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-start"
            >
              {/* Text Side */}
              <div className="space-y-10 text-right">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-purple-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]"
                >
                  <Sparkles size={14} className="animate-pulse" />
                  متاح الآن للمشاريع الكبرى
                </motion.div>
                
                <div className="space-y-6">
                  <h2 className="text-6xl md:text-8xl font-black text-white leading-[1.1] font-cairo tracking-tighter">
                    فلنصنع <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-400 via-pink-500 to-blue-500 italic">أثراً رقمياً</span>
                  </h2>
                  <p className="text-gray-400 text-lg md:text-xl max-w-lg font-cairo leading-relaxed opacity-70">
                    حول رؤيتك إلى واقع ملموس. أنا لا أبني مواقع، أنا أصنع تجارب رقمية سينمائية تترك بصمة لا تُمحى.
                  </p>
                </div>

                <div className="pt-10 flex flex-col gap-6">
                  <div className="flex items-center gap-5 group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
                      <Mail size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">تواصل مباشر</p>
                      <p className="text-white font-bold font-cairo">hello@mojimmy.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Side - Pure Ref Management */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                
                <form 
                  ref={formRef}
                  action={handleAction} 
                  className="relative bg-[#080808] border border-white/[0.08] p-8 md:p-12 rounded-[3rem] space-y-8 shadow-2xl overflow-hidden focus-within:border-purple-500/30 transition-colors duration-500"
                >
                  <div className="space-y-6">
                    {/* لاحظ هنا: شلنا الـ focusedField و State الـ Focus تماماً ونعتمد على الـ Internal Focus للـ Input */}
                    <ContactInput icon={User} name="name" placeholder="الاسم الكريم" error={errors.name} />
                    <ContactInput icon={Mail} name="email" type="email" placeholder="بريدك الإلكتروني" error={errors.email} />
                    <ContactInput icon={MessageSquare} name="message" isTextArea placeholder="أخبرني عن مشروعك الحلم..." error={errors.message} />
                  </div>

                  <Magnetic>
                    <button 
                      type="submit"
                      disabled={isPending}
                      className="group relative w-full h-[80px] md:h-[90px] bg-white text-black rounded-[2.5rem] font-black font-cairo text-xl md:text-2xl overflow-hidden shadow-2xl transition-all active:scale-[0.97] disabled:cursor-not-allowed"
                    >
                      <AnimatePresence>
                        {isPending && (
                          <motion.div 
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            className="absolute inset-0 bg-gradient-to-l from-purple-600 via-blue-600 to-purple-600 z-20 flex items-center justify-center overflow-hidden"
                          >
                            <div className="relative z-30 flex items-center gap-4 text-white font-black tracking-widest uppercase text-sm md:text-base">
                              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              جاري الإطلاق...
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <span className={cn(
                        "relative z-10 flex items-center justify-center gap-4 transition-all duration-500",
                        isPending ? "opacity-0 scale-90" : "opacity-100 scale-100"
                      )}>
                        إطلاق المشروع
                        <Send size={24} className="rotate-180 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                      </span>
                    </button>
                  </Magnetic>
                </form>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="success-state"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center space-y-12 py-20"
            >
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 animate-pulse" />
                <div className="relative w-full h-full bg-white text-black rounded-full flex items-center justify-center shadow-2xl">
                  <CheckCircle2 size={50} />
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-5xl md:text-7xl font-black text-white font-cairo tracking-tighter">وصلت بسلام!</h3>
                <p className="text-gray-400 text-xl font-cairo leading-relaxed max-w-md mx-auto">
                  تلقيت رسالتك. سأقوم بالرد عليك شخصياً خلال الـ 24 ساعة القادمة.
                </p>
              </div>
              <button onClick={() => setIsSuccess(false)} className="px-10 py-4 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all font-bold font-cairo">
                إرسال رسالة أخرى
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}