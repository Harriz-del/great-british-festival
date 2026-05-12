import { motion } from 'motion/react';
import { Camera, Music, Utensils, Star, Users, Flag, ChevronRight, ArrowRight } from 'lucide-react';
import BandCard from '../components/BandCard';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function Showcase() {
  const [coreBands, setCoreBands] = useState<any[]>([]);
  const [continuumBands, setContinuumBands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const featuredNames = [
    'The Beatles',
    'The Rolling Stones',
    'Queen',
    'Royal Blood',
    'Bring Me The Horizon',
    'Coldplay',
    'Arctic Monkeys'
  ];

  useEffect(() => {
    const fetchBands = async () => {
      const { data } = await supabase.from('artists').select('*').eq('status', 'approved');
      if (data) {
        const featuredNamesLower = featuredNames.map(n => n.toLowerCase());
        
        // Filter featured 7 - case insensitive
        const featured = featuredNames.map(name => 
          data.find(b => b.name.toLowerCase() === name.toLowerCase())
        ).filter(Boolean);

        // Underground Continuum - everything else that is approved
        // Removing the is_official check to ensure all 14 (or more) show up
        const remaining = data.filter(b => 
          !featuredNamesLower.includes(b.name.toLowerCase())
        );

        setCoreBands(featured);
        setContinuumBands(remaining);
      }
      setLoading(false);
    };
    fetchBands();
  }, []);

  const activities = [
    { icon: <Music />, title: '4 Main Stages', desc: 'From heavy rock to electronic bangers.' },
    { icon: <Utensils />, title: 'UK Street Food', desc: 'The best local bites from across the islands.' },
    { icon: <Camera />, title: 'Arts & Culture', desc: 'Immersive installations and live workshops.' },
    { icon: <Users />, title: 'Fan Zones', desc: 'Connect with breakthrough acts.' },
  ];

  return (
    <div className="flex flex-col gap-20 p-6 md:p-10 pt-24 overflow-hidden">
      {/* Introduction */}
      <section className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2 text-accent-cyan">
            <Music size={14} />
            <span className="text-[10px] uppercase font-black tracking-[4px]">Collective Exhibit</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            The Music <br/>
            <span className="text-accent-cyan">Assembly</span>
          </h1>
          <p className="text-gray-300 text-xl font-medium italic leading-relaxed">
            A definitive curation of the British soundscape. From the legends who paved the way to the 
            underground disruptors of tomorrow. Experience 3 days of sonic history.
          </p>
        </motion.div>
      </section>

      {/* Core Artists */}
      <section>
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Main <span className="text-accent-cyan">Exhibits</span></h2>
          <div className="h-px bg-white/5 flex-grow" />
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(n => <div key={n} className="h-96 bg-charcoal/50 animate-pulse rounded-[2px]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreBands.map((band, i) => (
              <BandCard
                key={band.name}
                image={band.image}
                name={band.name}
                genre={band.genre}
                description={band.description}
                // Ambient audio restricted to Home page featured cards
                audio={undefined}
                delay={i * 0.1}
              />
            ))}
          </div>
        )}
      </section>

      {/* The Assembly Wall - Underground Continuum */}
      <section className="relative group/continuum">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4 flex-grow">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Underground <span className="text-accent-lime">Continuum</span></h2>
            <div className="h-px bg-white/5 flex-grow" />
          </div>
          <div className="flex gap-2 ml-4">
            <button 
              onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
              className="p-2 border border-white/10 hover:border-accent-lime transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <button 
              onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
              className="p-2 border border-white/10 hover:border-accent-lime transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-12 scrollbar-none snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {continuumBands.map((band, i) => (
            <motion.div
              key={band.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 5) * 0.05 }}
              viewport={{ once: true }}
              className="group relative min-w-[300px] h-96 bg-charcoal/30 border border-white/5 overflow-hidden rounded-[2px] snap-start"
            >
              <img src={band.image} className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" alt={band.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-[10px] text-accent-cyan font-black uppercase tracking-[0.4em] mb-3">{band.genre}</span>
                <h4 className="text-2xl font-black italic uppercase text-white mb-2">{band.name}</h4>
                <p className="text-xs text-gray-400 font-medium italic line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{band.description}</p>
                <div className="mt-6 flex items-center gap-2 text-accent-lime text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  <span>Explore DNA</span>
                  <ChevronRight size={12} />
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-1 bg-accent-lime scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
            </motion.div>
          ))}
          {continuumBands.length === 0 && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="min-w-[300px] h-96 bg-charcoal/10 border border-white/5 border-dashed flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 italic">Syncing Continuum...</span>
            </div>
          ))}
        </div>
      </section>

      {/* Activities Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4 text-accent-cyan">
            <Flag size={14} />
            <span className="text-[10px] uppercase font-black tracking-[4px]">Culture Map</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-6 leading-tight">Shared <span className="text-accent-lime">Spaces</span></h2>
          <p className="text-gray-300 font-medium italic leading-relaxed">
            More than just sound. Immerse yourself in the multi-sensory landscape of a modern British tradition.
          </p>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((act) => (
            <div key={act.title} className="p-8 bg-charcoal/30 border border-white/[0.03] flex flex-col gap-4 hover:border-accent-cyan/20 transition-all duration-500">
              <div className="text-accent-cyan opacity-50">{act.icon}</div>
              <h3 className="text-xl font-black uppercase tracking-tight italic">{act.title}</h3>
              <p className="text-sm text-gray-300 font-medium leading-relaxed italic">{act.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Highlights Gallery */}
      <section>
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px bg-white/[0.03] flex-grow" />
          <h2 className="text-4xl md:text-5xl text-right font-black italic uppercase tracking-tighter">The <span className="text-accent-cyan">Gallery</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 aspect-video overflow-hidden">
           {[1, 2, 3, 4].map(n => (
             <motion.div 
               key={n}
               whileHover={{ scale: 0.99 }}
               className="bg-charcoal overflow-hidden relative border border-white/[0.03]"
             >
               <img 
                 src={`https://images.unsplash.com/photo-${1514525253361 + n}-bee8d48700df?auto=format&fit=crop&q=80&w=400`} 
                 className="w-full h-full object-cover opacity-40 hover:opacity-100 transition-all duration-1000 grayscale hover:grayscale-0" 
                 alt="Gallery" 
               />
               <Star className="absolute top-4 right-4 text-accent-cyan opacity-20" size={14} />
             </motion.div>
           ))}
        </div>
      </section>
    </div>
  );
}

