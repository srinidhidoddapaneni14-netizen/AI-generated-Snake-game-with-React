import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Handle autoplay block
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="w-full max-w-[400px] p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
      {/* Decorative gradient background */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-fuchsia-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-6 mb-8 relative">
        <div className="relative w-24 h-24 shrink-0">
          <motion.div
            key={currentTrack.id}
            initial={{ rotate: -20, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-white/10"
          >
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          {isPlaying && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border-2 border-dashed border-cyan-500/30 rounded-full pointer-events-none"
            />
          )}
        </div>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <h3 className="text-xl font-bold text-white truncate leading-none mb-2">
                {currentTrack.title}
              </h3>
              <p className="text-white/50 text-sm font-medium tracking-wide flex items-center gap-1.5 uppercase">
                <Music2 className="w-3 h-3" />
                {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 w-full bg-white/10 rounded-full mb-8 overflow-hidden cursor-pointer" 
           onClick={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             const x = e.clientX - rect.left;
             const p = x / rect.width;
             if (audioRef.current) {
               audioRef.current.currentTime = p * audioRef.current.duration;
             }
           }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <button className="text-white/40 hover:text-white transition-colors">
          <Volume2 className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-6">
          <button
            onClick={handlePrev}
            className="text-white/60 hover:text-white transition-all transform active:scale-90"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.6)] active:scale-95 relative z-10"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="text-white/60 hover:text-white transition-all transform active:scale-90"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="w-5 h-5" /> {/* Spacer */}
      </div>

      {/* Track List Preview */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-4">
          COMING UP NEXT
        </p>
        <div className="space-y-3">
          {TRACKS.filter((_, i) => i !== currentTrackIndex).slice(0, 2).map((track) => (
            <div key={track.id} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
              <img src={track.cover} className="w-8 h-8 rounded-md object-cover" referrerPolicy="no-referrer" />
              <div>
                <p className="text-xs font-bold text-white">{track.title}</p>
                <p className="text-[10px] text-white/50">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
