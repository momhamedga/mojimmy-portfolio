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

  if (initialised && next) {
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

function subscribe(onChange: () => void) {
  const first = listeners.size === 0;
  listeners.add(onChange);
  if (!observer) start();
  if (first) window.addEventListener("resize", handleResize, { passive: true });

  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      window.removeEventListener("resize", handleResize);
      observer?.disconnect();
      observer = null;
      tops.clear();
      current = "";
      initialised = false;
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
