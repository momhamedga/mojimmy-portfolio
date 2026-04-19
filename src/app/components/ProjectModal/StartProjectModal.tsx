"use client"
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, CheckCircle2, Rocket, Loader2, Sparkles } from "lucide-react";
import { StepOption } from "./StepOption";
import { useTimeTheme } from "../Layouts/TimeAwareProvider";

// --- Types ---
interface FormData {
  service: string;
  budget: string;
  email: string;
  message: string;
}

export default function StartProjectModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { mode } = useTimeTheme(); // استهلاك حالة الوقت
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({ service: "", budget: "", email: "", message: "" });

  const totalSteps = 3;

  const handleNext = useCallback(() => {
    if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(10);
    setStep((s) => Math.min(s + 1, totalSteps));
  }, []);

  const handleBack = useCallback(() => {
    if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(5);
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!formData.email.includes("@")) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "b02db0d8-32b5-41cc-b422-6bc4440cdcd5",
          subject: `New Project [${mode}]: ${formData.service}`,
          ...formData,
        }),
      });
      if (response.ok) {
        setIsSuccess(true);
        if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
        setTimeout(() => { 
          onClose(); 
          setTimeout(() => setIsSuccess(false), 500); 
        }, 3500);
      }
    } catch (error) {
        console.error("Submission Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-6" dir="rtl">
          {/* Overlay مع Blur قوي لإبراز المودال */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-2xl transition-all duration-[2000ms]"
          />

          <motion.div 
            layout
            initial={{ y: "100%", scale: 0.9 }} 
            animate={{ y: 0, scale: 1 }} 
            exit={{ y: "100%", scale: 0.9 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative bg-[#080808]/80 border border-white/5 w-full max-w-xl md:rounded-[3.5rem] rounded-t-[3rem] overflow-hidden shadow-2xl backdrop-blur-3xl"
          >
            {/* Progress Bar - متفاعل مع متغيرات CSS */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/5 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(step / totalSteps) * 100}%` }}
                 className="h-full transition-colors duration-[2000ms]"
                 style={{ backgroundColor: "var(--color-primary)", boxShadow: "0 0 20px var(--color-primary)" }}
               />
            </div>

            <div className="px-8 pt-14 pb-10">
              <div className="flex justify-between items-center mb-10">
                 <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-gray-400 group">
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                 </button>
                 
                 {step > 1 && !isSuccess && (
                   <button onClick={handleBack} className="font-cairo text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2 hover:text-white transition-colors bg-white/5 px-5 py-2.5 rounded-full border border-white/5">
                      <ChevronLeft size={14} className="rotate-0" /> عودة 
                   </button>
                 )}
              </div>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <SuccessState key="success" primary="var(--color-primary)" />
                ) : (
                  <motion.div 
                    key={step} 
                    initial={{ x: -20, opacity: 0, filter: "blur(10px)" }} 
                    animate={{ x: 0, opacity: 1, filter: "blur(0px)" }} 
                    exit={{ x: 20, opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  >
                    {step === 1 && <ServiceStep formData={formData} setFormData={setFormData} onNext={handleNext} primary="var(--color-primary)" />}
                    {step === 2 && <BudgetStep formData={formData} setFormData={setFormData} onNext={handleNext} primary="var(--color-primary)" />}
                    {step === 3 && <ContactStep formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isSubmitting={isSubmitting} primary="var(--color-primary)" />}
                  </motion.div>
                )}
              </AnimatePresence>

              {!isSuccess && (
                <div className="mt-12 flex flex-col items-center gap-4">
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    <div className="flex items-center gap-2">
                        <Sparkles size={10} style={{ color: "var(--color-primary)" }} />
                        <span className="text-[8px] font-mono text-gray-600 uppercase tracking-[0.4em]">  Mojimmy• Abu Dhabi 2026</span>
                    </div>
                </div>
              )}
            </div>

            {/* Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- Sub-Components ---

const ServiceStep = ({ formData, setFormData, onNext, primary }: any) => (
  <div className="space-y-8 text-right">
    <div>
      <h2 className="text-4xl font-black text-white font-cairo leading-tight tracking-tighter">
        ما هي <span style={{ color: primary, transition: 'color 2s' }}>الرؤية؟</span>
      </h2>
      <p className="text-white/30 font-cairo mt-3 text-sm tracking-wide">اختر نوع المشروع لنبدأ التخطيط المعماري</p>
    </div>
    <div className="grid gap-3">
      {["تصميم موقع فريد", "متجر إلكتروني متكامل", "تطوير تطبيق ويب", "هوية بصرية كاملة"].map(opt => (
        <StepOption 
          key={opt} 
          label={opt} 
          selected={formData.service === opt} 
          onClick={() => { setFormData({...formData, service: opt}); setTimeout(onNext, 400); }} 
        />
      ))}
    </div>
  </div>
);

const BudgetStep = ({ formData, setFormData, onNext, primary }: any) => (
  <div className="space-y-8 text-right">
    <div>
      <h2 className="text-4xl font-black text-white font-cairo leading-tight tracking-tighter">
        حجم <span style={{ color: primary, transition: 'color 2s' }}>الاستثمار</span>
      </h2>
      <p className="text-white/30 font-cairo mt-3 text-sm tracking-wide">ساعدني في تقدير الموارد المطلوبة</p>
    </div>
    <div className="grid gap-3">
      {["2,000 - 5,000 AED", "5,000 - 10,000 AED", "10,000+ AED", "تحديد لاحقاً"].map(opt => (
        <StepOption 
          key={opt} 
          label={opt} 
          selected={formData.budget === opt} 
          onClick={() => { setFormData({...formData, budget: opt}); setTimeout(onNext, 400); }} 
        />
      ))}
    </div>
  </div>
);

const ContactStep = ({ formData, setFormData, onSubmit, isSubmitting, primary }: any) => (
  <div className="space-y-8 text-right">
    <div>
      <h2 className="text-4xl font-black text-white font-cairo leading-tight tracking-tighter">
        تأكيد <span style={{ color: primary, transition: 'color 2s' }}>الإطلاق</span>
      </h2>
      <p className="text-white/30 font-cairo mt-3 text-sm tracking-wide">كيف يمكننا الوصول إليك؟</p>
    </div>
    <div className="space-y-4">
      <input 
        type="email" placeholder="البريد الإلكتروني"
        className="w-full p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-white outline-none focus:border-white/20 transition-all text-right font-cairo placeholder:text-gray-700"
        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
      />
      <textarea 
        placeholder="أخبرني باختصار عن طموحك.."
        className="w-full p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-white outline-none focus:border-white/20 transition-all h-32 resize-none text-right font-cairo placeholder:text-gray-700"
        value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
      />
      <motion.button 
        whileTap={{ scale: 0.97 }} disabled={isSubmitting || !formData.email.includes("@")}
        onClick={onSubmit}
        className="w-full py-6 font-cairo font-black rounded-[2rem] flex items-center justify-center gap-3 transition-all text-xl shadow-2xl disabled:opacity-20"
        style={{ backgroundColor: "var(--color-primary)", color: "black" }}
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : <><Rocket size={20} /> إطلاق الطلب</>}
      </motion.button>
    </div>
  </div>
);

const SuccessState = ({ primary }: { primary: string }) => (
  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-16 flex flex-col items-center text-center">
    <div className="relative mb-10">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ repeat: Infinity, duration: 3 }} 
        className="absolute inset-0 blur-3xl rounded-full" 
        style={{ backgroundColor: primary }}
      />
      <div className="w-28 h-28 rounded-[3rem] flex items-center justify-center relative z-10 shadow-2xl rotate-12 transition-colors duration-[2000ms]"
           style={{ backgroundColor: primary }}>
        <CheckCircle2 size={54} className="text-black -rotate-12" />
      </div>
    </div>
    <h2 className="text-5xl font-black text-white font-cairo mb-4 tracking-tighter">تم الاستلام</h2>
    <p className="text-white/40 font-cairo text-lg max-w-xs leading-relaxed">
      رسالتك الآن في دبي.. <br/> جيمي سيراجع التفاصيل قريباً.
    </p>
  </motion.div>
);