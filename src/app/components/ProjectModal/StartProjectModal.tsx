"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, ChevronRight, CheckCircle2, Rocket, Loader2 } from "lucide-react";
import { StepOption } from "./StepOption";

// مكون التنبيه المودرن
const StatusAlert = ({ message, type }: { message: string, type: 'error' | 'info' }) => (
  <motion.div
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -50, opacity: 0 }}
    className={`absolute top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl border backdrop-blur-3xl flex items-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.4)]
      ${type === 'error' ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-purple-500/30 bg-purple-500/10 text-purple-400'}`}
  >
    <div className={`w-2 h-2 rounded-full animate-ping ${type === 'error' ? 'bg-red-500' : 'bg-purple-500'}`} />
    <span className="font-arabic text-xs font-bold">{message}</span>
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
  if (window.navigator.vibrate) window.navigator.vibrate(5);
  setStep((s) => Math.min(s + 1, totalSteps));
};

const handleBack = () => {
  if (window.navigator.vibrate) window.navigator.vibrate(5);
  setStep((s) => Math.max(s - 1, 1));
};

  // ميزة السحب للإغلاق في الموبايل
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 200], [1, 0]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else {
      document.body.style.overflow = 'unset';
      setTimeout(() => { setStep(1); setIsSuccess(false); setIsSubmitting(false); }, 500);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!formData.email.includes("@")) {
      setAlert({ message: "أحتاج بريداً صحيحاً لنبدأ الرحلة 📧", type: 'error' });
      if (window.navigator.vibrate) window.navigator.vibrate([40, 30, 40]);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: "b02db0d8-32b5-41cc-b422-6bc4440cdcd5",
          subject: `مشروع جديد: ${formData.service}`,
          ...formData,
          message: `الميزانية: ${formData.budget}\nالرسالة: ${formData.message}`
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        if (window.navigator.vibrate) window.navigator.vibrate([100, 30, 100, 30, 150]);
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setFormData({ service: "", budget: "", email: "", message: "" });
        }, 4000);
      }
    } catch (error) {
      setAlert({ message: "عذراً، يبدو أن هناك عائقاً في الشبكة", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-end md:items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          <motion.div 
            style={{ y, opacity }}
            drag={window.innerWidth < 768 ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => info.offset.y > 150 && onClose()}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative bg-[#080808] border-t border-white/10 w-full max-w-xl rounded-t-[3rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl"
          >
            {/* مؤشر السحب للموبايل */}
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 md:hidden" />

            <AnimatePresence>
              {alert && <StatusAlert message={alert.message} type={alert.type} />}
            </AnimatePresence>

            {/* حالة التحميل (Loading Overlay) */}
            <AnimatePresence>
              {isSubmitting && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center"
                >
                  <Loader2 className="text-purple-500 animate-spin mb-4" size={40} />
                  <p className="font-arabic text-white font-bold animate-pulse text-lg">جاري إرسال رؤيتك الان...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* محتوى المودال الرئيسي */}
            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="py-12 flex flex-col items-center text-center"
                  >
                    <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-purple-500/20">
                      <CheckCircle2 size={48} className="text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-white font-arabic mb-4">وصلت الرسالة!</h2>
                    <p className="text-gray-400 font-arabic leading-relaxed max-w-xs">مشروعك القادم بدأ يتنفس الآن.. سأتواصل معك شخصياً خلال الساعات القادمة.</p>
                  </motion.div>
                ) : (
                  <motion.div key={step}>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-12">
                       <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-colors"><X size={20}/></button>
                       <div className="flex gap-2">
                         {[1,2,3].map(i => <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-purple-500' : 'w-2 bg-white/10'}`} />)}
                       </div>
                    </div>

                    {step === 1 && (
                      <div className="space-y-6">
                        <h2 className="text-4xl font-black text-white font-arabic text-right">ما هي <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">الرؤية؟</span></h2>
                        <div className="grid gap-3">
                          {["تصميم موقع فريد", "متجر إلكتروني متكامل", "تطوير تطبيق ويب", "استشارة تقنية"].map(opt => (
                            <StepOption key={opt} label={opt} selected={formData.service === opt} onClick={() => { setFormData({...formData, service: opt}); setTimeout(handleNext, 400); }} />
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <h2 className="text-4xl font-black text-white font-arabic text-right">ميزانية <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">الاستثمار</span></h2>
                        <div className="grid gap-3">
                          {["2,000 - 5,000 AED", "5,000 - 10,000 AED", "10,000+ AED", "تحديد لاحقاً"].map(opt => (
                            <StepOption key={opt} label={opt} selected={formData.budget === opt} onClick={() => { setFormData({...formData, budget: opt}); setTimeout(handleNext, 400); }} />
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        <h2 className="text-4xl font-black text-white font-arabic text-right">قنوات <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">الاتصال</span></h2>
                        <div className="space-y-4">
                          <input 
                            type="email" placeholder="بريدك الإلكتروني"
                            className="w-full p-6 bg-white/[0.03] border border-white/5 rounded-3xl text-white outline-none focus:border-purple-500/50 transition-all text-right font-arabic"
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                          />
                          <textarea 
                            placeholder="أخبرني عن طموح مشروعك.."
                            className="w-full p-6 bg-white/[0.03] border border-white/5 rounded-3xl text-white outline-none focus:border-purple-500/50 transition-all h-32 resize-none text-right font-arabic"
                            value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                          />
                          <motion.button 
                            whileTap={{ scale: 0.95 }} onClick={handleSubmit} disabled={isSubmitting}
                            className="w-full py-6 bg-white text-black font-black rounded-3xl flex items-center justify-center gap-3 hover:bg-purple-600 hover:text-white transition-all font-arabic text-xl"
                          >
                            إطلاق المشروع <Rocket size={22} />
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              {!isSuccess && (
                <div className="mt-8 flex flex-row-reverse justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
                  {step > 1 ? (
                    <button onClick={handleBack} className="flex items-center gap-2 text-white font-bold font-arabic text-sm">
                      <ChevronRight size={18} /> العودة للخلف
                    </button>
                  ) : <div />}
                  <span className="text-[10px] font-mono tracking-tighter text-white">DUBAI 2026 © EXPERIENCES</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}