/**
 * Server Component — الشعار. صفر JavaScript.
 * كان framer-motion بـ variants للـ hover/tap + حلقتين `repeat: Infinity`.
 * كله بقى CSS: :hover على الحاوية + keyframes للنبض والتوهج.
 *
 * 5B.10 (قرار مؤجَّل من 5B.2): كان <div> بـ cursor-pointer — يبدو قابلًا للنقر
 * ولا يفعل شيئًا، وغير موجود في ترتيب التركيز ولا يعلن نفسه لقارئ الشاشة.
 * بقى <a> حقيقيًا إلى #home باسم واضح. الشكل لم يتغيّر إطلاقًا: نفس البنية
 * ونفس الألوان ونفس الحركة. cursor-pointer أُزيل لأن الرابط يعطيه أصلًا.
 */
export const Logo = () => {
  return (
    <a
      href="#home"
      aria-label="محمد جمال — العودة إلى الرئيسية"
      className="logo-root relative block select-none touch-none w-fit h-fit"
    >
      {/* الهالة الملونة عند الـ Hover */}
      <div
        aria-hidden="true"
        className="logo-halo absolute inset-0 rounded-2xl blur-xl pointer-events-none"
        style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
      />

      {/* الإطار المتدرج (Gradient Ring) */}
      <div
        aria-hidden="true"
        className="logo-ring relative z-10 w-14 h-14 p-[1.5px] rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
      >
        <div className="relative w-full h-full bg-background rounded-[0.9rem] overflow-hidden flex items-center justify-center">
          {/* توهج داخلي هادئ */}
          <div
            className="logo-glow absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--color-primary) 25%, transparent), transparent 65%)",
            }}
          />

          {/* حرف M بتدرج العلامة التجارية */}
          <span
            className="relative z-10 font-cairo text-2xl font-black tracking-tighter bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
            }}
          >
            M
          </span>

          {/* لمعة عابرة عند الـ Hover */}
          <div className="logo-sheen absolute inset-0 z-20 w-1/2 h-full bg-linear-to-r from-transparent via-foreground/10 to-transparent -skew-x-12" />
        </div>
      </div>

      {/* نقطة النشاط */}
      <div aria-hidden="true" className="logo-dot absolute -bottom-1 -left-1 z-20">
        <div className="w-2.5 h-2.5 rounded-full bg-accent border-2 border-background shadow-[0_0_8px_var(--color-accent)]" />
      </div>
    </a>
  );
};
