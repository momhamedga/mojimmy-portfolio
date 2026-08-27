import Projects from "./projects";
import About from "./about/About";
import Services from "./services";
import ProcessSection from "./Process/ProcessSection";
import WhyWorkWithMe from "./why/WhyWorkWithMe";
import InteractiveFAQ from "./FAQ/InteractiveFAQ";
import Contact from "./contact/Contact";
import Footer from "./footer/Footer";
import MobileScrollTop from "./MobileScrollTop";

/**
 * ترتيب أقسام الصفحة — Server Component.
 *
 * الترتيب المستهدف بعد اكتمال إعادة التصميم:
 *   Hero · Projects · About · Services · Process · Why · FAQ · Contact · Footer
 *
 * الترتيب أعلاه هو الترتيب النهائي المطبَّق فعليًا.
 *
 * (TechStack اندمج داخل About في 5B.3 وحُذف قسمه المستقل.
 *  Testimonials حُذف في 5B.8 لأن شهاداته لم تكن حقيقية، وحلّ محلّه "لماذا تعمل معي؟".)
 *
 * الغلاف `.reveal` وظيفته الكشف عند السكرول بـCSS خالص (بلا JavaScript).
 */
export default function SectionsWrapper() {
  return (
    <div className="flex flex-col w-full relative">
      <div className="relative w-full">
        <Projects />
      </div>

      <div className="reveal relative w-full">
        <About />
      </div>

      <div className="reveal relative w-full">
        <Services />
      </div>

      <div className="reveal relative w-full">
        <ProcessSection />
      </div>

      <div className="reveal relative w-full">
        <WhyWorkWithMe />
      </div>

      <div className="reveal relative w-full">
        <InteractiveFAQ />
      </div>

      <div className="reveal relative w-full">
        <Contact />
      </div>

      <Footer />
      <MobileScrollTop />
    </div>
  );
}
