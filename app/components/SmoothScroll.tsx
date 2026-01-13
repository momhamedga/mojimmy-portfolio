"use client"
import { ReactLenis } from 'lenis/react'
import { ReactNode } from 'react'

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ 
      duration: 1.2, // سرعة السكرول
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 2,
      infinite: false,
    }}>
      {children}
    </ReactLenis>
  )
}