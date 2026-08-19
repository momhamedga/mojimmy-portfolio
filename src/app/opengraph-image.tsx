import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { JOB_TITLE, SITE_NAME } from "@/constants/site";

/**
 * صورة المشاركة الاجتماعية — تُولَّد وقت البناء وتخرج كأصل ثابت (PNG).
 * صفر JavaScript على العميل.
 *
 * الخط محلّي في _og-assets (مجلد خاص لا يُوجَّه إليه مسار) بدل جلبه من الشبكة
 * وقت البناء: بلا اعتماد شبكي والناتج حتمي. Cairo ضروري لأن الخط الافتراضي
 * في satori لا يرسم الحروف العربية فتظهر مربّعات فارغة.
 *
 * المحتوى: الاسم والمسمّى وسطر تقني قصير. بلا إحصاءات ولا شهادات ولا موقع
 * جغرافي — نفس قواعد صدق المحتوى المطبّقة على الموقع.
 */
export const alt = "محمد جمال — مطوّر ويب";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * satori يشكّل حروف الكلمة العربية صحيحًا لكنه يصفّ الكلمات يسارًا-يمينًا،
 * فـ«محمد جمال» كانت تظهر «جمال محمد» في الصورة المولَّدة. خاصية
 * direction: "rtl" جُرِّبت ولم يقرأها satori إطلاقًا.
 *
 * الحل: كل كلمة عنصر مستقل داخل صفّ row-reverse، فأول كلمة في النص تقع
 * أقصى اليمين والتالية إلى يسارها — وهو ترتيب القراءة العربي الصحيح.
 */
function RtlText({ text, style }: { text: string; style: React.CSSProperties }) {
  const words = text.split(" ").filter(Boolean);
  return (
    <div style={{ display: "flex", flexDirection: "row-reverse", gap: "0.28em", ...style }}>
      {words.map((word, i) => (
        <div key={i} style={{ display: "flex" }}>
          {word}
        </div>
      ))}
    </div>
  );
}

export default async function OpengraphImage() {
  const cairo = await readFile(join(process.cwd(), "src/app/_og-assets/Cairo-Black.ttf"));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "80px",
        background: "#000103",
        color: "#f6f9fc",
        fontFamily: "Cairo",
        position: "relative",
      }}
    >
      {/* شريط تدرّج العلامة أعلى الصورة */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "10px",
          background: "linear-gradient(90deg, #db2943, #297cef)",
        }}
      />

      <RtlText text={SITE_NAME} style={{ fontSize: 92, fontWeight: 900, lineHeight: 1.2 }} />

      <RtlText text={JOB_TITLE} style={{ fontSize: 46, color: "#297cef", marginTop: 12 }} />

      <div style={{ display: "flex", fontSize: 30, color: "#9aa4b2", marginTop: 30 }}>
        React · Next.js · TypeScript · Node.js
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 80,
          display: "flex",
          fontSize: 26,
          color: "#6b7280",
        }}
      >
        mohamedjimmy.com
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Cairo", data: cairo, weight: 900, style: "normal" }],
    },
  );
}
