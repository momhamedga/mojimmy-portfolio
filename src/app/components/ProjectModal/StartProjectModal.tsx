"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, ChevronLeft, CheckCircle2, Rocket, Loader2 } from "lucide-react";
import { StepOption } from "./StepOption";

const StatusAlert = ({ message, type }: { message: string, type: 'error' | 'info' }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -20, opacity: 0 }}
    className={`absolute top-10 left-1/2 -translate-x-1/2 z-[110] px-6 py-4 rounded-2xl border backdrop-blur-3xl flex items-center gap-3 shadow-2xl min-w-[300px] justify-center
      ${type === 'error' ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-purple-500/30 bg-purple-500/10 text-purple-400'}`}
  >
    <span className="font-cairo text-sm font-bold">{message}</span>
  </motion.div>
);

export default function StartProjectModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alert, setAlert] = useState<{ message: string, type: 'error' | 'info' } | null>(null);
  const [formData, setFormData] = useState({ service: "", budget: "", email: "", message: "" });

  const totalSteps = 3;

  const handleNext = () => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) window.navigator.vibrate(8);
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) window.navigator.vibrate(5);
    setStep((s) => Math.max(s - 1, 1));
  };

  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);

  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        setStep(1); // Reset step when opening
    }
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!formData.email.includes("@")) {
      setAlert({ message: "أحتاج بريداً صحيحاً لنبدأ الرحلة 📧", type: 'error' });
      if (window.navigator.vibrate) window.navigator.vibrate([40, 30, 40]);
      setTimeout(() => setAlert(null), 3000);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "b02db0d8-32b5-41cc-b422-6bc4440cdcd5",
          subject: `New Project: ${formData.service}`,
          ...formData,
        }),
      });
      if (response.ok) {
        setIsSuccess(true);
        if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
        setTimeout(() => { onClose(); setIsSuccess(false); }, 4000);
      }
    } catch (e) {
      setAlert({ message: "مشكلة في الإرسال.. حاول مرة أخرى", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center md:items-center justify-center p-0 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div 
            style={{ y, opacity }}
            drag={typeof window !== 'undefined' && window.innerWidth < 768 ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => info.offset.y > 150 && onClose()}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative bg-[#0A0A0B] border-t border-white/20 w-full max-w-xl rounded-t-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_-20px_50px_rgba(168,85,247,0.1)]"
          >
            {/* Handle Bar - Raised higher */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-6 mb-2 md:hidden" />

            <AnimatePresence>
              {alert && <StatusAlert message={alert.message} type={alert.type} />}
            </AnimatePresence>

            {isSubmitting && (
              <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <Loader2 className="text-purple-500 animate-spin mb-4" size={48} />
                <p className="font-cairo text-white text-lg font-bold">جاري إطلاق رؤيتك...</p>
              </div>
            )}

            <div className="px-8 pt-4 pb-16 md:pb-12">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-20 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-white font-cairo mb-2">تم الإرسال بنجاح!</h2>
                    <p className="text-gray-400 font-cairo">سنتواصل معك لبدء الرحلة قريباً جداً.</p>
                  </motion.div>
                ) : (
                  <motion.div key={step} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                    {/* Navigation Header */}
                    <div className="flex items-center justify-between mb-10">
                      <button onClick={onClose} className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                        <X size={20} />
                      </button>
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-10 bg-purple-500' : 'w-3 bg-white/10'}`} />
                        ))}
                      </div>
                      {step > 1 ? (
                        <button onClick={handleBack} className="p-2 text-gray-400 font-cairo text-sm hover:text-white transition-all flex items-center">
                           <ChevronLeft size={16} /> عودة
                        </button>
                      ) : <div className="w-10" />}
                    </div>

                    {/* Content Steps */}
                    <div className="min-h-[340px]">
                        {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-4xl font-black text-white font-cairo text-right leading-tight">ما هي <span className="text-purple-400">الرؤية؟</span></h2>
                            <div className="grid gap-3">
                            {["تصميم موقع فريد", "متجر إلكتروني متكامل", "تطوير تطبيق ويب", "استشارة تقنية"].map(opt => (
                                <StepOption key={opt} label={opt} selected={formData.service === opt} onClick={() => { setFormData({...formData, service: opt}); setTimeout(handleNext, 300); }} />
                            ))}
                            </div>
                        </div>
                        )}

                        {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-4xl font-black text-white font-cairo text-right leading-tight">ميزانية <span className="text-purple-500">الاستثمار</span></h2>
                            <div className="grid gap-3">
                            {["2,000 - 5,000 AED", "5,000 - 10,000 AED", "10,000+ AED", "تحديد لاحقاً"].map(opt => (
                                <StepOption key={opt} label={opt} selected={formData.budget === opt} onClick={() => { setFormData({...formData, budget: opt}); setTimeout(handleNext, 300); }} />
                            ))}
                            </div>
                        </div>
                        )}

                        {step === 3 && (
                        <div className="space-y-5">
                            <h2 className="text-4xl font-black text-white font-cairo text-right leading-tight">قنوات <span className="text-purple-500">الاتصال</span></h2>
                            <div className="space-y-3">
                            <input 
                                type="email" placeholder="بريدك الإلكتروني"
                                className="w-full p-5 bg-white/[0.04] border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 transition-all text-right font-cairo"
                                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                            <textarea 
                                placeholder="أخبرني عن طموحك.."
                                className="w-full p-5 bg-white/[0.04] border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500/50 transition-all h-28 resize-none text-right font-cairo"
                                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                            />
                            <motion.button 
                                whileTap={{ scale: 0.98 }} onClick={handleSubmit}
                                className="w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-purple-600 hover:text-white transition-all font-cairo text-lg"
                            >
                                إطلاق المشروع <Rocket size={20} />
                            </motion.button>
                            </div>
                        </div>
                        )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              {!isSuccess && (
                <div className="mt-8 flex justify-center border-t border-white/5 pt-6">
                   <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] ">mojimmy 2026 • High-End Development</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}