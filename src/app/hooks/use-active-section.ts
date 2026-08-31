"use client";

import { useSyncExternalStore } from "react";

/**
 * مصدر الحقيقة الوحيد للقسم النشط، ومزامنة الهاش معه.
 *
 * قبل هذا كان في نظامان مستقلان: الشريط العلوي بلا أي حالة نشطة إطلاقًا
 * (ستة روابط بصنف واحد وصفر aria-current)، وشريط الموبايل السفلي بمراقب
 * خاص به يرصد أربعة أقسام فقط من ثمانية — فكل قسم غير مرصود يترك آخر قيمة
 * عالقة، وهو سبب ظهور "أعمالي" بينما المعروض "عني". والهاش لم يكن يُكتب
 * أبدًا: نقر الروابط يستدعي preventDefault فيمنع Next من تحديث العنوان،
 * وlenis.scrollTo لا يمسّ الـhistory، فهاش قديم من تحميل مباشر يبقى للأبد.
 *
 * الآن مراقب واحد فقط لكل الصفحة يشترك فيه كل المستهلكين عبر مخزن صغير،
 * فعدد المراقبين يبقى 1 مهما تعدّد المستخدمون.
 *
 * الاستراتيجية حتمية: خط تفعيل ثابت أسفل الشريط مباشرةً (ACTIVATION_LINE).
 * القسم النشط هو آخر قسم — بترتيب المستند — يقع أعلى ذلك الخط. هذا يتعامل
 * بشكل صحيح مع الأقسام الطويلة جدًا (المشاريع ٣١٤٠px) ومع الفجوات الصغيرة
 * بينها، بخلاف "أعلى نسبة تقاطع" التي تختار الخطأ حين يتقاطع قسمان.
 */

/** الأقسام التي تقود الحالة النشطة والهاش — بترتيب المستند. */
const TRACKED = ["home", "projects", "about", "services", "process", "faq", "contact"] as const;

export type TrackedSection = (typeof TRACKED)[number];

/** ارتفاع الشريط الثابت تقريبًا؛ الخط أسفله بقليل. */
const ACTIVATION_LINE = 96;

/**
 * إزاحة التنقّل — نفس القيمة التي يستخدمها الشريط في `lenis.scrollTo`.
 *
 * مكتوبة صراحةً لا مخترعة: النقر على رابط يمرّر `offset: -80`، فالاستعادة
 * بزر الرجوع يجب أن تستقر على الموضع نفسه بالضبط، وإلا اختلف مكان القسم بين
 * الوصول إليه بالنقر والوصول إليه بالرجوع.
 */
const NAV_OFFSET = 80;

/**
 * القسم الذي تجري استعادته الآن عبر زر الرجوع/التقدّم.
 *
 * أثناء الاستعادة قد يرصد المراقب أقسامًا عابرة، ولو كتبها في الهاش لكانت
 * `replaceState` قد أعادت كتابة **سجل التاريخ الحالي نفسه** — أي أن الرجوع
 * إلى #projects يحوّل ذلك السجل إلى #about، فيفسد المكدس عند أول تقدّم.
 * العلم يمنع الكتابة وحدها؛ الحالة النشطة تستمر في التحديث طبيعيًا.
 */
let restoringTo: string | null = null;

function isTracked(id: string): id is TrackedSection {
  return (TRACKED as readonly string[]).includes(id);
}

/**
 * مُمرِّر التمرير المسجَّل — الجسر الوحيد إلى Lenis.
 *
 * الوحدة هنا عادية لا مكوّن، وLenis لا يُتاح إلا عبر سياق React
 * (`LenisContext`)، فلا سبيل للوصول إليه من هنا مباشرةً. لذلك يسجّل الشريط —
 * وهو المالك الحالي لتمرير التنقّل — دالةً واحدة، فيبقى في الصفحة نسخة Lenis
 * واحدة ومسار تمرير واحد.
 *
 * خانة واحدة لا قائمة: إعادة التسجيل تستبدل ولا تتراكم.
 */
type SectionScroller = (target: string | number, options: { immediate: boolean }) => void;

let sectionScroller: SectionScroller | null = null;

/** يسجّل مُمرِّر التمرير المالك لـLenis. التمرير null عند التفكيك. */
export function setSectionScroller(scroller: SectionScroller | null) {
  sectionScroller = scroller;
}

let observer: IntersectionObserver | null = null;
let current = "";
/**
 * إحداثي كل قسم **بالنسبة للمستند** لا للنافذة.
 *
 * تخزين `boundingClientRect.top` وحده كان خطأ: الـentries لا تحوي إلا الأقسام
 * التي تغيّر تقاطعها، فتبقى الأقسام الأخرى بإحداثيات من موضع تمرير أقدم —
 * أي مقارنة بين أُطر إحداثيات من لحظات مختلفة، وهو ما جعل القسم النشط
 * يتأخّر قسمًا كاملًا. الإحداثي المطلق ثابت مهما تغيّر التمرير.
 */
const tops = new Map<string, number>();
const listeners = new Set<() => void>();
/**
 * أول قيمة تُحسب لا تُكتب في الهاش إطلاقًا: عند فتح /#services يجب ألا
 * يدهس المراقب الهاش المطلوب بـ#home أثناء الإقلاع، وعند فتح "/" يظل
 * العنوان نظيفًا بلا هاش حتى يتحرك المستخدم فعلًا.
 */
let initialised = false;

function computeActive(): string {
  const scrollY = window.scrollY;
  let active = "";
  for (const id of TRACKED) {
    const top = tops.get(id);
    if (top === undefined) continue;
    if (top - scrollY <= ACTIVATION_LINE + 1) active = id;
  }
  // فوق أول قسم مرصود: نعتبر الأول هو النشط بدل ترك القيمة فارغة.
  return active || TRACKED.find((id) => tops.has(id)) || "";
}

function publish() {
  const next = computeActive();
  if (next === current) return;
  current = next;

  // وصلنا وجهة الاستعادة: يُرفع العلم فيعود التزامن الطبيعي
  if (restoringTo && next === restoringTo) restoringTo = null;

  if (initialised && next && !restoringTo) {
    // replaceState لا pushState: التمرير عبر الأقسام يجب ألا يُنشئ سجلًا
    // في التاريخ لكل انتقال، وإلا صار زر الرجوع غير قابل للاستخدام.
    const hash = `#${next}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }
  initialised = true;

  for (const fn of listeners) fn();
}

function start() {
  const elements = TRACKED.map((id) => document.getElementById(id)).filter(
    (el): el is HTMLElement => el !== null,
  );
  if (!elements.length) return;

  // قراءة واحدة عند التهيئة فقط — لا قراءة تخطيط مع كل حدث تمرير.
  for (const el of elements) tops.set(el.id, el.getBoundingClientRect().top + window.scrollY);

  // شريط ارتفاعه بكسل واحد عند خط التفعيل — لا من الخط إلى أسفل النافذة.
  //
  // الفرق جوهري لا تجميلي: بشريط ممتد إلى الأسفل يتبدّل تقاطع القسم عند
  // دخوله من حافة النافذة السفلية، أي قبل عبوره خط التفعيل بآلاف البكسلات،
  // فلا يُطلق المراقب أي حدث في اللحظة التي تتغيّر فيها الإجابة فعلًا —
  // وهو ما جعل النقر على "الخدمات" يستقر على #about. بشريط بكسل واحد يقع
  // الحدث عند العبور بالضبط.
  const band = Math.max(0, window.innerHeight - ACTIVATION_LINE - 1);

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        tops.set(entry.target.id, entry.boundingClientRect.top + window.scrollY);
      }
      publish();
    },
    { rootMargin: `-${ACTIVATION_LINE}px 0px -${band}px 0px`, threshold: 0 },
  );

  for (const el of elements) observer.observe(el);
  publish();
}

/**
 * ارتفاع الشريط مشتق من ارتفاع النافذة، فتغيّره يبطل هوامش المراقب.
 * إعادة البناء عند تغيّر المقاس فقط — حدث نادر، لا علاقة له بالتمرير.
 */
function handleResize() {
  if (!observer) return;
  observer.disconnect();
  observer = null;
  tops.clear();
  start();
}

/**
 * استعادة الموضع عند الرجوع/التقدّم في التاريخ.
 *
 * السبب الجذري: نقر التنقّل يستدعي `preventDefault` ثم يمرّر بـ`lenis.scrollTo`،
 * فالمتصفح لم يُجرِ ملاحة جزء (fragment navigation) قط. لذلك عند `popstate`
 * يغيّر المتصفح `location.hash` فقط ولا يحرّك العرض — لا يوجد سلوك مرساة
 * أصلي ليستعيده، ولم يكن في الشيفرة أي معالج يقوم بذلك.
 *
 * التمرير هنا **فوري لا ناعم**: هكذا يتصرّف المتصفح أصلًا في الرجوع/التقدّم،
 * والقفزة الفورية تلغي مرور المراقب على أقسام وسيطة من الأساس.
 *
 * لا `pushState` ولا `replaceState` هنا إطلاقًا: الموضع في التاريخ يجب أن
 * يبقى كما اختاره المتصفح، وأي كتابة كانت ستصنع حلقة رجوع لا تنتهي.
 */
function handlePopState() {
  const id = window.location.hash.slice(1);

  // العودة إلى "/" بلا هاش: أعلى الصفحة، كما يفعل المتصفح.
  // تمرّ هي الأخرى عبر Lenis حين يكون موجودًا، وإلا أكملت حركة النقرة
  // السابقة وسحبت العرض بعيدًا عن القمة.
  if (!id) {
    restoringTo = null;
    if (sectionScroller) sectionScroller(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: "instant" });
    publish();
    return;
  }

  if (!isTracked(id)) return;
  const el = document.getElementById(id);
  if (!el) return;

  restoringTo = id;

  if (sectionScroller) {
    // عبر Lenis نفسه: استدعاء `scrollTo` جديد يستبدل الحركة الجارية
    // (`animate.fromTo`)، فيُلغى هدف النقرة القديم بدل أن يكمل بعد الاستعادة
    // ويسحب العرض إلى قسم عفا عليه الزمن. `immediate` يقفز بلا حركة، تمامًا
    // كما يفعل المتصفح في الرجوع والتقدّم.
    sectionScroller(id, { immediate: true });
  } else {
    // بلا Lenis (وضع تقليل الحركة لا يركّبه أصلًا): تمرير المتصفح المباشر
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  }

  publish();
}

/** قيمة استعادة التمرير الأصلية، تُعاد كما كانت عند التفكيك. */
let previousScrollRestoration: ScrollRestoration | null = null;

function subscribe(onChange: () => void) {
  const first = listeners.size === 0;
  listeners.add(onChange);
  if (!observer) start();
  if (first) {
    /**
     * نتولّى استعادة التمرير بأنفسنا.
     *
     * الافتراضي `auto`: يسجّل المتصفح موضع التمرير لكل سجل ويستعيده عند
     * الرجوع. وهذا يتعارض مع تنقّل يملكه التطبيق — قياس هذه المرحلة أظهر أن
     * التقدّم إلى #about كان يستقر على ‎628‎، أي الموضع المسجَّل لحظة مغادرة
     * ذلك السجل (والحركة لم تكن قد اكتملت)، لا عند القسم نفسه. وحين تكتمل
     * الحركة قبل المغادرة يتصادف الموضعان فيبدو كل شيء سليمًا، وهو ما كان
     * يخفي التعارض.
     *
     * `manual` يوقف استعادة المتصفح فيبقى معالج popstate هو المرجع الوحيد.
     */
    previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    window.addEventListener("resize", handleResize, { passive: true });
    // مستمع واحد على مستوى الوحدة لكل الصفحة — الشريط والشريط السفلي
    // يشتركان في هذا المخزن، فلا يسجّل أيٌّ منهما معالجًا خاصًا به.
    window.addEventListener("popstate", handlePopState);
  }

  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      if (previousScrollRestoration) {
        window.history.scrollRestoration = previousScrollRestoration;
        previousScrollRestoration = null;
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("popstate", handlePopState);
      observer?.disconnect();
      observer = null;
      tops.clear();
      current = "";
      initialised = false;
      restoringTo = null;
    }
  };
}

const getSnapshot = () => current;
/** أثناء التصيير على الخادم لا يوجد قسم نشط — يمنع اختلاف الترطيب. */
const getServerSnapshot = () => "";

/** القسم النشط حاليًا، مشتقًّ من مراقب واحد مشترك. */
export function useActiveSection(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * يكتب الهاش عند النقر على رابط تنقّل.
 *
 * pushState لا replaceState هنا: النقر إجراء تنقّل مقصود من المستخدم،
 * فمن حقّه أن يرجع منه بزر الرجوع — تمامًا كما يفعل رابط المرساة الأصلي
 * الذي عطّلناه بـpreventDefault للحصول على إزاحة الشريط.
 */
export function pushSectionHash(id: string) {
  const hash = `#${id}`;
  if (window.location.hash !== hash) {
    window.history.pushState(null, "", hash);
  }
  initialised = true;
}
