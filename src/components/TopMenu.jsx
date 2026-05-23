import React, { useState } from 'react';
import { Sparkles, ChevronDown, AlignLeft, Menu } from 'lucide-react';

const MENU_TAXONOMY = [
  {
    title: "1. NÚCLEO",
    submenus: [
      {
        title: "Métodos Fundamentales",
        items: [
          { name: "gsap.to()", id: "gsap-to" },
          { name: "gsap.from()", id: "gsap-from" },
          { name: "gsap.fromTo()", id: "gsap-from-to" },
          { name: "gsap.set()", id: "gsap-set" }
        ]
      },
      {
        title: "Métodos de Control",
        items: [
          { name: "Controles Internos", id: "control-methods" }
        ]
      }
    ]
  },
  {
    title: "2. RITMO Y SECUENCIAS",
    submenus: [
      {
        title: "Easing (Velocidad)",
        items: [
          { name: "Clásicos", id: "easing-classics" },
          { name: "Dinámicos (Rebotes)", id: "easing-dynamics" },
          { name: "Exclusivos", id: "easing-exclusives" }
        ]
      },
      {
        title: "Stagger (Escalonado)",
        items: [
          { name: "Básicos", id: "stagger-basics" },
          { name: "Avanzados (Grid/Axis)", id: "stagger-advanced" }
        ]
      }
    ]
  },
  {
    title: "3. TIMELINES",
    submenus: [
      {
        title: "Construcción Base",
        items: [
          { name: "Timeline & Defaults", id: "timeline-base" }
        ]
      },
      {
        title: "Parámetro de Posición",
        items: [
          { name: "Absoluto, Relativo y Sincro", id: "position-parameter" }
        ]
      }
    ]
  },
  {
    title: "4. INTERACTIVIDAD Y SCROLL",
    submenus: [
      {
        title: "ScrollTrigger Básico",
        items: [
          { name: "Trigger y Marcadores", id: "scroll-trigger-basic" }
        ]
      },
      {
        title: "ScrollTrigger Avanzado",
        items: [
          { name: "Scrub, Pin & Parallax", id: "scroll-trigger-advanced" }
        ]
      },
      {
        title: "Interacción de Entrada",
        items: [
          { name: "Draggable (Inercia)", id: "draggable" },
          { name: "Observer Gestures", id: "observer" }
        ]
      }
    ]
  },
  {
    title: "5. TEXTO Y EFECTOS FX",
    submenus: [
      {
        title: "SplitText FX",
        items: [
          { name: "Líneas, Palabras, Letras", id: "split-text" }
        ]
      },
      {
        title: "Text & Scramble",
        items: [
          { name: "Máquina y Desencriptado", id: "text-scramble" }
        ]
      },
      {
        title: "MorphSVG FX",
        items: [
          { name: "Morphing de Formas", id: "morph-svg" }
        ]
      }
    ]
  },
  {
    title: "6. UTILS & PHYSICS",
    submenus: [
      {
        title: "MotionPath",
        items: [
          { name: "Trayectorias SVG", id: "motion-path" }
        ]
      },
      {
        title: "Inercia y Física",
        items: [
          { name: "Physics2D / Physics", id: "physics-inertia" }
        ]
      },
      {
        title: "Funciones Útiles",
        items: [
          { name: "gsap.utils (Clamp/Wrap...)", id: "gsap-utils" }
        ]
      }
    ]
  },
  {
    title: "7. MÓDULOS AVANZADOS",
    submenus: [
      {
        title: "Efectos Premium",
        items: [
          { name: "Flip Layout", id: "gsap-flip" },
          { name: "ScrollTo & Smoother", id: "scroll-to-smoother" },
          { name: "DrawSVG FX", id: "draw-svg" },
          { name: "Inertia Drag", id: "inertia-drag" },
          { name: "Three.js + GSAP", id: "three-gsap" }
        ]
      }
    ]
  }
];

export default function TopMenu() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // height of the sticky menu
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-900/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/30 text-purple-400">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 tracking-tight text-md md:text-lg">
                GSAP VIBE-SANCTUARY
              </span>
              <span className="block text-[9px] text-slate-500 font-mono tracking-widest leading-none">V3+ AI-READY</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {MENU_TAXONOMY.map((menu, idx) => (
              <div
                key={idx}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(idx)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-colors ${
                    activeDropdown === idx ? 'text-purple-400 bg-slate-900/40' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{menu.title}</span>
                  <ChevronDown size={12} className="opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Submenu Dropdown */}
                {activeDropdown === idx && (
                  <div className="absolute left-0 mt-0 w-64 glass-panel border border-slate-800 rounded-lg shadow-xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                    {menu.submenus.map((submenu, sIdx) => (
                      <div key={sIdx} className="px-3 py-1">
                        <div className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider mb-1 px-2 border-b border-slate-800/40 pb-1">
                          {submenu.title}
                        </div>
                        <ul className="space-y-0.5">
                          {submenu.items.map((item, iIdx) => (
                            <li key={iIdx}>
                              <button
                                onClick={() => handleScrollTo(item.id)}
                                className="w-full text-left px-2 py-1.5 rounded text-xs text-slate-300 hover:text-white hover:bg-purple-500/10 hover:border-l-2 hover:border-purple-500 font-medium transition-all"
                              >
                                {item.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* AI Badge */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400 font-mono tracking-wider border border-slate-800 px-2 py-1 rounded bg-slate-950/80">
              VIBE-CODING PROMPTER ACTIVE
            </span>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-slate-800 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-3 space-y-2">
            {MENU_TAXONOMY.map((menu, idx) => (
              <div key={idx} className="p-2 border-b border-slate-900/60 last:border-0">
                <div className="text-[11px] font-extrabold text-purple-400 mb-2 font-mono">{menu.title}</div>
                {menu.submenus.map((submenu, sIdx) => (
                  <div key={sIdx} className="pl-2 mb-2 last:mb-0">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{submenu.title}</div>
                    <div className="grid grid-cols-2 gap-1">
                      {submenu.items.map((item, iIdx) => (
                        <button
                          key={iIdx}
                          onClick={() => handleScrollTo(item.id)}
                          className="text-left text-[11px] text-slate-300 hover:text-white py-1 pl-1 border-l border-slate-800 hover:border-purple-500 transition-colors"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
