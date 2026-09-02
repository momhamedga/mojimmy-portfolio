import { PROJECTS } from "@/constants/projects";
import type { CaseStudySection, Project } from "@/types/project";

/**
 * متى تستحق دراسة الحالة صفحة عامة؟
 *
 * القاعدة صريحة لا مستنتجة: وجود slug أو عنوان أو وصف لا يكفي. تلك الحقول
 * موجودة للمشاريع الخمسة جميعًا منذ البداية، ولو بَنينا عليها لأنتجنا خمس
 * صفحات تكرّر صفوف الصفحة الرئيسية بكلمات أقل — محتوى ضحل يضرّ الأرشفة
 * ولا يضيف مصداقية.
 *
 * الشرط: دور معلَن + قسمان سرديّان على الأقل فيهما نصّ فعلي. القسم الفارغ
 * أو المكوّن من فقرات بيضاء لا يُحتسب، فلا يمكن تمرير البوابة بعناوين بلا
 * مضمون.
 *
 * والنتيجة اليوم صفر: لا مشروع من الخمسة يملك سردًا معتمدًا بعد.
 */
function hasText(section: CaseStudySection | undefined): boolean {
  return Boolean(section && section.body.some((paragraph) => paragraph.trim().length > 0));
}

export function hasPublishableCaseStudy(project: Project): boolean {
  const study = project.caseStudy;
  if (!study) return false;
  if (!study.role || study.role.trim().length === 0) return false;

  const narrated = [study.challenge, study.solution, study.decisions].filter(hasText);
  return narrated.length >= 2;
}

/** المشاريع التي تُولَّد لها صفحات — تقرؤها الصفحة وخريطة الموقع معًا. */
export function publishableCaseStudies(): Project[] {
  return PROJECTS.filter(hasPublishableCaseStudy);
}

/** مشروع بمسار معيّن، أو undefined إن لم يكن قابلًا للنشر. */
export function findPublishableProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug && hasPublishableCaseStudy(project));
}
