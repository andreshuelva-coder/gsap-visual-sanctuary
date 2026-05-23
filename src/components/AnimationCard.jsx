import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Code, BookOpen, Sliders, Play, Info, Sparkles } from 'lucide-react';

export default function AnimationCard({
  id,
  titleEs,
  titleEn,
  prompt,
  sandboxChildren,
  controlsChildren,
  codeString,
  technicalInfo = {},
  onRestart
}) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState('code'); // default to code tab for easy copying

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id={id} className="w-full mb-16 pt-6">
      <div className="glass-panel glow-card rounded-2xl border border-slate-800/80 overflow-hidden shadow-premium">
        
        {/* ========================================================================= */}
        {/* CAPA 1: SISTEMA DE NOMENCLATURA EN DOS IDIOMAS (AI-READY) */}
        {/* ========================================================================= */}
        <div className="p-6 border-b border-slate-800/60 bg-gradient-to-r from-slate-900/80 via-slate-950/40 to-slate-900/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  {titleEs}
                </span>
                <span className="text-slate-500 font-normal text-base md:text-lg">/ {titleEn}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-mono">Selector ID: #{id}</p>
            </div>
            
            <div className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-full w-max flex items-center gap-1.5 self-start md:self-center font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              IA-READY PROMPT
            </div>
          </div>

          {/* AI Prompt Box */}
          <div className="mt-4 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative flex items-start justify-between bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">Prompt de IA para Vibe-Coding:</p>
                <p className="text-xs text-slate-300 font-mono italic leading-relaxed">"{prompt}"</p>
              </div>
              <button
                onClick={handleCopyPrompt}
                className="mt-1 flex items-center justify-center p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-800"
                title="Copiar Prompt"
              >
                {copiedPrompt ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CAPA 2: ESCENARIO VISUAL (SANDBOX PREVIEW) */}
        {/* ========================================================================= */}
        <div className="relative min-h-[300px] flex items-center justify-center bg-slate-950/20 border-b border-slate-800/60 p-8 overflow-hidden dot-bg">
          {/* Visual sandbox canvas */}
          <div className="w-full flex items-center justify-center z-10">
            {sandboxChildren}
          </div>

          {/* Floating controls */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
              onClick={onRestart}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all uppercase"
            >
              <RotateCcw size={12} />
              Reiniciar Animación
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CAPA 3: PANEL DE CONTROL INTERACTIVO (DYNAMIC SLIDERS) */}
        {/* ========================================================================= */}
        <div className="p-5 bg-slate-900/20 border-b border-slate-800/60">
          <div className="flex items-center gap-1.5 mb-4">
            <Sliders size={14} className="text-purple-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Valores Reactivos (Vars Object)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {controlsChildren}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CAPA 4: ENCICLOPEDIA TÉCNICA CONCISA (FOOTER INTEGRADO) */}
        {/* ========================================================================= */}
        <div className="bg-slate-950/60 p-5">
          {/* Tabs header */}
          <div className="flex flex-wrap border-b border-slate-800/80 mb-4 gap-1">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
                activeTab === 'code'
                  ? 'border-cyan-400 text-cyan-400 bg-slate-900/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code size={12} />
              Código GSAP
            </button>
            <button
              onClick={() => setActiveTab('tween')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
                activeTab === 'tween'
                  ? 'border-purple-400 text-purple-400 bg-slate-900/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Info size={12} />
              El Tween y Métodos
            </button>
            <button
              onClick={() => setActiveTab('concepts')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
                activeTab === 'concepts'
                  ? 'border-emerald-400 text-emerald-400 bg-slate-900/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen size={12} />
              Conceptos Internos
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
                activeTab === 'advanced'
                  ? 'border-amber-400 text-amber-400 bg-slate-900/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles size={12} />
              Estructuras Avanzadas
            </button>
          </div>

          {/* Tabs Content */}
          <div className="min-h-[140px] text-xs leading-relaxed text-slate-300">
            {/* 1. Dynamic Code Viewer */}
            {activeTab === 'code' && (
              <div className="relative group">
                <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-white transition-all uppercase"
                  >
                    {copiedCode ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                    {copiedCode ? 'Copiado' : 'Copiar Código'}
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl overflow-x-auto text-[11px] font-mono text-cyan-300/90 whitespace-pre-wrap max-h-[300px]">
                  {codeString}
                </pre>
              </div>
            )}

            {/* 2. Tween & Methods */}
            {activeTab === 'tween' && (
              <div className="bg-slate-900/10 p-2 rounded-lg border border-slate-900/40">
                <h4 className="font-bold text-slate-200 text-xs mb-1.5 uppercase font-mono tracking-wide">¿Qué se ejecuta aquí?</h4>
                <p className="mb-3 text-slate-400">{technicalInfo.tweenMethods}</p>
                <h4 className="font-bold text-slate-200 text-xs mb-1.5 uppercase font-mono tracking-wide">Estructura de Variables (Vars)</h4>
                <code className="block bg-slate-950 p-3 rounded border border-slate-900 text-purple-300 text-[11px] font-mono whitespace-pre-wrap">
                  {technicalInfo.varsObject}
                </code>
              </div>
            )}

            {/* 3. Concepts */}
            {activeTab === 'concepts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/20 p-3 rounded-lg border border-slate-800/40">
                  <h4 className="font-bold text-emerald-400 text-xs mb-1.5 uppercase font-mono tracking-wider">Conceptos Especiales (GSAP Core)</h4>
                  <ul className="space-y-2 text-slate-400">
                    {technicalInfo.specialProps && (
                      <li><strong className="text-slate-200">Special Properties:</strong> {technicalInfo.specialProps}</li>
                    )}
                    {technicalInfo.aliases && (
                      <li><strong className="text-slate-200">Transform Aliases:</strong> {technicalInfo.aliases}</li>
                    )}
                    {technicalInfo.staggerConcept && (
                      <li><strong className="text-slate-200">Stagger Logic:</strong> {technicalInfo.staggerConcept}</li>
                    )}
                  </ul>
                </div>
                <div className="bg-slate-900/20 p-3 rounded-lg border border-slate-800/40">
                  <h4 className="font-bold text-cyan-400 text-xs mb-1.5 uppercase font-mono tracking-wider">Flujos y Funciones</h4>
                  <ul className="space-y-2 text-slate-400">
                    {technicalInfo.easingConcept && (
                      <li><strong className="text-slate-200">Easing:</strong> {technicalInfo.easingConcept}</li>
                    )}
                    {technicalInfo.callbacksConcept && (
                      <li><strong className="text-slate-200">Callbacks (Eventos):</strong> {technicalInfo.callbacksConcept}</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* 4. Advanced */}
            {activeTab === 'advanced' && (
              <div className="bg-slate-900/20 p-4 rounded-lg border border-slate-800/40">
                <h4 className="font-bold text-amber-400 text-xs mb-1.5 uppercase font-mono tracking-wider">Línea de Tiempo y Plugins Asociados</h4>
                <div className="space-y-3 text-slate-400">
                  <div>
                    <h5 className="font-bold text-slate-200 text-xs">Estructura Timeline:</h5>
                    <p>{technicalInfo.timelineStructure}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-200 text-xs">Plugins & Utils involucrados:</h5>
                    <p>{technicalInfo.pluginsAssociated}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
