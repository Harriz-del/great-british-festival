import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const links = [
    { name: 'The Assembly', path: '/showcase' },
    { name: 'Tickets', path: '/#tickets' },
    { name: 'Vendors', path: '/vendor' },
    { name: 'Artists', path: '/artist-registration' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isOpen ? 'bg-black' : 'bg-charcoal-deep/95 backdrop-blur-md'
      } h-20 border-b border-white/[0.05]`}
    >
      <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 relative z-[60]">
          <span className="text-sm font-black tracking-[0.4em] uppercase text-accent-cyan cursor-pointer">
            GREATBRITISH.UK
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8">
          {links.map((link) => {
            const isActive = location.pathname === link.path || (link.path.startsWith('/#') && location.pathname === '/' && location.hash === link.path.substring(1));
            return (
              <Link
                key={link.name}
                to={link.path}
                className="relative group"
              >
                <span className={`nav-link ${isActive ? 'nav-link-active' : ''}`}>
                  {link.name}
                </span>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-pink group-hover:w-full transition-all duration-300"
                />
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-white relative z-[60] p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-black z-50 md:hidden flex flex-col pt-24 overflow-y-auto"
          >
            <div className="flex flex-col items-center gap-4 py-8">
              {links.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  className="w-full px-8"
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block w-full py-5 text-3xl font-black uppercase tracking-[0.2em] text-center border-b border-white/5 transition-colors ${
                      location.pathname === link.path 
                        ? 'text-neon-pink text-glow-pink' 
                        : 'text-white active:text-neon-blue'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="w-full px-8 mt-12"
              >
                <Link
                  to="/purchase-tickets"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-pink w-full py-6 text-lg text-center justify-center items-center flex font-black italic tracking-widest shadow-[0_0_30px_rgba(244,24,182,0.3)]"
                >
                  SECURE YOUR ACCESS
                </Link>
              </motion.div>
            </div>
            
            <div className="mt-auto p-12 text-center opacity-30">
              <p className="text-[10px] font-black tracking-[0.5em] text-white uppercase italic">
                EST. 2026 / UK CULTURE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
