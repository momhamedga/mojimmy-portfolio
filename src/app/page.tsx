import Navbar from "./components/Layouts/Navbar";
import Hero from "./components/hero";
import SectionsWrapper from "./components/SectionsWrapper";

export default function Home() {
  return (
    <div id="page-root" className="relative w-full">
      <div className="relative z-10 flex flex-col w-full">
        <Navbar />
        
        {/* الـ Hero */}
        <Hero />
        
        {/* الـ SectionsWrapper الذي يحتوي على باقي سكاشن الصفحة */}
        <SectionsWrapper />
      </div>
    </div>
  );
}