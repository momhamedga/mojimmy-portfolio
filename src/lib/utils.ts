import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * دمج الكلاسات بطريقة احترافية:
 * 1. clsx: بتسمح لك تحط شروط (Conditions) للكلاسات بسهولة.
 * 2. twMerge: بتمنع تعارض Tailwind (مثلاً لو حطيت p-4 وبعدها p-2، بياخد الأخيرة بس).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}