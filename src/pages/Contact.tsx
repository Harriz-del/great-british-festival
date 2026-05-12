import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-black pt-24 min-h-screen">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-6"
            >
              Get In <span className="text-accent-cyan">Touch</span>
            </motion.h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Whether you're a fan, a journalist, or looking for collaborations, our team is ready to amplify your vision.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-morphism p-8 md:p-12"
            >
              <h2 className="text-3xl font-black italic uppercase tracking-tight mb-8">Send a Message</h2>
              
              {submitted ? (
                <div className="bg-accent-lime/20 border border-accent-lime p-6 text-accent-lime font-black uppercase tracking-widest text-center mb-6 text-xs">
                  Message Transmitted. Standing By.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/5 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan transition-colors rounded-[2px]"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/5 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan transition-colors rounded-[2px]"
                      placeholder="jane@solstice.uk"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/5 px-4 py-4 text-white focus:outline-none focus:border-accent-cyan transition-colors resize-none rounded-[2px]"
                      placeholder="Your inquiry..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-full py-5 flex items-center justify-center gap-3"
                  >
                    Send Signal <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>

            {/* Info & Socials */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col justify-between py-8"
            >
              <div className="space-y-12">
                <div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tight mb-8">Operational Hubs</h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-gray-300 group">
                      <div className="w-12 h-12 bg-charcoal border border-white/5 flex items-center justify-center text-accent-cyan group-hover:border-accent-cyan/50 transition-colors">
                        <Mail size={18} />
                      </div>
                      <span className="font-bold tracking-wider text-white">hello@gbfestival.uk</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300 group">
                      <div className="w-12 h-12 bg-charcoal border border-white/5 flex items-center justify-center text-accent-cyan group-hover:border-accent-cyan/50 transition-colors">
                        <Phone size={18} />
                      </div>
                      <span className="font-bold tracking-wider text-white">+44 20 7946 0882</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300 group">
                      <div className="w-12 h-12 bg-charcoal border border-white/5 flex items-center justify-center text-accent-cyan group-hover:border-accent-cyan/50 transition-colors">
                        <MapPin size={18} />
                      </div>
                      <span className="font-bold tracking-wider text-white">London, United Kingdom</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6 font-mono">Transmission Channels</h3>
                  <div className="flex gap-4">
                    <a href="#" className="w-12 h-12 bg-charcoal border border-white/5 flex items-center justify-center text-white hover:border-accent-cyan/50 transition-all">
                      <Instagram size={18} />
                    </a>
                    <a href="#" className="w-12 h-12 bg-charcoal border border-white/5 flex items-center justify-center text-white hover:border-accent-cyan/50 transition-all">
                      <Twitter size={18} />
                    </a>
                    <a href="#" className="w-12 h-12 bg-charcoal border border-white/5 flex items-center justify-center text-white hover:border-accent-cyan/50 transition-all">
                      <Facebook size={18} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-16 p-8 border-l-4 border-neon-blue bg-white/5">
                <p className="text-gray-300 italic font-medium leading-relaxed">
                  "One of the best experiences for any music professional. The integration of bands and tech is leading the way in the UK."
                </p>
                <p className="mt-4 text-neon-blue font-black uppercase tracking-widest text-xs">— The Guardian Music</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
