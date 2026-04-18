/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Landing } from './components/Landing';
import { Processor } from './components/Processor';
import { Zap, Sparkles, LayoutGrid, Settings, HelpCircle, Bell } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');

  return (
    <div className="min-h-screen font-sans selection:bg-brand selection:text-white grainy overflow-x-hidden">
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Landing onStart={() => setView('app')} />
          </motion.div>
        ) : (
          <motion.div 
            key="app"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-screen bg-dark flex flex-col"
          >
            {/* Ultra-Clean Header */}
            <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between glass sticky top-0 z-[100] backdrop-blur-3xl">
              <div className="flex items-center gap-12">
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setView('landing')}
                >
                  <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white rotate-[-8deg] group-hover:rotate-0 transition-all duration-500 shadow-[0_0_20px_rgba(192,38,211,0.3)]">
                    <Sparkles size={22} fill="currentColor" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-black text-2xl tracking-tighter uppercase italic leading-none">ATTENTION<span className="text-brand">X</span></span>
                    <span className="text-[9px] font-black tracking-[0.3em] text-zinc-500 uppercase mt-0.5">Neural Engine</span>
                  </div>
                </div>

                <nav className="hidden lg:flex items-center gap-2">
                  {['Workspace', 'Library', 'Cloud Archive', 'Analytics'].map((item) => (
                    <button 
                      key={item}
                      className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                        item === 'Workspace' ? 'text-brand' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center gap-4 px-4 py-2 glass rounded-2xl border border-white/5">
                   <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                   <span className="text-[10px] font-black tracking-widest text-zinc-400">GEMINI 1.5 ACTIVE</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/5">
                    <Bell size={18} />
                  </button>
                  <button className="p-2.5 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/5">
                    <Settings size={18} />
                  </button>
                </div>
              </div>
            </header>

            {/* Main Application Interface */}
            <main className="flex-1 bg-dark attention-gradient overflow-x-hidden">
              <div className="max-w-7xl mx-auto px-6 pt-16">
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.8 }}
                      className="space-y-4"
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full border border-white/10">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                         <span className="text-[9px] font-black tracking-widest text-brand uppercase">Stable Production Node</span>
                      </div>
                      <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                        CONTENT REPURPOSE
                      </h1>
                    </motion.div>
                    
                    <div className="flex items-center gap-4">
                      <button className="px-8 py-3 glass font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 border-white/10 hover:bg-white/5 transition-all active:scale-95">
                         <LayoutGrid size={18} /> Master Library
                      </button>
                      <button 
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-white text-dark font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-zinc-200 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.5)] active:scale-95"
                      >
                         <Zap size={18} fill="currentColor" /> New Session
                      </button>
                    </div>
                 </div>
              </div>

              <Processor />
            </main>

            {/* Micro-Footer Status Bar */}
            <footer className="h-14 border-t border-white/5 glass px-8 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand shadow-[0_0_10px_rgba(192,38,211,0.5)]" />
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Neural Link: Encrypted</span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-white/10" />
                <div className="hidden sm:block text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">Platform Latency: 42ms</div>
              </div>
              
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">
                    Build 0.4.2-Flash <HelpCircle size={12} className="opacity-50" />
                 </div>
                 <div className="h-8 w-px bg-white/5" />
                 <div className="text-[10px] font-black text-brand uppercase tracking-widest italic flex items-center gap-1">
                    Powered by <Sparkles size={12} fill="currentColor" />
                 </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

