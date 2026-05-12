import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Store, Utensils, Music, Laptop, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Vendor() {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    categoryId: '',
    description: ''
  });
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scarcityMessage, setScarcityMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    checkScarcity();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('vendor_categories').select('*');
    
    if (!error && data && data.length > 0) {
      setCategories(data);
      setFormData(prev => ({ ...prev, categoryId: data[0].id.toString() }));
    } else {
      // Fallback categories with specific UUIDs to match production database
      const fallback = [
        { id: '57a7489f-312b-4d06-9ec7-9b5e367132ec', name: 'Food & Beverage', slug: 'food-beverage' },
        { id: '58b11908-1578-4572-aca3-4bc30e9b1b04', name: 'Music Bands', slug: 'music-bands' },
        { id: '4ea95178-fc09-47a1-9951-670665c05d07', name: 'Tech & Art', slug: 'tech-art' },
        { id: '38bbf380-615f-42b2-adf0-2489a55da305', name: 'Merchandise', slug: 'merchandise' }
      ];
      setCategories(fallback);
      setFormData(prev => ({ ...prev, categoryId: fallback[1].id })); // Default to Music Bands
    }
  };

  const checkScarcity = async () => {
    try {
      const { data: settings } = await supabase.from('settings').select('*').eq('key', 'vendor_spots').single();
      const totalSpots = settings?.value?.total || 30;
      
      const { count } = await supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('status', 'approved');
      const taken = count || 0;
      
      if (totalSpots - taken <= totalSpots * 0.2) {
        setScarcityMessage("Only a few vendor spots remain for this year’s festival.");
      }
    } catch (err) {
      console.error('Error checking scarcity:', err);
    }
  };

  const benefits = [
    "Exposure to 80,000+ enthusiastic festival attendees",
    "Prime placement in the heart of London's Hyde Park",
    "Digital promotion across all GBF social platforms",
    "VIP networking opportunities with industry leaders"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('vendors').insert([{
      business_name: formData.businessName,
      email: formData.email,
      category_id: formData.categoryId,
      description: formData.description,
      status: 'pending'
    }]);

    if (!error) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setFormData({ businessName: '', email: '', categoryId: categories[0]?.id.toString() || '', description: '' });
    } else {
      alert('Application transmission failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-black pt-24 min-h-screen">
      {/* Header */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-accent-cyan font-mono font-black tracking-[0.4em] uppercase mb-4 text-[10px]"
          >
            Partnerships
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8"
          >
            Become Part <span className="text-white/10 italic font-light">& Of The</span> <br className="hidden sm:block"/>
            <span className="text-accent-cyan">Festival Spirit</span>
          </motion.h1>
          <p className="text-gray-300 text-xl max-w-2xl font-medium">
            Join the elite circle of vendors and performers who define the mood of Great British Festival.
          </p>

          <AnimatePresence>
            {scarcityMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mt-12 p-6 bg-accent-cyan/10 border border-accent-cyan/20 rounded-[2px] flex items-center gap-4 max-w-2xl"
              >
                  <div className="w-12 h-12 rounded-full bg-neon-pink flex items-center justify-center text-white flex-shrink-0 animate-pulse shadow-[0_0_20px_rgba(244,24,182,0.4)]">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase italic tracking-widest text-sm">Critical Capacity Alert</h4>
                    <p className="text-neon-pink text-xs font-bold italic mt-1">{scarcityMessage}</p>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Abstract background shape */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-neon-blue/5 blur-[120px] -z-1" />
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-charcoal/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 relative overflow-hidden bg-charcoal/30 border border-white/[0.03] rounded-[2px]"
          >
            <div className="absolute top-0 left-0 w-px h-full bg-accent-cyan" />
            <h2 className="text-3xl font-black italic uppercase tracking-tight mb-8">Contract Application</h2>
            
            {submitted ? (
              <div className="py-12 text-center space-y-6">
                <CheckCircle2 className="w-16 h-16 text-accent-lime mx-auto opacity-50" />
                <h3 className="text-2xl font-black uppercase tracking-widest text-white">Transmission Logged</h3>
                <p className="text-gray-300 italic font-medium">Processing application. Please await verification.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Business / Act Name</label>
                  <input
                    required
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/5 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Operational Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/5 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Department / Category</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((cat) => {
                      let Icon = Music;
                      const slug = cat.slug?.toLowerCase() || '';
                      const name = cat.name?.toLowerCase() || '';
                      
                      if (slug.includes('food') || name.includes('food')) Icon = Utensils;
                      if (slug.includes('merch') || name.includes('merchandise')) Icon = Store;
                      if (slug.includes('tech') || slug.includes('art') || name.includes('tech') || name.includes('art')) Icon = Laptop;
                      if (slug.includes('music') || name.includes('music')) Icon = Music;
                      
                      const isActive = formData.categoryId === cat.id.toString();
                      
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, categoryId: cat.id.toString() })}
                          className={`flex items-center gap-3 p-4 border transition-all duration-300 rounded-[2px] cursor-pointer group ${
                            isActive 
                              ? 'bg-neon-pink border-neon-pink text-white shadow-[0_0_20px_rgba(244,24,182,0.2)]' 
                              : 'bg-white/[0.03] border-white/5 text-gray-300 hover:border-neon-pink/30 hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className={`${isActive ? 'text-white' : 'text-neon-pink opacity-50 group-hover:opacity-100'} transition-opacity`}>
                            <Icon size={18} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Product / Service Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/5 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-pink w-full py-5 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? 'Transmitting Data...' : 'Confirm Registration'} <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </motion.div>

          {/* Benefits info */}
          <div className="space-y-16">
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Why Join <span className="text-accent-cyan">GBF</span>?</h2>
              <div className="space-y-8">
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-6 h-6 rounded-full border border-accent-lime flex items-center justify-center flex-shrink-0 text-accent-lime">
                      <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" />
                    </div>
                    <p className="text-gray-300 font-medium italic">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-12 bg-charcoal/30 border border-white/[0.03] space-y-6 border-t-accent-cyan border-t-2">
              <h3 className="text-xl font-black uppercase tracking-tighter text-white">Deadline</h3>
              <p className="text-gray-300 text-sm italic font-medium">Applications close on <span className="text-white font-bold">May 31st, 2026</span>. Late submissions are restricted to waiting lists.</p>
              <div className="pt-4 flex items-center gap-2 text-accent-cyan font-black text-[10px] uppercase tracking-[0.3em]">
                <Music className="w-4 h-4 opacity-50" />
                LIMITED SLOTS REMAINING
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
