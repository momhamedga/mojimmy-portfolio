/** قسم سردي في دراسة الحالة — عنوان وفقرات نصّية، بلا HTML خام. */
export interface CaseStudySection {
  heading: string;
  body: string[];
}

/**
 * نتيجة قابلة للنشر.
 *
 * `evidence` إلزامي لا اختياري عمدًا: رقم بلا مصدر يمكن التحقق منه لا يجوز
 * أن يُكتب أصلًا، فجعله شرطًا في النوع يمنع اختلاقه بدل أن يعتمد على انتباه
 * من يحرّر البيانات لاحقًا.
 */
export interface CaseStudyResult {
  label: string;
  value: string;
  evidence: string;
}

/**
 * محتوى دراسة الحالة — كله اختياري.
 *
 * الغياب هو الحالة الطبيعية: خمسة مشاريع اليوم بلا سرد معتمد، وصفحة تُبنى
 * من عنوان ووصف وشعارات تقنية ليست دراسة حالة بل تكرار لصفّ الصفحة الرئيسية
 * على عنوان جديد. لذلك لا يوجد حقل واحد إلزامي هنا.
 */
export interface CaseStudy {
  role?: string;
  year?: string;
  challenge?: CaseStudySection;
  solution?: CaseStudySection;
  decisions?: CaseStudySection;
  features?: string[];
  notes?: CaseStudySection;
  limitations?: string[];
  results?: CaseStudyResult[];
}

export interface Project {
  id: string;
  /**
   * جزء المسار في `/projects/{slug}` — ثابت لا يتغيّر بعد الفهرسة.
   *
   * منفصل عن `id` لأن الأخير رقم ترتيب عرض ومفتاح صورة («01»…«05»)،
   * ولا يصلح عنوانًا: لا يقول شيئًا لقارئ ولا لمحرك بحث.
   */
  slug: string;
  title: string;
  description: string;
  /** وصف نوع المشروع، مشتق من طبيعته لا من تسويقه. يُعرض بصريًا في 5B.4. */
  category?: string;
  color: string;
  tags: string[];
  link: string;
  caseStudy?: CaseStudy;
}
