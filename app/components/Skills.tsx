"use client"
import { motion } from "framer-motion";

const skills = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", 
  "Framer Motion", "Node.js", "MongoDB", "Prisma",
  "UI/UX Design", "Git & GitHub", "Upwork Expert"
];

export default function Skills() {
  return (
    <section className="py-20 relative overflow-hidden " id="skills">
      <div className="container mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-center dark:text-white">التقنيات اللي بستخدمها</h2>
      </div>

      {/* الشريط المتحرك */}
      <div className="flex overflow-hidden select-none">
        <motion.div 
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex flex-nowrap gap-8 whitespace-nowrap"
        >
          {/* بنكرر المصفوفة مرتين عشان الحركة تكون مستمرة */}
          {[...skills, ...skills].map((skill, index) => (
            <div 
              key={index}
              className="glass-card px-8 py-4 rounded-2xl text-xl font-semibold dark:text-white/80 border-white/10"
            >
              {skill}
            </div>
          ))}
        </motion.div>
      </div>

      {/* إضافة ظل (Fade) على الجوانب عشان الحركة تبان طبيعية */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-[#050505] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-[#050505] to-transparent z-10" />
    </section>
  );
}