import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import * as THREE from 'three';
import AnimationCard from '../AnimationCard';
import { Play, Pause, RotateCcw, ArrowRight, MousePointer, Move, RefreshCw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin, TextPlugin, Observer, ScrollToPlugin);

// Helper styles for standard UI controls
const Slider = ({ label, min, max, step = 1, value, onChange, suffix = "" }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-[11px] font-mono text-slate-400">
      <span>{label}</span>
      <span className="text-purple-400 font-bold">{value}{suffix}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
    />
  </div>
);

const Selector = ({ label, options, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-mono text-slate-400">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-purple-400"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer p-1">
    <span className="text-[11px] font-mono text-slate-400">{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only peer"
    />
    <div className="relative w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500 peer-checked:after:bg-white"></div>
  </label>
);


// =========================================================================
// 1. NÚCLEO (Tweens Básicos)
// =========================================================================

// --- gsap.to() ---
export function GsapToDemo() {
  const [x, setX] = useState(100);
  const [y, setY] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [duration, setDuration] = useState(1);
  const [ease, setEase] = useState("power2.out");

  const boxRef = useRef(null);
  const containerRef = useRef(null);

  const triggerAnimation = () => {
    if (!boxRef.current) return;
    gsap.killTweensOf(boxRef.current);
    gsap.set(boxRef.current, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
    gsap.to(boxRef.current, {
      x,
      y,
      scale,
      rotation,
      opacity,
      duration,
      ease
    });
  };

  useGSAP(() => {
    triggerAnimation();
  }, { dependencies: [x, y, scale, rotation, opacity, duration, ease], scope: containerRef });

  const code = `gsap.to(".box", {
  x: ${x},
  y: ${y},
  scale: ${scale},
  rotation: ${rotation},
  opacity: ${opacity},
  duration: ${duration},
  ease: "${ease}"
});`;

  return (
    <AnimationCard
      id="gsap-to"
      titleEs="Animar hacia un estado"
      titleEn="gsap.to()"
      prompt="Quiero animar una caja 3D en React usando gsap.to para desplazarla horizontal y verticalmente, rotarla, aplicarle escala y opacidad configurables mediante sliders con una curva suave."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "gsap.to() crea una animación que parte de los valores actuales del elemento y se desplaza HACIA los valores especificados en el objeto vars.",
        varsObject: "{ x: number, y: number, scale: number, rotation: number, opacity: number, duration: number, ease: string }",
        specialProps: "duration (duración en segundos), ease (curva de aceleración), overwrite (control de conflictos entre animaciones).",
        aliases: "x representa transform: translateX(), y representa translateY(), scale y rotation mapean a transform matrices directamente optimizadas por GPU.",
        easingConcept: "La propiedad ease determina la aceleración/deceleración temporal (ej. power2.out desacelera suavemente al final).",
        callbacksConcept: "onStart, onUpdate, onComplete, onReverseComplete. Ejecutan funciones en momentos clave de la animación.",
        timelineStructure: "En un Timeline, este tween se añade secuencialmente con tl.to('.box', {...})",
        pluginsAssociated: "No requiere plugins adicionales. Forma parte del núcleo principal de GSAP."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full flex justify-center py-10">
          <div ref={boxRef} className="w-20 h-20 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-400 shadow-lg border border-white/20 flex items-center justify-center font-bold text-xs text-white">
            GSAP Box
          </div>
        </div>
      }
      controlsChildren={
        <>
          <Slider label="Posición X (x)" min={-150} max={150} value={x} onChange={setX} />
          <Slider label="Posición Y (y)" min={-80} max={80} value={y} onChange={setY} />
          <Slider label="Escala (scale)" min={0.2} max={2} step={0.1} value={scale} onChange={setScale} />
          <Slider label="Rotación (rotation)" min={-360} max={360} value={rotation} onChange={setRotation} suffix="deg" />
          <Slider label="Opacidad (opacity)" min={0} max={1} step={0.1} value={opacity} onChange={setOpacity} />
          <Slider label="Duración (duration)" min={0.2} max={3} step={0.1} value={duration} onChange={setDuration} suffix="s" />
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <Selector
              label="Curva de Aceleración (ease)"
              options={["power1.out", "power2.out", "power3.out", "power4.out", "elastic.out", "bounce.out", "back.out", "none"]}
              value={ease}
              onChange={setEase}
            />
          </div>
        </>
      }
    />
  );
}

// --- gsap.from() ---
export function GsapFromDemo() {
  const [fromX, setFromX] = useState(-200);
  const [fromY, setFromY] = useState(0);
  const [fromScale, setFromScale] = useState(0.2);
  const [fromRotation, setFromRotation] = useState(180);
  const [duration, setDuration] = useState(1.5);
  const [ease, setEase] = useState("elastic.out");

  const orbRef = useRef(null);
  const containerRef = useRef(null);

  const triggerAnimation = () => {
    if (!orbRef.current) return;
    gsap.killTweensOf(orbRef.current);
    gsap.set(orbRef.current, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
    gsap.from(orbRef.current, {
      x: fromX,
      y: fromY,
      scale: fromScale,
      rotation: fromRotation,
      opacity: 0,
      duration,
      ease
    });
  };

  useGSAP(() => {
    triggerAnimation();
  }, { dependencies: [fromX, fromY, fromScale, fromRotation, duration, ease], scope: containerRef });

  const code = `gsap.from(".orb", {
  x: ${fromX},
  y: ${fromY},
  scale: ${fromScale},
  rotation: ${fromRotation},
  opacity: 0,
  duration: ${duration},
  ease: "${ease}"
});`;

  return (
    <AnimationCard
      id="gsap-from"
      titleEs="Animar desde un estado"
      titleEn="gsap.from()"
      prompt="Quiero animar la aparición de un elemento flotante brillante usando gsap.from para que aparezca desde fuera de la pantalla (x, y negativos, rotación, escala reducida) y se desplace suavemente hacia su posición HTML base."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "gsap.from() define los valores de INICIO. El elemento comienza con las propiedades definidas en el objeto vars y viaja hacia sus estilos CSS originales.",
        varsObject: "{ x: ${fromX}, y: ${fromY}, scale: ${fromScale}, rotation: ${fromRotation}, opacity: 0, duration: ${duration}, ease: '${ease}' }",
        specialProps: "duration, ease, delay, immediateRender: true (fuerza al motor a renderizar los valores de inicio en el instante inicial).",
        aliases: "x, y, scale y rotation se aplican al inicio y se limpian hacia el estado final nativo.",
        easingConcept: "Ideal para animaciones de aparición. 'elastic.out' genera un efecto muelle al llegar al destino.",
        callbacksConcept: "onStart se ejecuta en el instante en que inicia el recorrido, útil si immediateRender altera la visibilidad.",
        timelineStructure: "Añadido secuencialmente con tl.from('.orb', {...})",
        pluginsAssociated: "No requiere plugins adicionales."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full flex justify-center py-10">
          <div ref={orbRef} className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 shadow-[0_0_30px_rgba(34,211,238,0.5)] border border-cyan-300/30 flex items-center justify-center font-bold text-xs text-slate-900">
            Glowing Orb
          </div>
        </div>
      }
      controlsChildren={
        <>
          <Slider label="Inicio X (x)" min={-300} max={300} value={fromX} onChange={setFromX} suffix="px" />
          <Slider label="Inicio Y (y)" min={-100} max={100} value={fromY} onChange={setFromY} suffix="px" />
          <Slider label="Escala Inicial" min={0.1} max={1.5} step={0.1} value={fromScale} onChange={setFromScale} />
          <Slider label="Rotación Inicial" min={-360} max={360} value={fromRotation} onChange={setFromRotation} suffix="deg" />
          <Slider label="Duración (duration)" min={0.5} max={4} step={0.1} value={duration} onChange={setDuration} suffix="s" />
          <Selector
            label="Curva de Aceleración"
            options={["elastic.out", "bounce.out", "back.out", "power3.out", "none"]}
            value={ease}
            onChange={setEase}
          />
        </>
      }
    />
  );
}

// --- gsap.fromTo() ---
export function GsapFromToDemo() {
  const [startX, setStartX] = useState(-150);
  const [endX, setEndX] = useState(150);
  const [startOpacity, setStartOpacity] = useState(0.2);
  const [endOpacity, setEndOpacity] = useState(1);
  const [startScale, setStartScale] = useState(0.5);
  const [endScale, setEndScale] = useState(1.5);
  const [duration, setDuration] = useState(1.5);
  const [ease, setEase] = useState("power3.inOut");

  const elementRef = useRef(null);
  const containerRef = useRef(null);

  const triggerAnimation = () => {
    if (!elementRef.current) return;
    gsap.killTweensOf(elementRef.current);
    gsap.fromTo(elementRef.current,
      { x: startX, opacity: startOpacity, scale: startScale, rotation: 0 },
      { x: endX, opacity: endOpacity, scale: endScale, rotation: 360, duration, ease }
    );
  };

  useGSAP(() => {
    triggerAnimation();
  }, { dependencies: [startX, endX, startOpacity, endOpacity, startScale, endScale, duration, ease], scope: containerRef });

  const code = `gsap.fromTo(".element", 
  { x: ${startX}, opacity: ${startOpacity}, scale: ${startScale}, rotation: 0 },
  { x: ${endX}, opacity: ${endOpacity}, scale: ${endScale}, rotation: 360, duration: ${duration}, ease: "${ease}" }
);`;

  return (
    <AnimationCard
      id="gsap-from-to"
      titleEs="Definir inicio y fin explícitos"
      titleEn="gsap.fromTo()"
      prompt="Quiero animar una esfera de color gradiente definiendo explícitamente tanto sus valores de inicio (from) como de llegada (to) para controlar exactamente su rango de escala, opacidad y posición sin depender del estado actual del DOM."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "gsap.fromTo() requiere dos objetos de variables. El primero define el estado de INICIO exacto y el segundo define el estado FINAL exacto.",
        varsObject: "gsap.fromTo(target, { fromVars }, { toVars })",
        specialProps: "Las propiedades especiales de control (duration, ease, repeat, etc.) se definen únicamente en el segundo objeto (toVars).",
        aliases: "x, opacity, scale y rotation se declaran en ambos objetos para forzar límites exactos de animación.",
        easingConcept: "Excelente para transiciones complejas donde la posición inicial y final están en constante cambio reactivo.",
        callbacksConcept: "onStart inicializa el estado con fromVars, onComplete consolida el final con toVars.",
        timelineStructure: " tl.fromTo('.element', { ... }, { ... })",
        pluginsAssociated: "No requiere plugins."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full flex justify-center py-10">
          <div ref={elementRef} className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 shadow-[0_0_25px_rgba(244,63,94,0.4)] border border-rose-300/30 flex items-center justify-center font-bold text-xs text-white">
            Star
          </div>
        </div>
      }
      controlsChildren={
        <>
          <Slider label="X Inicio" min={-180} max={0} value={startX} onChange={setStartX} suffix="px" />
          <Slider label="X Fin" min={0} max={180} value={endX} onChange={setEndX} suffix="px" />
          <Slider label="Opacidad Inicio" min={0} max={0.9} step={0.1} value={startOpacity} onChange={setStartOpacity} />
          <Slider label="Opacidad Fin" min={0.5} max={1} step={0.1} value={endOpacity} onChange={setEndOpacity} />
          <Slider label="Escala Inicio" min={0.2} max={1} step={0.1} value={startScale} onChange={setStartScale} />
          <Slider label="Escala Fin" min={1} max={2} step={0.1} value={endScale} onChange={setEndScale} />
          <Slider label="Duración (duration)" min={0.5} max={3} step={0.1} value={duration} onChange={setDuration} suffix="s" />
          <Selector
            label="Curva de Aceleración"
            options={["power3.inOut", "bounce.out", "elastic.out", "none"]}
            value={ease}
            onChange={setEase}
          />
        </>
      }
    />
  );
}

// --- gsap.set() ---
export function GsapSetDemo() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const boxRef = useRef(null);

  const applySet = () => {
    if (!boxRef.current) return;
    gsap.set(boxRef.current, { x, y, scale, rotation });
  };

  useEffect(() => {
    applySet();
  }, [x, y, scale, rotation]);

  const code = `gsap.set(".box", {
  x: ${x},
  y: ${y},
  scale: ${scale},
  rotation: ${rotation}
});`;

  return (
    <AnimationCard
      id="gsap-set"
      titleEs="Fijar estado instantáneo"
      titleEn="gsap.set()"
      prompt="Quiero aplicar propiedades CSS de forma instantánea usando gsap.set en React, simulando cambios inmediatos de posición, rotación y escala sin ninguna transición temporal."
      onRestart={applySet}
      codeString={code}
      technicalInfo={{
        tweenMethods: "gsap.set() aplica propiedades de manera instantánea (duración = 0). Equivale a un tween con duración cero, optimizado internamente para un rendimiento máximo.",
        varsObject: "{ x: ${x}, y: ${y}, scale: ${scale}, rotation: ${rotation} }",
        specialProps: "No tiene tiempo de animación. Se ejecuta de inmediato, ideal para preparar elementos antes de una secuencia.",
        aliases: "Transforma inmediatamente propiedades x, y, rotation, scale sin parpadeos visuales.",
        easingConcept: "No existe easing en un set() porque la duración es 0.",
        callbacksConcept: "onComplete se dispara en el mismo frame que se ejecuta el comando.",
        timelineStructure: "Útil para resets: tl.set('.box', { opacity: 0 }).to('.box', { opacity: 1 })",
        pluginsAssociated: "No requiere plugins."
      }}
      sandboxChildren={
        <div className="w-full flex justify-center py-10">
          <div ref={boxRef} className="w-20 h-20 rounded-xl bg-slate-800 border border-slate-700 shadow-inner flex items-center justify-center font-bold text-xs text-slate-300">
            Set Target
          </div>
        </div>
      }
      controlsChildren={
        <>
          <Slider label="Posición X" min={-150} max={150} value={x} onChange={setX} suffix="px" />
          <Slider label="Posición Y" min={-80} max={80} value={y} onChange={setY} suffix="px" />
          <Slider label="Escala" min={0.5} max={1.8} step={0.1} value={scale} onChange={setScale} />
          <Slider label="Rotación" min={-180} max={180} value={rotation} onChange={setRotation} suffix="deg" />
        </>
      }
    />
  );
}

// --- Métodos de Control ---
export function ControlMethodsDemo() {
  const [playState, setPlayState] = useState("running");
  const [seekVal, setSeekVal] = useState(0);

  const boxRef = useRef(null);
  const tweenRef = useRef(null);

  useGSAP(() => {
    if (!boxRef.current) return;
    
    tweenRef.current = gsap.to(boxRef.current, {
      x: 180,
      rotation: 360,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      paused: false,
      onUpdate: () => {
        if (tweenRef.current) {
          setSeekVal(Number(tweenRef.current.progress().toFixed(2)));
        }
      }
    });

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, []);

  const handlePlay = () => {
    tweenRef.current?.play();
    setPlayState("running");
  };

  const handlePause = () => {
    tweenRef.current?.pause();
    setPlayState("paused");
  };

  const handleReverse = () => {
    tweenRef.current?.reverse();
    setPlayState("reversing");
  };

  const handleRestart = () => {
    tweenRef.current?.restart();
    setPlayState("running");
  };

  const handleSeek = (val) => {
    setSeekVal(val);
    if (tweenRef.current) {
      tweenRef.current.progress(val);
    }
  };

  const code = `const tween = gsap.to(".box", { x: 180, rotation: 360, duration: 3, repeat: -1, yoyo: true });

// Métodos de control:
tween.play();    // Reanudar
tween.pause();   // Pausar
tween.reverse(); // Invertir dirección
tween.restart(); // Reiniciar desde cero
tween.progress(${seekVal}); // Ir a un punto exacto (0.0 - 1.0)`;

  return (
    <AnimationCard
      id="control-methods"
      titleEs="Métodos de Control de Animación"
      titleEn="play(), pause(), reverse()..."
      prompt="Quiero crear un reproductor multimedia de animación interactivo con GSAP, donde tenga botones de reproducir, pausar, invertir y reiniciar, además de un slider para arrastrar (seek/progress) el tiempo de la animación."
      onRestart={handleRestart}
      codeString={code}
      technicalInfo={{
        tweenMethods: "Cualquier tween o timeline de GSAP devuelve una instancia con métodos de control interactivos como play(), pause(), resume(), reverse(), restart(), seek() o progress().",
        varsObject: "const myTween = gsap.to(target, { ... })",
        specialProps: "repeat: -1 (bucle infinito), yoyo: true (vuelve hacia atrás al completar la vuelta).",
        aliases: "Ninguno. Controla la reproducción cronológica global del Tween.",
        easingConcept: "El control respeta la curva de aceleración configurada en el Tween mientras avanzamos o retrocedemos.",
        callbacksConcept: "onUpdate se ejecuta en cada frame, ideal para sincronizar el slider de progreso con el estado de React.",
        timelineStructure: "Los mismos métodos funcionan idénticamente en Timelines (tl.play(), tl.pause() etc.).",
        pluginsAssociated: "No requiere plugins."
      }}
      sandboxChildren={
        <div className="w-full flex flex-col items-center py-6 gap-6">
          <div className="w-[300px] h-1 bg-slate-800 rounded relative">
            <div 
              className="absolute h-full bg-purple-500 rounded transition-all duration-75"
              style={{ width: `${seekVal * 100}%` }}
            ></div>
          </div>
          <div ref={boxRef} className="w-16 h-16 rounded-xl bg-gradient-to-tr from-purple-500 to-rose-400 border border-white/20 shadow-md flex items-center justify-center font-bold text-xs text-white">
            GSAP
          </div>
          <div className="text-[10px] font-mono text-slate-400 uppercase">
            Estado de Reproducción: <span className="text-purple-400 font-bold">{playState}</span>
          </div>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={handlePlay} className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-semibold hover:bg-slate-800 hover:text-white transition-all">Play</button>
            <button onClick={handlePause} className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-semibold hover:bg-slate-800 hover:text-white transition-all">Pause</button>
            <button onClick={handleReverse} className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-semibold hover:bg-slate-800 hover:text-white transition-all">Reverse</button>
            <button onClick={handleRestart} className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-semibold hover:bg-slate-800 hover:text-white transition-all">Restart</button>
          </div>
          <Slider label="Progreso Manual (seek / progress)" min={0} max={1} step={0.01} value={seekVal} onChange={handleSeek} />
        </div>
      }
    />
  );
}


// =========================================================================
// 2. RITMO Y SECUENCIAS
// =========================================================================

// --- Easing Clásicos ---
export function EasingClassicsDemo() {
  const [ease, setEase] = useState("power2.out");
  const [triggerCount, setTriggerCount] = useState(0);

  const containerRef = useRef(null);

  const triggerAnimation = () => {
    setTriggerCount(prev => prev + 1);
  };

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.fromTo(".lane-dot", 
      { x: 0 },
      { x: 260, duration: 1.8, ease: ease, repeat: 1, yoyo: true }
    );
  }, { dependencies: [ease, triggerCount], scope: containerRef });

  const code = `gsap.to(".dot", {
  x: 260,
  duration: 1.8,
  ease: "${ease}"
});`;

  return (
    <AnimationCard
      id="easing-classics"
      titleEs="Easing Clásicos"
      titleEn="Linear, Power1 - Power4"
      prompt="Quiero comparar los distintos niveles de aceleración clásicos de GSAP (Linear, Power1, Power2, Power3, Power4) sobre un carril de animación horizontal para comprender visualmente cómo el easing altera la velocidad del elemento."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "El Easing define la curva de velocidad de la animación. Los clásicos se basan en potencias matemáticas (Power1 cuadrático, Power4 quintuplicado).",
        varsObject: "{ ease: '${ease}' }",
        specialProps: "Añadir .in (aceleración inicial), .out (desaceleración final) o .inOut a las palabras clave del ease (ej. 'power3.inOut').",
        aliases: "Traduce los tiempos relativos de renderizado de la propiedad animada de manera no lineal.",
        easingConcept: "Linear es una velocidad constante. Power1 a 4 ofrecen curvas que se vuelven más pronunciadas y dramáticas.",
        callbacksConcept: "onUpdate refleja de forma no lineal los cambios de valor.",
        timelineStructure: "Se aplica por Tween individual dentro de la línea de tiempo.",
        pluginsAssociated: "No requiere plugins."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full max-w-sm flex flex-col gap-3 py-6">
          {["linear", "power1.out", "power2.out", "power3.out", "power4.out"].map((laneEase) => (
            <div key={laneEase} className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>{laneEase}</span>
              </div>
              <div className="h-6 w-full bg-slate-950 rounded-lg relative overflow-hidden border border-slate-900/60 flex items-center">
                <div className="lane-dot absolute w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)] ml-2"></div>
              </div>
            </div>
          ))}
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <Selector
            label="Visualizar Curva Activa"
            options={["linear", "power1.out", "power2.out", "power3.out", "power4.out", "power2.inOut", "power4.in"]}
            value={ease}
            onChange={setEase}
          />
        </div>
      }
    />
  );
}

// --- Easing Dinámicos ---
export function EasingDynamicsDemo() {
  const [ease, setEase] = useState("bounce.out");
  const [triggerCount, setTriggerCount] = useState(0);
  const ballRef = useRef(null);
  const shadowRef = useRef(null);

  const triggerAnimation = () => {
    setTriggerCount(prev => prev + 1);
  };

  useGSAP(() => {
    if (!ballRef.current || !shadowRef.current) return;
    gsap.killTweensOf([ballRef.current, shadowRef.current]);
    
    // Reset positions
    gsap.set(ballRef.current, { y: -80, scaleY: 1, scaleX: 1 });
    gsap.set(shadowRef.current, { scaleX: 0.2, opacity: 0.1 });

    // Drop animation
    gsap.to(ballRef.current, {
      y: 60,
      duration: 1.5,
      ease: ease,
    });

    // Shadow scaling in sync
    gsap.to(shadowRef.current, {
      scaleX: 1,
      opacity: 0.7,
      duration: 1.5,
      ease: ease,
    });
  }, { dependencies: [ease, triggerCount] });

  const code = `gsap.to(".ball", {
  y: 60,
  duration: 1.5,
  ease: "${ease}"
});`;

  return (
    <AnimationCard
      id="easing-dynamics"
      titleEs="Easing Dinámicos"
      titleEn="Back, Elastic, Bounce"
      prompt="Quiero recrear un efecto de pelota que rebota físicamente usando la curva bounce.out de GSAP, y comparar su comportamiento elástico con elastic.out y back.out."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "Los easings dinámicos emulan efectos físicos como retroceso (back), muelles elásticos (elastic) o rebotes gravitacionales (bounce).",
        varsObject: "{ ease: '${ease}' }",
        specialProps: "elastic admite configuraciones adicionales en su string (ej. 'elastic.out(1, 0.3)' para amplitud y periodo).",
        aliases: "Ninguno.",
        easingConcept: "Bounce.out rebota de forma realista. Elastic.out vibra como una cuerda de guitarra. Back.out sobrepasa el límite antes de asentarse.",
        callbacksConcept: "onUpdate muestra cómo los valores oscilan y van más allá del rango 0-1.",
        timelineStructure: "Ideal para transiciones de UI divertidas o dinámicas.",
        pluginsAssociated: "No requiere plugins."
      }}
      sandboxChildren={
        <div className="w-full flex flex-col items-center justify-center h-44 relative py-6">
          <div className="relative flex flex-col items-center">
            <div ref={ballRef} className="w-12 h-12 rounded-full bg-gradient-to-b from-rose-400 to-red-600 shadow-md border border-white/10 z-10"></div>
            <div className="w-24 h-1 bg-slate-800 rounded-full mt-24"></div>
            <div ref={shadowRef} className="w-12 h-2 bg-black/40 rounded-full blur-[2px] mt-1 z-0 absolute bottom-[-10px]"></div>
          </div>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <Selector
            label="Tipo de Rebote Elástico"
            options={["bounce.out", "elastic.out", "back.out", "back.inOut"]}
            value={ease}
            onChange={setEase}
          />
        </div>
      }
    />
  );
}

// --- Easing Exclusivos ---
export function EasingExclusivesDemo() {
  const [ease, setEase] = useState("steps(5)");
  const [triggerCount, setTriggerCount] = useState(0);
  const elementRef = useRef(null);

  const triggerAnimation = () => {
    setTriggerCount(prev => prev + 1);
  };

  useGSAP(() => {
    if (!elementRef.current) return;
    gsap.killTweensOf(elementRef.current);
    gsap.set(elementRef.current, { x: -120 });
    gsap.to(elementRef.current, {
      x: 120,
      duration: 2.5,
      ease: ease,
      repeat: 1,
      yoyo: true
    });
  }, { dependencies: [ease, triggerCount] });

  const code = `gsap.to(".element", {
  x: 120,
  duration: 2.5,
  ease: "${ease}"
});`;

  return (
    <AnimationCard
      id="easing-exclusives"
      titleEs="Easing Exclusivos"
      titleEn="SlowMo, SteppedEase..."
      prompt="Quiero animar un indicador digital usando el ease stepped o SlowMo de GSAP para simular el paso discreto de frames (como las manecillas de un reloj) o un efecto cinematográfico de cámara lenta central."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "Los Easing Exclusivos permiten modular el flujo de forma discreta o no lineal única (como saltar de frame en frame con SteppedEase o frenar a mitad de trayecto con SlowMo).",
        varsObject: "{ ease: '${ease}' }",
        specialProps: "steps(N) define la cantidad de tramos discretos en los que se divide el recorrido lineal.",
        aliases: "Ninguno.",
        easingConcept: "SteppedEase divide la interpolación en pasos discretos ideales para simular cronómetros, spritesheets o relojes mecánicos.",
        callbacksConcept: "Los cambios discretos ocurren en saltos instantáneos.",
        timelineStructure: "Ninguna diferencia.",
        pluginsAssociated: "No requiere plugins adicionales para Stepped/SlowMo. CustomEase requiere el plugin oficial CustomEase para curvas personalizadas complejas."
      }}
      sandboxChildren={
        <div className="w-full flex justify-center py-10">
          <div ref={elementRef} className="w-12 h-12 rounded-lg bg-gradient-to-tr from-amber-400 to-orange-500 border border-white/20 shadow-md flex items-center justify-center font-mono text-slate-900 font-extrabold text-xs">
            STEP
          </div>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <Selector
            label="Curva Exclusiva"
            options={["steps(5)", "steps(12)", "steps(3)", "slow(0.7, 0.7, false)", "none"]}
            value={ease}
            onChange={setEase}
          />
        </div>
      }
    />
  );
}

// --- Stagger Básicos ---
export function StaggerBasicsDemo() {
  const [staggerValue, setStaggerValue] = useState(0.15);
  const [triggerCount, setTriggerCount] = useState(0);

  const containerRef = useRef(null);

  const triggerAnimation = () => {
    setTriggerCount(prev => prev + 1);
  };

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.killTweensOf(".bar-item");
    gsap.set(".bar-item", { scaleY: 0.2, opacity: 0.3 });
    gsap.to(".bar-item", {
      scaleY: 1,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      stagger: staggerValue
    });
  }, { dependencies: [staggerValue, triggerCount], scope: containerRef });

  const code = `gsap.to(".bar-item", {
  scaleY: 1,
  opacity: 1,
  duration: 0.8,
  ease: "power2.out",
  stagger: ${staggerValue}
});`;

  return (
    <AnimationCard
      id="stagger-basics"
      titleEs="Stagger Básico"
      titleEn="Stagger by Value"
      prompt="Quiero animar la aparición secuencial de múltiples barras de carga usando GSAP stagger con un retraso flotante para simular una onda de ecualizador de audio."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "Al pasar un selector múltiple a GSAP (o un array de elementos), el atributo 'stagger' aplica un retraso progresivo en segundos a cada elemento consecutivo.",
        varsObject: "{ stagger: ${staggerValue} }",
        specialProps: "stagger (si es numérico, define el tiempo de espera entre el inicio de una animación y la siguiente).",
        aliases: "scaleY afecta al eje vertical y conserva el centro de transformación base (origin) configurado en CSS (bottom).",
        staggerConcept: "El desfase temporal básico calcula automáticamente: index * staggerValue.",
        easingConcept: "Cada elemento individual ejecuta el mismo ease de forma independiente.",
        callbacksConcept: "Puedes capturar callbacks en cada elemento individual.",
        timelineStructure: "El stagger agrupa las animaciones en una única llamada, expandiendo la duración global en el Timeline.",
        pluginsAssociated: "No requiere plugins."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full flex justify-center items-end h-28 gap-3 py-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bar-item w-4 h-24 rounded-full bg-gradient-to-t from-purple-500 to-cyan-400 origin-bottom border border-white/10"
              style={{ transform: "scaleY(0.2)", opacity: 0.3 }}
            ></div>
          ))}
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <Slider label="Retraso de Stagger" min={0.05} max={0.5} step={0.05} value={staggerValue} onChange={setStaggerValue} suffix="s" />
        </div>
      }
    />
  );
}

// --- Stagger Avanzados ---
export function StaggerAdvancedDemo() {
  const [from, setFrom] = useState("center");
  const [axis, setAxis] = useState("null");
  const [triggerCount, setTriggerCount] = useState(0);

  const containerRef = useRef(null);

  const triggerAnimation = () => {
    setTriggerCount(prev => prev + 1);
  };

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.killTweensOf(".grid-item");
    gsap.set(".grid-item", { scale: 0.1, opacity: 0.2, backgroundColor: "rgba(192, 132, 252, 0.2)" });
    
    gsap.to(".grid-item", {
      scale: 1,
      opacity: 1,
      backgroundColor: "rgba(34, 211, 238, 0.9)",
      duration: 0.6,
      ease: "power2.out",
      stagger: {
        grid: [4, 6],
        from: from,
        axis: axis === "null" ? null : axis,
        amount: 1.2
      }
    });
  }, { dependencies: [from, axis, triggerCount], scope: containerRef });

  const code = `gsap.to(".grid-item", {
  scale: 1,
  opacity: 1,
  duration: 0.6,
  ease: "power2.out",
  stagger: {
    grid: [4, 6],
    from: "${from}",
    axis: ${axis === "null" ? "null" : `"${axis}"`},
    amount: 1.2
  }
});`;

  return (
    <AnimationCard
      id="stagger-advanced"
      titleEs="Stagger Avanzado"
      titleEn="Stagger Config Objects"
      prompt="Quiero animar una rejilla bidimensional de esferas usando un objeto de configuración avanzada de stagger, indicando la distribución de la cuadrícula grid, el eje de propagación y el punto de origen (centro, bordes) para crear una onda radial."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "Un objeto stagger avanzado permite calcular retrasos bidimensionales en base a la posición de los elementos en una rejilla virtual.",
        varsObject: "stagger: { grid: [filas, cols], from: string, axis: string, amount: number }",
        specialProps: "amount (duración total en segundos distribuida entre todas las animaciones), grid (dimensiones de la cuadrícula en columnas/filas para calcular distancias espaciales).",
        aliases: "Ninguno.",
        staggerConcept: "El motor calcula la distancia euclidiana desde el origen ('from') a cada elemento de la rejilla para definir su retraso.",
        easingConcept: "Se puede añadir un 'ease' dentro del objeto stagger para modificar el espaciado temporal de la onda.",
        callbacksConcept: "Ninguno.",
        timelineStructure: "Representa un bloque unificado de animaciones secuenciales complejas en el Timeline.",
        pluginsAssociated: "No requiere plugins."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full flex justify-center py-6">
          <div className="grid grid-cols-6 gap-2 bg-slate-950/60 p-4 rounded-xl border border-slate-900">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="grid-item w-5 h-5 rounded bg-purple-500/20 border border-white/5"
                style={{ transform: "scale(0.1)", opacity: 0.2 }}
              ></div>
            ))}
          </div>
        </div>
      }
      controlsChildren={
        <>
          <Selector
            label="Punto de Origen (from)"
            options={["center", "start", "end", "edges"]}
            value={from}
            onChange={setFrom}
          />
          <Selector
            label="Eje de Onda (axis)"
            options={["null", "x", "y"]}
            value={axis}
            onChange={setAxis}
          />
        </>
      }
    />
  );
}


// =========================================================================
// 3. TIMELINES (Secuenciación Compleja)
// =========================================================================

// --- Construcción Base ---
export function TimelineBaseDemo() {
  const [triggerCount, setTriggerCount] = useState(0);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const footerRef = useRef(null);

  const triggerAnimation = () => {
    setTriggerCount(prev => prev + 1);
  };

  useGSAP(() => {
    if (!headerRef.current || !bodyRef.current || !footerRef.current) return;
    const tl = gsap.timeline({
      defaults: { duration: 0.6, ease: "power2.out" }
    });

    // Reset initial states
    gsap.set([headerRef.current, bodyRef.current, footerRef.current], { x: -80, opacity: 0 });

    // Method Chaining
    tl.to(headerRef.current, { x: 0, opacity: 1 })
      .to(bodyRef.current, { x: 0, opacity: 1 })
      .to(footerRef.current, { x: 0, opacity: 1 });
  }, { dependencies: [triggerCount] });

  const code = `const tl = gsap.timeline({
  defaults: { duration: 0.6, ease: "power2.out" }
});

// Encadenamiento de métodos (Method Chaining)
tl.to(".header", { x: 0, opacity: 1 })
  .to(".body", { x: 0, opacity: 1 })
  .to(".footer", { x: 0, opacity: 1 });`;

  return (
    <AnimationCard
      id="timeline-base"
      titleEs="Construcción Base y Defaults"
      titleEn="gsap.timeline()"
      prompt="Quiero secuenciar la aparición progresiva de una tarjeta simulando una interfaz real (cabecera, cuerpo de texto y botón) usando una línea de tiempo (gsap.timeline) con propiedades por defecto (defaults) para evitar repetir la duración en cada tween."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "gsap.timeline() crea un contenedor de animaciones en el que los tweens se ejecutan secuencialmente uno detrás del otro por defecto.",
        varsObject: "gsap.timeline({ defaults: { duration: 0.6 } })",
        specialProps: "defaults (objeto que hereda propiedades de animación a todos los tweens internos del timeline, ahorrando código redundante).",
        aliases: "Optimiza el rendimiento agrupando múltiples animaciones del DOM.",
        easingConcept: "Cada Tween del timeline respeta el ease definido en su interior o hereda el ease de defaults.",
        callbacksConcept: "onComplete en el timeline se dispara cuando TODO el flujo secuencial termina.",
        timelineStructure: "Permite una modularidad absoluta, controlando complejas secuencias con un solo play/pause.",
        pluginsAssociated: "No requiere plugins."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full flex justify-center py-6">
          <div className="w-56 glass-panel border border-slate-800 p-4 rounded-xl flex flex-col gap-3 shadow-lg">
            <div ref={headerRef} className="h-4 w-2/3 bg-purple-500/25 border border-purple-500/20 rounded"></div>
            <div ref={bodyRef} className="space-y-1.5 py-1">
              <div className="h-2 w-full bg-slate-800 rounded"></div>
              <div className="h-2 w-full bg-slate-800 rounded"></div>
              <div className="h-2 w-4/5 bg-slate-800 rounded"></div>
            </div>
            <div ref={footerRef} className="h-8 w-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-[10px] text-white">
              Botón de Acción
            </div>
          </div>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-xs text-slate-400 italic">
          Haz clic en "Reiniciar Animación" para ver la secuencia ordenada.
        </div>
      }
    />
  );
}

// --- Parámetro de Posición ---
export function PositionParameterDemo() {
  const [positionMode, setPositionMode] = useState("<");
  const [triggerCount, setTriggerCount] = useState(0);

  const containerRef = useRef(null);
  const redRef = useRef(null);
  const blueRef = useRef(null);
  const greenRef = useRef(null);

  const triggerAnimation = () => {
    setTriggerCount(prev => prev + 1);
  };

  useGSAP(() => {
    if (!redRef.current || !blueRef.current || !greenRef.current) return;
    const tl = gsap.timeline();

    // Reset positions
    gsap.set([redRef.current, blueRef.current, greenRef.current], { x: -100, opacity: 0 });

    // Animating boxes with the selected position parameter
    tl.to(redRef.current, { x: 80, opacity: 1, duration: 1 })
      .to(blueRef.current, { x: 80, opacity: 1, duration: 1 }) 
      .to(greenRef.current, { x: 80, opacity: 1, duration: 1 }, positionMode === "default" ? undefined : positionMode);
  }, { dependencies: [positionMode, triggerCount] });

  const code = `const tl = gsap.timeline();

tl.to(".red", { x: 80, opacity: 1, duration: 1 })
  .to(".blue", { x: 80, opacity: 1, duration: 1 })
  // Parámetro de Posición aplicado a la tercera animación:
  .to(".green", { x: 80, opacity: 1, duration: 1 }, "${positionMode}");`;

  return (
    <AnimationCard
      id="position-parameter"
      titleEs="Parámetro de Posición"
      titleEn="The Position Parameter"
      prompt="Quiero demostrar visualmente cómo funciona el parámetro de posición en los Timelines de GSAP, permitiendo solapar animaciones usando posiciones absolutas, desfases relativos o sincronizándolas con el inicio del elemento anterior."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "El parámetro de posición se pasa como tercer argumento en tl.to(), tl.from() o tl.fromTo() y controla exactamente CUÁNDO se inserta el tween.",
        varsObject: "tl.to(target, { vars }, position)",
        specialProps: "Posiciones posibles: Absoluto (ej. 2 -> inicia exactamente al segundo 2), Relativo (ej. '+=0.5' -> retrasa 0.5s, '-=0.5' -> solapa 0.5s), Sincronizado ('<' -> inicia junto al anterior, '>' -> inicia al terminar el anterior).",
        aliases: "Ninguno.",
        staggerConcept: "Permite una secuenciación manual no lineal sin necesidad de calcular offsets matemáticos en código.",
        easingConcept: "No afecta las curvas de velocidad, solo modifica el punto de inicio del Tween en la línea de tiempo.",
        callbacksConcept: "Los eventos globales del timeline calculan la duración acumulada en base a las posiciones relativas.",
        timelineStructure: "Es el corazón de los timelines complejos. Sin él, todas las animaciones se encolarían una tras otra en fila india.",
        pluginsAssociated: "No requiere plugins."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full flex flex-col gap-3 py-6 items-center">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-red-400 font-bold w-12 text-right">Elemento 1:</span>
            <div ref={redRef} className="w-10 h-10 rounded bg-red-500 border border-white/10 shadow"></div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-blue-400 font-bold w-12 text-right">Elemento 2:</span>
            <div ref={blueRef} className="w-10 h-10 rounded bg-cyan-500 border border-white/10 shadow"></div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-emerald-400 font-bold w-12 text-right">Elemento 3:</span>
            <div ref={greenRef} className="w-10 h-10 rounded bg-emerald-500 border border-white/10 shadow"></div>
          </div>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <Selector
            label="Parámetro de Posición (Elemento 3)"
            options={["<", ">", "+=0.5", "-=0.8", "1.5", "default"]}
            value={positionMode}
            onChange={setPositionMode}
          />
        </div>
      }
    />
  );
}


// =========================================================================
// 4. INTERACTIVIDAD Y SCROLL (Plugins Core)
// =========================================================================

// --- ScrollTrigger Básicos ---
export function ScrollTriggerBasicDemo() {
  const triggerRef = useRef(null);
  const elementRef = useRef(null);

  useGSAP(() => {
    if (!elementRef.current || !triggerRef.current) return;
    gsap.killTweensOf(elementRef.current);
    
    gsap.fromTo(elementRef.current,
      { scale: 0.5, opacity: 0.1, rotation: -45 },
      {
        scale: 1.1,
        opacity: 1,
        rotation: 0,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top bottom-=80px", 
          end: "bottom center",
          toggleActions: "play none none reverse", 
          markers: true 
        }
      }
    );
  }, { scope: triggerRef });

  const code = `gsap.fromTo(".card", 
  { scale: 0.5, opacity: 0.1, rotation: -45 },
  {
    scale: 1.1,
    opacity: 1,
    rotation: 0,
    scrollTrigger: {
      trigger: ".trigger-container",
      start: "top bottom-=80px",
      end: "bottom center",
      toggleActions: "play none none reverse"
    }
  }
);`;

  return (
    <AnimationCard
      id="scroll-trigger-basic"
      titleEs="ScrollTrigger Básico"
      titleEn="Scroll Trigger & Markers"
      prompt="Quiero animar la revelación de una tarjeta premium cuando entra en el viewport haciendo scroll usando el plugin ScrollTrigger de GSAP, y configurar la acción para que retroceda si el usuario vuelve arriba."
      onRestart={() => ScrollTrigger.refresh()}
      codeString={code}
      technicalInfo={{
        tweenMethods: "ScrollTrigger permite disparar tweens y timelines basados en la posición de desplazamiento de la ventana o de un contenedor scrollable.",
        varsObject: "scrollTrigger: { trigger: selector, start: string, end: string, toggleActions: string }",
        specialProps: "toggleActions: 'onEnter onLeave onEnterBack onLeaveBack' (define si reproducir, pausar, resetear o revertir en cada zona del scroll).",
        aliases: "Ninguno.",
        easingConcept: "La animación se reproduce con su velocidad natural e independiente del scroll de forma autónoma una vez disparado.",
        callbacksConcept: "onEnter, onLeave, onUpdate etc. útiles para rastrear la interacción.",
        timelineStructure: "Se puede asociar un ScrollTrigger global a todo un Timeline en lugar de tweens individuales.",
        pluginsAssociated: "Requiere el plugin ScrollTrigger. Registrado con gsap.registerPlugin(ScrollTrigger)."
      }}
      sandboxChildren={
        <div ref={triggerRef} className="w-full flex flex-col items-center py-10 gap-2">
          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-ping"></span>
            HAZ SCROLL ABAJO/ARRIBA PARA PROBAR
          </div>
          <div ref={elementRef} className="w-48 p-6 glass-panel border border-purple-500/20 rounded-2xl shadow-premium text-center">
            <h4 className="text-white font-bold text-xs">Revelación por Scroll</h4>
            <p className="text-[10px] text-slate-400 mt-2 font-mono">ScrollTrigger activo. Respeta tu velocidad de desplazamiento.</p>
          </div>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-xs text-slate-400 italic">
          El ScrollTrigger está enlazado dinámicamente al scroll de tu pantalla. Desplaza la página y observa cómo este contenedor rota y se revela.
        </div>
      }
    />
  );
}

// --- ScrollTrigger Avanzado ---
export function ScrollTriggerAdvancedDemo() {
  const [scrub, setScrub] = useState(true);
  const containerRef = useRef(null);
  const scrollBoxRef = useRef(null);
  const boxRef = useRef(null);

  useGSAP(() => {
    if (!boxRef.current || !scrollBoxRef.current) return;
    gsap.killTweensOf(boxRef.current);
    
    gsap.fromTo(boxRef.current,
      { x: -110, rotation: 0, backgroundColor: "rgb(192, 132, 252)" },
      {
        x: 110,
        rotation: 360,
        backgroundColor: "rgb(34, 211, 238)",
        scrollTrigger: {
          trigger: scrollBoxRef.current,
          scroller: scrollBoxRef.current, 
          start: "top top+=10px",
          end: "bottom bottom-=10px",
          scrub: scrub,
        }
      }
    );
  }, { dependencies: [scrub], scope: containerRef });

  const code = `gsap.to(".box", {
  x: 110,
  rotation: 360,
  scrollTrigger: {
    trigger: ".box-container",
    scroller: ".internal-scroll-box", 
    start: "top top",
    end: "bottom bottom",
    scrub: ${scrub ? "true" : "false"}
  }
});`;

  return (
    <AnimationCard
      id="scroll-trigger-advanced"
      titleEs="Scroll Trigger Avanzado"
      titleEn="Scrub, Pinning & Parallax"
      prompt="Quiero construir una animación donde un bloque rote y cambie de color vinculando directamente el progreso temporal de GSAP al scrollbar del contenedor usando scrub, de modo que si el scroll se detiene, la animación también."
      onRestart={() => ScrollTrigger.refresh()}
      codeString={code}
      technicalInfo={{
        tweenMethods: "Un ScrollTrigger avanzado utiliza 'scrub' para vincular el progreso temporal del tween directamente a la barra de scroll.",
        varsObject: "scrollTrigger: { scrub: true | number, pin: boolean | string, scroller: element }",
        specialProps: "scrub: true (sincronía inmediata) o un número en segundos (ej. 1 -> añade un lag/retraso elástico de seguimiento suave).",
        aliases: "El motor intercepta el scroll del DOM y calcula un porcentaje (0.0 - 1.0) para interpolar las propiedades del vars.",
        easingConcept: "La curva del ease ya no determina el tiempo real, sino la aceleración espacial sobre la distancia del scrollbar.",
        callbacksConcept: "onScrubComplete o progresiones por frame en onUpdate.",
        timelineStructure: "Excelente para crear efectos Parallax y landing pages narrativas altamente visuales.",
        pluginsAssociated: "ScrollTrigger."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full flex flex-col items-center py-4">
          <div className="text-[10px] text-slate-500 font-mono mb-2">SCROLLEA DENTRO DE LA CAJA GRIS</div>
          <div 
            ref={scrollBoxRef} 
            className="w-64 h-40 overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-24 relative"
          >
            <div className="text-[9px] font-mono text-purple-400/80 uppercase">Inicio del Scroll ▲</div>
            
            <div className="flex justify-center my-4">
              <div ref={boxRef} className="w-12 h-12 rounded bg-purple-500 shadow border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                Scrub
              </div>
            </div>

            <div className="text-[9px] font-mono text-cyan-400/80 uppercase text-right">Fin del Scroll ▼</div>
          </div>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <Toggle label="Activar Acoplamiento de Scroll (scrub)" checked={scrub} onChange={setScrub} />
        </div>
      }
    />
  );
}

// --- Draggable ---
export function DraggableDemo() {
  const [bounce, setBounce] = useState(true);
  const containerRef = useRef(null);
  const dragRef = useRef(null);
  const draggableInstance = useRef(null);

  useGSAP(() => {
    if (!dragRef.current || !containerRef.current) return;
    
    if (draggableInstance.current && draggableInstance.current.length > 0) {
      draggableInstance.current[0].kill();
    }

    draggableInstance.current = Draggable.create(dragRef.current, {
      bounds: containerRef.current,
      edgeResistance: 0.65,
      type: "x,y",
      inertia: false, 
      onRelease: function() {
        if (bounce) {
          gsap.to(this.target, { x: 0, y: 0, duration: 1.2, ease: "elastic.out(1, 0.4)" });
        }
      }
    });

    return () => {
      if (draggableInstance.current && draggableInstance.current.length > 0) {
        draggableInstance.current[0].kill();
      }
    };
  }, { dependencies: [bounce], scope: containerRef });

  const code = `// Requiere registrar el plugin Draggable
gsap.registerPlugin(Draggable);

Draggable.create(".drag-box", {
  bounds: ".sandbox-container",
  edgeResistance: 0.65,
  type: "x,y",
  onRelease: function() {
    // Simula muelle elástico al soltar
    gsap.to(this.target, { x: 0, y: 0, duration: 1.2, ease: "elastic.out(1, 0.4)" });
  }
});`;

  return (
    <AnimationCard
      id="draggable"
      titleEs="Draggable e Interacción"
      titleEn="Drag & Inertia"
      prompt="Quiero hacer que una tarjeta flotante de cristal sea completamente arrastrable dentro de su caja contenedora usando GSAP Draggable, y configurar un efecto elástico para que regrese a su posición original al soltarla."
      onRestart={() => {
        if (dragRef.current) {
          gsap.to(dragRef.current, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
        }
      }}
      codeString={code}
      technicalInfo={{
        tweenMethods: "GSAP Draggable proporciona la habilidad de arrastrar y soltar elementos HTML de forma táctil y mediante puntero físico.",
        varsObject: "Draggable.create(target, { bounds, type, onRelease })",
        specialProps: "bounds (limita el área de arrastre al selector indicado), edgeResistance (fricción al sobrepasar límites), type: 'x,y' (arrastre bidimensional) o 'rotation' (arrastrar para girar).",
        aliases: "Usa internamente transformaciones translate3d para un rendimiento móvil impecable de 60fps.",
        easingConcept: "El retorno elástico al soltar usa el muelle 'elastic.out' para dar una respuesta háptica e interactiva de juguete de física.",
        callbacksConcept: "onDragStart, onDrag, onDragEnd, onRelease, onPress, onClick.",
        timelineStructure: "Se puede pausar o reanudar el arrastre libre del usuario desde un control externo.",
        pluginsAssociated: "Plugin Draggable. Para física de inercia y lanzamientos complejos con fricción se complementa con InertiaPlugin."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full h-56 relative border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <Move size={80} className="text-slate-300" />
          </div>
          <div 
            ref={dragRef} 
            className="w-28 h-28 glass-panel border border-cyan-400/30 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.15)] flex flex-col items-center justify-center p-3 text-center cursor-grab active:cursor-grabbing z-10 select-none"
          >
            <MousePointer size={18} className="text-cyan-400 mb-1 animate-bounce" />
            <h4 className="text-[10px] text-white font-bold uppercase font-mono">Arrástrame</h4>
            <p className="text-[8px] text-slate-400 leading-none mt-1">Suelto elástico</p>
          </div>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <Toggle label="Efecto Elástico al Soltar (Reset Elastic)" checked={bounce} onChange={setBounce} />
        </div>
      }
    />
  );
}

// --- Observer ---
export function ObserverDemo() {
  const [scrollDirection, setScrollDirection] = useState("Ninguno");
  const containerRef = useRef(null);
  const activeBoxRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current || !activeBoxRef.current) return;

    const observerInstance = Observer.create({
      target: containerRef.current,
      type: "wheel,touch,pointer",
      onChange: (self) => {
        let dir = "Ninguno";
        let color = "#c084fc";
        if (self.deltaY > 0) {
          dir = "Abajo (Down)";
          color = "#f43f5e";
        } else if (self.deltaY < 0) {
          dir = "Arriba (Up)";
          color = "#34d399";
        } else if (self.deltaX > 0) {
          dir = "Derecha (Right)";
          color = "#22d3ee";
        } else if (self.deltaX < 0) {
          dir = "Izquierda (Left)";
          color = "#fbbf24";
        }

        setScrollDirection(dir);
        
        gsap.fromTo(activeBoxRef.current,
          { scale: 0.85 },
          { scale: 1, borderColor: color, duration: 0.4, ease: "back.out" }
        );
      }
    });

    return () => {
      observerInstance?.kill();
    };
  }, { scope: containerRef });

  const code = `// Requiere registrar el plugin Observer
gsap.registerPlugin(Observer);

Observer.create({
  target: ".gesture-box",
  type: "wheel,touch,pointer", 
  onChange: (self) => {
    console.log("Delta X:", self.deltaX, "Delta Y:", self.deltaY);
  }
});`;

  return (
    <AnimationCard
      id="observer"
      titleEs="Observer Gestures"
      titleEn="Unified Gesture Listener"
      prompt="Quiero capturar gestos unificados (rueda de ratón, swipe táctil y arrastre) en una zona interactiva usando GSAP Observer para cambiar el color de una caja y animar su escala de manera fluida ante cada evento."
      onRestart={() => setScrollDirection("Ninguno")}
      codeString={code}
      technicalInfo={{
        tweenMethods: "Observer unifica escuchadores de eventos para desplazamientos por ratón, trackpad, toques táctiles y gestos swipe en una API unificada.",
        varsObject: "Observer.create({ target, type: 'wheel,touch,pointer', onChange })",
        specialProps: "type (lista de eventos a vigilar), target (zona reactiva), tolerance (pixelaje mínimo para disparar el callback).",
        aliases: "Elimina la necesidad de lidiar de forma manual con addEventListener('wheel') o 'touchstart' y sus inconsistencias de hardware.",
        easingConcept: "Sincroniza y reacciona de forma dinámica a la velocidad física de entrada del usuario.",
        callbacksConcept: "onUp, onDown, onLeft, onRight, onChange, onPress, onRelease.",
        timelineStructure: "Excelente para disparar transiciones de diapositivas o pantallas completas tipo Fullpage.",
        pluginsAssociated: "Plugin Observer (incluido gratuitamente en el núcleo de GSAP)."
      }}
      sandboxChildren={
        <div 
          ref={containerRef} 
          className="w-full h-48 border border-dashed border-slate-800 bg-slate-900/40 rounded-xl flex flex-col items-center justify-center p-6 select-none cursor-pointer"
        >
          <div 
            ref={activeBoxRef} 
            className="w-32 py-4 border-2 border-purple-500 rounded-xl bg-slate-950 flex flex-col items-center justify-center text-center shadow-lg transition-colors"
          >
            <span className="text-[10px] text-slate-500 font-mono uppercase">Gesto Detectado:</span>
            <span className="text-xs font-bold text-white mt-1 tracking-wider">{scrollDirection}</span>
          </div>
          <p className="text-[9px] text-slate-400 mt-4 text-center font-mono leading-none">
            HAZ SWIPE TÁCTIL, ARRASTRA O ROTA LA RUEDA AQUÍ DENTRO
          </p>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-xs text-slate-400 italic">
          El panel monitoriza tu trackpad/rueda y gestos móviles enviando señales inmediatas a la animación.
        </div>
      }
    />
  );
}


// =========================================================================
// 5. TEXTO Y EFECTOS FX (Plugins Especiales)
// =========================================================================

// --- SplitText FX ---
export function SplitTextDemo() {
  const [splitMode, setSplitMode] = useState("chars");
  const [triggerCount, setTriggerCount] = useState(0);
  const containerRef = useRef(null);

  const triggerAnimation = () => {
    setTriggerCount(prev => prev + 1);
  };

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.killTweensOf(".split-char");
    gsap.killTweensOf(".split-word");

    if (splitMode === "chars") {
      gsap.fromTo(".split-char",
        { y: 30, opacity: 0, rotationX: -90 },
        { y: 0, opacity: 1, rotationX: 0, duration: 0.6, stagger: 0.03, ease: "back.out(1.5)" }
      );
    } else {
      gsap.fromTo(".split-word",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, { dependencies: [splitMode, triggerCount], scope: containerRef });

  const rawText = "VIBE CODING";

  const code = `// Sintaxis oficial real de GSAP SplitText (Premium Club):
const split = new SplitText(".text-animate", { type: "${splitMode}" });
gsap.from(split.${splitMode}, {
  y: 30,
  opacity: 0,
  stagger: ${splitMode === 'chars' ? 0.03 : 0.1},
  duration: 0.6,
  ease: "back.out(1.5)"
});`;

  return (
    <AnimationCard
      id="split-text"
      titleEs="SplitText FX"
      titleEn="Text Splitting Plugin"
      prompt="Quiero simular el efecto de SplitText de GSAP para descomponer un título y animar secuencialmente con stagger cada letra por separado mediante un salto 3D elástico."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "SplitText desglosa texto HTML plano en divs de letras, palabras o líneas de forma automática para animarlas por separado.",
        varsObject: "new SplitText(target, { type: 'chars,words,lines' })",
        specialProps: "Permite aislar por letra para crear efectos avanzados de tipografía reactiva cinética.",
        aliases: "El plugin descompone y añade divs con display inline-block conservando la accesibilidad web original.",
        staggerConcept: "Es crucial usar stagger pequeños (0.02 - 0.05) al animar caracteres para mantener el ritmo fluido.",
        easingConcept: "Easing de rebote o elástico para dar sensación de elasticidad al texto.",
        callbacksConcept: "onComplete permite reconstruir (revert) el texto para evitar alterar la semántica HTML.",
        timelineStructure: " tl.from(split.chars, { opacity: 0, stagger: 0.02 })",
        pluginsAssociated: "Requiere el plugin SplitText (GSAP Club). Simulado localmente dividiendo cadenas HTML en React."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full flex justify-center py-8">
          <h3 
            key={`${splitMode}-${triggerCount}`}
            className="text-4xl md:text-5xl font-black tracking-widest font-mono perspective-500"
          >
            {splitMode === "chars" ? (
              rawText.split("").map((char, i) => (
                <span
                  key={i}
                  className="split-char inline-block origin-bottom transform-gpu text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"
                  style={{ display: char === " " ? "inline" : "inline-block", marginRight: char === " " ? "12px" : "1px" }}
                >
                  {char}
                </span>
              ))
            ) : (
              rawText.split(" ").map((word, i) => (
                <span
                  key={i}
                  className="split-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"
                  style={{ marginRight: "16px" }}
                >
                  {word}
                </span>
              ))
            )}
          </h3>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <Selector
            label="Tipo de División Tipográfica (Split Type)"
            options={["chars", "words"]}
            value={splitMode}
            onChange={setSplitMode}
          />
        </div>
      }
    />
  );
}

// --- TextPlugin & ScrambleText ---
export function TextScrambleDemo() {
  const [text, setText] = useState("VIBE-CODING");
  const textRef = useRef(null);

  const triggerAnimation = () => {
    if (!textRef.current) return;
    gsap.killTweensOf(textRef.current);
    
    const words = ["CREATIVIDAD", "TECNOLOGÍA", "GSAP V3", "SANCTUARY"];
    const nextWord = words[Math.floor(Math.random() * words.length)];
    
    gsap.to(textRef.current, {
      text: {
        value: nextWord,
        speed: 1,
      },
      duration: 1.5,
      ease: "none"
    });
    setText(nextWord);
  };

  useGSAP(() => {
    if (!textRef.current) return;
    gsap.to(textRef.current, {
      text: "VIBE-CODING",
      duration: 1,
      ease: "power1.out"
    });
  }, { scope: textRef });

  const code = `// Requiere registrar TextPlugin (Gratuito) o ScrambleTextPlugin (Club)
gsap.registerPlugin(TextPlugin);

gsap.to(".scramble-text", {
  duration: 1.5,
  text: {
    value: "${text}",
    scrambleText: { chars: "01X*#%", speed: 0.4 } 
  }
});`;

  return (
    <AnimationCard
      id="text-scramble"
      titleEs="Text & Scramble FX"
      titleEn="Typewriter & Decrypt"
      prompt="Quiero recrear un efecto de máquina de escribir donde el texto cambie carácter a carácter de forma secuencial simulando la desencriptación o recarga de palabras usando TextPlugin."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "TextPlugin permite animar el contenido de texto de un nodo HTML interpolando letras una a una (efecto máquina de escribir).",
        varsObject: "text: { value: string }",
        specialProps: "scrambleText: { chars, speed } (específico del plugin Premium ScrambleText, simula descodificación binaria de código).",
        aliases: "Ninguno. Modifica directamente la propiedad innerText/textContent del nodo.",
        easingConcept: "Usualmente se configura con ease: 'none' para que la cadencia de tipeo sea uniforme.",
        callbacksConcept: "onUpdate monitoriza cada carácter insertado.",
        timelineStructure: "Excelente para presentar títulos de interfaces futuristas de forma secuencial.",
        pluginsAssociated: "TextPlugin (Gratuito en núcleo) y ScrambleTextPlugin (Club Premium)."
      }}
      sandboxChildren={
        <div className="w-full flex justify-center py-10">
          <span 
            ref={textRef} 
            className="text-3xl font-mono font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 border-r-2 border-emerald-400 pr-1 animate-pulse"
          >
            ...
          </span>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center">
          <button
            onClick={triggerAnimation}
            className="px-4 py-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 hover:bg-emerald-900/40 text-emerald-400 text-xs font-semibold font-mono tracking-wider transition-all"
          >
            Cambiar y Desencriptar Palabra Aleatoria
          </button>
        </div>
      }
    />
  );
}

// --- MorphSVGPlugin ---
export function MorphSvgDemo() {
  const [shape, setShape] = useState("blob");
  const [triggerCount, setTriggerCount] = useState(0);
  const pathRef = useRef(null);

  const paths = {
    blob: "M 50.00,8.00 C 61.13,8.00 64.55,24.95 69.80,30.20 C 75.05,35.45 94.00,38.34 94.00,50.00 C 94.00,61.66 76.83,65.59 71.21,71.21 C 65.59,76.83 61.13,92.00 50.00,92.00 C 38.87,92.00 37.01,72.36 32.32,67.68 C 27.64,62.99 5.00,61.93 5.00,50.00 C 5.00,38.08 24.95,35.45 30.20,30.20 C 35.45,24.95 38.87,8.00 50.00,8.00 Z",
    circle: "M 50.00,8.00 C 61.13,8.00 71.83,12.43 79.70,20.30 C 87.57,28.17 92.00,38.87 92.00,50.00 C 92.00,61.13 87.57,71.83 79.70,79.70 C 71.83,87.57 61.13,92.00 50.00,92.00 C 38.87,92.00 28.17,87.57 20.30,79.70 C 12.43,71.83 8.00,61.13 8.00,50.00 C 8.00,38.87 12.43,28.17 20.30,20.30 C 28.17,12.43 38.87,8.00 50.00,8.00 Z",
    star: "M 50.00,5.00 C 50.00,5.00 62.73,37.27 62.73,37.27 C 62.73,37.27 95.00,50.00 95.00,50.00 C 95.00,50.00 62.73,62.73 62.73,62.73 C 62.73,62.73 50.00,95.00 50.00,95.00 C 50.00,95.00 37.27,62.73 37.27,62.73 C 37.27,62.73 5.00,50.00 5.00,50.00 C 5.00,50.00 37.27,37.27 37.27,37.27 C 37.27,37.27 50.00,5.00 50.00,5.00 Z"
  };

  const triggerAnimation = () => {
    setTriggerCount(prev => prev + 1);
  };

  useGSAP(() => {
    if (!pathRef.current) return;
    gsap.killTweensOf(pathRef.current);
    
    gsap.to(pathRef.current, {
      attr: { d: paths[shape] },
      duration: 1.2,
      ease: "elastic.out(1, 0.6)"
    });
  }, { dependencies: [shape, triggerCount] });

  const code = `// Requiere MorphSVGPlugin (Premium Club)
gsap.registerPlugin(MorphSVGPlugin);

gsap.to("#vectorPath", {
  duration: 1.2,
  morphSVG: "${shape === 'blob' ? '#blobPath' : shape === 'star' ? '#starPath' : '#circlePath'}",
  ease: "elastic.out(1, 0.6)"
});`;

  return (
    <AnimationCard
      id="morph-svg"
      titleEs="MorphSVG FX"
      titleEn="Shape Morphing Plugin"
      prompt="Quiero simular el comportamiento de MorphSVG de GSAP para deformar de forma fluida un SVG blob abstracto hacia una estrella geométrica usando una transición elástica."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "MorphSVGPlugin permite interpolar el atributo de trazado 'd' de un path SVG a otro path totalmente distinto aunque tengan diferente número de nodos.",
        varsObject: "morphSVG: '#targetPathSelector'",
        specialProps: "shapeIndex (determina cómo rotan y se emparejan los puntos del vector para evitar torsión).",
        aliases: "Modifica el atributo SVG 'd' directamente.",
        easingConcept: "Soporta elasticidad para generar efectos tipo gelatina.",
        callbacksConcept: "Ninguno.",
        timelineStructure: "Excelente para mutar iconos (ej. botón reproducir a pausar) de forma integrada.",
        pluginsAssociated: "Plugin MorphSVG (GSAP Club Premium). Simulado en React mediante interpolación de atributos vectoriales básicos."
      }}
      sandboxChildren={
        <div className="w-full flex justify-center py-6">
          <svg viewBox="0 0 100 100" className="w-48 h-48 text-purple-400 drop-shadow-[0_0_20px_rgba(192,132,252,0.4)]">
            <path
              ref={pathRef}
              d={paths.blob}
              fill="currentColor"
            />
          </svg>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <Selector
            label="Transformar Forma Vectorial A"
            options={["blob", "circle", "star"]}
            value={shape}
            onChange={setShape}
          />
        </div>
      }
    />
  );
}


// =========================================================================
// 6. UTILS & PHYSICS (Matemáticas y Movimiento)
// =========================================================================

// --- MotionPath ---
export function MotionPathDemo() {
  const [speed, setSpeed] = useState(2);
  const [triggerCount, setTriggerCount] = useState(0);
  const elementRef = useRef(null);
  const containerRef = useRef(null);

  const triggerAnimation = () => {
    setTriggerCount(prev => prev + 1);
  };

  useGSAP(() => {
    if (!elementRef.current || !containerRef.current) return;
    gsap.killTweensOf(elementRef.current);
    
    gsap.set(elementRef.current, { xPercent: -50, yPercent: -50 });
    gsap.to(elementRef.current, {
      duration: speed,
      ease: "power1.inOut",
      repeat: -1,
      motionPath: {
        path: "#svg-motion-path",
        align: "#svg-motion-path",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
      }
    });
  }, { dependencies: [speed, triggerCount], scope: containerRef });

  const code = `// Requiere registrar MotionPathPlugin
gsap.registerPlugin(MotionPathPlugin);

gsap.to(".rocket", {
  duration: ${speed},
  ease: "power1.inOut",
  repeat: -1,
  motionPath: {
    path: "#pathId",
    align: "#pathId",
    autoRotate: true,
    alignOrigin: [0.5, 0.5]
  }
});`;

  return (
    <AnimationCard
      id="motion-path"
      titleEs="MotionPath SVG"
      titleEn="Path Trajectory Follow"
      prompt="Quiero animar un cohete espacial para que recorra de forma fluida una trayectoria curva ondulada definida por un PATH SVG y se auto-rote para seguir la inclinación del trayecto."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "MotionPathPlugin permite que cualquier elemento HTML siga una trayectoria curva o recta trazada mediante un path de SVG.",
        varsObject: "motionPath: { path: selector, align: selector, autoRotate: boolean }",
        specialProps: "autoRotate (inclina el elemento adaptándolo al ángulo de la curva), alignOrigin (centro del elemento anclado al camino), start/end (limita el tramo recorrido del 0 al 1).",
        aliases: "Convierte coordenadas SVG relativas a posiciones absolutas de translate3d del DOM.",
        easingConcept: "Soporta cualquier curva de velocidad a lo largo del recorrido total.",
        callbacksConcept: "Útil para disparar partículas en ciertas posiciones del trayecto.",
        timelineStructure: "Integrable en cualquier bloque cronológico.",
        pluginsAssociated: "Plugin MotionPath (Gratuito en núcleo)."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full flex justify-center py-6 relative">
          <svg viewBox="0 0 300 120" className="w-full max-w-sm absolute overflow-visible pointer-events-none">
            <path
              id="svg-motion-path"
              d="M 10 60 C 80 10, 120 110, 180 30 C 230 -20, 270 90, 290 60"
              fill="none"
              stroke="rgba(192, 132, 252, 0.25)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
          <div className="h-28 w-full max-w-sm relative overflow-hidden">
            <div 
              ref={elementRef} 
              className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 border border-white/20 shadow-md flex items-center justify-center font-bold text-[8px] text-white absolute"
            >
              🚀
            </div>
          </div>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <Slider label="Duración del Recorrido (Velocidad)" min={1} max={6} step={0.5} value={speed} onChange={setSpeed} suffix="s" />
        </div>
      }
    />
  );
}

// --- Inercia y Física ---
export function PhysicsInertiaDemo() {
  const [gravity, setGravity] = useState(1.2);
  const [triggerCount, setTriggerCount] = useState(0);
  const ballRef = useRef(null);

  const triggerAnimation = () => {
    setTriggerCount(prev => prev + 1);
  };

  useGSAP(() => {
    if (!ballRef.current) return;
    gsap.killTweensOf(ballRef.current);
    
    gsap.set(ballRef.current, { y: -60, scaleY: 1 });

    const tl = gsap.timeline();
    tl.to(ballRef.current, { y: 60, duration: 0.5 * gravity, ease: "power2.in" })
      .to(ballRef.current, { scaleY: 0.7, scaleX: 1.3, duration: 0.08, ease: "none", yoyo: true, repeat: 1 })
      .to(ballRef.current, { y: -10, duration: 0.4 * gravity, ease: "power2.out" })
      .to(ballRef.current, { y: 60, duration: 0.35 * gravity, ease: "power2.in" })
      .to(ballRef.current, { scaleY: 0.85, scaleX: 1.15, duration: 0.05, ease: "none", yoyo: true, repeat: 1 })
      .to(ballRef.current, { y: 30, duration: 0.2 * gravity, ease: "power2.out" })
      .to(ballRef.current, { y: 60, duration: 0.2 * gravity, ease: "power2.in" });
  }, { dependencies: [gravity, triggerCount] });

  const code = `// Sintaxis conceptual de Physics2D / PhysicsProps (Premium Club):
gsap.to(".ball", {
  physics2D: {
    velocity: 200,
    angle: -60,
    gravity: ${gravity * 200},
    friction: 0.05
  }
});`;

  return (
    <AnimationCard
      id="physics-inertia"
      titleEs="Inercia y Física"
      titleEn="Physics2D & Friction"
      prompt="Quiero simular el comportamiento gravitacional y físico de un rebote elástico mediante la concatenación secuencial de timelines en GSAP para simular aceleración de caída."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "Physics2DPlugin permite animar elementos en base a leyes de física newtoniana simple (gravedad, velocidad inicial, fricción y rebote).",
        varsObject: "physics2D: { gravity: number, velocity: number, angle: number }",
        specialProps: "gravity (fuerza de atracción hacia abajo), friction (resistencia del aire), angle (vector de salida).",
        aliases: "Interpola x e y en función del tiempo transcurrido basándose en ecuaciones de movimiento acelerado.",
        easingConcept: "La aceleración es calculada físicamente (fórmula cuadrática), no mediante curvas bezier estáticas.",
        callbacksConcept: "onUpdate permite recalcular rebotes en bordes dinámicos del viewport.",
        timelineStructure: "Permite coordinar colisiones ordenadas.",
        pluginsAssociated: "Plugin Physics2D (GSAP Club Premium). Simulado localmente mediante un timeline de secuencia coordinada."
      }}
      sandboxChildren={
        <div className="w-full flex flex-col items-center justify-center h-44 relative py-6">
          <div ref={ballRef} className="w-10 h-10 rounded-full bg-gradient-to-t from-emerald-500 to-cyan-400 border border-white/10 z-10 shadow-md"></div>
          <div className="w-32 h-1 bg-slate-800 mt-28 rounded-full"></div>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <Slider label="Gravedad Simulada (Aceleración de Caída)" min={0.5} max={2} step={0.1} value={gravity} onChange={setGravity} />
        </div>
      }
    />
  );
}

// --- Funciones Útiles ---
export function GsapUtilsDemo() {
  const [val, setVal] = useState(50);
  
  const clamped = gsap.utils.clamp(20, 80, val);
  const mapped = gsap.utils.mapRange(0, 100, 0.2, 1.8, val);

  const code = `// Utilidades de GSAP
const limit = gsap.utils.clamp(20, 80, ${val}); // Devuelve: ${clamped}
const scale = gsap.utils.mapRange(0, 100, 0.2, 1.8, ${val}); // Devuelve: ${mapped.toFixed(2)}`;

  return (
    <AnimationCard
      id="gsap-utils"
      titleEs="Funciones Útiles"
      titleEn="gsap.utils"
      prompt="Quiero demostrar el uso de las utilidades matemáticas de GSAP (clamp, mapRange) para tomar un valor reactivo de un slider y convertirlo a un rango de tamaño y opacidad para animar una caja en pantalla."
      onRestart={() => setVal(50)}
      codeString={code}
      technicalInfo={{
        tweenMethods: "gsap.utils es un conjunto de herramientas matemáticas que agilizan cálculos avanzados de animación directamente en JavaScript.",
        varsObject: "gsap.utils.clamp(min, max, value) | gsap.utils.mapRange(inMin, inMax, outMin, outMax, value)",
        specialProps: "clamp (restringe un número a un rango), mapRange (mapea un número de un rango de entrada a un rango de salida completamente diferente), wrap (repite cíclicamente), random (genera aleatorios inteligentes).",
        aliases: "Ninguno. Son utilidades puras de cálculo matemático.",
        easingConcept: "Útil para interpolar inputs físicos de usuario (como mover el scroll o ratón) directamente a parámetros de animación.",
        callbacksConcept: "Ninguno.",
        timelineStructure: "Ninguna.",
        pluginsAssociated: "No requiere plugins."
      }}
      sandboxChildren={
        <div className="w-full flex flex-col items-center py-6 gap-4">
          <div 
            className="w-20 h-20 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-500 border border-white/20 shadow-md flex items-center justify-center font-bold text-[10px] text-white"
            style={{
              transform: `scale(${mapped})`,
              opacity: clamped / 100 
            }}
          >
            Utils Target
          </div>
          <div className="flex gap-4 text-[10px] font-mono text-slate-400">
            <span>Clamped (20-80): <strong className="text-purple-400">{clamped}</strong></span>
            <span>Mapped Scale: <strong className="text-cyan-400">{mapped.toFixed(2)}</strong></span>
          </div>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <Slider label="Valor del Slider (Input 0 - 100)" min={0} max={100} value={val} onChange={setVal} />
        </div>
      }
    />
  );
}


// =========================================================================
// 7. MÓDULOS AVANZADOS (Efectos Premium y WebGL)
// =========================================================================

// --- 7.1. Flip Layout Transition ---
export function FlipLayoutDemo() {
  const [expandedId, setExpandedId] = useState(null);
  const containerRef = useRef(null);
  const cardRectsRef = useRef({});

  const cardData = [
    { id: '1', title: 'Diseño UX', color: 'from-purple-600/80 to-indigo-800/80', text: 'Planificación de interfaces de usuario interactivas basadas en cuadrículas asimétricas.' },
    { id: '2', title: 'GSAP Core', color: 'from-cyan-600/80 to-blue-800/80', text: 'Interpolaciones fluidas aceleradas por hardware en el lienzo del DOM.' },
    { id: '3', title: 'WebGL 3D', color: 'from-emerald-600/80 to-teal-800/80', text: 'Renderizado tridimensional acelerado en GPU mediante WebGL y Three.js.' },
    { id: '4', title: 'Físicas', color: 'from-rose-600/80 to-pink-800/80', text: 'Fricción, gravedad simulada, colisiones y rebotes dinámicos.' }
  ];

  const handleToggle = (id) => {
    if (!containerRef.current) return;

    // 1. FIRST: Guardar la posición inicial de todas las tarjetas antes del render
    const cards = containerRef.current.querySelectorAll('.flip-card');
    cards.forEach(card => {
      const cardId = card.getAttribute('data-id');
      cardRectsRef.current[cardId] = card.getBoundingClientRect();
    });

    setExpandedId(prev => (prev === id ? null : id));
  };

  useGSAP(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.flip-card');

    cards.forEach(card => {
      const cardId = card.getAttribute('data-id');
      const firstRect = cardRectsRef.current[cardId];
      if (!firstRect) return;

      // 2. LAST: Obtener la posición final después de que React re-renderizó el layout
      const lastRect = card.getBoundingClientRect();

      // 3. INVERT: Calcular diferencia de escala y traslación
      const dx = firstRect.left - lastRect.left;
      const dy = firstRect.top - lastRect.top;
      const dw = firstRect.width / lastRect.width;
      const dh = firstRect.height / lastRect.height;

      if (dx === 0 && dy === 0 && dw === 1 && dh === 1) return;

      // Aplicar el estado invertido inmediatamente sin transición
      gsap.set(card, {
        x: dx,
        y: dy,
        scaleX: dw,
        scaleY: dh,
        transformOrigin: "top left"
      });

      // 4. PLAY: Animar suavemente de vuelta a su posición física natural (escala 1, traslación 0)
      gsap.to(card, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "transform"
      });
    });
  }, { dependencies: [expandedId], scope: containerRef });

  const code = `// Técnica FLIP en React con GSAP
const firstRect = card.getBoundingClientRect(); // 1. FIRST
setExpandedId(id); // 2. LAST (Trigger React Render)

useGSAP(() => {
  const lastRect = card.getBoundingClientRect();
  const dx = firstRect.left - lastRect.left; // 3. INVERT
  const dy = firstRect.top - lastRect.top;
  
  gsap.set(card, { x: dx, y: dy, scaleX: dw, scaleY: dh, transformOrigin: 'top left' });
  
  gsap.to(card, { // 4. PLAY
    x: 0, y: 0, scaleX: 1, scaleY: 1,
    duration: 0.6,
    ease: "power2.out"
  });
}, [expandedId]);`;

  return (
    <AnimationCard
      id="gsap-flip"
      titleEs="Flip Layout Transition"
      titleEn="FLIP Plugin Principle"
      prompt="Quiero implementar la técnica FLIP con GSAP y React para expandir de forma elástica una tarjeta seleccionada en una rejilla hasta ocupar el tamaño completo, adaptando su contenido."
      onRestart={() => setExpandedId(null)}
      codeString={code}
      technicalInfo={{
        tweenMethods: "La técnica FLIP de GSAP calcula la física inicial (First) y final (Last), invierte la posición (Invert) y ejecuta la animación (Play) para transicionar layouts que cambian de dimensiones.",
        varsObject: "{ x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.6 }",
        specialProps: "transformOrigin: 'top left' (mantiene la esquina de referencia anclada en el inicio de la tarjeta).",
        aliases: "ScaleX e ScaleY interpolan el tamaño vectorial sin provocar distorsión de repintado del DOM.",
        easingConcept: "El ease power2.out suaviza la velocidad al aproximarse al tamaño de destino.",
        callbacksConcept: "onComplete limpia los parámetros de transformación para evitar colisiones con el CSS de rejilla.",
        timelineStructure: "Sincronizable con transiciones de salida de otros elementos en paralelo.",
        pluginsAssociated: "Flip Plugin (GSAP Club Premium). Simulado nativamente registrando y calculando los offsets de layouts reactivos."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full h-80 bg-slate-950/40 border border-slate-800 rounded-xl p-4 overflow-hidden relative flex flex-col justify-center">
          <div className={`grid gap-3 h-full ${expandedId ? 'grid-cols-4' : 'grid-cols-2'}`}>
            {cardData.map(card => {
              const isExpanded = expandedId === card.id;
              const isAnyExpanded = expandedId !== null;

              if (isAnyExpanded && !isExpanded) {
                return (
                  <div
                    key={card.id}
                    data-id={card.id}
                    className="flip-card opacity-20 bg-slate-900 border border-slate-800/80 rounded-lg p-2 flex items-center justify-center cursor-pointer hover:opacity-30 transition-opacity"
                    onClick={() => handleToggle(card.id)}
                  >
                    <span className="text-[10px] font-mono font-bold text-slate-500 text-center leading-none">{card.title}</span>
                  </div>
                );
              }

              return (
                <div
                  key={card.id}
                  data-id={card.id}
                  className={`flip-card cursor-pointer rounded-xl bg-gradient-to-tr ${card.color} border border-white/10 shadow-md p-4 flex flex-col justify-between select-none ${
                    isExpanded ? 'col-span-4 h-full relative z-10' : 'h-full'
                  }`}
                  onClick={() => handleToggle(card.id)}
                >
                  <div>
                    <h4 className="font-bold text-white text-xs md:text-sm tracking-wide">{card.title}</h4>
                    {isExpanded && (
                      <p className="text-[10px] text-white/90 mt-3 leading-relaxed font-mono animate-in fade-in duration-300">
                        {card.text} Utilizando el cálculo del bounding rect, invertimos las diferencias espaciales y escalamos fluidamente las cajas del DOM a 60fps.
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2 border-t border-white/10 pt-2">
                    <span className="text-[8px] font-mono text-white/70 uppercase tracking-widest">
                      {isExpanded ? 'Click para contraer ▲' : 'Click para expandir ▼'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-xs text-slate-400 italic">
          Haz clic en cualquier tarjeta del mosaico de arriba para observar el cambio de estructura animado por FLIP.
        </div>
      }
    />
  );
}

// --- 7.2. ScrollTo & ScrollSmoother ---
export function ScrollToDemo() {
  const scrollRef = useRef(null);
  const [activeSection, setActiveSection] = useState("A");

  const handleScrollTo = (targetId) => {
    if (!scrollRef.current) return;
    const targetElement = scrollRef.current.querySelector(targetId);
    if (!targetElement) return;

    gsap.to(scrollRef.current, {
      scrollTo: { y: targetElement, autoKill: false },
      duration: 1.0,
      ease: "power2.inOut"
    });
    setActiveSection(targetId.replace("#scroll-", "").toUpperCase());
  };

  const code = `// Requiere registrar ScrollToPlugin (Gratuito)
gsap.registerPlugin(ScrollToPlugin);

gsap.to(".scroll-container", {
  duration: 1.0,
  scrollTo: { y: "#scroll-section-b", autoKill: false },
  ease: "power2.inOut"
});`;

  return (
    <AnimationCard
      id="scroll-to-smoother"
      titleEs="ScrollTo & Smoother"
      titleEn="ScrollToPlugin Interface"
      prompt="Quiero crear un sistema de scroll elástico e interactivo usando ScrollToPlugin de GSAP que anime el scroll vertical hacia elementos marcados específicos al pulsar un botón."
      onRestart={() => handleScrollTo("#scroll-sec-a")}
      codeString={code}
      technicalInfo={{
        tweenMethods: "ScrollToPlugin permite animar el scroll de ventanas del navegador o de bloques contenedores usando coordenadas o selectores directos.",
        varsObject: "scrollTo: { y: selector | number, autoKill: boolean }",
        specialProps: "autoKill: true (detiene la animación de scroll automáticamente si el usuario interactúa con la rueda del ratón en medio del recorrido).",
        aliases: "Traduce valores de offset de desplazamiento a propiedades scrollTop / scrollLeft del DOM.",
        easingConcept: "La aceleración en los saltos largos suaviza la entrada y salida mediante power2.inOut.",
        callbacksConcept: "onComplete se ejecuta al estabilizarse el scroll en la posición de destino.",
        timelineStructure: "Se puede encadenar con revelaciones de contenido después de situar el scrollbar.",
        pluginsAssociated: "Plugin ScrollTo (Gratuito en GreenSock). Registrado mediante gsap.registerPlugin(ScrollToPlugin)."
      }}
      sandboxChildren={
        <div className="w-full flex flex-col gap-4 py-2">
          {/* Section Selector Buttons */}
          <div className="flex gap-2 justify-center">
            {["a", "b", "c", "d"].map((sec) => (
              <button
                key={sec}
                onClick={() => handleScrollTo(`#scroll-sec-${sec}`)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] font-bold tracking-wider transition-all uppercase ${
                  activeSection === sec.toUpperCase()
                    ? "bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/20"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                Sección {sec.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Scrollable Container */}
          <div 
            ref={scrollRef} 
            className="w-full h-44 overflow-y-auto bg-slate-950/60 border border-slate-850 rounded-xl p-4 space-y-16 scroll-container"
            style={{ scrollbarWidth: "thin" }}
          >
            <div id="scroll-sec-a" className="h-28 border border-purple-500/10 rounded-lg p-3 bg-purple-950/10 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-purple-400 font-bold tracking-widest">SECCIÓN A: INICIO</span>
              <p className="text-[10px] text-slate-400 leading-relaxed">El santuario del movimiento web. Control de coordenadas iniciales y timelines fluidos.</p>
            </div>
            <div id="scroll-sec-b" className="h-28 border border-cyan-500/10 rounded-lg p-3 bg-cyan-950/10 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest">SECCIÓN B: DISEÑO DINÁMICO</span>
              <p className="text-[10px] text-slate-400 leading-relaxed">Sincronización milimétrica de elementos. El scrollbar alimenta el progreso de interpolación.</p>
            </div>
            <div id="scroll-sec-c" className="h-28 border border-emerald-500/10 rounded-lg p-3 bg-emerald-950/10 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest">SECCIÓN C: FÍSICA INICIAL</span>
              <p className="text-[10px] text-slate-400 leading-relaxed">Fricciones dinámicas aplicadas al deslizamiento. Emulación de fricción del viento.</p>
            </div>
            <div id="scroll-sec-d" className="h-28 border border-rose-500/10 rounded-lg p-3 bg-rose-950/10 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-rose-400 font-bold tracking-widest">SECCIÓN D: FINAL DEL VIAJE</span>
              <p className="text-[10px] text-slate-400 leading-relaxed">Estabilización final del puntero mediante amortiguación elástica de velocidad.</p>
            </div>
          </div>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-xs text-slate-400 italic">
          Los botones superiores simulan clics de anclas que desplazan el contenedor interno usando <strong className="text-purple-400">ScrollToPlugin</strong>.
        </div>
      }
    />
  );
}

// --- 7.3. DrawSVG FX ---
export function DrawSvgDemo() {
  const [triggerCount, setTriggerCount] = useState(0);
  const containerRef = useRef(null);

  const triggerAnimation = () => {
    setTriggerCount(prev => prev + 1);
  };

  useGSAP(() => {
    if (!containerRef.current) return;
    const paths = containerRef.current.querySelectorAll('.draw-path');

    paths.forEach(path => {
      // 1. Obtener la longitud física del trazado vectorial
      const length = path.getTotalLength();
      
      // 2. Fijar estados de inicio (completamente oculto/desplazado)
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length
      });

      // 3. Animar de vuelta a cero (dibujado completo)
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2.0,
        ease: "power2.inOut",
        stagger: 0.15
      });
    });
  }, { dependencies: [triggerCount], scope: containerRef });

  const code = `// Animación nativa de trazo SVG (DrawSVG simulación)
const length = path.getTotalLength();

// Ocultar trazado usando dash offsets:
gsap.set(path, {
  strokeDasharray: length,
  strokeDashoffset: length
});

// Animar el contorno de trazo:
gsap.to(path, {
  strokeDashoffset: 0,
  duration: 2.0,
  stagger: 0.15,
  ease: "power2.inOut"
});`;

  return (
    <AnimationCard
      id="draw-svg"
      titleEs="DrawSVG FX"
      titleEn="Vector Stroke Drawing"
      prompt="Quiero simular el comportamiento de DrawSVG de GSAP para auto-dibujar progresivamente las líneas de un icono o ilustración vectorial usando stroke-dashoffset."
      onRestart={triggerAnimation}
      codeString={code}
      technicalInfo={{
        tweenMethods: "DrawSVG simula la escritura de vectores manipulando las propiedades SVG strokeDasharray y strokeDashoffset basándose en la longitud del camino.",
        varsObject: "{ strokeDashoffset: 0, duration: 2.0, stagger: 0.15 }",
        specialProps: "strokeDasharray (define el espaciado de rayas del contorno), strokeDashoffset (desplaza el patrón de rayas para ocultar/revelar).",
        aliases: "No requiere transformaciones complejas, altera propiedades directas de representación del navegador.",
        easingConcept: "La curva suaviza el tramo medio del contorno dinámicamente.",
        callbacksConcept: "onUpdate renderiza de forma consecutiva.",
        timelineStructure: "Excelente para transiciones de carga de logotipos o dibujos geométricos.",
        pluginsAssociated: "DrawSVGPlugin (GSAP Club Premium). Simulado calculando la longitud getTotalLength() directamente en el DOM."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full flex justify-center py-4 bg-slate-950/20 border border-slate-900 rounded-xl p-4">
          <svg viewBox="0 0 100 100" className="w-44 h-44 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            {/* Concentric outer circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="draw-path fill-none stroke-purple-500/30 stroke-[1.5]"
            />
            {/* Concentric inner circle */}
            <circle
              cx="50"
              cy="50"
              r="34"
              className="draw-path fill-none stroke-cyan-400/80 stroke-2"
            />
            {/* Geometric Cross Lines */}
            <path
              d="M 26 26 L 74 74"
              className="draw-path fill-none stroke-purple-400 stroke-[1.5] stroke-dasharray-4"
            />
            <path
              d="M 74 26 L 26 74"
              className="draw-path fill-none stroke-purple-400 stroke-[1.5] stroke-dasharray-4"
            />
            {/* Outer box border */}
            <rect
              x="22"
              y="22"
              width="56"
              height="56"
              rx="8"
              className="draw-path fill-none stroke-emerald-400/90 stroke-2"
            />
            {/* Center target circle */}
            <circle
              cx="50"
              cy="50"
              r="10"
              className="draw-path fill-none stroke-cyan-300 stroke-2"
            />
          </svg>
        </div>
      }
      controlsChildren={
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-xs text-slate-400 italic">
          Haz clic en "Reiniciar Animación" para ver el contorno vectorial autotrazándose en orden coordinado.
        </div>
      }
    />
  );
}

// --- 7.4. Inertia & Physics Drag ---
export function InertiaDragDemo() {
  const containerRef = useRef(null);
  const targetRef = useRef(null);
  const draggableInstance = useRef(null);

  const [frictionVal, setFrictionVal] = useState(0.85); // drag friction coefficient
  const [elasticity, setElasticity] = useState(0.7); // bounce elasticity

  useGSAP(() => {
    if (!targetRef.current || !containerRef.current) return;

    if (draggableInstance.current && draggableInstance.current.length > 0) {
      draggableInstance.current[0].kill();
    }

    let velocityX = 0;
    let velocityY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();

    draggableInstance.current = Draggable.create(targetRef.current, {
      bounds: containerRef.current,
      edgeResistance: 0.85,
      type: "x,y",
      onDragStart: function() {
        gsap.killTweensOf(this.target);
        lastX = this.x;
        lastY = this.y;
        lastTime = Date.now();
        velocityX = 0;
        velocityY = 0;
      },
      onDrag: function() {
        const now = Date.now();
        const dt = (now - lastTime) / 1000;
        if (dt > 0) {
          // Calcular la velocidad vectorial en px/s
          velocityX = (this.x - lastX) / dt;
          velocityY = (this.y - lastY) / dt;
        }
        lastX = this.x;
        lastY = this.y;
        lastTime = now;
      },
      onRelease: function() {
        // Simular inercia amortiguada por fricción
        const decay = frictionVal;
        
        // Distancia proyectada = velocidad * factor de inercia
        let targetX = this.x + (velocityX * 0.18 * decay);
        let targetY = this.y + (velocityY * 0.18 * decay);

        // Límites del contenedor
        const maxBoundX = 140;
        const minBoundX = -140;
        const maxBoundY = 60;
        const minBoundY = -60;

        let finalX = Math.max(minBoundX, Math.min(maxBoundX, targetX));
        let finalY = Math.max(minBoundY, Math.min(maxBoundY, targetY));

        let bounceX = null;
        let bounceY = null;

        // Detectar colisiones y calcular el punto de rebote físico elástico
        if (targetX < minBoundX || targetX > maxBoundX) {
          const delta = targetX < minBoundX ? (minBoundX - targetX) : (maxBoundX - targetX);
          bounceX = targetX < minBoundX ? (minBoundX + delta * elasticity) : (maxBoundX + delta * elasticity);
        }
        if (targetY < minBoundY || targetY > maxBoundY) {
          const delta = targetY < minBoundY ? (minBoundY - targetY) : (maxBoundY - targetY);
          bounceY = targetY < minBoundY ? (minBoundY + delta * elasticity) : (maxBoundY + delta * elasticity);
        }

        const tl = gsap.timeline();
        tl.to(this.target, {
          x: finalX,
          y: finalY,
          duration: 1.4,
          ease: "power3.out"
        });

        if (bounceX !== null || bounceY !== null) {
          tl.to(this.target, {
            x: bounceX !== null ? Math.max(minBoundX, Math.min(maxBoundX, bounceX)) : finalX,
            y: bounceY !== null ? Math.max(minBoundY, Math.min(maxBoundY, bounceY)) : finalY,
            duration: 0.5,
            ease: "bounce.out"
          }, "-=0.3"); // solapamiento para continuidad elástica
        }
      }
    });

    return () => {
      if (draggableInstance.current && draggableInstance.current.length > 0) {
        draggableInstance.current[0].kill();
      }
    };
  }, { dependencies: [frictionVal, elasticity], scope: containerRef });

  const code = `// Simulación física de InertiaPlugin con Draggable
Draggable.create(".puck", {
  bounds: ".container",
  onDrag: function() {
    velocityX = (this.x - lastX) / dt;
  },
  onRelease: function() {
    let targetX = this.x + (velocityX * 0.18 * friction);
    // Aplicar deslizamiento inercial con rebote elástico:
    gsap.to(this.target, { x: finalX, ease: "power3.out" });
  }
});`;

  return (
    <AnimationCard
      id="inertia-drag"
      titleEs="Inertia & Physics Drag"
      titleEn="Draggable Inertia Bounces"
      prompt="Quiero simular el comportamiento de InertiaPlugin de GSAP midiendo la velocidad de salida de un puck al arrastrarlo y deslizarlo dinámicamente con fricción y rebote físico en los bordes."
      onRestart={() => {
        if (targetRef.current) {
          gsap.to(targetRef.current, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
        }
      }}
      codeString={code}
      technicalInfo={{
        tweenMethods: "La inercia se calcula a partir de la velocidad residual en el instante de liberación y se aplica mediante curvas de desaceleración cúbicas.",
        varsObject: "Draggable.create(target, { onDrag, onRelease })",
        specialProps: "edgeResistance: fricción al cruzar los límites del contenedor.",
        aliases: "velocityX y velocityY calculados a partir de diferenciales temporales entre frames (dt).",
        easingConcept: "El ease power3.out emula el deslizamiento amortiguado por fricción mecánica.",
        callbacksConcept: "onDragStart limpia tweens activos, onDrag actualiza diferenciales de velocidad, onRelease lanza la inercia.",
        timelineStructure: "Un timeline encadena el deslizamiento inercial y el rebote reactivo tras colisión.",
        pluginsAssociated: "InertiaPlugin (Premium Club). Simulado localmente programando el lanzamiento inercial por velocidad."
      }}
      sandboxChildren={
        <div ref={containerRef} className="w-full h-56 relative border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <Move size={80} className="text-slate-300 animate-pulse" />
          </div>
          {/* Draggable Puck */}
          <div 
            ref={targetRef} 
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 border border-cyan-300/30 shadow-[0_0_20px_rgba(34,211,238,0.25)] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing z-10 select-none"
          >
            <MousePointer size={14} className="text-white mb-0.5 animate-bounce" />
            <h4 className="text-[9px] text-white font-extrabold uppercase font-mono tracking-widest leading-none">PUCK</h4>
            <span className="text-[7px] text-cyan-200 font-mono mt-0.5 leading-none">INERCIA</span>
          </div>
        </div>
      }
      controlsChildren={
        <>
          <Slider label="Fricción de Deslizamiento (Friction)" min={0.2} max={1.5} step={0.05} value={frictionVal} onChange={setFrictionVal} />
          <Slider label="Elasticidad de Rebote (Bounce)" min={0.1} max={1.2} step={0.05} value={elasticity} onChange={setElasticity} />
        </>
      }
    />
  );
}

// --- 7.5. Three.js + GSAP WebGL 3D ---
export function ThreeWebGLDemo() {
  const canvasRef = useRef(null);
  const [speed, setSpeed] = useState(1);
  const [scale, setScale] = useState(1);
  const [triggerCount, setTriggerCount] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. Inicializar Three.js
    const width = canvasRef.current.clientWidth || 300;
    const height = canvasRef.current.clientHeight || 180;

    const scene = new THREE.Scene();
    
    // Cámara perspectiva
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 4.2;

    // Renderizador con fondo transparente
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Geometría 3D (TorusKnot de rejilla metálica futurista)
    const geometry = new THREE.TorusKnotGeometry(0.85, 0.22, 90, 14);
    
    // Material Normal con sombreado de vectores de colores
    const material = new THREE.MeshNormalMaterial({ 
      wireframe: true 
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 3. Animaciones GSAP controlando las propiedades del objeto 3D
    // Rotación infinita en múltiples ejes
    const rotationTween = gsap.to(mesh.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      duration: 8 / speed,
      repeat: -1,
      ease: "none"
    });

    // Escala del mesh conectada al estado del slider reactivo
    const scaleTween = gsap.to(mesh.scale, {
      x: scale,
      y: scale,
      z: scale,
      duration: 0.6,
      ease: "back.out(1.5)"
    });

    // Movimiento oscilatorio de la cámara (efecto flotación)
    const cameraTween = gsap.to(camera.position, {
      z: 5.0,
      y: 0.2,
      duration: 3.5,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut"
    });

    // 4. Bucle de renderizado
    let animationFrameId;
    const animate = () => {
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Redimensionado de pantalla
    const handleResize = () => {
      if (!canvasRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Limpieza al desmontar
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      rotationTween.kill();
      scaleTween.kill();
      cameraTween.kill();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [speed, scale, triggerCount]);

  const code = `// Integración real de Three.js + GSAP
const scene = new THREE.Scene();
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// GSAP anima directamente propiedades de rotación del mesh de Three.js
gsap.to(mesh.rotation, {
  x: Math.PI * 2,
  y: Math.PI * 2,
  duration: 8,
  repeat: -1,
  ease: "none"
});

// GSAP anima la escala física basada en variables React
gsap.to(mesh.scale, {
  x: ${scale}, y: ${scale}, z: ${scale},
  duration: 0.6,
  ease: "back.out(1.5)"
});`;

  return (
    <AnimationCard
      id="three-gsap"
      titleEs="Three.js + GSAP WebGL 3D"
      titleEn="WebGL Material Tweening"
      prompt="Quiero renderizar un TorusKnot en 3D interactivo usando Three.js, y animar sus propiedades de rotación física tridimensional de forma continua y su escala reactivamente mediante GSAP."
      onRestart={() => setTriggerCount(prev => prev + 1)}
      codeString={code}
      technicalInfo={{
        tweenMethods: "GSAP puede interpolar numéricamente cualquier objeto y propiedad en JavaScript, lo que permite modificar dinámicamente matrices de rotación, posición y escalado de WebGL/Three.js.",
        varsObject: "gsap.to(mesh.rotation, { x: value, y: value, duration: number })",
        specialProps: "z (escala tridimensional o profundidad de cámara).",
        aliases: "Modifica directamente los objetos Vector3 y Euler de Three.js de manera directa.",
        easingConcept: "Ideal para animar la velocidad de rotación infinita sin cortes visuales usando ease: 'none'.",
        callbacksConcept: "onUpdate actualiza transformaciones en WebGL.",
        timelineStructure: "Sincroniza transiciones 3D de cámara con cambios de interfaz 2D.",
        pluginsAssociated: "No requiere plugins adicionales para animar objetos de JavaScript. Conectado al lienzo Canvas mediante WebGLRenderer."
      }}
      sandboxChildren={
        <div className="w-full flex justify-center py-2 bg-slate-950/20 border border-slate-900 rounded-xl relative overflow-hidden h-52 items-center">
          <canvas ref={canvasRef} className="w-full h-full max-w-sm cursor-pointer z-10" />
        </div>
      }
      controlsChildren={
        <>
          <Slider label="Velocidad de Rotación (Speed)" min={0.2} max={3.0} step={0.2} value={speed} onChange={setSpeed} suffix="x" />
          <Slider label="Escala del Torus (Scale)" min={0.5} max={1.6} step={0.1} value={scale} onChange={setScale} />
        </>
      }
    />
  );
}

// --- CATEGORÍA 08 / EFECTOS DE PORTFOLIO AWWWARDS ---

// --- 8.1. Magnetic Button (Atracción elástica de mouse) ---
export function MagneticButtonDemo() {
  const [strength, setStrength] = useState(40);
  const [duration, setDuration] = useState(0.4);
  const [radius, setRadius] = useState(120);
  const [triggerCount, setTriggerCount] = useState(0);

  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const button = buttonRef.current;
    const text = textRef.current;
    if (!container || !button || !text) return;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mX = e.clientX - rect.left;
      const mY = e.clientY - rect.top;

      const btnRect = button.getBoundingClientRect();
      const bX = btnRect.left - rect.left + btnRect.width / 2;
      const bY = btnRect.top - rect.top + btnRect.height / 2;

      const dist = Math.hypot(mX - bX, mY - bY);

      if (dist < radius) {
        const factor = (radius - dist) / radius;
        const targetX = (mX - bX) * (strength / 100) * factor;
        const targetY = (mY - bY) * (strength / 100) * factor;

        gsap.to(button, {
          x: targetX,
          y: targetY,
          duration: duration,
          ease: "power2.out",
          overwrite: "auto"
        });

        gsap.to(text, {
          x: targetX * 0.4,
          y: targetY * 0.4,
          duration: duration,
          ease: "power2.out",
          overwrite: "auto"
        });
      } else {
        gsap.to([button, text], {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1.2, 0.4)",
          overwrite: "auto"
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to([button, text], {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1.2, 0.3)",
        overwrite: "auto"
      });
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [strength, duration, radius, triggerCount]);

  const code = `// Botón Magnético Interactivo
const button = buttonRef.current;
const text = textRef.current;

const onMouseMove = (e) => {
  const rect = container.getBoundingClientRect();
  const mX = e.clientX - rect.left;
  const mY = e.clientY - rect.top;

  const btnRect = button.getBoundingClientRect();
  const bX = btnRect.left - rect.left + btnRect.width / 2;
  const bY = btnRect.top - rect.top + btnRect.height / 2;

  const dist = Math.hypot(mX - bX, mY - bY);

  if (dist < ${radius}) {
    const factor = (${radius} - dist) / ${radius};
    const targetX = (mX - bX) * (${strength / 100}) * factor;
    const targetY = (mY - bY) * (${strength / 100}) * factor;

    gsap.to(button, {
      x: targetX,
      y: targetY,
      duration: ${duration},
      ease: "power2.out",
      overwrite: "auto"
    });

    gsap.to(text, {
      x: targetX * 0.4,
      y: targetY * 0.4,
      duration: ${duration},
      ease: "power2.out",
      overwrite: "auto"
    });
  } else {
    // Retorno con elasticidad Awwwards
    gsap.to([button, text], {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1.2, 0.4)",
      overwrite: "auto"
    });
  }
};`;

  return (
    <AnimationCard
      id="magnetic-button"
      titleEs="Magnetic Button Awwwards"
      titleEn="Elastic Mouse Attraction"
      prompt="Crea un botón magnético con GSAP que atraiga la posición del botón y del texto interno con un efecto de paralaje hacia el puntero cuando el cursor entra en el radio de detección, y rebote elásticamente al salir."
      onRestart={() => setTriggerCount(prev => prev + 1)}
      codeString={code}
      technicalInfo={{
        tweenMethods: "gsap.to() con propiedades CSS translate (x, y).",
        varsObject: "x, y, duration, ease: 'power2.out' para seguimiento y 'elastic.out' para retorno.",
        specialProps: "overwrite: 'auto' para anular tweens previos fluidamente durante el movimiento continuo del mouse.",
        aliases: "x/y mapeados a translate3d de CSS para aceleración por GPU.",
        easingConcept: "elastic.out(1.2, 0.4) simula la inercia física de un muelle metálico elástico.",
        callbacksConcept: "Interacción basada en eventos nativos 'mousemove' con coordenadas relativas.",
        pluginsAssociated: "No requiere plugins adicionales. Funciona sobre el core de GSAP."
      }}
      sandboxChildren={
        <div 
          ref={containerRef}
          className="w-full flex justify-center py-12 bg-slate-950/20 border border-slate-900 rounded-xl relative overflow-hidden h-64 items-center cursor-none"
        >
          <div 
            className="absolute rounded-full border border-purple-500/10 bg-purple-500/[0.01] pointer-events-none transition-all duration-300"
            style={{
              width: radius * 2,
              height: radius * 2,
            }}
          ></div>
          <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500">Mueve el ratón cerca del botón</div>
          
          <button
            ref={buttonRef}
            className="relative px-8 py-5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-400/40 text-white font-bold shadow-lg shadow-purple-500/20 transition-colors duration-200 z-10 flex items-center justify-center min-w-[160px] min-h-[60px]"
          >
            <span ref={textRef} className="block select-none pointer-events-none">
              ¡Atráeme!
            </span>
          </button>
        </div>
      }
      controlsChildren={
        <>
          <Slider label="Fuerza Magnética (Strength)" min={10} max={80} step={5} value={strength} onChange={setStrength} suffix="%" />
          <Slider label="Duración Interpolación (Lag)" min={0.1} max={1.0} step={0.05} value={duration} onChange={setDuration} suffix="s" />
          <Slider label="Radio de Acción (Radius)" min={60} max={200} step={10} value={radius} onChange={setRadius} suffix="px" />
        </>
      }
    />
  );
}

// --- 8.2. Custom Cursor Follow (Seguidor de cursor ultra fluido) ---
export function CustomCursorDemo() {
  const [lag, setLag] = useState(0.15);
  const [baseSize, setBaseSize] = useState(16);
  const [hoverScale, setHoverScale] = useState(3.5);
  const [triggerCount, setTriggerCount] = useState(0);

  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!container || !cursor || !cursorDot) return;

    const xTo = gsap.quickTo(cursor, "x", { duration: lag, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: lag, ease: "power3.out" });

    const xDotTo = gsap.quickTo(cursorDot, "x", { duration: 0.05, ease: "power2.out" });
    const yDotTo = gsap.quickTo(cursorDot, "y", { duration: 0.05, ease: "power2.out" });

    gsap.set([cursor, cursorDot], { xPercent: -50, yPercent: -50, x: 150, y: 100 });

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      xTo(x);
      yTo(y);
      xDotTo(x);
      yDotTo(y);
    };

    const onMouseEnter = () => {
      gsap.to([cursor, cursorDot], { opacity: 1, duration: 0.2 });
    };

    const onMouseLeave = () => {
      gsap.to([cursor, cursorDot], { opacity: 0, duration: 0.2 });
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [lag, baseSize, triggerCount]);

  const onItemEnter = () => {
    gsap.to(cursorRef.current, {
      width: baseSize * hoverScale,
      height: baseSize * hoverScale,
      backgroundColor: "rgba(34, 211, 238, 0.2)",
      borderColor: "rgba(34, 211, 238, 0.8)",
      duration: 0.3,
      ease: "power2.out"
    });
    gsap.to(cursorDotRef.current, {
      scale: 0.5,
      backgroundColor: "#22d3ee",
      duration: 0.2
    });
  };

  const onItemLeave = () => {
    gsap.to(cursorRef.current, {
      width: baseSize,
      height: baseSize,
      backgroundColor: "transparent",
      borderColor: "rgba(168, 85, 247, 0.8)",
      duration: 0.3,
      ease: "power2.out"
    });
    gsap.to(cursorDotRef.current, {
      scale: 1,
      backgroundColor: "#a855f7",
      duration: 0.2
    });
  };

  const code = `// Custom Cursor utilizando gsap.quickTo para rendimiento óptimo de 60fps+
const xTo = gsap.quickTo(cursorElement, "x", { duration: ${lag}, ease: "power3.out" });
const yTo = gsap.quickTo(cursorElement, "y", { duration: ${lag}, ease: "power3.out" });

const onMouseMove = (e) => {
  const rect = container.getBoundingClientRect();
  xTo(e.clientX - rect.left);
  yTo(e.clientY - rect.top);
};

// Modificación del estado del cursor en Hover
const onHoverEnter = () => {
  gsap.to(cursorElement, {
    width: ${baseSize * hoverScale},
    height: ${baseSize * hoverScale},
    backgroundColor: "rgba(34, 211, 238, 0.2)",
    borderColor: "rgba(34, 211, 238, 0.8)",
    duration: 0.3
  });
};`;

  return (
    <AnimationCard
      id="custom-cursor"
      titleEs="Custom Cursor Follow"
      titleEn="High-Performance gsap.quickTo"
      prompt="Crea un cursor personalizado fluido usando gsap.quickTo para evitar recálculos excesivos de layout, y haz que se expanda elásticamente y cambie de color y fusión mix-blend al pasar sobre zonas interactivas."
      onRestart={() => setTriggerCount(prev => prev + 1)}
      codeString={code}
      technicalInfo={{
        tweenMethods: "gsap.quickTo() para asignación directa de coordenadas optimizada en el render-loop.",
        varsObject: "x, y, duration, ease: 'power3.out' para amortiguar el arrastre y seguir el cursor.",
        specialProps: "quickTo previene la creación y recolección de miles de objetos Tween innecesarios.",
        aliases: "Optimiza drásticamente el rendimiento móvil y de pantallas con altas tasas de refresco (120Hz+).",
        easingConcept: "La pequeña latencia (lag) genera un efecto orgánico de arrastre fluido que parece flotar sobre la interfaz.",
        callbacksConcept: "Hover interactivo con gsap.to para deformación de escala y cambio cromático.",
        pluginsAssociated: "Core de GSAP. quickTo es una función integrada en el motor principal."
      }}
      sandboxChildren={
        <div 
          ref={containerRef}
          className="w-full flex flex-col justify-center items-center py-12 bg-slate-950/20 border border-slate-900 rounded-xl relative overflow-hidden h-64 cursor-none"
        >
          <div 
            ref={cursorRef}
            className="absolute pointer-events-none border border-purple-500/80 bg-purple-500/0 rounded-full z-30 transition-shadow duration-300 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
            style={{
              width: baseSize,
              height: baseSize,
              left: 0,
              top: 0,
              willChange: "transform, width, height",
            }}
          />
          <div 
            ref={cursorDotRef}
            className="absolute pointer-events-none bg-purple-500 w-1.5 h-1.5 rounded-full z-40"
            style={{
              left: 0,
              top: 0,
              willChange: "transform",
            }}
          />
          
          <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500">Mueve el ratón aquí dentro</div>
          
          <div className="flex gap-6 z-10">
            <div 
              onMouseEnter={onItemEnter}
              onMouseLeave={onItemLeave}
              className="px-6 py-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-none select-none"
            >
              Hover Interactivo A
            </div>
            
            <div 
              onMouseEnter={onItemEnter}
              onMouseLeave={onItemLeave}
              className="px-6 py-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-none select-none"
            >
              Hover Interactivo B
            </div>
          </div>
        </div>
      }
      controlsChildren={
        <>
          <Slider label="Suavidad/Fricción (Lag)" min={0.02} max={0.4} step={0.02} value={lag} onChange={setLag} suffix="s" />
          <Slider label="Tamaño Base" min={10} max={30} step={2} value={baseSize} onChange={setBaseSize} suffix="px" />
          <Slider label="Escala en Hover" min={2.0} max={6.0} step={0.5} value={hoverScale} onChange={setHoverScale} suffix="x" />
        </>
      }
    />
  );
}

// --- 8.3. Infinite Speed Marquee (Marquesina sin cortes con aceleración) ---
export function InfiniteMarqueeDemo() {
  const [baseSpeed, setBaseSpeed] = useState(15);
  const [hoverScale, setHoverScale] = useState(2.0);
  const [triggerCount, setTriggerCount] = useState(0);

  const marqueeRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const tween = gsap.to(marquee, {
      xPercent: -50,
      repeat: -1,
      ease: "none",
      duration: baseSpeed
    });

    tweenRef.current = tween;

    return () => {
      tween.kill();
    };
  }, [baseSpeed, triggerCount]);

  const onMouseEnter = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, {
        timeScale: hoverScale,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  };

  const onMouseLeave = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, {
        timeScale: 1.0,
        duration: 0.8,
        ease: "power1.out"
      });
    }
  };

  const code = `// Marquesina Infinita con Modulación de Velocidad (timeScale)
// Animamos xPercent de -50% sobre un wrapper duplicado para bucle sin fin
const tween = gsap.to(marqueeElement, {
  xPercent: -50,
  repeat: -1,
  ease: "none",
  duration: ${baseSpeed}
});

// Aceleración elástica en Hover / Interacción
const onHoverEnter = () => {
  gsap.to(tween, {
    timeScale: ${hoverScale},
    duration: 0.6,
    ease: "power2.out"
  });
};

const onHoverLeave = () => {
  gsap.to(tween, {
    timeScale: 1.0,
    duration: 0.8,
    ease: "power1.out"
  });
};`;

  return (
    <AnimationCard
      id="infinite-marquee"
      titleEs="Infinite Speed Marquee"
      titleEn="Seamless Loop & timeScale modulation"
      prompt="Diseña una marquesina de texto infinita y continua con GSAP que se mueva de manera constante a 60fps, y cuya escala de tiempo (timeScale) aumente orgánicamente en hover y retorne suavemente a su valor base."
      onRestart={() => setTriggerCount(prev => prev + 1)}
      codeString={code}
      technicalInfo={{
        tweenMethods: "gsap.to() modulando la propiedad timeScale del objeto Tween de forma progresiva.",
        varsObject: "xPercent: -50, ease: 'none' para flujo continuo sin parones, repeat: -1 para repetición eterna.",
        specialProps: "timeScale es el multiplicador de velocidad del tween. 2.0 corre al doble de velocidad, 0.5 a la mitad.",
        aliases: "xPercent optimiza el rendimiento al forzar transformaciones de CSS en vez de modificar left/right de layout.",
        easingConcept: "Fricción fluida mediante aceleración amortiguada con ease: 'power2.out' sobre la propiedad timeScale.",
        callbacksConcept: "Interacción de ratón para acelerar y desacelerar la marquesina mediante hover.",
        pluginsAssociated: "Ninguno, forma parte del núcleo de GSAP (Core Engine)."
      }}
      sandboxChildren={
        <div 
          className="w-full flex flex-col justify-center py-12 bg-slate-950/20 border border-slate-900 rounded-xl relative overflow-hidden h-64 items-center"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500">Pon el ratón encima para acelerar</div>
          
          <div className="w-full bg-slate-900/40 border-y border-slate-800 py-6 overflow-hidden flex whitespace-nowrap">
            <div 
              ref={marqueeRef}
              className="flex space-x-12 pr-12 text-2xl md:text-3xl font-black uppercase tracking-wider text-slate-200 select-none cursor-pointer"
              style={{ willChange: "transform" }}
            >
              <span className="flex items-center gap-4">
                AWWWARDS PORTFOLIO <span className="text-purple-400">★</span> GSAP SANCTUARY <span className="text-cyan-400">✦</span> SEAMLESS TICKER
              </span>
              <span className="flex items-center gap-4">
                VIBE CODING <span className="text-purple-400">★</span> HIGH PERFORMANCE <span className="text-cyan-400">✦</span> 120FPS SMOOTH
              </span>
              <span className="flex items-center gap-4">
                AWWWARDS PORTFOLIO <span className="text-purple-400">★</span> GSAP SANCTUARY <span className="text-cyan-400">✦</span> SEAMLESS TICKER
              </span>
              <span className="flex items-center gap-4">
                VIBE CODING <span className="text-purple-400">★</span> HIGH PERFORMANCE <span className="text-cyan-400">✦</span> 120FPS SMOOTH
              </span>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-slate-500 font-mono">
            Modulador de velocidad actual (timeScale): <span className="text-purple-400 font-bold">{hoverScale}x (en hover)</span>
          </div>
        </div>
      }
      controlsChildren={
        <>
          <Slider label="Duración del Bucle (Segundos)" min={5} max={30} step={1} value={baseSpeed} onChange={setBaseSpeed} suffix="s" />
          <Slider label="Multiplicador en Hover (timeScale)" min={1.5} max={5.0} step={0.5} value={hoverScale} onChange={setHoverScale} suffix="x" />
        </>
      }
    />
  );
}

// --- 8.4. SVG Clip-Path Reveal (Máscara geométrica dinámica) ---
export function ClipPathRevealDemo() {
  const [duration, setDuration] = useState(0.8);
  const [elasticity, setElasticity] = useState(1.2);
  const [shape, setShape] = useState("rectangle");
  const [triggerCount, setTriggerCount] = useState(0);

  const polygonRef = useRef(null);
  const cardRef = useRef(null);

  const getPoints = (type) => {
    switch (type) {
      case "diamond":
        return "0.5 0, 1 0.5, 0.5 1, 0 0.5";
      case "triangle":
        return "0.5 0, 1 1, 0 1, 0.5 0.5";
      case "rectangle":
      default:
        return "0 0, 1 0, 1 1, 0 1";
    }
  };

  const getCollapsedPoints = () => {
    return "0.5 0.5, 0.5 0.5, 0.5 0.5, 0.5 0.5";
  };

  useEffect(() => {
    if (polygonRef.current) {
      gsap.set(polygonRef.current, {
        attr: { points: getCollapsedPoints() }
      });
    }
  }, [shape, triggerCount]);

  const onMouseEnter = () => {
    if (polygonRef.current) {
      gsap.to(polygonRef.current, {
        attr: { points: getPoints(shape) },
        duration: duration,
        ease: `elastic.out(${elasticity}, 0.5)`,
        overwrite: "auto"
      });
    }
  };

  const onMouseLeave = () => {
    if (polygonRef.current) {
      gsap.to(polygonRef.current, {
        attr: { points: getCollapsedPoints() },
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto"
      });
    }
  };

  const code = `// SVG Clip-Path Reveal con Morphing de Puntos (objectBoundingBox)
// Puntos destino: ${shape === "rectangle" ? "Rectángulo [0 0, 1 0, 1 1, 0 1]" : "Diamante [0.5 0, 1 0.5, 0.5 1, 0 0.5]"}
const onHoverEnter = () => {
  gsap.to(polygonElement, {
    attr: { points: "${getPoints(shape)}" },
    duration: ${duration},
    ease: "elastic.out(${elasticity}, 0.5)"
  });
};

const onHoverLeave = () => {
  gsap.to(polygonElement, {
    attr: { points: "0.5 0.5, 0.5 0.5, 0.5 0.5, 0.5 0.5" },
    duration: 0.5,
    ease: "power2.out"
  });
};`;

  return (
    <AnimationCard
      id="clip-path-reveal"
      titleEs="SVG Clip-Path Reveal"
      titleEn="Geometric Morphing Mask"
      prompt="Crea una tarjeta de revelado utilizando un clip-path SVG interactivo con objectBoundingBox, donde un polígono cerrado se expande elásticamente en hover desde un punto central revelando la imagen interna."
      onRestart={() => setTriggerCount(prev => prev + 1)}
      codeString={code}
      technicalInfo={{
        tweenMethods: "gsap.to() interpolando el atributo de puntos 'attr: { points }' de un polígono SVG.",
        varsObject: "points (cadena de coordenadas relativas de 0 a 1), duration, ease.",
        specialProps: "objectBoundingBox en clipPath permite que el polígono sea responsivo y se escale con el contenedor sin código JavaScript adicional.",
        aliases: "Evita la pesadez de librerías vectoriales de terceros usando capacidades nativas de SVG.",
        easingConcept: "elastic.out crea un rebote gelatinoso en los bordes del corte al expandirse.",
        callbacksConcept: "Usa callbacks de React onMouseEnter y onMouseLeave para controlar la transición del clipPath.",
        pluginsAssociated: "No requiere MorphSVGPlugin, ya que modificamos polígonos del mismo número de puntos en el Core."
      }}
      sandboxChildren={
        <div 
          ref={cardRef}
          className="w-full flex flex-col justify-center items-center py-6 bg-slate-950/20 border border-slate-900 rounded-xl relative overflow-hidden h-64 select-none"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500">Pasa el ratón por encima del marco</div>
          
          <div className="relative w-64 h-44 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center cursor-pointer shadow-premium group">
            <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-bold uppercase text-xs tracking-widest font-mono">
              [ Hover para Revelar ]
            </div>
            
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-pink-600 to-cyan-500 flex flex-col justify-center items-center p-4"
              style={{
                clipPath: "url(#revealMask)",
                WebkitClipPath: "url(#revealMask)"
              }}
            >
              <span className="text-white text-lg font-black uppercase tracking-wider text-center drop-shadow-md">
                Awwwards FX
              </span>
              <span className="text-cyan-200 text-[10px] font-mono font-bold tracking-widest mt-1">
                REVELADO GEOMÉTRICO
              </span>
            </div>

            <svg className="absolute w-0 h-0" width="0" height="0">
              <defs>
                <clipPath id="revealMask" clipPathUnits="objectBoundingBox">
                  <polygon ref={polygonRef} points="0.5 0.5, 0.5 0.5, 0.5 0.5, 0.5 0.5" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      }
      controlsChildren={
        <>
          <Slider label="Duración Revelación" min={0.3} max={1.8} step={0.1} value={duration} onChange={setDuration} suffix="s" />
          <Slider label="Elasticidad (Rebote)" min={0.5} max={2.2} step={0.1} value={elasticity} onChange={setElasticity} />
          <Selector 
            label="Tipo de Forma Destino (Shape)" 
            options={["rectangle", "diamond", "triangle"]} 
            value={shape} 
            onChange={setShape} 
          />
        </>
      }
    />
  );
}

// --- 8.5. gsap.registerEffect (Registro global de efectos) ---
export function GsapEffectsDemo() {
  const [scale, setScale] = useState(1.15);
  const [glow, setGlow] = useState(25);
  const [duration, setDuration] = useState(0.5);
  const [triggerCount, setTriggerCount] = useState(0);

  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  useEffect(() => {
    if (!gsap.effects.glowPulse) {
      gsap.registerEffect({
        name: "glowPulse",
        effect: (targets, config) => {
          return gsap.to(targets, {
            scale: config.scale,
            borderColor: config.color,
            boxShadow: `0 0 ${config.glow}px ${config.color}`,
            duration: config.duration,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut"
          });
        },
        defaults: { scale: 1.1, glow: 15, color: "#a855f7", duration: 0.3 }
      });
    }
  }, []);

  const triggerEffect = (ref, customColor) => {
    if (gsap.effects.glowPulse && ref.current) {
      gsap.effects.glowPulse(ref.current, {
        scale: scale,
        glow: glow,
        duration: duration,
        color: customColor
      });
    }
  };

  const code = `// Registro del Efecto Reutilizable
gsap.registerEffect({
  name: "glowPulse",
  effect: (targets, config) => {
    return gsap.to(targets, {
      scale: config.scale,
      borderColor: config.color,
      boxShadow: \`0 0 \${config.glow}px \${config.color}\`,
      duration: config.duration,
      yoyo: true,
      repeat: 1,
      ease: "sine.inOut"
    });
  },
  defaults: { scale: 1.1, glow: 15, color: "#a855f7", duration: 0.3 }
});

// Invocación dinámica desde cualquier componente
gsap.effects.glowPulse(cardRef.current, {
  scale: ${scale},
  glow: ${glow},
  duration: ${duration},
  color: "#22d3ee" // Cyan
});`;

  return (
    <AnimationCard
      id="gsap-effects"
      titleEs="gsap.registerEffect"
      titleEn="Reusable Global Custom Animation"
      prompt="Registra un efecto global reutilizable mediante gsap.registerEffect que encapsule una animación de parpadeo, escalado y sombra luminosa (glow) con parámetros dinámicos, y aplícalo a múltiples elementos individuales en la UI."
      onRestart={() => setTriggerCount(prev => prev + 1)}
      codeString={code}
      technicalInfo={{
        tweenMethods: "gsap.registerEffect() para registrar la lógica de animación, y gsap.effects.effectName() para ejecutarla.",
        varsObject: "name (cadena identificadora), effect (función generadora de tween), defaults (objeto con parámetros por defecto).",
        specialProps: "Permite centralizar animaciones repetitivas del sistema de diseño de tu app web.",
        aliases: "extendTimeline: true permite inyectar el efecto directamente en timelines mediante tl.glowPulse(target, vars).",
        easingConcept: "sine.inOut suaviza la entrada y la salida de la oscilación yoyo de forma armónica.",
        callbacksConcept: "Invocación a través de manejadores de eventos onClick o gestos.",
        pluginsAssociated: "No requiere plugins adicionales. Funciona en el Core principal de GSAP."
      }}
      sandboxChildren={
        <div className="w-full flex flex-col justify-center items-center py-6 bg-slate-950/20 border border-slate-900 rounded-xl relative overflow-hidden h-64 select-none">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500">Haz clic en las tarjetas para pulsar el efecto</div>
          
          <div className="grid grid-cols-3 gap-4 z-10 w-full max-w-md px-4">
            <div 
              ref={card1Ref}
              onClick={() => triggerEffect(card1Ref, "#a855f7")}
              className="px-4 py-6 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-center cursor-pointer transition-all duration-150"
            >
              <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/50 mx-auto mb-3 flex items-center justify-center text-[10px] text-purple-400 font-bold">1</div>
              <span className="text-[10px] font-mono text-slate-400 font-bold">Efecto Púrpura</span>
            </div>
            
            <div 
              ref={card2Ref}
              onClick={() => triggerEffect(card2Ref, "#22d3ee")}
              className="px-4 py-6 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-center cursor-pointer transition-all duration-150"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/50 mx-auto mb-3 flex items-center justify-center text-[10px] text-cyan-400 font-bold">2</div>
              <span className="text-[10px] font-mono text-slate-400 font-bold">Efecto Cyan</span>
            </div>
            
            <div 
              ref={card3Ref}
              onClick={() => triggerEffect(card3Ref, "#fbbf24")}
              className="px-4 py-6 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-center cursor-pointer transition-all duration-150"
            >
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50 mx-auto mb-3 flex items-center justify-center text-[10px] text-yellow-400 font-bold">3</div>
              <span className="text-[10px] font-mono text-slate-400 font-bold">Efecto Oro</span>
            </div>
          </div>
        </div>
      }
      controlsChildren={
        <>
          <Slider label="Escala Máxima (Scale)" min={1.05} max={1.30} step={0.02} value={scale} onChange={setScale} />
          <Slider label="Intensidad de Brillo (Glow px)" min={10} max={40} step={2} value={glow} onChange={setGlow} suffix="px" />
          <Slider label="Duración del Pulso" min={0.2} max={1.2} step={0.1} value={duration} onChange={setDuration} suffix="s" />
        </>
      }
    />
  );
}

// --- 8.6. Letter Domino FX (Efecto dominó tridimensional tipográfico) ---
export function LetterDominoDemo() {
  const [stagger, setStagger] = useState(0.04);
  const [angle, setAngle] = useState(70);
  const [duration, setDuration] = useState(0.5);
  const [triggerCount, setTriggerCount] = useState(0);

  const wordRef = useRef(null);

  const triggerDomino = () => {
    if (!wordRef.current) return;
    const chars = wordRef.current.querySelectorAll('.domino-char');
    
    gsap.killTweensOf(chars);
    
    const tl = gsap.timeline();
    tl.to(chars, {
      rotationX: -angle,
      y: 10,
      scaleY: 0.8,
      color: "#22d3ee",
      duration: duration,
      stagger: stagger,
      ease: "power2.inOut"
    })
    .to(chars, {
      rotationX: 0,
      y: 0,
      scaleY: 1,
      color: "#a855f7",
      duration: duration * 1.5,
      stagger: stagger,
      ease: "elastic.out(1.2, 0.4)"
    });
  };

  const wordText = "DOMINÓ";

  const code = `// Efecto Dominó Tipográfico (3D Stagger Wave)
const chars = wordRef.current.querySelectorAll('.domino-char');

const tl = gsap.timeline();
// Fichas caen
tl.to(chars, {
  rotationX: -${angle},
  y: 10,
  scaleY: 0.8,
  color: "#22d3ee",
  duration: ${duration},
  stagger: ${stagger},
  ease: "power2.inOut"
})
// Fichas se levantan con elasticidad
.to(chars, {
  rotationX: 0,
  y: 0,
  scaleY: 1,
  color: "#a855f7",
  duration: ${duration * 1.5},
  stagger: ${stagger},
  ease: "elastic.out(1.2, 0.4)"
});`;

  return (
    <AnimationCard
      id="letter-domino"
      titleEs="Letter Domino FX"
      titleEn="Tipographic 3D Cascade"
      prompt="Quiero una animación tipográfica en GSAP que simule un efecto dominó, donde al hacer hover o clic sobre un texto, las letras individuales roten en el eje 3D y caigan en cascada escalonada (stagger), volviendo a levantarse elásticamente."
      onRestart={triggerDomino}
      codeString={code}
      technicalInfo={{
        tweenMethods: "gsap.timeline() encadenando caídas y levantadas consecutivas con staggers.",
        varsObject: "rotationX, y, scaleY, duration, stagger, ease.",
        specialProps: "perspective en el contenedor CSS para habilitar el espacio y renderizado 3D real en GPU.",
        aliases: "rotationX mapea directamente a rotateX en CSS transform.",
        easingConcept: "elastic.out para el rebote final de la recuperación tipográfica.",
        callbacksConcept: "Invocación por hover (onMouseEnter) y botón de reinicio.",
        pluginsAssociated: "No requiere plugins adicionales. Funciona en el Core principal de GSAP."
      }}
      sandboxChildren={
        <div className="w-full flex flex-col justify-center items-center py-6 bg-slate-950/20 border border-slate-900 rounded-xl relative overflow-hidden h-64 select-none">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500">Pasa el ratón por encima del texto</div>
          
          <div 
            ref={wordRef}
            onMouseEnter={triggerDomino}
            className="flex justify-center items-center gap-1 cursor-pointer py-10"
            style={{ perspective: "800px" }}
          >
            {wordText.split("").map((char, index) => (
              <span
                key={index}
                className="domino-char inline-block text-5xl md:text-7xl font-black text-purple-500 font-mono select-none"
                style={{
                  transformOrigin: "bottom center",
                  display: "inline-block",
                  willChange: "transform, color"
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      }
      controlsChildren={
        <>
          <Slider label="Retraso Cascada (Stagger)" min={0.02} max={0.15} step={0.01} value={stagger} onChange={setStagger} suffix="s" />
          <Slider label="Ángulo de Caída (rotateX)" min={30} max={90} step={5} value={angle} onChange={setAngle} suffix="°" />
          <Slider label="Duración Caída" min={0.2} max={1.0} step={0.05} value={duration} onChange={setDuration} suffix="s" />
        </>
      }
    />
  );
}

// --- 8.7. Horizontal Scroll Panel (Carrusel horizontal con gestos) ---
export function HorizontalScrollDemo() {
  const [duration, setDuration] = useState(0.6);
  const [friction, setFriction] = useState(1.5);
  const [triggerCount, setTriggerCount] = useState(0);

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    gsap.to(track, {
      xPercent: -currentSlide * 25,
      duration: duration,
      ease: `power2.out(${friction})`,
      overwrite: "auto"
    });
  }, [currentSlide, duration, friction]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = Observer.create({
      target: container,
      type: "wheel,touch",
      onChangeY: (self) => {
        if (self.deltaY > 50) {
          setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
        } else if (self.deltaY < -50) {
          setCurrentSlide(prev => Math.max(prev - 1, 0));
        }
      },
      preventDefault: true
    });

    return () => {
      observer.kill();
    };
  }, []);

  const code = `// Scroll Horizontal interceptando la Rueda del Mouse (Observer)
// 4 Diapositivas = 25% de desplazamiento por slide
const onScrollAction = (direction) => {
  if (direction === "down" && currentSlide < maxSlides) {
    currentSlide++;
  } else if (direction === "up" && currentSlide > 0) {
    currentSlide--;
  }

  gsap.to(trackElement, {
    xPercent: -currentSlide * 25,
    duration: ${duration},
    ease: "power2.out(${friction})"
  });
};

// Configuración de GSAP Observer
Observer.create({
  target: containerElement,
  type: "wheel,touch",
  onChangeY: (self) => {
    if (self.deltaY > 50) onScrollAction("down");
    else if (self.deltaY < -50) onScrollAction("up");
  },
  preventDefault: true // evita desplazar la página principal
});`;

  return (
    <AnimationCard
      id="horizontal-scroll"
      titleEs="Horizontal Scroll Panel"
      titleEn="Observer-based Lateral Slider"
      prompt="Crea una sección de scroll horizontal con GSAP donde los eventos de rueda o toque sean interceptados usando el plugin Observer para desplazar un carrete de tarjetas lateralmente con inercia y amortiguación fluidas."
      onRestart={() => setCurrentSlide(0)}
      codeString={code}
      technicalInfo={{
        tweenMethods: "gsap.to() animando la propiedad xPercent del track de tarjetas.",
        varsObject: "xPercent, duration, ease.",
        specialProps: "Observer.create() intercepta eventos Y (rueda/gesto táctil) y los mapea a transformaciones horizontales X.",
        aliases: "xPercent para realizar desplazamientos optimizados por hardware.",
        easingConcept: "La fuerza de amortiguación (friction) regula el deslizamiento lateral.",
        callbacksConcept: "Manejador onChangeY del Observer con control de límites mínimos y máximos.",
        pluginsAssociated: "Observer Plugin para interceptar y unificar gestos entre mouse, trackpads y dispositivos táctiles."
      }}
      sandboxChildren={
        <div 
          ref={containerRef}
          className="w-full flex flex-col justify-center py-6 bg-slate-950/20 border border-slate-900 rounded-xl relative overflow-hidden h-64 select-none cursor-ew-resize"
        >
          <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 z-10 flex gap-4">
            <span>Rueda del ratón aquí dentro para deslizar</span>
            <span className="text-purple-400 font-bold">Slide {currentSlide + 1} / {totalSlides}</span>
          </div>
          
          <div 
            ref={trackRef}
            className="flex h-40 w-[400%] relative"
            style={{ willChange: "transform" }}
          >
            {/* Slide 1 */}
            <div className="w-1/4 px-4 h-full">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-500/30 p-6 flex flex-col justify-between">
                <span className="text-4xl font-black text-white/20">01</span>
                <div>
                  <h4 className="text-md font-bold text-white">Diseño Inmersivo</h4>
                  <p className="text-xs text-slate-300 mt-1">El scroll horizontal rompe el paradigma vertical tradicional.</p>
                </div>
              </div>
            </div>
            
            {/* Slide 2 */}
            <div className="w-1/4 px-4 h-full">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-900 to-cyan-900 border border-indigo-500/30 p-6 flex flex-col justify-between">
                <span className="text-4xl font-black text-white/20">02</span>
                <div>
                  <h4 className="text-md font-bold text-white">Observer Plugin</h4>
                  <p className="text-xs text-slate-300 mt-1">Sincroniza gestos táctiles y ratón en un único manejador de eventos.</p>
                </div>
              </div>
            </div>
            
            {/* Slide 3 */}
            <div className="w-1/4 px-4 h-full">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-cyan-900 to-emerald-900 border border-cyan-500/30 p-6 flex flex-col justify-between">
                <span className="text-4xl font-black text-white/20">03</span>
                <div>
                  <h4 className="text-md font-bold text-white">Aceleración GPU</h4>
                  <p className="text-xs text-slate-300 mt-1">El uso de xPercent garantiza 60fps constantes al evitar reflows.</p>
                </div>
              </div>
            </div>
            
            {/* Slide 4 */}
            <div className="w-1/4 px-4 h-full">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-900 to-purple-900 border border-emerald-500/30 p-6 flex flex-col justify-between">
                <span className="text-4xl font-black text-white/20">04</span>
                <div>
                  <h4 className="text-md font-bold text-white">Interactividad Awwwards</h4>
                  <p className="text-xs text-slate-300 mt-1">Ideal para portfolios creativos, galerías de arte y showcases.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === i ? 'bg-cyan-400 w-6' : 'bg-slate-700'}`}
              />
            ))}
          </div>
        </div>
      }
      controlsChildren={
        <>
          <Slider label="Duración Desplazamiento" min={0.3} max={1.5} step={0.1} value={duration} onChange={setDuration} suffix="s" />
          <Slider label="Suavizado (Fricción)" min={0.5} max={3.0} step={0.2} value={friction} onChange={setFriction} />
          <div className="flex gap-2 justify-between mt-2">
            <button 
              onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 hover:text-white transition-all uppercase"
              disabled={currentSlide === 0}
            >
              ← Anterior
            </button>
            <button 
              onClick={() => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))}
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 hover:text-white transition-all uppercase"
              disabled={currentSlide === totalSlides - 1}
            >
              Siguiente →
            </button>
          </div>
        </>
      }
    />
  );
}

// --- 8.8. Temporal Scroll (Transición interactiva de eras antes/después) ---
export function TemporalScrollDemo() {
  const [era, setEra] = useState(1);
  const [duration, setDuration] = useState(0.8);
  const [triggerCount, setTriggerCount] = useState(0);

  const pastRef = useRef(null);
  const presentRef = useRef(null);
  const futureRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    const past = pastRef.current;
    const present = presentRef.current;
    const future = futureRef.current;
    const indicator = indicatorRef.current;
    if (!past || !present || !future || !indicator) return;

    const tl = gsap.timeline({ defaults: { duration: duration, ease: "power2.inOut" } });

    gsap.to(indicator, {
      xPercent: era * 100,
      backgroundColor: era === 0 ? "#10b981" : era === 1 ? "#3b82f6" : "#ec4899",
      duration: duration
    });

    if (era === 0) {
      tl.to(past, { opacity: 1, scale: 1, filter: "blur(0px)", pointerEvents: "auto" }, 0)
        .to([present, future], { opacity: 0, scale: 0.9, filter: "blur(8px)", pointerEvents: "none" }, 0);
    } else if (era === 1) {
      tl.to(present, { opacity: 1, scale: 1, filter: "blur(0px)", pointerEvents: "auto" }, 0)
        .to([past, future], { opacity: 0, scale: 0.9, filter: "blur(8px)", pointerEvents: "none" }, 0);
    } else {
      tl.to(future, { opacity: 1, scale: 1, filter: "blur(0px)", pointerEvents: "auto" }, 0)
        .to([past, present], { opacity: 0, scale: 0.9, filter: "blur(8px)", pointerEvents: "none" }, 0);
    }
  }, [era, duration, triggerCount]);

  const onWheel = (e) => {
    if (e.deltaY > 30) {
      setEra(prev => Math.min(prev + 1, 2));
    } else if (e.deltaY < -30) {
      setEra(prev => Math.max(prev - 1, 0));
    }
  };

  const code = `// Scroll Temporal (Time-Travel Transition)
// era: 0 (Pasado), 1 (Presente), 2 (Futuro)
const eras = [pastRef, presentRef, futureRef];
const indicator = indicatorRef.current;

const tl = gsap.timeline({ defaults: { duration: ${duration}, ease: "power2.inOut" } });

// Posicionar indicador temporal
gsap.to(indicator, {
  xPercent: ${era} * 100,
  backgroundColor: \`\${${era} === 0 ? "#10b981" : ${era} === 1 ? "#3b82f6" : "#ec4899"}\`
});

// Transición cruzada tridimensional con blur
if (${era} === 0) {
  tl.to(pastCard, { opacity: 1, scale: 1, filter: "blur(0px)" }, 0)
    .to([presentCard, futureCard], { opacity: 0, scale: 0.9, filter: "blur(8px)" }, 0);
} else if (${era} === 1) {
  tl.to(presentCard, { opacity: 1, scale: 1, filter: "blur(0px)" }, 0)
    .to([pastCard, futureCard], { opacity: 0, scale: 0.9, filter: "blur(8px)" }, 0);
} else {
  tl.to(futureCard, { opacity: 1, scale: 1, filter: "blur(0px)" }, 0)
    .to([pastCard, presentCard], { opacity: 0, scale: 0.9, filter: "blur(8px)" }, 0);
}`;

  return (
    <AnimationCard
      id="temporal-scroll"
      titleEs="Temporal Scroll (Antes/Después)"
      titleEn="Time-Travel State Morphing"
      prompt="Crea un panel de viaje temporal en GSAP que permita transicionar de forma fluida entre tres estados (Pasado, Presente y Futuro) animando opacidad, desenfoque tridimensional y colores mediante la rueda del ratón o sliders."
      onRestart={() => setEra(1)}
      codeString={code}
      technicalInfo={{
        tweenMethods: "gsap.timeline() coordinando desvanecimientos cruzados, desenfoques y transformaciones de escala tridimensionales.",
        varsObject: "opacity, scale, filter: 'blur()', xPercent, backgroundColor, duration.",
        specialProps: "filter: 'blur(Xpx)' para lograr transiciones cinemáticas fluidas con aceleración GPU.",
        aliases: "xPercent para desplazar la barra del indicador temporal.",
        easingConcept: "power2.inOut suaviza tanto el despegue como el frenado de las transiciones.",
        callbacksConcept: "Intercepción de rueda del ratón (onWheel) para desplazarse a través del tiempo.",
        pluginsAssociated: "No requiere plugins especiales. Funciona enteramente sobre el core principal de GSAP."
      }}
      sandboxChildren={
        <div 
          onWheel={onWheel}
          className="w-full flex flex-col justify-center items-center py-6 bg-slate-950/20 border border-slate-900 rounded-xl relative overflow-hidden h-64 select-none cursor-ns-resize"
        >
          <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 z-10">
            Rueda del ratón arriba/abajo aquí dentro para viajar en el tiempo
          </div>

          <div className="relative w-72 h-40 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
            
            {/* ERA 0: PASADO (1990) */}
            <div 
              ref={pastRef}
              className="absolute inset-0 bg-emerald-950/30 border border-emerald-500/20 p-6 flex flex-col justify-between items-center text-center font-mono"
              style={{ willChange: "transform, opacity, filter" }}
            >
              <div className="text-[10px] text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded bg-emerald-950/60 uppercase tracking-widest animate-pulse">
                [ PASADO - AÑO 1990 ]
              </div>
              <div className="text-3xl text-emerald-400 font-bold tracking-tight uppercase select-none">
                📟 CRT PIXELS
              </div>
              <p className="text-[10px] text-emerald-500 max-w-[200px] leading-tight">
                Terminal de comandos en fósforo verde. Estilo retro, baja resolución y scanlines.
              </p>
            </div>

            {/* ERA 1: PRESENTE (2010) */}
            <div 
              ref={presentRef}
              className="absolute inset-0 bg-blue-950/20 border border-blue-500/20 p-6 flex flex-col justify-between items-center text-center font-sans"
              style={{ willChange: "transform, opacity, filter" }}
            >
              <div className="text-[10px] text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded bg-blue-950/60 uppercase tracking-widest">
                PRESENTE - AÑO 2010
              </div>
              <div className="text-3xl text-blue-400 font-extrabold tracking-tight uppercase select-none">
                🌐 WEB GRID
              </div>
              <p className="text-[10px] text-blue-300 max-w-[200px] leading-tight">
                Diseño estructurado y reticular. Mayor resolución, tipografía limpia y minimalista.
              </p>
            </div>

            {/* ERA 2: FUTURO (2026) */}
            <div 
              ref={futureRef}
              className="absolute inset-0 bg-gradient-to-br from-pink-950/40 via-slate-950 to-purple-950/40 border border-pink-500/20 p-6 flex flex-col justify-between items-center text-center font-sans"
              style={{ willChange: "transform, opacity, filter" }}
            >
              <div className="text-[10px] text-pink-400 border border-pink-500/40 px-2 py-0.5 rounded bg-pink-950/60 uppercase tracking-widest font-mono">
                ✦ FUTURO - AÑO 2026 ✦
              </div>
              <div className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-black tracking-wider uppercase select-none drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]">
                🌌 CYBER PUNK
              </div>
              <p className="text-[10px] text-pink-200/80 max-w-[200px] leading-tight font-mono">
                Composición holística 3D, neon glow, interfaces líquidas e IA omnipresente.
              </p>
            </div>

          </div>

          <div className="mt-4 flex bg-slate-900/60 border border-slate-800 rounded-lg p-1 relative w-64 overflow-hidden h-8">
            <div 
              ref={indicatorRef}
              className="absolute top-1 bottom-1 left-1 w-[80px] rounded bg-purple-500 z-0"
              style={{ willChange: "transform, background-color" }}
            />
            <button 
              onClick={() => setEra(0)}
              className={`flex-1 text-[9px] font-mono font-bold z-10 transition-colors uppercase ${era === 0 ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              1990
            </button>
            <button 
              onClick={() => setEra(1)}
              className={`flex-1 text-[9px] font-mono font-bold z-10 transition-colors uppercase ${era === 1 ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              2010
            </button>
            <button 
              onClick={() => setEra(2)}
              className={`flex-1 text-[9px] font-mono font-bold z-10 transition-colors uppercase ${era === 2 ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              2026
            </button>
          </div>
        </div>
      }
      controlsChildren={
        <>
          <Slider label="Control Temporal (Era)" min={0} max={2} step={1} value={era} onChange={setEra} />
          <Slider label="Duración Viaje Temporal" min={0.3} max={1.8} step={0.1} value={duration} onChange={setDuration} suffix="s" />
          <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
            <span>PASADO</span>
            <span>PRESENTE</span>
            <span>FUTURO</span>
          </div>
        </>
      }
    />
  );
}



