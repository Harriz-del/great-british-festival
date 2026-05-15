import { Flag, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/[0.05] pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1 flex flex-col gap-6">
            <img 
              src="https://www.britishcouncilfoundation.id/profiles/solas2/themes/solas_ui/images/desktop/britishcouncil_indigo_logo.jpg" 
              alt="British Council"
              className="h-10 w-fit brightness-0 invert opacity-60"
            />
            <p className="text-gray-300 text-xs font-medium italic leading-relaxed">
              A definitive curation of British music identity. <br/>
              Presented in partnership with the British Council.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Festival Hub</h4>
            <div className="flex flex-col gap-4 text-sm font-bold italic">
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin size={16} className="text-accent-cyan" />
                <span>Hyde Park, London</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Flag size={16} className="text-accent-lime" />
                <span>August 14-16, 2026</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail size={16} className="text-white" />
                <span>info@greatbritishfest.uk</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Cultural Partners</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <a 
                href="https://duitpropertech.org/football/" 
                target="_blank" 
                rel="noreferrer"
                className="group flex flex-col gap-2 p-4 bg-charcoal/30 border border-white/5 rounded-[2px] transition-all hover:border-accent-cyan/20"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white group-hover:text-accent-cyan transition-colors">THE BEAUTIFUL GAME</span>
                  <ExternalLink size={12} className="text-gray-300" />
                </div>
                <span className="text-[9px] text-gray-300 leading-tight">Premier League stats and English football heritage hub.</span>
              </a>
              <a 
                 href="https://www.bfi.org.uk/" 
                target="_blank" 
                rel="noreferrer"
                className="group flex flex-col gap-2 p-4 bg-charcoal/30 border border-white/5 rounded-[2px] transition-all hover:border-accent-lime/20"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white group-hover:text-accent-lime transition-colors">CINEMATIC HERITAGE</span>
                  <ExternalLink size={12} className="text-gray-300" />
                </div>
                <span className="text-[9px] text-gray-300 leading-tight">Explore the legacy of English film at the BFI institute.</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">
            © 2026 GREAT BRITISH FESTIVAL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            {['TW', 'IG', 'FB', 'YT'].map(social => (
              <span key={social} className="text-[10px] font-black text-gray-300 hover:text-accent-cyan cursor-pointer transition-colors">
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

