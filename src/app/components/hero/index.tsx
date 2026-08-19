import { HeroContent } from "./HeroContent";
import { HeroActions } from "./HeroActions";

/**
 * Hero — Server Component.
 *
 * الأورورا الخلفية بقت CSS keyframes بدل 3 حلقات framer-motion أبدية.
 * الـ IntersectionObserver اللي كان بيطفّيها خارج الشاشة اتشال: المتصفحات بتوقف
 * أنيميشن CSS للعناصر خارج الـ viewport تلقائيًا، فالمراقب كان تكلفة بلا مقابل.
 */
export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 md:pt-36 pb-16 overflow-hidden"
    >
      {/* أورورا متحركة: 3 كتل ضوئية بلون العلامة التجارية بتتحرك ببطء وعضوية */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="aurora-a absolute top-[-10%] right-[15%] w-105 h-105 bg-primary/20 blur-[110px] rounded-full" />
        <div className="aurora-b absolute top-[10%] left-[10%] w-95 h-95 bg-accent/15 blur-[110px] rounded-full" />
        <div className="aurora-c absolute bottom-[-15%] left-1/3 w-80 h-80 bg-primary/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center">
        <HeroContent />
        <HeroActions />
      </div>
    </section>
  );
}
