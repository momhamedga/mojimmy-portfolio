"use client"
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, CheckCircle2, Rocket, Loader2, Sparkles } from "lucide-react";
import { StepOption } from "./StepOption";
import { submitContactForm } from "@/src/actions/contact";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Types ---
interface FormData {
  service: string;
  budget: string;
  email: string;
  message: string;
}

export default function StartProjectModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
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
      setSubmitError("");
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!EMAIL_PATTERN.test(formData.email)) {
      setSubmitError("البريد الإلكتروني غير صحيح");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("name", "طلب مشروع جديد");
      fd.set("email", formData.email);
      fd.set("message", `الخدمة: ${formData.service}\nالميزانية: ${formData.budget}\n\n${formData.message}`);
      fd.set("subject", `New Project: ${formData.service}`);

      const result = await submitContactForm(fd);
      if (result.success) {
        setIsSuccess(true);
        if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
        setTimeout(() => {
          onClose();
          setTimeout(() => setIsSuccess(false), 500);
        }, 3500);
      } else {
        setSubmitError(result.message || "حدث خطأ أثناء الإرسال، حاول مرة أخرى");
        if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(200);
      }
    } catch (error) {
        console.error("Submission Error:", error);
        setSubmitError("فشل الاتصال بالسيرفر، حاول مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-1000 flex items-end md:items-center justify-center p-0 md:p-6" dir="rtl">
          {/* Overlay مع Blur قوي لإبراز المودال */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-2xl transition-all duration-2000"
          />

          <motion.div 
            layout
            initial={{ y: "100%", scale: 0.9 }} 
            animate={{ y: 0, scale: 1 }} 
            exit={{ y: "100%", scale: 0.9 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative bg-surface/90 border border-border w-full max-w-xl md:rounded-[3.5rem] rounded-t-[3rem] overflow-hidden shadow-2xl backdrop-blur-3xl"
          >
            {/* Progress Bar - متفاعل مع متغيرات CSS */}
            <div className="absolute top-0 left-0 right-0 h-0.75 bg-foreground/5 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(step / totalSteps) * 100}%` }}
                 className="h-full transition-colors duration-2000"
                 style={{ backgroundColor: "var(--color-primary)", boxShadow: "0 0 20px var(--color-primary)" }}
               />
            </div>

            <div className="px-8 pt-14 pb-10">
              <div className="flex justify-between items-center mb-10">
                 <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-foreground/5 rounded-2xl hover:bg-foreground/10 transition-all text-foreground-dim group">
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                 </button>
                 
                 {step > 1 && !isSuccess && (
                   <button onClick={handleBack} className="font-cairo text-[10px] font-black uppercase tracking-widest text-foreground-dim/40 flex items-center gap-2 hover:text-foreground transition-colors bg-foreground/5 px-5 py-2.5 rounded-full border border-border">
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
                    {step === 3 && <ContactStep formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitError={submitError} primary="var(--color-primary)" />}
                  </motion.div>
                )}
              </AnimatePresence>

              {!isSuccess && (
                <div className="mt-12 flex flex-col items-center gap-4">
                    <div className="h-px w-full bg-linear-to-r from-transparent via-foreground/5 to-transparent" />
                    <div className="flex items-center gap-2">
                        <Sparkles size={10} style={{ color: "var(--color-primary)" }} />
                        <span className="text-[8px] font-mono text-foreground-dim uppercase tracking-[0.4em]">  Mojimmy• Abu Dhabi 2026</span>
                    </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- Sub-Components ---

interface StepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onNext: () => void;
  primary: string;
}

interface ContactStepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string;
  primary: string;
}

const ServiceStep = ({ formData, setFormData, onNext, primary }: StepProps) => (
  <div className="space-y-8 text-right">
    <div>
      <h2 className="text-4xl font-black text-foreground font-cairo leading-tight tracking-tighter">
        ما هي <span style={{ color: primary, transition: 'color 2s' }}>الرؤية؟</span>
      </h2>
      <p className="text-foreground-dim/30 font-cairo mt-3 text-sm tracking-wide">اختر نوع المشروع لنبدأ التخطيط المعماري</p>
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

const BudgetStep = ({ formData, setFormData, onNext, primary }: StepProps) => (
  <div className="space-y-8 text-right">
    <div>
      <h2 className="text-4xl font-black text-foreground font-cairo leading-tight tracking-tighter">
        حجم <span style={{ color: primary, transition: 'color 2s' }}>الاستثمار</span>
      </h2>
      <p className="text-foreground-dim/30 font-cairo mt-3 text-sm tracking-wide">ساعدني في تقدير الموارد المطلوبة</p>
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

const ContactStep = ({ formData, setFormData, onSubmit, isSubmitting, submitError, primary }: ContactStepProps) => (
  <div className="space-y-8 text-right">
    <div>
      <h2 className="text-4xl font-black text-foreground font-cairo leading-tight tracking-tighter">
        تأكيد <span style={{ color: primary, transition: 'color 2s' }}>الإطلاق</span>
      </h2>
      <p className="text-foreground-dim/30 font-cairo mt-3 text-sm tracking-wide">كيف يمكننا الوصول إليك؟</p>
    </div>
    <div className="space-y-4">
      <input
        type="email" placeholder="البريد الإلكتروني"
        className="w-full p-6 bg-foreground/[0.02] border border-border rounded-3xl text-foreground outline-none focus:border-primary/40 transition-all text-right font-cairo placeholder:text-foreground-dim"
        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
      />
      <textarea
        placeholder="أخبرني باختصار عن طموحك.."
        className="w-full p-6 bg-foreground/[0.02] border border-border rounded-3xl text-foreground outline-none focus:border-primary/40 transition-all h-32 resize-none text-right font-cairo placeholder:text-foreground-dim"
        value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
      />
      {submitError && (
        <p role="alert" className="text-red-400 font-cairo font-bold text-sm text-center">
          {submitError}
        </p>
      )}
      <motion.button
        whileTap={{ scale: 0.97 }} disabled={isSubmitting || !formData.email.includes("@")}
        onClick={onSubmit}
        className="w-full py-4 font-cairo font-black rounded-2xl flex items-center justify-center gap-2.5 transition-all text-base shadow-lg disabled:opacity-20"
        style={{ backgroundColor: "var(--color-primary)", color: "white" }}
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
      <div className="w-28 h-28 rounded-[3rem] flex items-center justify-center relative z-10 shadow-2xl rotate-12 transition-colors duration-2000"
           style={{ backgroundColor: primary }}>
        <CheckCircle2 size={54} className="text-white -rotate-12" />
      </div>
    </div>
    <h2 className="text-5xl font-black text-foreground font-cairo mb-4 tracking-tighter">تم الاستلام</h2>
    <p className="text-foreground-dim/40 font-cairo text-lg max-w-xs leading-relaxed">
      رسالتك الآن في دبي.. <br/> جيمي سيراجع التفاصيل قريباً.
    </p>
  </motion.div>
);