import { AlertCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  /** يُستخدم كـ name و id معًا — لازم يكون فريدًا داخل الصفحة */
  name: string;
  /** التسمية الحقيقية للحقل — مرئية فوق الحقل، ومربوطة به بـ htmlFor. */
  label: string;
  placeholder: string;
  type?: string;
  isTextArea?: boolean;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  /** اتجاه المحتوى — البريد يُكتب لاتينيًا فيحتاج ltr داخل قسم عربي. */
  dir?: "ltr" | "rtl";
}

/**
 * Server Component — حقل إدخال بتسمية مرئية.
 *
 * قبل Phase 4: صفر <label> في الصفحة، والـplaceholder (بتباين 1.18:1) كان
 * التسمية الوحيدة. Phase 4 أضاف <label> حقيقيًا لكن بـsr-only.
 *
 * 5B.9: التسمية بقت مرئية فوق الحقل. الـsr-only كان يخدم قارئ الشاشة وحده،
 * بينما المستخدم المبصر يفقد التسمية لحظة ما يبدأ الكتابة (الـplaceholder يختفي).
 * التسمية المرئية تخدم الاثنين، وهي أبسط من floating labels المتحركة.
 *
 * يبقى كما هو: aria-invalid و aria-describedby عند الخطأ، و autocomplete،
 * والـplaceholder تلميح ثانوي لا بديل عن التسمية.
 */
export default function ContactInput({
  icon: Icon,
  name,
  label,
  placeholder,
  type = "text",
  isTextArea,
  error,
  autoComplete,
  required,
  dir,
}: Props) {
  const errorId = `${name}-error`;
  const fieldClasses =
    "w-full bg-transparent text-foreground text-base placeholder:text-foreground-subtle font-cairo";

  const shared = {
    id: name,
    name,
    placeholder,
    required,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? errorId : undefined,
    // React يُخرج هذه السمة كـautoComplete في الـHTML لا autocomplete.
    // صحيح وظيفيًا: أسماء سمات HTML غير حسّاسة لحالة الأحرف، والمتصفح يقرأها
    // كـautocomplete عاديًا. تمريرها بحروف صغيرة يُنتج تحذير prop غير معروف،
    // فالشكل الـcamelCase هو الصحيح هنا رغم مظهره في المصدر المولَّد.
    ...(autoComplete ? { autoComplete } : {}),
    ...(dir ? { dir } : {}),
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-cairo font-bold text-foreground">
        {label}
      </label>

      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl border bg-surface/40 px-4 py-3 transition-colors duration-300",
          error
            ? "border-red-600 dark:border-red-400"
            : "border-border-strong focus-within:border-primary",
        )}
      >
        <Icon
          aria-hidden="true"
          size={16}
          className="mt-1.5 shrink-0 text-foreground-subtle transition-colors duration-300"
        />

        {isTextArea ? (
          <textarea {...shared} rows={5} className={cn(fieldClasses, "resize-none min-h-32")} />
        ) : (
          <input {...shared} type={type} className={cn(fieldClasses, "min-h-6 leading-6")} />
        )}
      </div>

      {error && (
        <p
          id={errorId}
          className="enter-rise flex items-center gap-2 text-red-700 dark:text-red-400 font-cairo font-bold text-xs"
        >
          <AlertCircle aria-hidden="true" size={12} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
