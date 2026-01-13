"use client"
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const SKILLS = [
  "Next.js", "React", "TypeScript", "Tailwind", 
  "Framer", "Node.js", "MongoDB", "Prisma", "UI/UX"
];

export default function GravitySkills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<any[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Body } = Matter;
    
    const engine = Engine.create();
    const world = engine.world;
    const width = containerRef.current.clientWidth;
    const height = 350;

    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: { 
        width, 
        height, 
        wireframes: false, 
        background: 'transparent' 
      }
    });

    // الجدران
    const ground = Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true });
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true });
    Composite.add(world, [ground, leftWall, rightWall]);

    const isMobile = width < 768;
    const scaleFactor = isMobile ? 0.7 : 1;

    // إنشاء العناصر
    const newElements = SKILLS.map((skill, i) => {
      const body = Bodies.rectangle(
        Math.random() * (width - 100) + 50,
        -100 - (i * 50),
        (skill.length * 10 + 40) * scaleFactor,
        45 * scaleFactor,
        { restitution: 0.6, friction: 0.1, chamfer: { radius: 20 } }
      );
      return { body, text: skill };
    });

    setElements(newElements);
    Composite.add(world, newElements.map(el => el.body));

    // السحب بالماوس
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Composite.add(world, mouseConstraint);

    // دالة الانفجار السحرية
    const explode = (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      newElements.forEach((el) => {
        const body = el.body;
        const deltaX = body.position.x - x;
        const deltaY = body.position.y - y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 250) {
          // قوة الانفجار
          const force = (isMobile ? 0.15 : 0.3) * body.mass;
          const angle = Math.atan2(deltaY, deltaX);
          Body.applyForce(body, body.position, {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force
          });
        }
      });
    };

    // ربط الانفجار بحدث الضغط الحقيقي على المتصفح
    const handleMouseDown = (e: MouseEvent) => explode(e.clientX, e.clientY);
    const handleTouchStart = (e: TouchEvent) => explode(e.touches[0].clientX, e.touches[0].clientY);

    const canvas = render.canvas;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('touchstart', handleTouchStart);

    const runner = Runner.create();
    Runner.run(runner, engine);

    const updateUI = () => {
      newElements.forEach((el, i) => {
        const domEl = document.getElementById(`skill-tag-${i}`);
        if (domEl) {
          const { x, y } = el.body.position;
          const angle = el.body.angle;
          domEl.style.transform = `translate(${x - domEl.offsetWidth / 2}px, ${y - domEl.offsetHeight / 2}px) rotate(${angle}rad)`;
        }
      });
      requestAnimationFrame(updateUI);
    };

    const animationId = requestAnimationFrame(updateUI);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="py-12 relative bg-transparent overflow-hidden">
      <div className="container mx-auto px-6 mb-6">
        <h2 className="text-sm md:text-base font-mono text-purple-500/60 tracking-[0.3em] uppercase">
          // Physics Playground
        </h2>
      </div>
      
      <div 
        ref={containerRef} 
        className="relative w-full h-[350px] touch-none cursor-grab active:cursor-grabbing"
      >
        {elements.map((el, i) => (
          <div 
            key={i}
            id={`skill-tag-${i}`}
            className="absolute top-0 left-0 px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-white text-xs md:text-sm font-bold backdrop-blur-md select-none will-change-transform shadow-2xl"
          >
            {el.text}
          </div>
        ))}
      </div>
    </section>
  );
}