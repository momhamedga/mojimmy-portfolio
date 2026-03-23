"use client"
import dynamic from 'next/dynamic';

const DynamicBackground = dynamic(() => import("./DynamicBackground"), { ssr: false });

export default function BackgroundWrapper() {
  return <DynamicBackground />;
}