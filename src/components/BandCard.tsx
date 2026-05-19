import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { Play, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BandCardProps {
  name: string;
  genre: string;
  image: string;
  description?: string;
  audio?: string;
  delay?: number;
}

export default function BandCard({ name, genre, image, description, audio, delay = 0 }: BandCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // NEW: State for mobile press-and-hold
  const [isLongPressed, setIsLongPressed] = useState(false);
  const touchTimer = useRef<NodeJS.Timeout | null>(null);
  
  // 3D rotation logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    stopPlayback();
  };

  const startPlayback = () => {
    if (audio && audioRef.current) {
      setIsPlaying(true);
      audioRef.current.src = audio;
      audioRef.current.volume = 0.15;
      audioRef.current.play().catch(() => {});
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // NEW: Touch event handlers for mobile
  const handleTouchStart = () => {
    // Wait 200ms to ensure it's a hold and not a scroll
    touchTimer.current = setTimeout(() => {
      setIsLongPressed(true);
      startPlayback();
    }, 200);
  };

  const handleTouchEnd = () => {
    if (touchTimer.current) clearTimeout(touchTimer.current);
    setIsLongPressed(false);
    stopPlayback();
  };

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        onMouseMove={handleMouseMove}
        onMouseEnter={startPlayback}
        onMouseLeave={handleMouseLeave}
        // Touch events injected here
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onTouchMove={handleTouchEnd} // Cancel hold if they start scrolling
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`group relative overflow-hidden bg-charcoal aspect-[4/5] border border-white/5 transition-all duration-500 ${isPlaying ? 'border-accent-cyan/30' : ''} rounded-[2px]`}
      >
        <audio ref={audioRef} className="hidden" />
        <img
          src={image}
          alt={name}
          // Added logic to force hover effects when isLongPressed is true
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLongPressed 
              ? 'grayscale-0 brightness-100' 
              : 'grayscale brightness-[0.7] group-hover:brightness-100 group-hover:grayscale-0'
          }`}
          referrerPolicy="no-referrer"
          style={{ transform: "translateZ(-20px)" }}
        />
        
        {isPlaying && (
          <div className="absolute top-4 right-4 z-20" style={{ transform: "translateZ(30px)" }}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              <Play size={14} className="text-accent-cyan fill-accent-cyan" />
            </motion.div>
          </div>
        )}
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-300 ${
          isLongPressed ? 'opacity-90' : 'opacity-80 group-hover:opacity-90'
        }`} />
        
        <div 
          className={`absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-300 ${
            isLongPressed ? '-translate-y-2' : 'group-hover:-translate-y-2'
          }`} 
          style={{ transform: "translateZ(40px)" }}
        >
          <p className="text-accent-cyan font-bold text-xs uppercase tracking-[0.2em] mb-2 font-mono">
            {genre}
          </p>
          <h3 className={`text-2xl font-black italic uppercase tracking-tight mb-2 transition-colors ${
            isLongPressed ? 'text-accent-lime' : 'text-white group-hover:text-accent-lime'
          }`}>
            {name}
          </h3>
          {description && (
            <p className={`text-gray-300 text-sm line-clamp-2 italic font-medium transition-opacity duration-300 delay-100 ${
              isLongPressed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              {description}
            </p>
          )}
          
          <div className={`mt-4 h-px bg-accent-cyan transition-all duration-700 ${
            isLongPressed ? 'w-full' : 'w-0 group-hover:w-full'
          }`} />
        </div>
        
        <div className={`absolute top-0 right-0 w-8 h-8 border-t border-r border-transparent transition-colors duration-500 ${
          isLongPressed ? 'border-accent-cyan' : 'group-hover:border-accent-cyan'
        }`} />
      </motion.div>
      
      {/* Buy Ticket Button Link */}
      <Link 
        to="/purchase-tickets" 
        className={`btn btn-secondary w-full py-3 flex items-center justify-center gap-2 text-[10px] transition-opacity duration-300 ${
          isLongPressed ? 'opacity-100' : 'opacity-100 md:opacity-0 group-hover:opacity-100'
        }`}
      >
        <Ticket size={14} />
        Buy Tickets for {name.split(' ')[0]}
      </Link>
    </div>
  );
}