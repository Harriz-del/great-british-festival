import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
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

  // Added dropdown items to The Assembly
  const links = [
    { 
      name: 'The Assembly', 
      path: '/showcase',
      dropdown: [
        { name: 'Music Rosters', path: '/showcase' },
        { name: 'Sonic Chronicles', path: '/sonic-chronicles' }
      ]
    },
    { name: 'Tickets', path: '/purchase-tickets' },
    { name: 'Vendors', path: '/vendor' },
    { name: 'Artists', path: '/artist-registration' },
    { name: 'Contact', path: '/contact' },
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
            <span className="hidden md:inline">GREATBRITISHFESTIVAL.UK</span>
            <span className="inline md:hidden">GBF.UK</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 h-full items-center">
          {links.map((link) => {
            const isActive = location.pathname === link.path || (link.path.startsWith('/#') && location.pathname === '/' && location.hash === link.path.substring(1));
            return (
              <div 
                key={link.name} 
                className="relative group h-full flex items-center"
                onMouseEnter={() => setHoveredMenu(link.name)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link
                  to={link.path}
                  className="relative group py-2"
                >
                  <span className={`nav-link ${isActive ? 'nav-link-active' : ''}`}>
                    {link.name}
                  </span>
                  <motion.div 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-pink group-hover:w-full transition-all duration-300"
                  />
                </Link>

                {/* Desktop Dropdown Submenu */}
                {link.dropdown && (
                  <AnimatePresence>
                    {hoveredMenu === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, rotateX: -15 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, y: 15, rotateX: -15 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[60px] left-0 w-56 bg-charcoal-deep/95 border border-white/10 backdrop-blur-md rounded-[2px] overflow-hidden flex flex-col shadow-2xl origin-top z-50"
                      >
                        {link.dropdown.map(sub => (
                          <Link 
                            key={sub.name} 
                            to={sub.path} 
                            className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:bg-white/5 hover:text-accent-cyan transition-colors border-b border-white/5 last:border-0"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
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
                  className="w-full px-8 flex flex-col items-center"
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
                  
                  {/* Mobile Sub-links if Dropdown exists */}
                  {link.dropdown && (
                    <div className="w-full flex flex-col items-center bg-white/[0.02] py-2 border-b border-white/5">
                      {link.dropdown.map(sub => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          onClick={() => setIsOpen(false)}
                          className="py-3 text-sm font-bold uppercase tracking-widest text-accent-cyan"
                        >
                          ↳ {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
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