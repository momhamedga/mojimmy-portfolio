import Navbar from "./components/Layouts/Navbar";
import Hero from "./components/hero"; 
import BackgroundWrapper from "./components/Visuals/BackgroundWrapper";
import SectionsWrapper from "./components/SectionsWrapper";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function Home() {
  // اللحظة السينمائية للـ Loading
  await delay(1500); 

  return (
  
    <main 
      id="main-scroller" 
      className="relative min-h-screen overflow-x-hidden "
    >
      {/* الـ BackgroundWrapper هو اللي شايل الـ Canvas Ref */}
      <BackgroundWrapper />
      
      <div className="relative z-10 flex flex-col w-full">
        <Navbar />
        
        {/* الـ Hero */}
        <Hero />
        
        {/* الـ SectionsWrapper هو المكان المثالي للـ Client-side Refs */}
        {/* لأنه بيحتوي على الـ Locomotive/Lenis scroll sections */}
        <SectionsWrapper />
      </div>

      {/* لمسة 2026: Grain Overlay ثابت */}
      <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </main>
  );
}