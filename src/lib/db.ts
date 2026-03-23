// src/lib/db.ts
export const NEURAL_CONFIG = {
  particleCount: 80,
  connectionDistance: 150,
  mouseRadius: 150,
  particleSize: 1.5,
  velocity: 0.6,
  pulseSpeed: 0.015,
  maxPulseOpacity: 0.8,
  colors: {
    // استخدمنا oklch للـ nodes و rgba للخطوط عشان التوافق مع Canvas 2D
    node: "rgba(168, 85, 247, 0.4)", 
    line: "147, 51, 234", // بنبعتها كـ string عشان الـ opacity الديناميكي
    background: "#05050a"
  }
};