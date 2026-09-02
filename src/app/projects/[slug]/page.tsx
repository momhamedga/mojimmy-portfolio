import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PROJECT_PREVIEWS } from "@/app/components/projects/previews";
import { findPublishableProject, publishableCaseStudies } from "@/lib/case-study";
import type { CaseStudySection } from "@/types/project";

/**
 * صفحة دراسة حالة — Server Component، صفر JavaScript على العميل.
 *
 * البوابة مزدوجة عمدًا: `dynamicParams = false` يجعل Next يرفض أي مسار خارج
 * ما تولّده `generateStaticParams`، و`notFound()` داخل الصفحة يحرس الحالة
 * نفسها من داخلها. حارس واحد يكفي نظريًا، لكن اثنين يعنيان أن تغيير إعداد
 * البناء لاحقًا لا يفتح صفحة ضحلة بصمت.
 *
 * اليوم لا مشروع قابلًا للنشر، فالقائمة فارغة وكل مسار تحت /projects يعيد
 * 404 — وهو السلوك الصحيح لا نقص في التنفيذ: صفحة بلا سرد معتمد لا تُنشر.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return publishableCaseStudies().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = findPublishableProject(slug);

  // لا بيانات وصفية قابلة للفهرسة لمسار سيعيد 404
  if (!project) {
    return { title: "الصفحة غير موجودة", robots: { index: false, follow: false } };
  }

  const title = `${project.title} — دراسة حالة`;
  return {
    title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/projects/${project.slug}`,
      title,
      description: project.description,
    },
    twitter: { card: "summary_large_image", title, description: project.description },
  };
}

function Section({ section }: { section: CaseStudySection | undefined }) {
  if (!section) return null;
  return (
    <section className="mt-10">
      <h2 className="font-cairo text-2xl font-black text-foreground tracking-tight">
        {section.heading}
      </h2>
      {section.body.map((paragraph) => (
        <p key={paragraph} className="mt-4 font-cairo leading-relaxed text-foreground-dim">
          {paragraph}
        </p>
      ))}
    </section>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = findPublishableProject(slug);
  if (!project) notFound();

  const study = project.caseStudy!;
  const preview = PROJECT_PREVIEWS[project.id];

  return (
    <main dir="rtl" className="container mx-auto px-6 py-24 md:py-32">
      <Link href="/#projects" className="font-cairo text-sm font-bold text-foreground-dim">
        العودة إلى المشاريع
      </Link>

      <h1 className="mt-8 font-cairo text-3xl md:text-5xl font-black text-foreground tracking-tight">
        {project.title}
      </h1>

      <p className="mt-4 max-w-[60ch] font-cairo text-lg leading-relaxed text-foreground-dim">
        {project.description}
      </p>

      {preview && (
        <figure className="mt-10 overflow-hidden rounded-xl border border-border">
          <Image
            src={preview}
            alt={`معاينة الصفحة الرئيسية لموقع ${project.title}`}
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority
            className="block h-auto w-full"
          />
        </figure>
      )}

      <Section section={study.challenge} />
      <Section section={study.solution} />
      <Section section={study.decisions} />
      <Section section={study.notes} />

      <p
        dir="ltr"
        className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground-subtle"
      >
        {project.tags.join("  /  ")}
      </p>

      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`زيارة موقع ${project.title} (يفتح في تبويب جديد)`}
        className="mt-8 inline-flex items-center min-h-11 font-cairo text-sm font-bold text-foreground underline-offset-4 hover:underline"
      >
        زيارة الموقع
      </a>
    </main>
  );
}
