"use client"
import { ReactLenis, useLenis } from 'lenis/react'
import { ReactNode, useEffect, memo } from 'react'

interface SmoothScrollProps {
  children: ReactNode
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  // استخدام useLenis لمراقبة السكرول وتحديث أي قيم لو احتجنا
  const lenis = useLenis((lenis) => {
    // يمكنك إضافة منطق هنا مثل: إخفاء عناصر معينة عند سرعة سكرول عالية
  })

  useEffect(() => {
    // تحديث الـ Scrollbar ليناسب المتغيرات الجديدة عند تغيير الـ Theme
    // Lenis بيتعامل مع الـ HTML overflow، فبنضمن إن الـ scrollbar مخفي أو مخصص
    document.documentElement.classList.add('lenis-active');
    
    return () => {
      document.documentElement.classList.remove('lenis-active');
      lenis?.destroy();
    }
  }, [lenis])

  return (
    <ReactLenis 
      root 
      options={{ 
        duration: 1.2,       // سرعة استجابة متوازنة (مش بطيئة أوي ولا سريعة)
        lerp: 0.08,          // تنعيم احترافي جداً للماوس (Smooth as butter)
        wheelMultiplier: 1.1, // هزة خفيفة زيادة عشان تدي إحساس الـ Momentum
        touchMultiplier: 1.5, 
        smoothWheel: true,
        infinite: false,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        syncTouch: false,    // Next.js 15 + Lenis بيفضل false في العادة لتجنب الـ Jitter
        autoRaf: true,       // يخلي Lenis يتكفل بالـ RequestAnimationFrame لوحده
      }}
    >
      {/* إضافة Wrapper بسيط للتحكم في كيفية ظهور المحتوى أثناء السكرول
         transition-colors هنا مهمة عشان الـ background يتغير بنعومة مع السكرولر
      */}
      <main className="transition-colors duration-[2000ms] ease-in-out">
        {children}
      </main>

      <style jsx global>{`
        /* تخصيص الـ Scrollbar ليكون متوافق مع الـ Time Theme */
        html.lenis {
          height: auto;
        }
        
        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }

        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }

        /* تصميم الـ Scrollbar الاحترافي */
        ::-webkit-scrollbar {
          width: 5px;
        }
        
        ::-webkit-scrollbar-track {
          background: var(--color-background);
        }
        
        ::-webkit-scrollbar-thumb {
          background: var(--color-primary);
          border-radius: 10px;
          opacity: 0.5;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--color-accent);
        }

        /* تحسين استجابة الـ Smooth Scroll على المتصفحات الضعيفة */
        .lenis-active {
          overflow: hidden;
        }
      `}</style>
    </ReactLenis>
  )
}

export default memo(SmoothScroll)