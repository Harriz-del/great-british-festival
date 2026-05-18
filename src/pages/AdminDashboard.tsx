import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Music, BarChart3, LogOut, 
  Menu, X, TrendingUp, 
  Ticket, ShieldCheck, BarChart3 as BarChartIcon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // 1. AUTHENTICATION & ROLE STATE
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 2. DATA STATES
  // Find your stats state and update it to this:
  const [stats, setStats] = useState({
    artists: 0,
    vendors: 0,
    tickets_total: 0,
    tickets_sold: 0,
    revenue: 0,
    vendor_spots_total: 50, // Default limit
    vendor_spots_taken: 0,
    artist_spots_total: 20, // Default limit
    artist_spots_taken: 0
  });
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [bands, setBands] = useState<any[]>([]);
  const [tiersData, setTiersData] = useState<any[]>([])

  // 3. SECURITY BOUNCER
  useEffect(() => {
    const role = localStorage.getItem('adminRole');
    if (!role) {
      navigate('/access-gateway'); 
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  // 4. SIDEBAR & MOBILE LOGIC
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
    };
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    document.body.style.overflow = (sidebarOpen && isMobile) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [sidebarOpen]);

  // 5. DATA FETCHING
  useEffect(() => {
    if (userRole) {
      fetchStats();
      fetchVendors();
      fetchBands();
    }
  }, [activeTab, userRole]);

const fetchStats = async () => {
    setLoading(true);
    try {
      const [artistsRes, vendorsRes, purchasesRes, tiersRes] = await Promise.all([
        supabase.from('artists').select('status'),
        supabase.from('vendors').select('status'),
        supabase.from('mock_purchases').select('*').order('created_at', { ascending: false }),
        supabase.from('ticket_tiers').select('*')
      ]);

      const totalArtists = artistsRes.data?.length || 0;
      const approvedArtists = artistsRes.data?.filter(a => a.status === 'approved').length || 0;
      const approvedVendors = vendorsRes.data?.filter(v => v.status === 'approved').length || 0;
      const totalVendors = vendorsRes.data?.length || 0;
      const totalRevenue = purchasesRes.data?.reduce((sum, p) => sum + (p.total_price || 0), 0) || 0;
      const soldTickets = purchasesRes.data?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0;
      const totalCapacity = tiersRes.data?.reduce((sum, t) => sum + (t.capacity || 0), 0) || 1000;

setStats({
        artists: approvedArtists,
        vendors: totalVendors,
        tickets_total: totalCapacity,
        tickets_sold: soldTickets,
        revenue: totalRevenue,
        vendor_spots_total: 50,
        vendor_spots_taken: approvedVendors,
        artist_spots_total: 20,
        artist_spots_taken: approvedArtists // Make sure approvedArtists is calculated above!
      });

      setRecentPurchases(purchasesRes.data || []);
      setTiersData(tiersRes.data || []); // 👈 THIS fills the missing variable!
    } catch (err) {
      console.error('Data sync error:', err);
    }
    setLoading(false);
  };

  const fetchVendors = async () => {
    const { data } = await supabase.from('vendors').select('*').order('created_at', { ascending: false });
    if (data) setVendors(data);
  };

  const fetchBands = async () => {
    const { data } = await supabase.from('artists').select('*').order('created_at', { ascending: false });
    if (data) setBands(data);
  };

  const updateStatus = async (table: string, id: string, status: string) => {
    // We changed the id type to string to match Supabase UUIDs
    const { error } = await supabase.from(table).update({ status }).eq('id', id);
    
    if (error) {
      console.error(`❌ Update failed for ${table}:`, error.message);
    } else {
      console.log(`✅ ${table} updated to ${status}`);
      // Refresh the specific data
      table === 'vendors' ? fetchVendors() : fetchBands();
      fetchStats();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminRole');
    navigate('/access-gateway');
  };

// 6. DYNAMIC MENU BASED ON ROLE
  const availableTabs = [
    { name: 'Overview', icon: <BarChart3 size={18} />, roles: ['super_admin', 'ticket_admin'] },
    { name: 'Ticketing', icon: <Ticket size={18} />, roles: ['super_admin', 'ticket_admin'] },
    { name: 'Artists', icon: <Music size={18} />, roles: ['super_admin', 'artist_admin'] },
    { name: 'Vendors', icon: <Users size={18} />, roles: ['super_admin', 'vendor_admin'] },
  ].filter(item => userRole && item.roles.includes(userRole));


  // 7. SMART TAB ROUTING
  // Automatically select the correct starting tab based on their role
  useEffect(() => {
    if (userRole && availableTabs.length > 0) {
      const isTabAllowed = availableTabs.some(tab => tab.name === activeTab);
      if (!isTabAllowed) {
        setActiveTab(availableTabs[0].name); // Kick them to their authorized tab
      }
    }
  }, [userRole, activeTab]);

  const chartData = [
    { name: 'Mon', sales: 400 }, { name: 'Tue', sales: 300 }, { name: 'Wed', sales: 600 },
    { name: 'Thu', sales: 800 }, { name: 'Fri', sales: 500 }, { name: 'Sat', sales: 900 }, { name: 'Sun', sales: 1100 },
  ];

  if (!userRole) return null;

  return (
    <div className="flex h-screen bg-[#070708] text-white selection:bg-accent-cyan selection:text-black overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? '260px' : '0px', x: sidebarOpen ? 0 : -260 }}
        className={`fixed lg:relative bg-black border-r border-white/5 flex flex-col z-50 h-full overflow-hidden transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'w-[260px]' : 'w-0 lg:w-[80px]'}`}
      >
        <div className="p-8 flex items-center justify-between min-w-[260px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
            <span className="font-black italic uppercase text-[10px] tracking-[0.3em]">GBF 2026 Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-300"><X size={20} /></button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {availableTabs.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center p-4 rounded-[2px] transition-all duration-300 group ${activeTab === item.name ? 'bg-accent-cyan text-black font-black' : 'text-gray-300 hover:bg-white/[0.03]'}`}
            >
              <div className={activeTab === item.name ? 'text-black' : 'text-gray-300 group-hover:text-accent-cyan'}>{item.icon}</div>
              {sidebarOpen && <span className="ml-4 font-bold uppercase tracking-widest text-[10px]">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center text-gray-300 hover:text-accent-lime transition-colors w-full p-4 uppercase font-black text-[10px] tracking-widest">
            <LogOut className="w-5 h-5 text-accent-lime opacity-50" />
            {sidebarOpen && <span className="ml-4">Terminate Session</span>}
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 overflow-y-auto bg-black/50 relative">
        <div className="lg:hidden p-4 border-b border-white/5 flex items-center justify-between bg-black sticky top-0 z-30 h-16">
          <Link to="/" className="text-xs font-black tracking-[0.2em] text-accent-cyan">GREATBRITISH.UK</Link>
          <button onClick={() => setSidebarOpen(true)} className="p-3 text-white bg-white/5 rounded-full"><Menu size={24} /></button>
        </div>

        <div className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-accent-cyan" />
              <h1 className="text-5xl font-black italic uppercase tracking-tighter">
                Executive <span className="text-accent-cyan">Artists</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 text-gray-400 font-bold text-[9px] uppercase tracking-[0.3em] italic ml-4">
              <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-[2px] border border-white/10 text-white">
                Role: {userRole?.replace('_', ' ')}
              </span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="flex items-center gap-1 text-accent-lime">
                <ShieldCheck size={10} /> Active Protocol
              </span>
            </div>
          </div>
        </header>

          <AnimatePresence mode="wait">
            {activeTab === 'Overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Approved Artists', val: stats.artists, icon: <Music />, color: 'text-accent-cyan', sub: 'Registry Records' },
                    { label: 'Approved Vendors', val: stats.vendors, icon: <Users />, color: 'text-accent-lime', sub: 'Registry Records' },
                    { label: 'Tickets Issued', val: stats.tickets_sold, icon: <Ticket />, color: 'text-white', sub: `${stats.tickets_sold}/${stats.tickets_total}` },
                    { label: 'Total Revenue', val: `£${stats.revenue.toLocaleString()}`, icon: <TrendingUp />, color: 'text-accent-cyan', sub: 'Live Matrix' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-charcoal/30 p-8 border border-white/[0.03] rounded-[2px] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30">{stat.icon}</div>
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-4 block">{stat.label}</span>
                      <p className={`text-4xl font-black italic tracking-tighter ${stat.color} mb-2`}>{stat.val}</p>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 italic">{stat.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-charcoal/20 border border-white/5 p-8 rounded-[2px]">
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.1}/><stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                          <XAxis dataKey="name" stroke="#333" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis stroke="#333" fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #222', fontSize: '10px' }} />
                          <Area type="monotone" dataKey="sales" stroke="#00E5FF" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Ticketing' && (
              <motion.div key="ticketing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-charcoal/20 border border-white/5 rounded-[2px] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/[0.02] text-[10px] uppercase font-black tracking-widest text-gray-300 border-b border-white/5">
                        <tr><th className="p-6">Client Identity</th><th className="p-6">Access Tier</th><th className="p-6">Quantity</th><th className="p-6">Value</th><th className="p-6">Timestamp</th></tr>
                      </thead>
                      <tbody className="text-[11px] font-medium italic text-gray-200">
                        {recentPurchases.map((p, i) => (
                          <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                            <td className="p-6"><p className="text-white font-black not-italic">{p.full_name}</p><p className="text-[9px] text-gray-300 uppercase">{p.email}</p></td>
                            <td className="p-6 font-black uppercase tracking-widest">
                              {(() => {
                                // Manually find the matching tier in our other state
                                const matchedTier = tiersData.find(t => t.id === p.ticket_tier_id);
                                const tierName = matchedTier ? matchedTier.name : 'Unknown Tier';
                                
                                return (
                                  <span className={`px-2 py-1 rounded-[2px] ${
                                    tierName === 'VIP Pass' ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-white/5 text-gray-300'
                                  }`}>
                                    {tierName}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="p-6 font-mono text-white">{p.quantity}</td>
                            <td className="p-6 font-black italic text-accent-lime">£{p.total_price}</td>
                            <td className="p-6 text-[9px] uppercase tracking-tighter text-gray-300">{new Date(p.created_at).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Vendors' && ['super_admin', 'vendor_admin'].includes(userRole) && (
              <motion.div key="vendors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-charcoal/20 border border-white/5 rounded-[2px] overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-white/[0.02] text-[10px] uppercase font-black tracking-widest text-gray-300">
                      <tr><th className="p-6">Business</th><th className="p-6">Category</th><th className="p-6">Status</th><th className="p-6 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="text-[11px]">
                      {vendors.map((v) => (
                        <tr key={v.id} className="border-b border-white/[0.02]">
                          <td className="p-6"><p className="text-white font-black">{v.business_name}</p></td>
                          <td className="p-6 uppercase text-accent-cyan">{v.vendor_categories?.name}</td>
                          <td className="p-6"><span className="text-accent-lime font-black uppercase">{v.status}</span></td>
                          <td className="p-6 text-right">
                          {(!v.status || v.status.toLowerCase() === 'pending') ? (
                            <div className="flex justify-end items-center gap-3">
                              {/* APPROVE BUTTON */}
                              <button
                                onClick={() => updateStatus('vendors', v.id, 'approved')}
                                className="group relative flex items-center px-6 py-2 bg-accent-lime/5 border border-accent-lime/20 text-accent-lime text-[9px] font-black uppercase tracking-widest hover:bg-accent-lime hover:text-black transition-all duration-300 rounded-[2px]"
                              >
                                <span className="relative z-10">Authorize</span>
                                <div className="absolute inset-0 bg-accent-lime opacity-0 group-hover:opacity-10 blur-md transition-opacity" />
                              </button>

                              {/* REJECT BUTTON */}
                              <button
                                onClick={() => updateStatus('vendors', v.id, 'rejected')}
                                className="group relative flex items-center px-6 py-2 bg-red-500/5 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 rounded-[2px]"
                              >
                                <span className="relative z-10">Decline</span>
                                <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 blur-md transition-opacity" />
                              </button>
                            </div>
                          ) : (
                            /* Verified badge if already approved/rejected */
                            <div className="flex justify-end opacity-20">
                              <ShieldCheck size={16} className="text-accent-lime" />
                            </div>
                          )}
                        </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'Artists' && ['super_admin', 'artist_admin'].includes(userRole) && (
              <motion.div key="artists" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-charcoal/20 border border-white/5 rounded-[2px] overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-white/[0.02] text-[10px] uppercase font-black tracking-widest text-gray-300">
                      <tr><th className="p-6">Artist</th><th className="p-6">Genre</th><th className="p-6">Status</th><th className="p-6 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="text-[11px]">
                      {bands.map((b) => (
                        <tr key={b.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group/row">
                          <td className="p-6"><p className="text-white font-black">{b.name}</p></td>
                          <td className="p-6 uppercase text-accent-cyan">{b.genre}</td>
                          <td className="p-6"><span className="text-accent-lime font-black uppercase">{b.status}</span></td>
                          <td className="p-6 text-right">
                            {(!b.status || b.status.toLowerCase() === 'pending') ? (
                              <div className="flex justify-end items-center gap-3">
                                {/* APPROVE BUTTON */}
                                <button
                                  onClick={() => updateStatus('artists', b.id, 'approved')}
                                  className="group relative flex items-center px-6 py-2 bg-accent-lime/5 border border-accent-lime/20 text-accent-lime text-[9px] font-black uppercase tracking-widest hover:bg-accent-lime hover:text-black transition-all duration-300 rounded-[2px]"
                                >
                                  <span className="relative z-10">Authorize</span>
                                  <div className="absolute inset-0 bg-accent-lime opacity-0 group-hover:opacity-10 blur-md transition-opacity" />
                                </button>

                                {/* REJECT BUTTON */}
                                <button
                                  onClick={() => updateStatus('artists', b.id, 'rejected')}
                                  className="group relative flex items-center px-6 py-2 bg-red-500/5 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 rounded-[2px]"
                                >
                                  <span className="relative z-10">Decline</span>
                                  <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 blur-md transition-opacity" />
                                </button>
                              </div>
                            ) : (
                              /* OPTIONAL: Show a "Verified" badge if already approved */
                              <div className="flex justify-end opacity-20">
                                <ShieldCheck size={16} className="text-accent-lime" />
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}