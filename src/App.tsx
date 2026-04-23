/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Gamepad2, Headphones } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center py-12 px-6 relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Large Background Circles */}
        <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] bg-cyan-950/20 rounded-full" />
        <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-fuchsia-950/20 rounded-full" />
        <div className="absolute -bottom-[20%] left-[10%] w-[1000px] h-[1000px] bg-blue-950/10 rounded-full" />
      </div>

      {/* Header Section */}
      <header className="relative z-10 text-center mb-16 px-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-[0.3em] uppercase text-cyan-400 mb-6 backdrop-blur-sm"
        >
          <Gamepad2 className="w-4 h-4" />
          Arcade Edition
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </motion.div>

        <motion.h1
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-7xl md:text-[120px] font-black tracking-tighter mb-4 flex items-center justify-center gap-6"
        >
          <span className="font-display text-white">NEON</span>
          <div className="h-16 md:h-28 w-[200px] md:w-[500px] bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500" />
        </motion.h1>
        
        <p className="text-white/40 max-w-xl mx-auto font-medium text-lg leading-relaxed">
          Master the rhythm, conquer the grid. A synchronized fusion of classic arcade action and synthwave aesthetics.
        </p>
      </header>

      {/* Main Content Grid */}
      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Game Column */}
        <motion.section
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center lg:items-end justify-start"
        >
          <div className="relative">
            <div className="absolute -top-8 left-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
              <Gamepad2 className="w-3 h-3" />
              Game Unit 01
            </div>
            <SnakeGame />
          </div>
        </motion.section>

        {/* Music Column */}
        <motion.section
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center lg:items-start justify-start"
        >
          <div className="relative">
            <div className="absolute -top-8 left-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
              <Headphones className="w-3 h-3" />
              Audio Feed 01
            </div>
            <MusicPlayer />
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 w-full max-w-[400px]">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-3 ml-1">Control Scheme</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <p className="text-[10px] uppercase text-white/30 font-bold mb-1">Navigate</p>
                <p className="text-xs text-cyan-400 font-mono">Arrow Keys</p>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <p className="text-[10px] uppercase text-white/30 font-bold mb-1">Pause</p>
                <p className="text-xs text-fuchsia-400 font-mono">Space Bar</p>
              </div>
            </div>
          </div>
        </motion.section>

      </main>

      {/* Footer / Decorative Rail */}
      <footer className="mt-24 p-8 w-full border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">
        <div>© 2024 NEON RHYTHM PROTOCOL</div>
        <div className="flex gap-8">
          <span className="hover:text-cyan-400 transition-colors cursor-pointer">System Status: Nominal</span>
          <span className="hover:text-fuchsia-400 transition-colors cursor-pointer">Connection: Secure</span>
        </div>
      </footer>

      {/* Side Decorative Numbers */}
      <div className="fixed -left-20 top-[40%] vertical-text text-[200px] font-black opacity-[0.05] select-none pointer-events-none hidden xl:block uppercase">
        SNK_0
      </div>
      <div className="fixed -right-20 top-0 vertical-text text-[200px] font-black opacity-[0.05] select-none pointer-events-none hidden xl:block uppercase">
        AUD
      </div>
    </div>
  );
}

