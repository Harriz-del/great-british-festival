import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Ticket, User, Mail, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function TicketPurchase() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialTier = location.state?.tier || 'Weekend Pass';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tier: initialTier,
    quantity: 1
  });
  const [tiers, setTiers] = useState<{ id: string; name: string; price: number; capacity: number; remaining: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [scarcityMessage, setScarcityMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [{ data: tiersData }, { data: purchasesData }] = await Promise.all([
          supabase.from('ticket_tiers').select('*'),
          supabase.from('mock_purchases').select('tier, quantity')
        ]);

        let processedTiers = [];
        if (tiersData && tiersData.length > 0) {
          processedTiers = tiersData.map(tier => {
            const sold = purchasesData
              ?.filter(p => p.tier === tier.name)
              .reduce((sum, p) => sum + (p.quantity || 0), 0) || 0;
            
            return {
              ...tier,
              remaining: Math.max(0, tier.capacity - sold)
            };
          });
        } else {
          // Hardcoded fallbacks to ensure the app works even without base data
          const fallbacks = [
            { id: '8cd47c0a-167d-4c11-93b0-a275fbcc4b4b', name: 'General Admission', price: 85, capacity: 100 },
            { id: '050584a3-1a53-41c2-b7e3-efe15e23dd4a', name: 'Weekend Pass', price: 195, capacity: 100 },
            { id: 'f2f263e7-8bc9-41d6-a359-117bc29cf82c', name: 'VIP Pass', price: 350, capacity: 100 }
          ];
          processedTiers = fallbacks.map(tier => {
            const sold = purchasesData
              ?.filter(p => p.tier === tier.name)
              .reduce((sum, p) => sum + (p.quantity || 0), 0) || 0;
            return { ...tier, remaining: Math.max(0, tier.capacity - sold) };
          });
        }

        setTiers(processedTiers);
        
        // Switch to first available tier if current one is sold out or not found
        const currentTierData = processedTiers.find(t => t.name === formData.tier);
        if (!currentTierData || currentTierData.remaining <= 0) {
          const firstAvailable = processedTiers.find(t => t.remaining > 0);
          if (firstAvailable) {
            setFormData(prev => ({ ...prev, tier: firstAvailable.name }));
          }
        }

        // Global scarcity check
        const totalCapacity = processedTiers.reduce((sum, t) => sum + t.capacity, 0);
        const totalRemaining = processedTiers.reduce((sum, t) => sum + t.remaining, 0);
        
        if (totalRemaining <= totalCapacity * 0.2 && totalRemaining > 0) {
          setScarcityMessage("Final passes are disappearing fast.");
        }
      } catch (err) {
        console.error('Error fetching inventory:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const selectedTier = tiers.find(t => t.name === formData.tier) || tiers[0] || { price: 0, remaining: 0 };
  const total = selectedTier.price * formData.quantity;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/mock-payment', { state: { ...formData, total } });
  };

  return (
    <div className="bg-black pt-32 pb-20 min-h-screen px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
            Secure Your <span className="text-accent-cyan text-glow-cyan">Legacy</span>
          </h1>
          <p className="text-gray-300 font-medium italic">Step 1: Reservation Details</p>
          
          <AnimatePresence>
            {scarcityMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 inline-flex items-center gap-3 px-6 py-2 bg-accent-lime/10 border border-accent-lime/20 rounded-full text-accent-lime text-[10px] font-black uppercase tracking-widest italic"
              >
                <Zap size={14} className="animate-pulse" />
                {scarcityMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-charcoal/30 border border-white/[0.05] p-8 rounded-[2px]"
            >
              <form onSubmit={handleNext} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                      <User size={12} className="text-accent-cyan" />
                      Legal Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan transition-all rounded-[2px]"
                      placeholder="e.g. James Watson"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                      <Mail size={12} className="text-accent-cyan" />
                      Digital Address
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan transition-all rounded-[2px]"
                      placeholder="james@example.co.uk"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                        <Ticket size={12} className="text-accent-cyan" />
                        Access Tier
                      </label>
                      <div className="relative">
                        <select
                          value={formData.tier}
                          onChange={e => setFormData({ ...formData, tier: e.target.value })}
                          className="w-full bg-charcoal border border-white/10 px-4 py-4 text-white font-medium focus:outline-none focus:border-accent-cyan transition-all rounded-[2px] appearance-none cursor-pointer"
                        >
                          {tiers.map(t => (
                            <option 
                              key={t.name} 
                              value={t.name} 
                              disabled={t.remaining <= 0}
                              className="bg-[#1a1a1a] text-white"
                            >
                              {t.name} — £{t.price} {t.remaining <= 0 ? '(SOLD OUT)' : t.remaining < 20 ? `(${t.remaining} Left)` : ''}
                            </option>
                          ))}
                          {tiers.length === 0 && <option className="bg-[#1a1a1a] text-white">Loading tiers...</option>}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                          <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Quantity</label>
                      <input
                        required
                        type="number"
                        min="1"
                        max={Math.min(10, selectedTier.remaining || 1)}
                        value={formData.quantity}
                        onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                        className="w-full bg-white/[0.03] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan transition-all rounded-[2px]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || (selectedTier.remaining || 0) <= 0}
                  className="btn btn-primary w-full py-5 flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                  {(selectedTier.remaining || 0) <= 0 ? 'Tier Sold Out' : 'Proceed to Payment'} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-charcoal/50 border border-white/[0.05] p-8 rounded-[2px] sticky top-32 space-y-8"
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300 italic">{formData.tier} x {formData.quantity}</span>
                  <span className="text-white font-bold">£{total}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300 italic">Booking Fee</span>
                  <span className="text-white font-bold">£0.00</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-accent-cyan">Total</span>
                  <span className="text-3xl font-black italic text-white tracking-tighter">£{total}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.05] rounded-[2px]">
                <ShieldCheck size={20} className="text-accent-lime opacity-50" />
                <p className="text-[10px] text-gray-300 font-medium italic">
                  Encryption active. Your data is protected by British standard security.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
