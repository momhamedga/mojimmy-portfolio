export interface Review {
  id: number;
  name: string;
  role: string;
  country: "EG" | "SA" | "UAE";
  text: string;
  color: string;
  initial: string;
}

export const REVIEWS: Review[] = [
  { 
    id: 1, 
    name: "م. عبد الرحمن منصور", 
    role: "رئيس قطاع التقنية - الرياض", 
    country: "SA",
    text: "الاهتمام بالتفاصيل التقنية وسرعة الاستجابة كانت العامل الحاسم في نجاح مشروعنا الضخم.", 
    color: "#a855f7",
    initial: "ع"
  },
  { 
    id: 2, 
    name: "سلطان القاسمي", 
    role: "مؤسس منصة رقمية - دبي", 
    country: "UAE",
    text: "واجهات مستخدم سريعة وسلسة جداً، لم نعد بحاجة للقلق بشأن تجربة المستخدم بعد الآن.", 
    color: "#3b82f6",
    initial: "س"
  },
  { 
    id: 3, 
    name: "أستاذ حازم الشريف", 
    role: "مدير مشاريع - القاهرة", 
    country: "EG",
    text: "كود نظيف جداً وسهل التعديل، الالتزام بالمواعيد كان مبهراً والنتيجة فاقت التوقعات.", 
    color: "#10b981",
    initial: "ح"
  },
  { 
    id: 4, 
    name: "فيصل الحربي", 
    role: "رائد أعمال - جدة", 
    country: "SA",
    text: "قدم لنا حلولاً برمجية مبتكرة ساهمت في زيادة سرعة الموقع بنسبة 200%.", 
    color: "#f59e0b",
    initial: "ف"
  },
  { 
    id: 5, 
    name: "د. زايد العامري", 
    role: "استشاري تقني - أبوظبي", 
    country: "UAE",
    text: "أفضل تجربة تطوير واجهات مررت بها، يمتلك رؤية فنية وبرمجية نادرة.", 
    color: "#ec4899",
    initial: "ز"
  }
];