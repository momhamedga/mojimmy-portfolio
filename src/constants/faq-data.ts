export interface FAQItem {
  question: string;
  answer: string;
  timestamp: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    question: "بتستغرق كام وقت عشان تخلص مشروع؟",
    answer: "حسب حجم المشروع، بس غالباً المواقع التعريفية بتاخد من أسبوع لـ 10 أيام، والأنظمة المعقدة من شهر لـ 3 شهور. دايماً بهتم بالجودة قبل أي حاجة.",
    timestamp: "09:41 AM"
  },
  {
    question: "إيه التقنيات اللي بتستخدمها؟",
    answer: "أنا متخصص في Next.js 15 و React مع Tailwind CSS. وللأنظمة المعقدة بستخدم Node.js و PostgreSQL مع Prisma.",
    timestamp: "09:42 AM"
  },
  {
    question: "هل بتقدم دعم فني بعد التسليم؟",
    answer: "أكيد! بوفر دعم فني مجاني لمدة شهر بعد الإطلاق عشان أتأكد إن كل حاجة ماشية تمام، وفي باقات للصيانة الدورية لو حابب.",
    timestamp: "09:44 AM"
  },
  {
    question: "إزاي نقدر نبدأ نشتغل مع بعض؟",
    answer: "تقدر تضغط على زر 'اتصل بي' أو تبعتلي رسالة هنا، وهرد عليك في أقل من 24 ساعة عشان نحدد ميعاد لمكالمة اكتشاف.",
    timestamp: "09:45 AM"
  }
];