import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Ticket, ArrowRight, MapPin, Calendar, Users, Zap } from 'lucide-react';
import BandCard from '../components/BandCard';
import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [featuredBands, setFeaturedBands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

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
      // Fetch specifically by name to ensure we get the right ones
      const { data } = await supabase.from('artists').select('*').in('name', featuredNames).eq('status', 'approved');
      if (data) {
        // Sort to match featuredNames order, case-insensitive
        const sorted = featuredNames.map(name => 
          data.find(b => b.name.toLowerCase() === name.toLowerCase())
        ).filter(Boolean);
        setFeaturedBands(sorted);
      }
      setLoading(false);
    };
    fetchBands();
  }, []);

  const displayedBands = showAll ? featuredBands : featuredBands.slice(0, 3);

  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2000" 
            alt="Festival atmosphere" 
            className="w-full h-full object-cover brightness-[1.1]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1 border border-white/10 bg-white/5 rounded-full mb-6">
              <span className="w-2 h-2 bg-neon-pink rounded-full animate-pulse shadow-[0_0_8px_#f418b6]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Summer 2026</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black italic uppercase tracking-tighter leading-none mb-4">
              Great British<br/>
              <span className="text-accent-cyan text-glow-cyan">Festival</span>
            </h1>
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-300 text-[10px] sm:text-xs md:text-base font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] italic mb-2">
                In collaboration with <span className="text-white">British Council</span>
              </p>
              {/* British Council Logo */}
              <div className="flex items-center gap-6">
                <div className="w-16 h-px bg-white/20" />
                <img 
                  src="https://www.britishcouncilfoundation.id/profiles/solas2/themes/solas_ui/images/desktop/britishcouncil_indigo_logo.jpg" 
                  alt="British Council"
                  className="h-10 object-contain brightness-100"
                />
                <div className="w-16 h-px bg-white/20" />
              </div>
            </div>
            
            <div className="mt-16">
              <Countdown />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium italic underline decoration-accent-cyan/20 decoration-2 underline-offset-8"
          >
            A definitive assembly of UK music culture. Experience the legacy in the heart of London.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a
              href="#tickets"
              className="btn btn-primary px-12 py-4 flex items-center gap-3 group"
            >
              <Ticket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Secure Access
            </a>
            <Link
              to="/showcase"
              className="btn btn-secondary px-10 py-4 flex items-center gap-2"
            >
              The Assembly
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-10 left-10 hidden lg:block">
          <div className="flex flex-col gap-4 text-xs font-black uppercase tracking-[0.3em] text-gray-300">
            <span>01 / MUSIC</span>
            <span>02 / CULTURE</span>
            <span>03 / LEGACY</span>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative border-y border-white/[0.03]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex items-start gap-4">
            <Calendar className="w-8 h-8 text-accent-cyan mt-1" />
            <div>
              <h3 className="text-xl font-black uppercase italic mb-2 tracking-tight">August 14-16</h3>
              <p className="text-gray-300 text-sm font-medium">Three days of non-stop performances across 5 massive stages.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="w-8 h-8 text-accent-lime mt-1" />
            <div>
              <h3 className="text-xl font-black uppercase italic mb-2 tracking-tight">Hyde Park, London</h3>
              <p className="text-gray-300 text-sm font-medium">Central London's most iconic outdoor venue for a historic event.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Users className="w-8 h-8 text-neon-pink mt-1" />
            <div>
              <h3 className="text-xl font-black uppercase italic mb-2 tracking-tight">80K Capacity</h3>
              <p className="text-gray-300 text-sm font-medium">Join thousands of fans in the largest celebration of UK music.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bands Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-charcoal/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          >
            <div>
              <p className="text-accent-lime font-mono font-black tracking-[0.4em] uppercase mb-4 text-[10px]">Curation Preview</p>
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight">
                Featured<br/>
                <span className="text-accent-cyan">Artists</span>
              </h2>
            </div>
            <Link
              to="/showcase"
              className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest border-b border-accent-lime pb-2 hover:text-accent-lime transition-all duration-300"
            >
              Full Assembly <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {displayedBands.map((band, idx) => (
              <div key={band.name} className="space-y-6">
                <BandCard 
                  image={band.image}
                  name={band.name}
                  genre={band.genre}
                  description={band.description}
                  audio="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                  delay={idx * 0.1}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    to="/purchase-tickets"
                    className="w-full py-4 border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-accent-cyan hover:border-accent-cyan/50 hover:bg-accent-cyan/5 transition-all text-center block rounded-[2px]"
                  >
                    Purchase Ticket
                  </Link>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticket Section */}
      <section id="tickets" className="py-32 px-4 sm:px-6 lg:px-8 bg-black relative scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6">Select <span className="text-accent-lime">Access</span></h2>
            <p className="text-gray-300 font-medium italic">All access passes include entry to main cultural exhibits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {[
              { 
                type: 'General Admission', 
                price: '85', 
                desc: 'Single day access to all stages and standard food zones.',
                color: 'text-accent-cyan'
              },
              { 
                type: 'Weekend Pass', 
                price: '195', 
                desc: 'Full 3-day access. Includes priority entry to cultural workshops.',
                color: 'text-accent-lime',
                featured: true
              },
              { 
                type: 'VIP Pass', 
                price: '350', 
                desc: 'Premium viewing decks, acoustic sessions, and backstage lounge access.',
                color: 'text-white'
              }
            ].map((pkg, idx) => (
              <motion.div
                key={pkg.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-10 bg-charcoal/30 border border-white/[0.03] rounded-[2px] flex flex-col items-center text-center transition-all duration-500 hover:border-accent-cyan/30 ${pkg.featured ? 'md:scale-105 border-accent-cyan/20 z-10' : ''}`}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-cyan text-black text-[9px] font-black px-4 py-1 uppercase tracking-widest">
                    Best Value
                  </div>
                )}
                <h3 className="text-xl font-black uppercase italic mb-4 tracking-tight">{pkg.type}</h3>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-2xl font-black italic tracking-tighter text-gray-300">£</span>
                  <span className={`text-7xl font-black italic tracking-tighter ${pkg.color}`}>
                    {pkg.price}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm font-medium italic mb-10 leading-relaxed min-h-[60px]">
                  {pkg.desc}
                </p>
                <Link 
                  to="/purchase-tickets"
                  state={{ tier: pkg.type }}
                  className={`mt-auto btn w-full py-4 uppercase font-black tracking-widest text-xs transition-all flex items-center justify-center ${pkg.featured ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Buy Ticket
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section with scroll ID */}
      <section id="contact" className="py-32 relative overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop" 
            alt="Crowd hands" 
            className="w-full h-full object-cover opacity-30 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <Zap className="w-12 h-12 text-neon-pink mx-auto mb-8 opacity-70 drop-shadow-[0_0_15px_rgba(244,24,182,0.4)]" />
          <h2 className="text-4xl md:text-6xl font-black italic uppercase mb-8 tracking-tighter">
            Don't miss the <br/>
            <span className="text-neon-pink text-glow-pink">Greatest Night</span> of your life
          </h2>
          <p className="text-gray-300 text-lg mb-12 font-medium italic">Limited early bird tickets available now. Join the history.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="#tickets"
              className="btn btn-primary px-16 py-5 text-sm"
            >
              Secure Your Spot
            </a>
            <Link
              to="/contact"
              className="btn btn-secondary px-16 py-5 text-sm"
            >
              Inquiry / Contact
            </Link>
          </div>
        </div>
      </section>

      {/* Partner Marquee */}
      <section className="py-24 bg-[#050505] border-y border-white/[0.03] overflow-hidden">
        <div className="mb-12 px-4 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 italic">Global Partnerships & Affiliates</p>
        </div>
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-24 pr-24"
          >
            {['BBC RADIO 1', 'SPOTIFY UK', 'DR. MARTENS', 'MARSHALL', 'FRED PERRY', 'TOPMAN', 'VOGUE UK', 'NME', 'ROUGH TRADE'].map((brand, i) => (
              <span key={i} className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white/[0.15] hover:text-white transition-all duration-700 cursor-default">
                {brand}
              </span>
            ))}
          </motion.div>
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-24 pr-24"
          >
            {['BBC RADIO 1', 'SPOTIFY UK', 'DR. MARTENS', 'MARSHALL', 'FRED PERRY', 'TOPMAN', 'VOGUE UK', 'NME', 'ROUGH TRADE'].map((brand, i) => (
              <span key={i + 10} className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white/[0.15] hover:text-white transition-all duration-700 cursor-default">
                {brand}
              </span>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
