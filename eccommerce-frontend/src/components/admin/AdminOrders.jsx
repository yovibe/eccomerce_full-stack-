import { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { 
  AlertTriangle, RefreshCw, Search, ChevronDown, Filter, 
  XOctagon, CheckCircle2, Clock, FileText, MoreVertical 
} from 'lucide-react';

const STATUS_STYLES = {
  PENDING:   'text-yellow-700 border-yellow-200 bg-[#fffdf0]',
  SHIPPED:   'text-blue-700   border-blue-200   bg-blue-50',
  DELIVERED: 'text-green-700  border-green-200  bg-[#f0fdf4]',
  CANCELLED: 'text-red-600    border-red-200    bg-[#fff1f2]',
};

// Replace lucide icons with simple custom SVGs that perfectly match the screenshot where possible
const IconCancelled = () => (
  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
    <XOctagon size={20} className="fill-red-100" />
  </div>
);

const IconDelivered = () => (
  <div className="w-10 h-10 rounded-full bg-[#f0fdf4] flex items-center justify-center text-green-600">
    <CheckCircle2 size={20} className="fill-green-100" />
  </div>
);

const IconPending = () => (
  <div className="w-10 h-10 rounded-full bg-[#fffbeb] flex items-center justify-center text-yellow-600">
    <Clock size={20} className="fill-yellow-100" />
  </div>
);

const IconTotal = () => (
  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
    <FileText size={20} className="fill-gray-200" />
  </div>
);

const AdminOrders = () => {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [dateFilter, setDateFilter] = useState('Last 30 days');
  
  const [updatingParams, setUpdatingParams] = useState({ id: null, menuOpen: false });

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/orders');
      const data = Array.isArray(res.data) ? res.data : res.data.content ?? [];
      setOrders(data);
    } catch (err) {
      console.error('Fetch orders error:', err.response || err);
      setError('Could not load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingParams({ id: orderId, menuOpen: false });
    try {
      await api.put(`/admin/orders/${orderId}/status?status=${newStatus}`);
      setOrders(prev =>
        prev.map(o => o.orderId === orderId || o.id === orderId
          ? { ...o, status: newStatus }
          : o
        )
      );
    } catch (err) {
      console.error('Status update error:', err.response || err);
      alert('Could not update status.');
    } finally {
      setUpdatingParams({ id: null, menuOpen: false });
    }
  };

  const fmtDate = (dateStr) => {
    if (!dateStr) return { d: '—', t: '' };
    try {
      const d = new Date(dateStr);
      return {
        d: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        t: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
    } catch { return { d: dateStr, t: '' }; }
  };

  // Metrics
  const metrics = useMemo(() => {
    let cancelled = 0, delivered = 0, pending = 0, total = orders.length;
    orders.forEach(o => {
      const s = (o.status || 'PENDING').toUpperCase();
      if (s === 'CANCELLED') cancelled++;
      else if (s === 'DELIVERED') delivered++;
      else if (s === 'PENDING') pending++;
    });
    return { cancelled, delivered, pending, total };
  }, [orders]);

  // Filtering
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    
    // As per user request, we explicitly filtering cancelled out from the list if active statuses are shown, 
    // but the screenshot showed them. We will show them by default to match screenshot.
    
    if (statusFilter !== 'All statuses') {
      filtered = filtered.filter(o => (o.status || 'PENDING').toUpperCase() === statusFilter.toUpperCase());
    }
    
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(o => {
        const oid = String(o.orderId ?? o.id ?? '');
        return oid.toLowerCase().includes(lower);
      });
    }
    
    // Sort descending by ID/Date roughly
    filtered.sort((a,b) => (b.orderId || b.id || 0) - (a.orderId || a.id || 0));
    
    return filtered;
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="w-full bg-white text-[#111]">
      
      {/* Top Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-[26px] font-bold tracking-tight">Orders</h2>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <IconCancelled/>, label: 'Cancelled', val: metrics.cancelled },
          { icon: <IconDelivered/>, label: 'Delivered', val: metrics.delivered },
          { icon: <IconPending/>,   label: 'Pending',   val: metrics.pending },
          { icon: <IconTotal/>,     label: 'Total Orders', val: metrics.total },
        ].map((m, i) => (
          <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 shadow-sm">
            {m.icon}
            <div>
              <p className="text-[14px] font-semibold text-gray-900 mb-0.5">{m.label}</p>
              <p className="text-2xl font-bold leading-none">{m.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-gray-400 text-sm"
          />
        </div>
        
        <div className="relative">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-44 pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-gray-400 text-sm font-medium appearance-none bg-white cursor-pointer"
          >
            <option>All statuses</option>
            <option>Pending</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </div>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>

        <div className="relative">
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-48 pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-gray-400 text-sm font-medium appearance-none bg-white cursor-pointer"
          >
            <option>Last 30 days</option>
            <option>All time</option>
          </select>
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>

        <button className="flex items-center justify-center p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
          <Filter size={18} />
        </button>

        <div className="flex-1"></div>

        <button 
          onClick={fetchOrders}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f4f4f4] hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Table block matching image */}
      <div className="bg-[#fafafa] rounded-[20px] overflow-hidden border border-gray-100">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Order ID</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Total</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-right pr-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredOrders.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400">No matching orders found.</td>
                </tr>
              )}
              {filteredOrders.map((order, i) => {
                const oid    = order.orderId ?? order.id;
                const status = (order.status ?? 'PENDING').toUpperCase();
                const total  = order.totalAmount ?? order.totalPrice ?? order.total;
                const {d, t} = fmtDate(order.createdAt ?? order.orderDate ?? order.date);
                
                // UUID mock or actual ID
                const displayId = typeof oid === 'string' && oid.length > 20 ? oid : 
                  `#${Math.random().toString(16).slice(2,10)}-${oid}`;
                
                const isMenuOpen = updatingParams.menuOpen && updatingParams.id === oid;

                return (
                  <tr key={oid} className="hover:bg-[#fafafa] transition-colors relative">
                    <td className="px-6 py-5 text-[14px] text-gray-500 max-w-[200px] truncate whitespace-nowrap font-medium">
                      {typeof oid === 'string' && oid.includes('-') ? oid : `#${oid}`}
                    </td>
                    <td className="px-6 py-5 text-[14px] font-bold text-gray-900">
                      {total != null ? `$${Number(total).toLocaleString(undefined, {minimumFractionDigits: total % 1 === 0 ? 0 : 2})}` : '—'}
                    </td>
                    <td className="px-6 py-5 text-[14px] text-gray-600">
                      <div>{d}</div>
                      <div className="text-gray-400 mt-0.5">{t}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-[13px] font-medium border ${STATUS_STYLES[status] || STATUS_STYLES.PENDING} capitalize tracking-wide`}>
                        {status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right relative">
                      <button 
                        onClick={() => setUpdatingParams({ id: isMenuOpen ? null : oid, menuOpen: !isMenuOpen })}
                        className="inline-flex items-center gap-2 bg-[#f4f4f4] hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-semibold text-gray-800 transition-colors mr-2"
                      >
                        <span className="flex flex-col gap-[3px] opacity-70">
                          <span className="bg-current w-1 h-1 rounded-full"></span>
                          <span className="bg-current w-1 h-1 rounded-full"></span>
                        </span>
                        Order
                        <ChevronDown size={14} className="opacity-50" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-[4.5rem] mt-1 w-40 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 text-left">
                           <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest">Update Status</div>
                           {['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                              <button 
                                key={s} 
                                onClick={() => handleStatusChange(oid, s)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${status === s ? 'font-semibold text-black bg-gray-50/50' : 'text-gray-600'}`}
                              >
                                {s.charAt(0) + s.slice(1).toLowerCase()}
                              </button>
                           ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminOrders;
