import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  {
    // قواعد Clean Code — كلها ضمن الـ plugins الموجودة أصلًا، بدون أي plugin إضافي.
    rules: {
      // متغيّرات/استيرادات غير مستخدمة = خطأ يوقف الـ CI، مش warning يتجاهله الناس.
      // "_" prefix هو الاستثناء الصريح الوحيد.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // ممنوع any نهائيًا.
      "@typescript-eslint/no-explicit-any": "error",
      // console.log منسي = ضجيج في الإنتاج. warn/error مسموحين للتسجيل المقصود.
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
]);

export default eslintConfig;
