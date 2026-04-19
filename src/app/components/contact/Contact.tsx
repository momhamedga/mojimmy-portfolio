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
    if (!name || name.length < 2) newErrors.name = "أخبرني ما اسمك الكريم؟";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "البريد الإلكتروني غير دقيق";
    if (!message || message.length < 10) newErrors.message = "مساحة الرسالة قصيرة جداً، أخبرني بالمزيد..";

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
            from_name: "Portfolio Contact",
            subject: `New Project Inquiry from ${name}`
          }),
        });

        const result = await response.json();
        if (result.success) {
          setIsSuccess(true);
          triggerHaptic([50, 30, 50]);
          formRef.current?.reset();
        }
      } catch (error) {
        triggerHaptic(200);
      }
    });
  };

  return (
    <section id="contact" dir="rtl" className="py-24 md:py-40 relative min-h-screen flex items-center  overflow-hidden selection:bg-primary/30">
      
      {/* Cinematic Background Glows */}
      <div className="absolute inset-0 pointer-events-none transform-gpu overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-primary/5 blur-[160px] rounded-full opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="form-layout"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center"
            >
              {/* Left Side: Copywriting */}
              <div className="space-y-10 text-right">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.3em]"
                >
                  <Sparkles size={14} className="animate-pulse" />
                  متاح الآن للمشاريع المتميزة
                </motion.div>
                
                <div className="space-y-6">
                  <h2 className="text-6xl md:text-8xl font-black text-white leading-tight font-cairo tracking-tighter">
                    فلنصنع <br />
                    <span className="text-primary italic">أثراً رقمياً</span>
                  </h2>
                  <p className="text-gray-400 text-lg md:text-xl max-w-lg font-cairo leading-relaxed opacity-80">
                    حوّل رؤيتك إلى واقع ملموس. أنا لا أبني مواقع فقط، بل أصنع تجارب رقمية تترك بصمة لا تُمحى في ذاكرة عملائك.
                  </p>
                </div>

                <div className="pt-10 space-y-6">
                  <div className="flex items-center gap-5 group cursor-pointer w-fit">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-primary transition-all duration-500 shadow-2xl">
                      <Mail size={22} className="text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">تواصل مباشر</p>
                      <p className="text-white font-bold font-cairo text-lg">hello@mojimmy.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: High-Performance Form */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[3rem] blur-2xl opacity-40 group-hover:opacity-100 transition duration-1000" />
                
                <form 
                  ref={formRef}
                  action={handleAction} 
                  className="relative bg-glass border border-white/[0.08] p-8 md:p-14 rounded-[3rem] space-y-8 shadow-2xl backdrop-blur-3xl"
                >
                  <div className="space-y-6">
                    <ContactInput icon={User} name="name" placeholder="الاسم الكامل" error={errors.name} />
                    <ContactInput icon={Mail} name="email" type="email" placeholder="بريدك الإلكتروني" error={errors.email} />
                    <ContactInput icon={MessageSquare} name="message" isTextArea placeholder="أخبرني عن مشروعك القادم..." error={errors.message} />
                  </div>

                  <Magnetic>
                    <button 
                      type="submit"
                      disabled={isPending}
                      className="group relative w-full h-[85px] bg-white text-black rounded-[2.2rem] font-black font-cairo text-2xl overflow-hidden shadow-2xl transition-all active:scale-[0.98] disabled:cursor-not-allowed"
                    >
                      <AnimatePresence>
                        {isPending && (
                          <motion.div 
                            initial={{ width: "0%" }} animate={{ width: "100%" }}
                            className="absolute inset-0 bg-primary z-20 flex items-center justify-center"
                          >
                            <span className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <span className={cn(
                        "relative z-10 flex items-center justify-center gap-4 transition-all duration-500",
                        isPending ? "opacity-0" : "opacity-100"
                      )}>
                        إطلاق المشروع
                        <Send size={22} className="rotate-180 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
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
                <div className="absolute inset-0 bg-primary blur-3xl opacity-30 animate-pulse" />
                <div className="relative w-full h-full bg-white text-black rounded-full flex items-center justify-center shadow-2xl scale-110">
                  <CheckCircle2 size={56} strokeWidth={2.5} />
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-6xl md:text-8xl font-black text-white font-cairo tracking-tighter">تم الإرسال!</h3>
                <p className="text-gray-400 text-xl font-cairo leading-relaxed max-w-md mx-auto">
                  رسالتك أصبحت في يدي الآن. سأرد عليك شخصياً خلال الـ 24 ساعة القادمة لبدء الرحلة.
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