import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { Observer } from 'gsap/Observer';
import AnimationCard from '../AnimationCard';
import { Play, Pause, RotateCcw, ArrowRight, MousePointer, Move } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin, TextPlugin, Observer);

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
