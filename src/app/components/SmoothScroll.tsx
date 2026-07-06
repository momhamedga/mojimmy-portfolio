"use client";

import { ReactLenis } from 'lenis/react';
import { ReactNode, useEffect, memo } from 'react';

interface SmoothScrollProps {
  children: ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  
  useEffect(() => {
    // إعلام المتصفح أن محرك Lenis يعمل بنجاح بدون قفل الـ overflow
    document.documentElement.classList.add('lenis-active');
    
    return () => {
      document.documentElement.classList.remove('lenis-active');
    };
  }, []);

  return (
    <ReactLenis 
      root 
      options={{ 
        duration: 1.2,        // سرعة استجابة متوازنة واحترافية جداً
        lerp: 0.1,            // زيادة التنعيم للحصول على حركة سينمائية
        wheelMultiplier: 1.0, // ضبط حساسية بكرة الماوس القياسية لمنع الـ Jitter
        touchMultiplier: 1.5, 
        smoothWheel: true,
        infinite: false,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        syncTouch: false,     // متوافق تماماً مع Next.js 16 و React 19
        autoRaf: true,        // Lenis يتكفل بإدارة الـ Animation Frames تلقائياً
      }}
    >
      {/* تم تحويل الـ Wrapper لـ div عادي لمنع تكرار الـ main الـ Semantic */}
      <div className="transition-colors duration-2000 ease-in-out">
        {children}
      </div>

      <style jsx global>{`
        /* تهيئة الـ HTML للتعامل مع السكرول الناعم */
        html.lenis, html.lenis body {
          height: auto;
        }
        
        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }

        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }

        /* تخصيص الـ Scrollbar الاحترافي لـ Ultra-Modern Space Cinematic */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #020202;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: background 0.3s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--color-primary, #fff);
        }

        /* إزالة الـ overflow: hidden تماماً لضمان حرية حركة بكرة الماوس */
        .lenis-active {
          scroll-behavior: auto !important;
        }
      `}</style>
    </ReactLenis>
  );
};

export default memo(SmoothScroll);