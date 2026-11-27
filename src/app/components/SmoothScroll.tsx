"use client";

import dynamic from "next/dynamic";
import { memo, useEffect, useState, type ReactNode } from "react";

const LenisSmoothScroll = dynamic(() => import("./LenisSmoothScroll"), { ssr: false });

/**
 * محرك السكرول الناعم — محمَّل كسولًا على سطح المكتب فقط.
 *
 * على الموبايل/اللمس وتحت `prefers-reduced-motion: reduce`:
 * يأخذ المستخدم التمرير الأصلي للمتصفح دون تحميل حزمة `lenis` أو تشغيل
 * حلقة `rAF`، مما يقلّل وقت تنفيذ الجافاسكربت على الأجهزة المحمولة.
 */
const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const [enableLenis, setEnableLenis] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setEnableLenis(desktopQuery.matches && !reduceQuery.matches);
    };

    update();
    desktopQuery.addEventListener("change", update);
    reduceQuery.addEventListener("change", update);
    return () => {
      desktopQuery.removeEventListener("change", update);
      reduceQuery.removeEventListener("change", update);
    };
  }, []);

  return (
    <>
      {enableLenis && <LenisSmoothScroll />}
      <div>{children}</div>
    </>
  );
};

export default memo(SmoothScroll);
