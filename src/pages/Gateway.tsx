import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Music, Tv, Trophy } from 'lucide-react';

export default function Gateway() {
  const navigate = useNavigate();

  const handleExternalRedirect = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 overflow-hidden relative selection:bg-accent-cyan selection:text-black">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 mb-16"
      >
        <p className="text-accent-cyan font-mono font-black tracking-[0.4em] uppercase mb-4 text-[10px]">Select Your Frequency</p>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
          What are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-lime">interested in?</span>
        </h1>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 z-10 w-full max-w-6xl items-center justify-center perspective-[1000px]">
        
        {/* MOVIES OPTION */}
        <motion.div
          whileHover={{ scale: 1.05, rotateY: 10 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleExternalRedirect('https://www.bfi.org.uk/')} // Replace with actual footer link
          className="group relative w-full md:w-1/4 h-64 bg-charcoal/40 border border-white/5 rounded-[4px] flex flex-col items-center justify-center cursor-pointer overflow-hidden backdrop-blur-sm transition-colors hover:border-white/20"
        >
          <Tv size={40} className="text-gray-500 group-hover:text-white transition-colors mb-4" />
          <h3 className="text-xl font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Cinema</h3>
        </motion.div>

        {/* MUSIC OPTION (EMPHASIZED) */}
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05, rotateY: 0, zIndex: 20 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/home')}
          className="group relative w-full md:w-2/4 h-80 bg-black border border-accent-cyan/30 rounded-[4px] flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.1)] hover:shadow-[0_0_60px_rgba(0,229,255,0.2)] hover:border-accent-cyan transition-all"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity duration-700 grayscale group-hover:grayscale-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          <div className="relative z-10 flex flex-col items-center">
            <Music size={50} className="text-accent-cyan mb-6 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
            <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">UK Music</h3>
            <p className="text-[10px] text-accent-cyan uppercase tracking-[0.4em] font-bold">Enter Festival Interface</p>
          </div>
        </motion.div>

        {/* FOOTBALL OPTION */}
        <motion.div
          whileHover={{ scale: 1.05, rotateY: -10 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleExternalRedirect('https://www.premierleague.com/')} // Replace with actual footer link
          className="group relative w-full md:w-1/4 h-64 bg-charcoal/40 border border-white/5 rounded-[4px] flex flex-col items-center justify-center cursor-pointer overflow-hidden backdrop-blur-sm transition-colors hover:border-white/20"
        >
          <Trophy size={40} className="text-gray-500 group-hover:text-white transition-colors mb-4" />
          <h3 className="text-xl font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Football</h3>
        </motion.div>

      </div>
    </div>
  );
}