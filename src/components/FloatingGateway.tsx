import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Tv, Trophy } from 'lucide-react';

export default function FloatingGateway() {
  const [isOpen, setIsOpen] = useState(false);

  const handleExternalRedirect = (url: string) => {
    window.location.href = url;
  };

  return (
    <motion.div 
      drag 
      dragMomentum={false}
      className="fixed top-8 right-8 z-[100] flex flex-col items-end gap-3 cursor-move"
    >
      {/* MODIFIED: Converted to motion.div with drag enabled. Placed at top-24. */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(244,24,182,0.3)] transition-colors duration-300 ${
          isOpen ? 'bg-charcoal border border-white/20 text-white' : 'bg-neon-pink text-black'
        }`}
      >
        <motion.div animate={{ rotate: isOpen ? 135 : 0 }} transition={{ duration: 0.3 }}>
          <Plus size={24} className={isOpen ? 'opacity-50' : ''} />
        </motion.div>
      </motion.button>

      {/* MODIFIED: Menu is now below the button and animates downwards */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3"
          >
            <button 
              onClick={() => handleExternalRedirect('https://www.bfi.org.uk/')}
              className="flex items-center gap-3 px-4 py-3 bg-charcoal/90 border border-white/10 rounded-full shadow-lg hover:border-accent-cyan transition-colors group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-white">Movies</span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-cyan/20 group-hover:text-accent-cyan transition-colors">
                <Tv size={14} />
              </div>
            </button>

            <button 
              onClick={() => handleExternalRedirect('https://www.premierleague.com/')}
              className="flex items-center gap-3 px-4 py-3 bg-charcoal/90 border border-white/10 rounded-full shadow-lg hover:border-accent-lime transition-colors group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-white">Football</span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-lime/20 group-hover:text-accent-lime transition-colors">
                <Trophy size={14} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}