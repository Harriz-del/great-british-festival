import { useState } from 'react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle2, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || { total: 0, name: '', email: '', tier: '', quantity: 1 };
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '' });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Save to Supabase
    const { error } = await supabase
      .from('mock_purchases')
      .insert([
        {
          full_name: data.name,
          email: data.email,
          ticket_tier_id: data.ticket_tier_id,
          quantity: data.quantity,
          total_price: data.total,
          payment_status: 'completed'
        }
      ]);

    if (error) {
      console.error('Error recording purchase:', error);
      alert('Transmission error. Your payment was not recorded.');
      setIsProcessing(false);
      return;
    }

    setIsProcessing(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="bg-black h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-charcoal/30 border border-white/[0.05] p-12 text-center space-y-8 rounded-[2px]"
        >
          <div className="w-20 h-20 bg-accent-lime/20 border border-accent-lime/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(18,255,142,0.1)]">
            <CheckCircle2 className="w-10 h-10 text-accent-lime" />
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Access <span className="text-accent-cyan">Granted</span></h2>
          <p className="text-gray-300 font-medium italic leading-relaxed">
            Your verification for <b>{data.tier}</b> is complete. 
            An encoded ticket has been sent to <b>{data.email}</b>.
          </p>
          <div className="pt-4 flex flex-col gap-4">
            <button 
               onClick={() => navigate('/')}
              className="btn btn-primary py-4 px-8 uppercase font-black tracking-widest text-xs"
            >
              Back to Festival
            </button>
            <p className="text-[10px] text-gray-300 uppercase font-black tracking-widest">Receipt ID: GBF-{Math.floor(Math.random() * 89999) + 10000}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-black pt-32 pb-20 min-h-screen px-4">
      <div className="max-w-xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Adjust Order</span>
        </button>

        <div className="mb-12">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">
            Payment <span className="text-accent-lime">Gateway</span>
          </h1>
          <p className="text-gray-300 font-medium italic">Amount to serve: £{data.total}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal/30 border border-white/[0.05] p-8 rounded-[2px]"
        >
          <form onSubmit={handlePayment} className="space-y-8 text-left">
            <div className="flex items-center gap-3 p-4 bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan rounded-[2px]">
              <Lock size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Secure Sandboxed Environment</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 flex items-center gap-2">
                  <CreditCard size={12} className="text-accent-cyan" />
                  Card Number
                </label>
                <input
                  required
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardData.number}
                  onChange={e => setCardData({ ...cardData, number: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan rounded-[2px] font-mono tracking-widest"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Expiry (MM/YY)</label>
                  <input
                    required
                    type="text"
                    placeholder="12/28"
                    value={cardData.expiry}
                    onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan rounded-[2px] font-mono tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">CVV</label>
                  <input
                    required
                    type="password"
                    inputMode="numeric"
                    placeholder="***"
                    maxLength={3}
                    value={cardData.cvv}
                    onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan rounded-[2px] font-mono tracking-widest"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn btn-primary w-full py-5 flex items-center justify-center gap-3 transition-all relative overflow-hidden"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authorizing...
                </>
              ) : (
                <>Confirm Purchase: £{data.total}</>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
