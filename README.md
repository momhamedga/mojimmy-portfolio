# Mohamed Gamal Portfolio

موقع بورتفوليو شخصي بالعربية (RTL)، صفحة واحدة، مبني على Next.js App Router ومنشور على Vercel.

**Production:** https://www.mohamedjimmy.com

---

## Overview

- صفحة واحدة (`/`) تُبنى **static prerender** وقت الـ build — لا قاعدة بيانات ولا جلب بيانات وقت التشغيل.
- كل محتوى الأقسام (المشاريع، الخدمات، الآراء، الأسئلة، مراحل العمل) ثابت داخل `src/constants/`.
- نموذج التواصل هو الجزء الديناميكي الوحيد: **Server Action** واحد يرسل إلى Web3Forms.
- الوضع الفاتح/الداكن عبر `next-themes` (استراتيجية `class`).

---

## Stack

| الطبقة        | الأداة                                              |
| ------------- | --------------------------------------------------- |
| Framework     | Next.js 16 (App Router)                             |
| UI            | React 19                                            |
| Language      | TypeScript 5 (strict)                               |
| Styling       | Tailwind CSS v4 (`@theme` + CSS variables بـ OKLCH) |
| Animation     | Framer Motion                                       |
| Smooth scroll | Lenis                                               |
| Icons         | lucide-react                                        |
| Theming       | next-themes                                         |
| Class utils   | clsx + tailwind-merge                               |
| Email         | Web3Forms (عبر Server Action)                       |
| Hosting       | Vercel                                              |

> لا يوجد في هذا المشروع: backend منفصل، قاعدة بيانات، ORM، أو أي طبقة data-fetching على العميل.

---

## Requirements

- **Node.js** ‏20.9 أو أحدث
- **npm** ‏10 أو أحدث

---

## Installation

```bash
git clone https://github.com/momhamedga/mojimmy-portfolio.git
cd mojimmy-portfolio
npm install
cp .env.example .env.local   # ثم املأ القيم
```

---

## Environment Variables

| المتغيّر               | مطلوب | الوصف                                                                                            |
| ---------------------- | ----- | ------------------------------------------------------------------------------------------------ |
| `WEB3FORMS_ACCESS_KEY` | نعم   | مفتاح Web3Forms المستخدم في `src/actions/contact.ts`. **خادمي بحت** — بدون بادئة `NEXT_PUBLIC_`. |

بدون هذا المتغيّر يعمل الموقع كاملًا، لكن إرسال نموذج التواصل يرجع برسالة خطأ.
القالب في [`.env.example`](.env.example) — ولا يُوضع أي مفتاح حقيقي في الريبو.

---

## Scripts

```bash
npm run dev           # تشغيل خادم التطوير
npm run build         # بناء الإنتاج (يشمل فحص الأنواع تلقائيًا)
npm run start         # تشغيل نسخة الإنتاج محليًا بعد build
npm run lint          # ESLint
npm run lint:fix      # ESLint مع إصلاح تلقائي
npm run type-check    # tsc --noEmit
npm run format        # Prettier — كتابة
npm run format:check  # Prettier — فحص فقط (للـ CI)
npm run clean         # حذف مجلد ‎.next‎ فقط
```

---

## Project Structure

```
src/
├── actions/            Server Actions ("use server")
│   └── contact.ts      إرسال نموذج التواصل إلى Web3Forms
├── app/                App Router
│   ├── layout.tsx      الجذر: الخطوط + الميتاداتا + ProvidersWrapper
│   ├── page.tsx        الصفحة الوحيدة
│   ├── error.tsx       حدود الخطأ
│   ├── not-found.tsx   صفحة 404
│   ├── globals.css     نظام التصميم + الأدوات المشتركة + الـ scrollbar
│   ├── components/     كل مكوّنات الواجهة (مجمّعة حسب القسم)
│   └── hooks/          hooks مشتركة على مستوى الواجهة
├── constants/          محتوى الموقع الثابت (مشاريع، خدمات، آراء، أسئلة…)
├── lib/                أدوات عامة (cn)
└── types/              أنواع مشتركة
```

**Path alias:** `@/*` → `src/*` — مثال: `import { cn } from "@/lib/utils"`.

---

## Deployment

يُنشر تلقائيًا على Vercel من فرع `main`.

- الصفحة تُبنى static prerender وتُخدَم من الحافة (`X-Nextjs-Prerender: 1`).
- اضبط `WEB3FORMS_ACCESS_KEY` في **Vercel → Project → Settings → Environment Variables**.

---

## Security Notes

- `WEB3FORMS_ACCESS_KEY` يُقرأ داخل Server Action فقط ولا يصل إلى حزمة المتصفح إطلاقًا.
- نموذج التواصل فيه **honeypot** وتحقق من الحقول على الخادم (نوع، طول، صيغة البريد).
- كل الروابط الخارجية تستخدم `rel="noopener noreferrer"`.
- لا يوجد `dangerouslySetInnerHTML` ولا أي سكربت طرف ثالث في المشروع.

> **معروف وغير منفَّذ بعد:** لا يوجد rate limiting ولا CAPTCHA على الـ Server Action، ولا security headers
> (CSP / X-Content-Type-Options / Referrer-Policy / Permissions-Policy). كلاهما مجدول في مرحلة لاحقة.
