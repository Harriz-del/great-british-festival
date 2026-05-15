/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Music, Send, CheckCircle2, ChevronRight, User, Mail, Disc, Info, Link as LinkIcon, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ArtistRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    genre: '',
    description: '',
    links: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from('artists')
      .insert([
        { 
          name: formData.name, 
          email: formData.email, 
          genre: formData.genre, 
          description: formData.description, 
          portfolio_links: { links: formData.links },
          status: 'pending',
          is_official: true
        }
      ]);

    if (error) {
      console.error('Error submitting application:', error);
      setError('System transmission failed. Please retry.');
    } else {
      setSubmitted(true);
      setFormData({ name: '', email: '', genre: '', description: '', links: '' });
    }
    setLoading(false);
  };

  return (
    <div className="bg-black pt-24 min-h-screen relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-neon-pink/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-lime/10 rounded-full blur-[120px]" />

      <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block p-3 bg-accent-cyan/10 border border-accent-cyan/20 rounded-full text-accent-cyan mb-4"
            >
              <Sparkles size={24} />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter">Artist <span className="text-accent-cyan text-glow-cyan">Registration</span></h1>
            <p className="text-gray-300 font-medium italic max-w-xl mx-auto leading-relaxed">
              Join the assembly. We are seeking the most resonant voices across the UK soundscape. 
              Submit your profile for the 2026 curation.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 md:p-12 relative overflow-hidden bg-charcoal/30 border border-white/[0.05] rounded-[2px] backdrop-blur-xl"
          >
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-accent-cyan via-accent-cyan/20 to-transparent" />
            
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-accent-lime/20 border border-accent-lime/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(18,255,142,0.1)]">
                  <CheckCircle2 className="w-10 h-10 text-accent-lime" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-widest text-white">Transmission Logged</h3>
                <p className="text-gray-300 italic font-medium max-w-md mx-auto leading-relaxed">
                  Your performance data has been synchronized with the curation team. 
                  Verification results will be sent to your management email.
                </p>
                <button 
                   onClick={() => setSubmitted(false)}
                  className="btn btn-secondary px-8 py-3"
                >
                  Return to Form
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 flex items-center gap-2">
                      <User size={12} className="text-accent-cyan opacity-50" />
                      Act Name / Identity
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g., London Shadows"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan focus:bg-white/[0.05] transition-all duration-300 rounded-[2px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 flex items-center gap-2">
                      <Mail size={12} className="text-accent-cyan opacity-50" />
                      Management Email
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="contact@artist.co.uk"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan focus:bg-white/[0.05] transition-all duration-300 rounded-[2px]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 flex items-center gap-2">
                    <Disc size={12} className="text-accent-cyan opacity-50" />
                    Musical Genre / Sound ID
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Industrial Indie / Dream Folk"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan focus:bg-white/[0.05] transition-all duration-300 rounded-[2px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 flex items-center gap-2">
                    <Info size={12} className="text-accent-cyan opacity-50" />
                    Performance Narrative
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your sound, stage setup, and recent trajectory..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan focus:bg-white/[0.05] transition-all duration-300 resize-none rounded-[2px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 flex items-center gap-2">
                    <LinkIcon size={12} className="text-accent-cyan opacity-50" />
                    Portfolio / Social Metadata (Spotify, YouTube, IG)
                  </label>
                  <input
                    type="text"
                    placeholder="https://spotify.com/artist/..."
                    value={formData.links}
                    onChange={(e) => setFormData({ ...formData, links: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan focus:bg-white/[0.05] transition-all duration-300 rounded-[2px]"
                  />
                </div>

                {error && (
                  <p className="text-accent-lime text-[10px] font-black uppercase italic text-center">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-pink w-full py-5 flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {loading ? 'Transmitting...' : (
                    <>
                      Register Application <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

