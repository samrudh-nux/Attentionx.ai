import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ViralClip, CaptionPhrase, EditingStyle } from '../types';

interface VerticalViewerProps {
  videoUrl: string | null;
  clip: ViralClip | null;
  captions: CaptionPhrase[] | null;
  editingPlan: EditingStyle | null;
  peaks?: any[] | null;
  currentTime: number;
  showCaptions: boolean;
  standalone?: boolean;
}

export const VerticalViewer: React.FC<VerticalViewerProps> = ({ 
  videoUrl, 
  clip, 
  captions, 
  editingPlan, 
  peaks,
  currentTime, 
  showCaptions, 
  standalone = true 
}) => {
  const [offset, setOffset] = useState(50); // 0-100%
  const [zoom, setZoom] = useState(1.1);
  
  // Real-time track centering and caption sync
  const [currentCaption, setCurrentCaption] = useState<CaptionPhrase | null>(null);

  useEffect(() => {
    // Dynamic Editing Styles
    if (editingPlan) {
      if (editingPlan.editing_style === 'zoom cuts') {
        const beat = Math.floor(currentTime * 2) % 2; // Flip every 0.5s
        setZoom(beat === 0 ? 1.1 : 1.3);
      } else {
        setZoom(1.1);
      }

      if (editingPlan.camera_focus === 'face') {
        setOffset(50 + Math.sin(currentTime * 0.3) * 5); // Subtle face tracking simulation
      }
    }

    // Smart Caption Logic: Phrase-based syncing
    if (captions && captions.length > 0) {
      const activePhrase = captions.find(c => currentTime >= c.start_time && currentTime <= c.end_time);
      if (activePhrase && activePhrase.text !== currentCaption?.text) {
        setCurrentCaption(activePhrase);
      } else if (!activePhrase && currentCaption !== null) {
        setCurrentCaption(null);
      }
    }
  }, [currentTime, clip, captions, editingPlan, currentCaption]);

  const overlays = (
    <>
      {/* Tracking Reticle */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <motion.div 
             animate={{ opacity: [0.1, 0.3, 0.1] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="w-full h-full border-x-4 border-brand/20 flex flex-col justify-between p-12"
          >
             <div className="flex justify-between">
                <div className="w-8 h-8 border-t-2 border-l-2 border-brand/40" />
                <div className="w-8 h-8 border-t-2 border-r-2 border-brand/40" />
             </div>
             <div className="flex justify-between">
                <div className="w-8 h-8 border-b-2 border-l-2 border-brand/40" />
                <div className="w-8 h-8 border-b-2 border-r-2 border-brand/40" />
             </div>
          </motion.div>
      </div>
      
      {/* Emotional Peak Heatmap Overlay */}
      <div className="absolute top-24 left-4 right-4 h-12 z-20 pointer-events-none">
          <div className="flex items-end justify-between h-full gap-0.5">
             {clip ? (
                Array.from({ length: 40 }).map((_, i) => {
                  const timeInClip = clip.start_time + (i / 40) * (clip.end_time - clip.start_time);
                  // Check if any emotional peak overlaps this segment
                  const peak = peaks?.find(p => timeInClip >= p.start_time && timeInClip <= p.end_time);
                  const isPeak = !!peak;
                  
                  return (
                    <motion.div 
                      key={i}
                      animate={{ 
                        height: isPeak ? `${50 + peak.confidence * 50}%` : `${10 + Math.random() * 20}%`,
                        opacity: isPeak ? 0.8 : 0.2,
                        backgroundColor: isPeak ? '#c026d3' : '#ffffff' // brand color for peaks
                      }}
                      className="flex-1 rounded-t-sm"
                    />
                  );
                })
             ) : (
                Array.from({ length: 40 }).map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ height: `${20 + Math.random() * 60}%`, opacity: 0.1 }}
                   className="flex-1 bg-white/20 rounded-t-sm"
                 />
               ))
             )}
          </div>
          <div className="text-[7px] font-black text-white/40 uppercase tracking-widest mt-1 text-center">Neural Intensity Mapper (Step 1 Feed)</div>
      </div>
      
      {/* Branding Overlay */}
      <div className="absolute top-8 left-0 right-0 flex justify-center z-20">
           <div className="px-3 py-1 bg-brand/80 backdrop-blur-md rounded-lg text-[10px] font-black text-white tracking-widest">
              ATTENTION X
           </div>
      </div>

      {/* Professional Whisper-Flow Caption Overlay */}
      {showCaptions && (
        <div className="absolute inset-x-6 top-[60%] z-50 pointer-events-none min-h-[120px] flex flex-col items-center justify-center">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
            {currentCaption ? (
                currentCaption.text.split(' ').map((word, i) => {
                  const isHighlighted = currentCaption.highlight.includes(word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ""));
                  return (
                    <motion.span 
                      key={i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: isHighlighted ? 1.2 : 1,
                        opacity: 1,
                        color: isHighlighted ? '#facc15' : '#ffffff' // Yellow for highlighted words
                      }}
                      className={`text-2xl font-black uppercase tracking-tighter italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${isHighlighted ? 'z-10 bg-brand/30 px-1 rounded' : 'z-0'}`}
                    >
                      {word}
                    </motion.span>
                  );
                })
            ) : (
                <div className="w-12 h-1 bg-white/5 rounded-full animate-pulse" />
            )}
          </div>
          <div className="mt-2 text-[6px] font-black text-white/20 uppercase tracking-[0.5em]">Neural Whisper Flow v5.0</div>
        </div>
      )}

      {/* Clip Info Overlay */}
      <div className="absolute bottom-24 left-6 right-6 z-20">
          <div className="px-4 py-3 glass-heavy rounded-2xl border border-white/10 shadow-2xl">
            <div className="text-[9px] font-black uppercase tracking-widest text-brand mb-1">Impact: {clip?.emotion || "Analyzing"}</div>
            <div className="text-white font-bold text-sm leading-tight truncate">
              {clip?.viral_reason || "NEURAL SYNCING..."}
            </div>
          </div>
      </div>

      {/* UI elements */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6 opacity-40">
          <div className="w-8 h-8 rounded-full border-2 border-white" />
          <div className="flex gap-2">
              <div className="w-1 h-8 bg-white rounded-full" />
              <div className="w-1 h-5 bg-white rounded-full" />
              <div className="w-1 h-6 bg-white rounded-full" />
          </div>
      </div>
    </>
  );

  if (!standalone) return overlays;

  return (
    <div className="flex flex-col items-center">
      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
         <div className="w-1 h-1 rounded-full bg-brand animate-ping" />
         Live Vertical Render
      </div>
      <div className="relative w-[320px] aspect-[9/16] rounded-[3rem] bg-black border-[12px] border-zinc-900 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden scale-90 md:scale-100 transition-transform">
        {/* Dynamic Video Crop */}
        {videoUrl && (
          <video 
            src={videoUrl}
            style={{
              transform: `translateX(-${offset}%) translateX(160px) scale(${zoom})`, 
              height: '100%',
              maxWidth: 'none',
              width: 'auto',
              position: 'absolute',
              left: 0,
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            muted
            playsInline
            autoPlay
            loop
          />
        )}
        {overlays}
      </div>
    </div>
  );
};
