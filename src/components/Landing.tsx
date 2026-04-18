import React from 'react';
import { motion } from 'motion/react';
import { Upload, Zap, Sparkles, Scissors, MonitorPlay, ChevronRight, Play, CheckCircle2 } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden attention-gradient px-6 grainy">
      {/* Background Decorative Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-12 w-96 h-96 bg-brand/20 blur-[128px] rounded-full" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 -right-12 w-96 h-96 bg-accent/20 blur-[128px] rounded-full" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 text-center max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-brand/20 text-brand text-[10px] font-black tracking-widest uppercase mb-10 shadow-premium">
          <Sparkles size={14} />
          <span>AI-POWERED CONTENT REPURPOSING</span>
        </div>

        <h1 className="text-7xl md:text-[9rem] font-black mb-8 leading-[0.8] tracking-tighter uppercase italic select-none">
          OWN THE <br />
          <span className="text-brand drop-shadow-[0_0_30px_rgba(192,38,211,0.3)]">ATTENTION</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          AttentionX uses advanced Multimodal AI to extract viral highlights from your long-form footage. 
          Smart-crop, dynamic captions, and 10x your output in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="group relative px-10 py-5 bg-white text-dark font-black rounded-3xl overflow-hidden shadow-2xl transition-all"
          >
            <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16, 1, 0.3, 1]" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors text-lg tracking-tight">
              Get Started <ChevronRight size={20} />
            </span>
          </motion.button>
          
          <button className="px-10 py-5 glass text-white font-bold rounded-3xl hover:bg-white/10 transition-all border-white/10 text-lg">
            Watch Engine Demo
          </button>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-6xl w-full">
        {[
          {
            icon: <Zap className="text-brand" />,
            title: "Emotional Peak Detection",
            desc: "Our AI identifies high-energy moments and profound insights automatically."
          },
          {
            icon: <Scissors className="text-accent" />,
            title: "Smart Vertical Crop",
            desc: "Speaker-tracking computer vision keeps the focus on what matters for Reels & TikTok."
          },
          {
            icon: <MonitorPlay className="text-zinc-400" />,
            title: "Dynamic Captions",
            desc: "High-contrast, timed overlays built to stop the scroll and keep viewers engaged."
          }
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="p-8 glass rounded-3xl border-white/5 hover:border-brand/20 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
            <p className="text-zinc-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-32 pb-12 text-zinc-600 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
        <span>Trusted by 500+ Creators</span>
      </div>
    </div>
  );
};
