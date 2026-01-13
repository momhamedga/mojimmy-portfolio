"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// هنا بنستخدم React.ComponentProps بدلاً من الاستيراد المباشر المعقد
export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}