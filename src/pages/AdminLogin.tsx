/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Lock, Shield, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for Super Admin Key
    if (password === 'super-secret-123') { 
      localStorage.setItem('adminRole', 'super_admin');
      navigate('/admin');
    } 
    // Check for Ticket Admin Key
    else if (password === 'ticket-manager-123') {
      localStorage.setItem('adminRole', 'ticket_admin');
      navigate('/admin');
    } 

    // Check for Vendor Admin Key
    else if (password === 'vendor-manager-123') {
      localStorage.setItem('adminRole', 'vendor_admin');
      navigate('/admin');
    }
    
    // Check for Artist Admin Key
    else if (password === 'artist-manager-123') {
      localStorage.setItem('adminRole', 'artist_admin');
      navigate('/admin');
    }
    
    // Invalid Key
    else {
      setError('Invalid system access key.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 bg-charcoal/50 border border-white/[0.05] rounded-[2px] backdrop-blur-xl relative"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-50" />
        
        <div className="text-center mb-10">
          <Shield className="w-12 h-12 text-accent-cyan mx-auto mb-6" />
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">System Access</h1>
          <p className="text-gray-300 text-[10px] uppercase font-black tracking-widest mt-2 italic">Secure Portal Gateway</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Access Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 pl-12 pr-4 py-4 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-accent-lime text-[10px] font-black uppercase italic text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full btn btn-primary py-4 flex items-center justify-center gap-3 group"
          >
            Decrypt & Enter <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-10 text-center text-[9px] text-gray-300 uppercase font-black tracking-widest leading-relaxed">
          Authorized personnel only.<br/>Unrecognized signatures will be flagged.
        </p>
      </motion.div>
    </div>
  );
}
