import { ServiceCard } from "./ServiceCard";
import { SERVICES } from "@/constants/services";

/**
 * Server Component — عرض رأسي للخدمات، محتوى ثابت بصفر JavaScript.
 *
 * 5B.5: شبكة 3 أعمدة → صفوف كاملة العرض. الشبكة كانت تترك بطاقة يتيمة
 * (5 خدمات) وتضغط الوصف؛ الصف يعطي كل خدمة مساحة يفهمها العميل.
 */
export default function Services() {
  return (
    <section id="services" className="relative bg-transparent w-full py-24 md:py-32">
      <div className="container mx-auto px-6">
        {/* 1. مقدمة القسم */}
        <div className="reveal text-center mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-border bg-surface mb-5">
            <span className="font-mono font-black text-[10px] md:text-xs uppercase tracking-[0.4em] text-primary">
              Capabilities
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cairo font-black text-foreground tracking-tight">
            حلول{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
              ذكية.
            </span>
          </h2>
        </div>

        {/* 2. صفوف الخدمات */}
        <div className="flex flex-col gap-5 md:gap-6">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
