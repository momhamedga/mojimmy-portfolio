"use client";
import { useRef } from "react";
import { useNeuralCore } from "../../hooks/useNeuralCore";

export const BackgroundCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useNeuralCore(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.9 }} // تعلية الـ opacity شوية عشان الـ nodes تبان
    />
  );
};