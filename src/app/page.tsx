import Navbar from "./components/Layouts/Navbar";
import Hero from "./components/hero"; 
import BackgroundWrapper from "./components/Visuals/BackgroundWrapper";
import SectionsWrapper from "./components/SectionsWrapper";

// دالة سحرية للتأخير (عشان اللودر يبان)
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function Home() {
  // بنجبر السيرفر يستنى 1.5 ثانية (أو المدة اللي تحبها)
  // دي اللحظة اللي الـ loading.tsx هيظهر فيها للزائر
  await delay(1500); 

  return (
    <main className="relative min-h-screen  overflow-x-hidden">
      <BackgroundWrapper />
      
      <div className="relative z-10 flex flex-col w-full">
        <Navbar />
        {/* الـ Hero */}
        <Hero />
        
        {/* السكاشن اللي بتتحمل Client-side */}
        <SectionsWrapper />
      </div>
    </main>
  );
}