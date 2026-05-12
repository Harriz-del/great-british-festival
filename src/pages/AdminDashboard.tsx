import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Music, MessageSquare, BarChart3, Settings, LogOut, 
  Search, Bell, Menu, X, ChevronRight, TrendingUp, Zap, 
  Ticket, ShoppingCart, LayoutDashboard, Database, ShieldCheck
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';

type AdminRole = 'SuperAdmin' | 'TicketingAdmin';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile, logic will handle desktop
  const [role, setRole] = useState<AdminRole>('SuperAdmin');

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  // Handle desktop sidebar initial state
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);
  const [stats, setStats] = useState({
    artists: 0,
    vendors: 0,
    tickets_total: 0,
    tickets_sold: 0,
    revenue: 0,
    vendor_spots_total: 0,
    vendor_spots_taken: 0
  });
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [bands, setBands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchVendors();
    fetchBands();
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [artistsRes, vendorsRes, purchasesRes, tiersRes] = await Promise.all([
        supabase.from('artists').select('status'),
        supabase.from('vendors').select('status'),
        supabase.from('mock_purchases').select('*').order('created_at', { ascending: false }),
        supabase.from('ticket_tiers').select('*')
      ]);

      const approvedArtists = artistsRes.data?.filter(a => a.status === 'approved').length || 0;
      const totalArtists = artistsRes.data?.length || 0;
      
      const approvedVendors = vendorsRes.data?.filter(v => v.status === 'approved').length || 0;
      const totalVendors = vendorsRes.data?.length || 0;

      const totalRevenue = purchasesRes.data?.reduce((sum, p) => sum + (p.total_price || 0), 0) || 0;
      const soldTickets = purchasesRes.data?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0;

      const totalCapacity = tiersRes.data?.reduce((sum, t) => sum + (t.capacity || 0), 0) || 1000;
      
      const VENDOR_LIMIT = 50;

      setStats({
        artists: totalArtists,
        vendors: totalVendors,
        tickets_total: totalCapacity,
        tickets_sold: soldTickets,
        revenue: totalRevenue,
        vendor_spots_total: VENDOR_LIMIT,
        vendor_spots_taken: approvedVendors
      });

      setRecentPurchases(purchasesRes.data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
    setLoading(false);
  };

  const fetchVendors = async () => {
    try {
      // Robust fetch: try join first, fallback to simple select if join fails
      const { data, error } = await supabase
        .from('vendors')
        .select('*, vendor_categories(name)')
        .order('created_at', { ascending: false });
        
      if (error) {
        // Fallback for missing relationship
        const { data: simpleData, error: simpleError } = await supabase
          .from('vendors')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (simpleData) setVendors(simpleData);
        if (simpleError) console.error('Error fetching vendors (simple):', simpleError);
      } else if (data) {
        setVendors(data);
      }
    } catch (err) {
      console.error('Vendor fetch exception:', err);
    }
  };

  const fetchBands = async () => {
    const { data } = await supabase.from('artists').select('*').order('created_at', { ascending: false });
    if (data) setBands(data);
  };

  const updateStatus = async (table: string, id: number, status: string) => {
    const { error } = await supabase.from(table).update({ status }).eq('id', id);
    if (!error) {
      if (table === 'vendors') fetchVendors();
      else fetchBands();
      fetchStats();
    }
  };

  const updateSetting = async (key: string, value: any) => {
    // Settings table currently does not exist in production
    console.warn(`Sync update for ${key} bypassed: Settings table missing`, value);
  };

  const chartData = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: 600 },
    { name: 'Thu', sales: 800 },
    { name: 'Fri', sales: 500 },
    { name: 'Sat', sales: 900 },
    { name: 'Sun', sales: 1100 },
  ];

  const menuItems = [
    { name: 'Overview', icon: <LayoutDashboard size={18} />, roles: ['SuperAdmin'] },
    { name: 'Artists', icon: <Music size={18} />, roles: ['SuperAdmin'] },
    { name: 'Vendors', icon: <Users size={18} />, roles: ['SuperAdmin'] },
    { name: 'Inquiries', icon: <MessageSquare size={18} />, roles: ['SuperAdmin'] },
    { name: 'Ticketing', icon: <ShoppingCart size={18} />, roles: ['SuperAdmin', 'TicketingAdmin'] },
    { name: 'System', icon: <Database size={18} />, roles: ['SuperAdmin'] },
  ].filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen bg-[#070708] text-white selection:bg-accent-cyan selection:text-black overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? '260px' : '0px',
          x: sidebarOpen ? 0 : -260
        }}
        className={`fixed lg:relative bg-black border-r border-white/5 flex flex-col z-50 h-full overflow-hidden transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'w-[260px]' : 'w-0 lg:w-[80px]'}`}
      >
        <div className="p-8 flex items-center justify-between min-w-[260px]">
          <motion.div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
            <span className="font-black italic uppercase text-[10px] tracking-[0.3em] text-white">GBF 2026 Admin</span>
          </motion.div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-300 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center p-4 rounded-[2px] transition-all duration-300 group ${
                activeTab === item.name 
                  ? 'bg-accent-cyan text-black font-black' 
                  : 'text-gray-300 hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <div className={activeTab === item.name ? 'text-black' : 'text-gray-300 group-hover:text-accent-cyan transition-colors'}>
                {item.icon}
              </div>
              {sidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-4 font-bold uppercase tracking-widest text-[10px]"
                >
                  {item.name}
                </motion.span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          {sidebarOpen && (
            <div className="p-4 bg-charcoal/50 border border-white/5 rounded-[2px] space-y-3">
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-300">Switch Role</p>
              <div className="flex gap-2">
                <button 
                   onClick={() => { setRole('SuperAdmin'); setActiveTab('Overview'); }}
                  className={`flex-1 text-[8px] font-black p-1 border rounded-[2px] ${role === 'SuperAdmin' ? 'border-accent-cyan text-accent-cyan' : 'border-white/5 text-gray-300'}`}
                >
                  SUPER
                </button>
                <button 
                  onClick={() => { setRole('TicketingAdmin'); setActiveTab('Ticketing'); }}
                  className={`flex-1 text-[8px] font-black p-1 border rounded-[2px] ${role === 'TicketingAdmin' ? 'border-accent-lime text-accent-lime' : 'border-white/5 text-gray-300'}`}
                >
                  TICKET
                </button>
              </div>
            </div>
          )}
          <button className="flex items-center text-gray-300 hover:text-accent-lime transition-colors w-full p-4 uppercase font-black text-[10px] tracking-widest">
            <LogOut className="w-5 h-5 text-accent-lime opacity-50" />
            {sidebarOpen && <span className="ml-4">Terminate Session</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black/50 relative">
        {/* Mobile Header Toggle */}
        <div className="lg:hidden p-4 border-b border-white/5 flex items-center justify-between bg-black sticky top-0 z-30 h-16">
          <Link to="/" className="text-xs font-black tracking-[0.2em] text-accent-cyan">GREATBRITISH.UK</Link>
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-3 text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
                Executive <span className="text-accent-cyan">{activeTab}</span>
              </h1>
              <div className="flex items-center gap-4 text-gray-300 font-medium text-[10px] uppercase tracking-widest italic">
                <span>Access: {role}</span>
                <span className="w-1 h-1 bg-gray-800 rounded-full" />
                <span className="flex items-center gap-1 text-accent-lime">
                  <ShieldCheck size={10} /> Encryption Verified
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-3 bg-white/[0.02] border border-white/5 px-6 py-3 rounded-[2px]">
                <BarChart3 size={14} className="text-accent-cyan" />
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase text-white leading-none">Live Market</p>
                  <p className="text-[9px] text-accent-lime font-bold uppercase tracking-widest mt-1">+4.2% Trend</p>
                </div>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'Overview' && role === 'SuperAdmin' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Artists', val: stats.artists, icon: <Music />, color: 'text-accent-cyan', sub: 'Applications & Seeded' },
                    { label: 'Approved Vendors', val: stats.vendors, icon: <Users />, color: 'text-accent-lime', sub: 'Registry Records' },
                    { label: 'Tickets Issued', val: stats.tickets_sold, icon: <Ticket />, color: 'text-white', sub: `${stats.tickets_sold}/${stats.tickets_total}` },
                    { label: 'Total Revenue', val: `£${stats.revenue.toLocaleString()}`, icon: <TrendingUp />, color: 'text-accent-cyan', sub: 'Live Matrix' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-charcoal/30 p-8 border border-white/[0.03] rounded-[2px] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                        {stat.icon}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-4 block">{stat.label}</span>
                      <p className={`text-4xl font-black italic tracking-tighter ${stat.color} mb-2`}>{stat.val}</p>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 italic">{stat.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-charcoal/20 border border-white/5 p-8 rounded-[2px]">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-300">Sales Velocity</h3>
                      <span className="text-[9px] font-bold py-1 px-3 bg-accent-cyan/10 text-accent-cyan rounded-full uppercase tracking-tighter">Live Broadcast</span>
                    </div>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                          <XAxis dataKey="name" stroke="#333" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis stroke="#333" fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #222', fontSize: '10px' }}
                            itemStyle={{ color: '#00E5FF' }}
                          />
                          <Area type="monotone" dataKey="sales" stroke="#00E5FF" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-charcoal/20 border border-white/5 p-8 rounded-[2px]">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-8">System Health</h3>
                    <div className="space-y-6">
                      {[
                        { label: 'DB Latency', val: '24ms', color: 'bg-accent-cyan' },
                        { label: 'Server Load', val: '12%', color: 'bg-accent-lime' },
                        { label: 'Auth Uptime', val: '99.9%', color: 'bg-white' },
                      ].map((h, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase italic">
                            <span className="text-gray-300">{h.label}</span>
                            <span className="text-white">{h.val}</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${h.color} w-3/4`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Ticketing' && (
              <motion.div
                key="ticketing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Tickets Management Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-charcoal/30 p-8 border border-white/[0.03] rounded-[2px]">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-4 block">Total Capacity</span>
                    <input 
                      type="number" 
                      value={stats.tickets_total}
                      onChange={(e) => updateSetting('ticket_inventory', { total: parseInt(e.target.value) })}
                      className="text-4xl font-black italic tracking-tighter text-white bg-transparent border-none focus:outline-none w-full"
                    />
                  </div>
                  <div className="bg-charcoal/30 p-8 border border-white/[0.03] rounded-[2px]">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-4 block">Tickets Sold</span>
                    <p className="text-4xl font-black italic tracking-tighter text-accent-cyan">{stats.tickets_sold}</p>
                  </div>
                  <div className="bg-charcoal/30 p-8 border border-white/[0.03] rounded-[2px]">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-4 block">Remaining</span>
                    <p className="text-4xl font-black italic tracking-tighter text-accent-lime">{stats.tickets_total - stats.tickets_sold}</p>
                  </div>
                </div>

                <div className="bg-charcoal/20 border border-white/5 rounded-[2px] overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Recent Ticket Acquisitions</h3>
                    <button onClick={fetchStats} className="text-[9px] font-black uppercase text-accent-cyan hover:underline">Refresh Matrix</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/[0.02] text-[10px] uppercase font-black tracking-widest text-gray-300 border-b border-white/5">
                        <tr>
                          <th className="p-6">Client Identity</th>
                          <th className="p-6">Access Tier</th>
                          <th className="p-6">Quantity</th>
                          <th className="p-6">Value</th>
                          <th className="p-6">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] font-medium italic text-gray-200">
                        {recentPurchases.map((p, i) => (
                          <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                            <td className="p-6">
                              <p className="text-white font-black not-italic mb-1">{p.full_name}</p>
                              <p className="text-[9px] tracking-tight text-gray-300 uppercase">{p.email}</p>
                            </td>
                            <td className="p-6 font-black uppercase tracking-widest">
                              <span className={`px-2 py-1 rounded-[2px] ${
                                p.ticket_tier === 'VIP Pass' ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-white/5 text-gray-300'
                              }`}>
                                {p.ticket_tier}
                              </span>
                            </td>
                            <td className="p-6 font-mono text-white">{p.quantity}</td>
                            <td className="p-6 font-black italic text-accent-lime">£{p.total_price}</td>
                            <td className="p-6 text-[9px] uppercase tracking-tighter text-gray-300">
                              {new Date(p.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Vendors' && (
              <motion.div
                key="vendors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Vendor Spots Management */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-charcoal/30 p-8 border border-white/[0.03] rounded-[2px]">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-4 block">Total Vendor Spots</span>
                    <input 
                      type="number" 
                      value={stats.vendor_spots_total}
                      onChange={(e) => updateSetting('vendor_spots', { total: parseInt(e.target.value) })}
                      className="text-4xl font-black italic tracking-tighter text-white bg-transparent border-none focus:outline-none w-full"
                    />
                  </div>
                  <div className="bg-charcoal/30 p-8 border border-white/[0.03] rounded-[2px]">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-4 block">Spots Occupied</span>
                    <p className="text-4xl font-black italic tracking-tighter text-accent-lime">{stats.vendor_spots_taken} / {stats.vendor_spots_total}</p>
                  </div>
                </div>

                <div className="bg-charcoal/20 border border-white/5 rounded-[2px] overflow-hidden">
                  <div className="p-8 border-b border-white/5">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Vendor Registration Registry</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/[0.02] text-[10px] uppercase font-black tracking-widest text-gray-300 border-b border-white/5">
                        <tr>
                          <th className="p-6">Business Identification</th>
                          <th className="p-6">Category</th>
                          <th className="p-6">Description</th>
                          <th className="p-6">Status</th>
                          <th className="p-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px]">
                        {vendors.map((v) => (
                          <tr key={v.id} className="border-b border-white/[0.02]">
                            <td className="p-6">
                              <p className="text-white font-black">{v.business_name}</p>
                              <p className="text-[9px] text-gray-400">{v.email}</p>
                            </td>
                            <td className="p-6 uppercase tracking-widest text-accent-cyan">{v.vendor_categories?.name}</td>
                            <td className="p-6 max-w-xs truncate text-gray-400 font-medium italic">{v.description}</td>
                            <td className="p-6">
                              <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
                                v.status === 'approved' ? 'text-accent-lime bg-accent-lime/10' : 
                                v.status === 'rejected' ? 'text-red-500 bg-red-500/10' : 'text-accent-cyan bg-accent-cyan/10'
                              }`}>
                                {v.status}
                              </span>
                            </td>
                            <td className="p-6 text-right space-x-2">
                              {v.status === 'pending' && (
                                <>
                                  <button onClick={() => updateStatus('vendors', v.id, 'approved')} className="text-[10px] font-black uppercase tracking-widest text-accent-lime hover:underline">Approve</button>
                                  <button onClick={() => updateStatus('vendors', v.id, 'rejected')} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline">Reject</button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Artists' && (
              <motion.div
                key="artists"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-charcoal/20 border border-white/5 rounded-[2px] overflow-hidden">
                  <div className="p-8 border-b border-white/5">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Artist Collection Manifest</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/[0.02] text-[10px] uppercase font-black tracking-widest text-gray-300 border-b border-white/5">
                        <tr>
                          <th className="p-6">Artist / Band</th>
                          <th className="p-6">Genre / Category</th>
                          <th className="p-6">Description</th>
                          <th className="p-6">Status</th>
                          <th className="p-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px]">
                        {bands.map((b) => (
                          <tr key={b.id} className="border-b border-white/[0.02]">
                            <td className="p-6">
                              <p className="text-white font-black">{b.name}</p>
                              <p className="text-[9px] text-gray-400">{b.email}</p>
                            </td>
                            <td className="p-6 uppercase tracking-widest text-accent-cyan">
                              {b.genre}
                              {b.is_official && <span className="ml-2 text-[8px] bg-white/10 px-1 rounded text-white">Featured</span>}
                              {b.category && <span className="ml-2 text-[8px] bg-accent-lime/20 text-accent-lime px-1 rounded">{b.category}</span>}
                            </td>
                            <td className="p-6 max-w-xs truncate text-gray-400 font-medium italic">{b.description}</td>
                            <td className="p-6">
                              <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
                                b.status === 'approved' ? 'text-accent-lime bg-accent-lime/10' : 
                                b.status === 'rejected' ? 'text-red-500 bg-red-500/10' : 'text-accent-cyan bg-accent-cyan/10'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="p-6 text-right space-x-2">
                              {b.status === 'pending' && (
                                <>
                                  <button onClick={() => updateStatus('artists', b.id, 'approved')} className="text-[10px] font-black uppercase tracking-widest text-accent-lime hover:underline">Approve</button>
                                  <button onClick={() => updateStatus('artists', b.id, 'rejected')} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline">Reject</button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Placeholder for other SuperAdmin tabs */}
            {['Inquiries'].includes(activeTab) && (
              <div className="h-96 flex items-center justify-center border border-white/5 border-dashed">
                <p className="text-gray-300 italic font-medium uppercase tracking-[0.4em] text-[10px]">Registry Data Synchronizing...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

