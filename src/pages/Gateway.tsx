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
      
      {/* MODIFIED: Animated Background Ambience */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-50%] z-0 flex items-center justify-center pointer-events-none origin-center"
      >
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-cyan/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-pink/10 blur-[120px] rounded-full mix-blend-screen" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 mb-16 px-4"
      >
        <p className="text-accent-cyan font-mono font-black tracking-[0.4em] uppercase mb-4 text-[10px]">Select Your Frequency</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter text-white leading-tight py-2">
          What are you <br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-lime pr-4">interested in?</span>
        </h1>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 z-10 w-full max-w-6xl items-center justify-center perspective-[1000px]">
        
        {/* MOVIES OPTION */}
        <motion.div
          whileHover={{ scale: 1.05, rotateY: 10, borderColor: "#f418b6", boxShadow: "0 0 20px rgba(244,24,182,0.2)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleExternalRedirect('https://www.bfi.org.uk/')}
          className="group relative w-full md:w-1/4 h-64 bg-charcoal/40 border border-white/5 rounded-[4px] flex flex-col items-center justify-center cursor-pointer overflow-hidden backdrop-blur-sm transition-colors"
        >
          <Tv size={40} className="text-gray-500 group-hover:text-neon-pink transition-colors mb-4" />
          <h3 className="text-xl font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Cinema</h3>
        </motion.div>

        {/* MUSIC OPTION (EMPHASIZED - MOVING BORDER BEAM) */}
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05, rotateY: 0, zIndex: 20, boxShadow: "0 0 40px rgba(244,24,182,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/home')}
          className="group relative w-full md:w-2/4 h-80 rounded-[4px] cursor-pointer overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.1)] transition-all bg-black"
        >
          {/* THE MOVING NEON LIGHT BEAM */}
          {/* Spins a sharp gradient from the exact center */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 w-[250%] h-[250%] bg-[conic-gradient(transparent_75%,#00E5FF_100%)] group-hover:opacity-0 transition-opacity duration-500 z-0"
            style={{ x: "-50%", y: "-50%" }}
          />

          {/* INNER CONTENT MASK */}
          {/* inset-[2px] leaves exactly 2px of the spinning light visible as a border */}
          <div className="absolute inset-[2px] bg-[#050505] rounded-[2px] z-10 overflow-hidden flex flex-col items-center justify-center border border-transparent group-hover:border-neon-pink transition-colors duration-500">
            
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity duration-700 grayscale group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {/* Text & Icon */}
            <div className="relative z-20 flex flex-col items-center">
              <Music size={50} className="text-accent-cyan group-hover:text-neon-pink transition-colors duration-500 mb-6 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
              <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">UK Music</h3>
              <p className="text-[10px] text-accent-cyan group-hover:text-neon-pink transition-colors duration-500 uppercase tracking-[0.4em] font-bold">Enter Festival Interface</p>
            </div>
          </div>
        </motion.div>

        {/* FOOTBALL OPTION */}
        <motion.div
          whileHover={{ scale: 1.05, rotateY: -10, borderColor: "#f418b6", boxShadow: "0 0 20px rgba(244,24,182,0.2)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleExternalRedirect('https://www.premierleague.com/')}
          className="group relative w-full md:w-1/4 h-64 bg-charcoal/40 border border-white/5 rounded-[4px] flex flex-col items-center justify-center cursor-pointer overflow-hidden backdrop-blur-sm transition-colors"
        >
          <Trophy size={40} className="text-gray-500 group-hover:text-neon-pink transition-colors mb-4" />
          <h3 className="text-xl font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Football</h3>
        </motion.div>

      </div>
    </div>
  );
}