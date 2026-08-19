import Navbar from "./components/Layouts/Navbar";
import Hero from "./components/hero";
import SectionsWrapper from "./components/SectionsWrapper";
import { StructuredData } from "./components/StructuredData";

export default function Home() {
  return (
    <div id="page-root" className="relative w-full">
      {/* البيانات المنظّمة على الصفحة الرئيسية وحدها — لا في layout،
          وإلا حملت صفحة 404 مخطط FAQPage وهو غير صحيح دلاليًا. */}
      <StructuredData />

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
