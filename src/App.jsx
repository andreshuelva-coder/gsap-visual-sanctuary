import React, { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TopMenu from './components/TopMenu';
import {
  GsapToDemo,
  GsapFromDemo,
  GsapFromToDemo,
  GsapSetDemo,
  ControlMethodsDemo,
  EasingClassicsDemo,
  EasingDynamicsDemo,
  EasingExclusivesDemo,
  StaggerBasicsDemo,
  StaggerAdvancedDemo,
  TimelineBaseDemo,
  PositionParameterDemo,
  ScrollTriggerBasicDemo,
  ScrollTriggerAdvancedDemo,
  DraggableDemo,
  ObserverDemo,
  SplitTextDemo,
  TextScrambleDemo,
  MorphSvgDemo,
  MotionPathDemo,
  PhysicsInertiaDemo,
  GsapUtilsDemo
} from './components/animations/AllAnimations';
import { Sparkles, Terminal, Code2 } from 'lucide-react';

export default function App() {
  useEffect(() => {
    // Recalcular posiciones de ScrollTrigger una vez montada y asentada la página
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 500);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col dot-bg antialiased selection:bg-purple-500/30 selection:text-white">
      {/* Sticky Navigation Menu */}
      <TopMenu />

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <header className="text-center mb-16 relative">
          {/* Subtle glowing radial background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[80px] pointer-events-none z-0"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-semibold font-mono tracking-wide mb-4">
              <Sparkles size={12} className="animate-spin duration-3000" />
              EL TEMPLO DE LA ANIMACIÓN WEB
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
              GSAP Visual Sanctuary
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 text-3xl sm:text-4xl md:text-5xl mt-2 font-black">
                Vibe-Coding Playground
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
              El laboratorio definitivo para creadores visuales, diseñadores y desarrolladores. Ajusta los parámetros en tiempo real, experimenta con las físicas de la plataforma, copia prompts listos para tu IA asistente o llévate el código de producción limpio de <strong className="text-white">GSAP v3+</strong>.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 border border-slate-900 bg-slate-950/60 px-3 py-1.5 rounded-lg">
                <Terminal size={14} className="text-cyan-400" />
                Vite 8 + React 19 + Tailwind v4
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 border border-slate-900 bg-slate-950/60 px-3 py-1.5 rounded-lg">
                <Code2 size={14} className="text-purple-400" />
                GSAP v3 Core + Free Plugins
              </div>
            </div>
          </div>
        </header>

        {/* Endless Page Animations Container */}
        <div className="space-y-6">
          
          {/* CATEGORY 1: NÚCLEO */}
          <div className="border-l-2 border-purple-500 pl-4 py-1 mb-8">
            <h2 className="text-xs font-bold text-purple-400 font-mono tracking-widest uppercase">Categoría 01 / NÚCLEO (Tweens Básicos)</h2>
            <p className="text-xs text-slate-500 mt-0.5">Métodos fundamentales y controles de ciclo de vida</p>
          </div>
          <GsapToDemo />
          <GsapFromDemo />
          <GsapFromToDemo />
          <GsapSetDemo />
          <ControlMethodsDemo />

          {/* CATEGORY 2: RITMO Y SECUENCIAS */}
          <div className="border-l-2 border-cyan-400 pl-4 py-1 pt-12 mb-8">
            <h2 className="text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">Categoría 02 / RITMO Y SECUENCIAS</h2>
            <p className="text-xs text-slate-500 mt-0.5">Control fino de velocidades y escalonamientos</p>
          </div>
          <EasingClassicsDemo />
          <EasingDynamicsDemo />
          <EasingExclusivesDemo />
          <StaggerBasicsDemo />
          <StaggerAdvancedDemo />

          {/* CATEGORY 3: TIMELINES */}
          <div className="border-l-2 border-emerald-400 pl-4 py-1 pt-12 mb-8">
            <h2 className="text-xs font-bold text-emerald-400 font-mono tracking-widest uppercase">Categoría 03 / TIMELINES (Secuenciación)</h2>
            <p className="text-xs text-slate-500 mt-0.5">Líneas de tiempo complejas y sincronía perfecta</p>
          </div>
          <TimelineBaseDemo />
          <PositionParameterDemo />

          {/* CATEGORY 4: INTERACTIVIDAD Y SCROLL */}
          <div className="border-l-2 border-amber-400 pl-4 py-1 pt-12 mb-8">
            <h2 className="text-xs font-bold text-amber-400 font-mono tracking-widest uppercase">Categoría 04 / INTERACTIVIDAD Y SCROLL</h2>
            <p className="text-xs text-slate-500 mt-0.5">Efectos basados en scroll de pantalla y gestos de entrada</p>
          </div>
          <ScrollTriggerBasicDemo />
          <ScrollTriggerAdvancedDemo />
          <DraggableDemo />
          <ObserverDemo />

          {/* CATEGORY 5: TEXTO Y EFECTOS FX */}
          <div className="border-l-2 border-rose-400 pl-4 py-1 pt-12 mb-8">
            <h2 className="text-xs font-bold text-rose-400 font-mono tracking-widest uppercase">Categoría 05 / TEXTO Y EFECTOS FX</h2>
            <p className="text-xs text-slate-500 mt-0.5">Plugins especiales para tipografía cinética y morphing SVG</p>
          </div>
          <SplitTextDemo />
          <TextScrambleDemo />
          <MorphSvgDemo />

          {/* CATEGORY 6: UTILS & PHYSICS */}
          <div className="border-l-2 border-indigo-400 pl-4 py-1 pt-12 mb-8">
            <h2 className="text-xs font-bold text-indigo-400 font-mono tracking-widest uppercase">Categoría 06 / UTILS & PHYSICS</h2>
            <p className="text-xs text-slate-500 mt-0.5">Trayectorias avanzadas, simulaciones físicas y utilidades matemáticas</p>
          </div>
          <MotionPathDemo />
          <PhysicsInertiaDemo />
          <GsapUtilsDemo />

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-12 text-center text-xs text-slate-500 font-mono">
        <p className="mb-2">GSAP VIBE-CODING VISUAL SANCTUARY — DISEÑADO CON FINES CREATIVOS</p>
        <p>Copyright © 2026. Todos los derechos reservados a GreenSock y a ti, Vibe-Coder.</p>
      </footer>
    </div>
  );
}
