"use client"
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, CheckCircle2, Rocket, Loader2 } from "lucide-react";
import { StepOption } from "./StepOption";

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
  const [formData, setFormData] = useState<FormData>({ service: "", budget: "", email: "", message: "" });

  const totalSteps = 3;

  const handleNext = useCallback(() => {
    if (window.navigator.vibrate) window.navigator.vibrate(10);
    setStep((s) => Math.min(s + 1, totalSteps));
  }, []);

  const handleBack = useCallback(() => {
    if (window.navigator.vibrate) window.navigator.vibrate(5);
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
          access_key: "b02db0d8-32b5-41cc-b422-6bc4440cdcd5", // مفتاحك الفعال
          subject: `New Project: ${formData.service}`,
          ...formData,
        }),
      });
      if (response.ok) {
        setIsSuccess(true);
        if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
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
        <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          <motion.div 
            layout
            initial={{ y: "100%", scale: 0.95 }} 
            animate={{ y: 0, scale: 1 }} 
            exit={{ y: "100%", scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative bg-[#0A0A0B]/90 border border-white/10 w-full max-w-xl md:rounded-[3rem] rounded-t-[2.5rem] overflow-hidden shadow-[0_-20px_80px_rgba(168,85,247,0.15)] backdrop-blur-3xl"
          >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(step / totalSteps) * 100}%` }}
                 className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 shadow-[0_0_20px_#a855f7]"
               />
            </div>

            <div className="px-8 pt-12 pb-12">
              <div className="flex justify-between items-center mb-10">
                 <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-gray-400">
                    <X size={20} />
                 </button>
                 {step > 1 && !isSuccess && (
                   <button onClick={handleBack} className="font-cairo text-sm font-bold text-purple-400 flex items-center gap-1 hover:text-purple-300 transition-colors bg-purple-500/5 px-4 py-2 rounded-xl">
                      عودة <ChevronLeft size={16} className="rotate-180" />
                   </button>
                 )}
              </div>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <SuccessState key="success" />
                ) : (
                  <motion.div 
                    key={step} 
                    initial={{ x: 20, opacity: 0, filter: "blur(8px)" }} 
                    animate={{ x: 0, opacity: 1, filter: "blur(0px)" }} 
                    exit={{ x: -20, opacity: 0, filter: "blur(8px)" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {step === 1 && <ServiceStep formData={formData} setFormData={setFormData} onNext={handleNext} />}
                    {step === 2 && <BudgetStep formData={formData} setFormData={setFormData} onNext={handleNext} />}
                    {step === 3 && <ContactStep formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />}
                  </motion.div>
                )}
              </AnimatePresence>

              {!isSuccess && (
                <div className="mt-12 flex justify-center border-t border-white/5 pt-6">
                   <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em] ">Precision Built • Mojimmy 2026</span>
                </div>
              )}
            </div>

            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- Sub-Components ---

const ServiceStep = ({ formData, setFormData, onNext }: any) => (
  <div className="space-y-8">
    <div className="text-right">
      <h2 className="text-4xl font-black text-white font-cairo leading-tight">ما هي <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">الرؤية؟</span></h2>
      <p className="text-gray-500 font-cairo mt-2">اختر نوع المشروع لنبدأ التخطيط</p>
    </div>
    <div className="grid gap-3">
      {["تصميم موقع فريد", "متجر إلكتروني متكامل", "تطوير تطبيق ويب", "استشارة تقنية"].map(opt => (
        <StepOption key={opt} label={opt} selected={formData.service === opt} onClick={() => { setFormData({...formData, service: opt}); setTimeout(onNext, 400); }} />
      ))}
    </div>
  </div>
);

const BudgetStep = ({ formData, setFormData, onNext }: any) => (
  <div className="space-y-8">
    <div className="text-right">
      <h2 className="text-4xl font-black text-white font-cairo leading-tight">ميزانية <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">الاستثمار</span></h2>
      <p className="text-gray-500 font-cairo mt-2">ساعدني في تقدير حجم العمل</p>
    </div>
    <div className="grid gap-3">
      {["2,000 - 5,000 AED", "5,000 - 10,000 AED", "10,000+ AED", "تحديد لاحقاً"].map(opt => (
        <StepOption key={opt} label={opt} selected={formData.budget === opt} onClick={() => { setFormData({...formData, budget: opt}); setTimeout(onNext, 400); }} />
      ))}
    </div>
  </div>
);

const ContactStep = ({ formData, setFormData, onSubmit, isSubmitting }: any) => (
  <div className="space-y-8">
    <div className="text-right">
      <h2 className="text-4xl font-black text-white font-cairo leading-tight">قنوات <span className="text-purple-400">الاتصال</span></h2>
      <p className="text-gray-500 font-cairo mt-2">كيف يمكنني التواصل معك؟</p>
    </div>
    <div className="space-y-4">
      <input 
        type="email" placeholder="بريدك الإلكتروني"
        className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 transition-all text-right font-cairo placeholder:text-gray-700 shadow-inner"
        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
      />
      <textarea 
        placeholder="أخبرني عن طموحك أو تفاصيل المشروع.."
        className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 transition-all h-32 resize-none text-right font-cairo placeholder:text-gray-700 shadow-inner"
        value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
      />
      <motion.button 
        whileTap={{ scale: 0.98 }} disabled={isSubmitting || !formData.email.includes("@")}
        onClick={onSubmit}
        className="w-full py-6 bg-white text-black font-black rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-purple-600 hover:text-white transition-all font-cairo text-xl shadow-2xl shadow-white/5 disabled:opacity-20"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : <><Rocket size={22} /> إطلاق المشروع</>}
      </motion.button>
    </div>
  </div>
);

const SuccessState = () => (
  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-20 flex flex-col items-center text-center">
    <div className="relative mb-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute inset-0 bg-emerald-500 blur-3xl rounded-full" />
      <div className="w-24 h-24 bg-purple-500 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-2xl shadow-emerald-500/40 rotate-12">
        <CheckCircle2 size={48} className="text-white -rotate-12" />
      </div>
    </div>
    <h2 className="text-4xl font-black text-white font-cairo mb-3">تم بنجاح!</h2>
    <p className="text-gray-400 font-cairo text-lg">تحضر للتحول الرقمي القادم..<br/>سنتصل بك قريباً جداً.</p>
  </motion.div>
);