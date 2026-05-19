import { motion } from 'framer-motion';
import { Award, Disc3 } from 'lucide-react';

const legends = [
  {
    name: 'The Beatles',
    image: 'https://www.postery.com/__media-service/img/product/512/4216-the-beatles-rooftop-show-1.jpg',
    achievements: ['1 Billion+ Records Sold', '20 Billboard Hot 100 #1s'],
    history: 'Formed in Liverpool in 1960, they became the most influential band of all time, spearheading the British Invasion.',
    iconic: 'Revolutionized studio recording techniques.'
  },
  {
    name: 'Queen',
    image: 'https://i.guim.co.uk/img/media/c6a272cdaf5d9cd66922e136e99eceefd0253f70/570_0_2700_2160/master/2700.jpg?width=620&dpr=2&s=none&crop=none',
    achievements: ['300 Million Records Sold', 'Global Icon Award'],
    history: 'Known for their musical versatility and legendary live performances, particularly Live Aid 1985.',
    iconic: 'Bohemian Rhapsody redefined commercial radio constraints.'
  },

  // Add Rolling Stones, Coldplay, BMTH, Arctic Monkeys, Royal Blood here...
];

export default function SonicChronicles() {
  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-neon-pink font-mono font-black tracking-[0.4em] uppercase mb-4 text-[10px]">Historical Matrix</p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight">
            Sonic <span className="text-white">Chronicles</span>
          </h1>
          <p className="mt-6 text-gray-400 max-w-2xl text-sm italic font-medium">
            Explore the monumental achievements and enduring legacy of the architects of British sound.
          </p>
        </motion.div>
      </div>

      {/* Interactive Timeline/Cards */}
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {legends.map((band, idx) => (
          <motion.div 
            key={band.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="group relative flex flex-col md:flex-row gap-8 bg-charcoal/20 border border-white/5 p-6 rounded-[2px] overflow-hidden hover:border-white/20 transition-all duration-500"
          >
            {/* Spotlight Background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/0 via-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="w-full md:w-1/3 h-64 md:h-auto relative overflow-hidden rounded-[2px]">
              <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-transparent transition-colors duration-500" />
              <img src={band.image} alt={band.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
            </div>

            <div className="w-full md:w-2/3 flex flex-col justify-center z-10">
              <h2 className="text-3xl font-black italic uppercase tracking-tight mb-4">{band.name}</h2>
              
              <div className="flex flex-wrap gap-3 mb-6">
                {band.achievements.map((ach, i) => (
                  <span key={i} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-[2px] border border-accent-cyan/20">
                    <Award size={12} /> {ach}
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-300 italic mb-4 leading-relaxed">{band.history}</p>
              
              <div className="mt-auto flex items-start gap-3 bg-white/5 p-4 rounded-[2px] border-l-2 border-neon-pink">
                <Disc3 className="text-neon-pink shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Iconic Contribution</span>
                  <span className="text-xs font-bold text-white">{band.iconic}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Relocated Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 mt-32">
         <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-10 border-b border-white/10 pb-4">Visual <span className="text-accent-lime">Archive</span></h2>
         {/* INSERT EXISTING GALLERY CODE HERE */}
         <div className="h-96 border border-white/10 border-dashed flex items-center justify-center text-gray-500 text-xs tracking-widest uppercase">
            [Existing Gallery Component Renders Here]
         </div>
      </section>
    </div>
  );
}