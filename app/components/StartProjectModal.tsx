"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner"; // استيراد التوست

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StartProjectModal({ isOpen, onClose }: ModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    service: "",
    budget: "",
    email: "",
    message: ""
  });

  const totalSteps = 3;

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    // تعديل 1: استخدام toast بدلاً من alert للتحقق
    if (!formData.email) {
      toast.error("أحتاج بريدك الإلكتروني لأتمكن من الرد عليك 📧", {
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' }
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      access_key: "b02db0d8-32b5-41cc-b422-6bc4440cdcd5", 
      service: formData.service,
      budget: formData.budget,
      email: formData.email,
      message: formData.message,
      from_name: "طلب مشروع جديد - Mojimmy", 
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        // تعديل 2: رسالة نجاح أنيقة
        toast.success("تم إرسال طلبك بنجاح! 🚀");

        setTimeout(() => {
          onClose();
          setTimeout(() => {
            setIsSuccess(false);
            setStep(1);
            setFormData({ service: "", budget: "", email: "", message: "" });
          }, 500);
        }, 2500);
      }
    } catch (e) {
      console.error("Error:", e);
      // تعديل 3: رسالة خطأ احترافية
      toast.error("عذراً، حدث خطأ أثناء الإرسال. حاول ثانية.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* النجاح - Success State Overlay */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center text-center p-8"
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
                    <CheckCircle2 size={80} className="text-green-500 mb-6" />
                  </motion.div>
                  <h2 className="text-3xl font-black text-white mb-2">تم الإرسال بنجاح!</h2>
                  <p className="text-gray-400">شكراً لثقتك، سأقوم بالرد عليك في أقرب وقت ممكن.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header & Progress */}
            <div className="p-8 pb-0">
              <div className="flex justify-between items-center mb-6">
                <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    animate={{ width: `${(step / totalSteps) * 100}%` }}
                  />
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-8 pt-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-black text-white leading-tight text-right">إيه الخدمة اللي <br/> محتاجها؟</h2>
                      <div className="grid grid-cols-1 gap-3">
                        {["تصميم موقع فريد", "متجر إلكتروني متكامل", "تطوير تطبيق ويب", "استشارة تقنية"].map((opt) => (
                          <button 
                            key={opt}
                            onClick={() => { setFormData({...formData, service: opt}); handleNext(); }}
                            className={`text-right p-5 rounded-2xl border transition-all duration-300 ${formData.service === opt ? "border-purple-500 bg-purple-500/10 text-white shadow-[0_0_20px_rgba(168,85,247,0.15)]" : "border-white/5 bg-white/5 text-gray-400 hover:border-white/20"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-black text-white leading-tight text-right">الميزانية <br/> المتوقعة؟</h2>
                      <div className="grid grid-cols-1 gap-3">
                        {["500$ - 1500$", "1500$ - 3000$", "3000$+", "أحتاج عرض سعر"].map((opt) => (
                          <button 
                            key={opt}
                            onClick={() => { setFormData({...formData, budget: opt}); handleNext(); }}
                            className={`text-right p-5 rounded-2xl border transition-all duration-300 ${formData.budget === opt ? "border-purple-500 bg-purple-500/10 text-white shadow-[0_0_20px_rgba(168,85,247,0.15)]" : "border-white/5 bg-white/5 text-gray-400 hover:border-white/20"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-black text-white leading-tight text-right">آخر خطوة.. <br/> كيف أتواصل معك؟</h2>
                      <div className="space-y-4">
                        <input 
                          type="email" 
                          required
                          placeholder="بريدك الإلكتروني"
                          className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-all shadow-inner text-right"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <textarea 
                          placeholder="احكيلي أكثر عن مشروعك.."
                          className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-all h-32 resize-none text-right"
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />
                        <button 
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                          {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                          {!isSubmitting && <Send size={18} className="group-hover:translate-x--1 group-hover:-translate-y-1 transition-transform" />}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer التنقل */}
            <div className="p-8 pt-0 flex justify-between">
              {step > 1 && !isSuccess && (
                <button onClick={handleBack} className="flex items-center gap-2 text-gray-500 hover:text-white transition-all font-bold">
                  <ChevronLeft size={20} /> السابق
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}