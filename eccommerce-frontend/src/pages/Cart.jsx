import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import api from '../services/api';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="py-32 text-center flex flex-col items-center">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Please log in to view your cart</h2>
        <Link to="/login" className="bg-black text-white px-8 py-3 rounded-full font-medium">Log In</Link>
      </div>
    );
  }

  if (loading && !cart) return <div className="py-32 text-center text-gray-400">Loading your cart...</div>;

  const items = cart?.items || [];

  const handleCheckout = async () => {
    try {
      await api.post('/orders/checkout');
      navigate('/orders');
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      alert('Checkout failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[70vh]">
      <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-gray-900 mb-10">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-20 bg-[#f9f9f9] rounded-3xl">
          <p className="text-gray-500 mb-8 text-lg">Your cart is feeling a little empty.</p>
          <Link to="/shop" className="bg-black text-white px-8 py-4 rounded-full font-medium transition hover:bg-gray-800">Continue Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-4">
            {items.map(item => (
              <div key={item.cartItemId} className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-medium tracking-tight text-gray-900 mb-1">{item.productName}</h3>
                  <p className="text-gray-500">${item.price.toLocaleString()}</p>
                </div>
                
                <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                  <button onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))} className="text-gray-400 hover:text-black transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium text-gray-900">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="text-gray-400 hover:text-black transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="text-center sm:text-right w-24">
                  <span className="font-semibold text-gray-900 text-lg">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
                
                <button onClick={() => removeFromCart(item.cartItemId)} className="text-black/30 hover:text-red-500 p-2 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            
            <div className="flex justify-end pt-4">
               <button onClick={clearCart} className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors underline">
                 Clear Cart
               </button>
            </div>
          </div>
          
          <div className="w-full lg:w-96">
            <div className="bg-[#f9f9f9] p-8 rounded-3xl sticky top-28 border border-gray-100 focus-within:ring-1">
              <h2 className="text-2xl font-bold mb-6 tracking-tight text-gray-900">Order Summary</h2>
              <div className="space-y-4 mb-6 text-gray-600 border-b border-gray-200 pb-6 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-gray-900">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">Complimentary</span>
                </div>
              </div>
              <div className="flex justify-between items-end mb-8">
                <span className="text-gray-900 font-medium">Estimated Total</span>
                <span className="text-4xl font-semibold tracking-tighter text-gray-900">${totalPrice.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full bg-black text-white py-5 rounded-full font-medium text-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
