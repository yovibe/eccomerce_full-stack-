import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Orders = () => {
   const [activeTab, setActiveTab] = useState('active');
   const [orders, setOrders] = useState([]);
   const [loading, setLoading] = useState(true);
   const [cancellingId, setCancellingId] = useState(null);
   const { user } = useAuth();
   
   useEffect(() => {
     if (user) {
       fetchOrders();
     }
   }, [user]);
   
   const fetchOrders = async () => {
     try {
       const res = await api.get('/orders');
       setOrders(res.data);
     } catch (err) {
       console.error(err);
     } finally {
       setLoading(false);
     }
   };
   
   const handleCancel = async (orderId) => {
     if (!window.confirm("Are you sure you want to cancel this order?")) return;
     setCancellingId(orderId);
     try {
       // Typically endpoints are /orders/{id}/cancel or /orders/{id}/status?status=CANCELLED
       await api.put(`/orders/${orderId}/cancel`).catch(async () => {
         // Fallback if the first standard endpoint 404s
         await api.put(`/orders/${orderId}/status?status=CANCELLED`);
       });
       fetchOrders();
     } catch (err) {
       console.error('Cancel error:', err.response || err);
       alert(err.response?.data?.message || err.response?.data?.error || 'Could not cancel order. Please contact support.');
     } finally {
       setCancellingId(null);
     }
   };
   
   if (!user) return <div className="py-32 text-center text-gray-500">Sign in to view orders.</div>;
   
   return (
     <div className="max-w-4xl mx-auto px-4 py-16 min-h-[70vh]">
       <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-gray-900 mb-10">Your Orders</h1>
       
       {/* Tabs */}
       <div className="flex gap-4 border-b border-gray-100 pb-2 mb-8 mt-2">
         {['active', 'past'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`pb-3 px-2 text-sm font-semibold capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
           >
             {tab === 'active' ? 'Active Orders' : 'Order History'}
           </button>
         ))}
       </div>

       {loading ? (
         <div className="text-center py-20 text-gray-400">Loading your history...</div>
       ) : orders.length === 0 ? (
         <div className="text-center py-20 bg-[#f9f9f9] rounded-3xl">
           <p className="text-gray-500 mb-6 text-lg">You haven't placed any orders yet.</p>
           <Link to="/shop" className="bg-black text-white px-8 py-3 rounded-full font-medium inline-block hover:bg-gray-800 transition">Discover New Fits</Link>
         </div>
       ) : (
         <div className="space-y-6">
           {orders
             .filter(o => {
               const st = (o.status || 'PENDING').toUpperCase();
               if (st === 'CANCELLED') return false; // Completely remove from both tabs
               if (activeTab === 'active') return st === 'PENDING';
               return st === 'SHIPPED' || st === 'DELIVERED';
             })
             .map(order => {
               const status = (order.status || 'PENDING').toUpperCase();
               let statusMsg = "We're preparing your items for shipment.";
               let statusColorMs = "text-yellow-700 bg-yellow-50";

               if (status === 'SHIPPED') {
                 statusColorMs = "text-blue-700 bg-blue-50";
                 statusMsg = "Great news! Your order has shipped. Thank you for shopping with us.";
               } else if (status === 'DELIVERED') {
                 statusColorMs = "text-green-700 bg-green-50";
                 statusMsg = "Delivered. We hope you love your new pieces!";
               } else if (status === 'CANCELLED') {
                 statusColorMs = "text-red-600 bg-red-50";
                 statusMsg = "We apologize, but this order has been cancelled. Any charge has been voided.";
               }

               return (
             <div key={order.orderId || order.id} className="p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] bg-white space-y-6 transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-6 gap-4">
                   <div>
                     <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">Order #{order.orderId || order.id}</p>
                     <p className="font-medium text-gray-900">{new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                   </div>
                   <div className="text-left sm:text-right">
                     <p className="text-xl font-semibold tracking-tight text-gray-900 mb-1">${order.totalAmount?.toLocaleString()}</p>
                     <span className={`text-xs font-semibold tracking-wider px-3 py-1 rounded-full uppercase inline-block ${statusColorMs}`}>{status}</span>
                   </div>
                </div>

                {/* Professional message block */}
                <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 text-sm ${
                   status === 'CANCELLED' ? 'bg-red-50/50 border-red-100 text-red-700' :
                   status === 'SHIPPED' || status === 'DELIVERED' ? 'bg-blue-50/50 border-blue-100 text-blue-700' :
                   'bg-[#f9f9f9] border-gray-100 text-gray-600'
                }`}>
                  {status === 'CANCELLED' ? '⚠️' : status === 'SHIPPED' ? '🚚' : status === 'DELIVERED' ? '✨' : '📦'}
                  <span>{statusMsg}</span>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-semibold text-gray-900">Items</h4>
                    {status === 'PENDING' && (
                       <button 
                         onClick={() => handleCancel(order.orderId || order.id)}
                         disabled={cancellingId === (order.orderId || order.id)}
                         className="text-xs font-semibold text-red-500 hover:text-red-700 underline transition-colors disabled:opacity-50"
                       >
                         {cancellingId === (order.orderId || order.id) ? 'Cancelling...' : 'Cancel Order'}
                       </button>
                    )}
                  </div>
                  {order.items?.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xs font-medium text-gray-400">
                          {item.quantity}x
                        </div>
                        <span className="font-medium text-gray-700">{item.productName}</span>
                      </div>
                      <span className="font-medium text-gray-900">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
             </div>
           );
           })}
           
           {orders.filter(o => {
             const st = (o.status || 'PENDING').toUpperCase();
             if (st === 'CANCELLED') return false;
             if (activeTab === 'active') return st === 'PENDING';
             return st === 'SHIPPED' || st === 'DELIVERED';
           }).length === 0 && (
             <div className="text-center py-16 bg-[#fafafa] rounded-3xl border border-gray-100 mt-6">
               <p className="text-gray-500 text-lg">No {activeTab} orders found.</p>
             </div>
           )}
         </div>
       )}
     </div>
   );
};

export default Orders;
