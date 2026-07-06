"use client";

// ملحوظة تعليمية: مفيش أي useState/onMouseEnter هنا خالص — الـ hover كله بـ CSS بحت (:hover)
// عشان على الموبايل (اللي مفهوش hover أصلاً) العنصر يفضل في حالته العادية دايمًا بدون ما "يعلق" في حالة hover وهمية.
interface TechIconProps {
  name: string;
  icon: React.ComponentType<React.ComponentPropsWithoutRef<"svg">>;
  color: string;
}

export default function TechIcon({ name, icon: Icon, color }: TechIconProps) {
  return (
    <div
      className="group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-surface/60 border border-border backdrop-blur-xl transition-all duration-300 md:hover:-translate-y-1 md:hover:shadow-lg md:hover:border-(--tech-color)"
      style={{ '--tech-color': `color-mix(in oklch, ${color} 45%, transparent)` } as React.CSSProperties}
    >
      <div
        className="w-10 h-10 md:w-11 md:h-11 shrink-0 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundColor: `color-mix(in oklch, ${color} 14%, transparent)`,
          boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${color} 30%, transparent)`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <span className="font-cairo font-bold text-sm text-foreground whitespace-nowrap">{name}</span>
    </div>
  );
}
