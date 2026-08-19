/**
 * بطاقة مجموعة خبرة — Server Component.
 *
 * لغة البطاقة مطابقة لباقي الموقع (زجاج + حد + زوايا دائرية)، والـchips
 * بنفس شكل وسوم المشاريع. صفر JavaScript: الـhover كله CSS.
 *
 * التقنيات نصوص لا عناصر تحكّم — فليست buttons ولا قابلة للتركيز (Phase 4 · §26).
 */
export function ExpertiseBlock({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="group rounded-3xl border border-border bg-surface/60 backdrop-blur-md p-6 md:p-7 transition-colors duration-300 md:hover:border-primary/40">
      <div className="flex items-baseline gap-3 mb-4">
        <span
          aria-hidden="true"
          className="font-mono text-xs font-black text-foreground-subtle tabular-nums"
        >
          {id}
        </span>
        <h3 className="text-lg md:text-xl font-black font-cairo text-foreground tracking-tight">
          {title}
        </h3>
      </div>

      <div className="h-px w-full bg-border mb-4" aria-hidden="true" />

      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="text-[10px] font-bold uppercase tracking-wider text-foreground-dim border border-border-strong/40 px-2.5 py-1 rounded-full"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
