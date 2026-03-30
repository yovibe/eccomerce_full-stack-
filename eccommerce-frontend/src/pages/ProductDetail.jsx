import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    setAddError(null);
    try {
      await addToCart(product.id, 1);
    } catch (err) {
      const msg = !err.response
        ? `Network error: ${err.message}`
        : err.response?.data?.message || err.response?.data?.error || `Server error ${err.response.status}`;
      setAddError(msg);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="py-32 text-center text-gray-400">Loading finest details...</div>;
  if (!product) return <div className="py-32 text-center text-red-500">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row gap-12 border-t border-gray-100 pt-16 mt-8">
        
        {/* Main Image View & Thumbnails */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
           <div className="relative w-full bg-[#f4f4f4] rounded-3xl overflow-hidden aspect-square md:aspect-[4/5] flex items-center justify-center p-12 transition-all">
             {/* New Badge */}
             <div className="absolute top-6 left-6 bg-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-sm z-20">
                 <span className="text-[10px]">✨</span> New
             </div>
             <img 
               src={product.imageUrls?.[activeImageIndex] || 'https://via.placeholder.com/600x800?text=Product'} 
               alt={product.name}
               className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-700 z-10 relative"
             />
           </div>
           
           {/* Thumbnails Row Below Image */}
           {product.imageUrls && product.imageUrls.length > 1 && (
             <div className="flex justify-start gap-3 mt-2">
               {product.imageUrls.map((url, idx) => (
                 <button 
                   key={idx}
                   onClick={(e) => {
                     e.preventDefault();
                     setActiveImageIndex(idx);
                   }}
                   className={`w-[4.5rem] h-[4.5rem] rounded-2xl overflow-hidden transition-all bg-[#f4f4f4] flex flex-shrink-0 items-center justify-center p-2 border-2 cursor-pointer ${activeImageIndex === idx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'}`}
                 >
                   <img src={url} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain mix-blend-darken pointer-events-none" />
                 </button>
               ))}
             </div>
           )}
        </div>
        
        {/* Info View */}
        <div className="w-full md:w-1/2 flex flex-col justify-center lg:pl-10">
           <div className="mb-6 flex items-center gap-3">
              <span className="text-black bg-white px-4 py-1 rounded-full shadow-sm text-sm font-medium border border-gray-100/50">Shop</span> 
              <span className="text-gray-900 text-xs">•</span> 
              <span className="text-gray-500 font-medium text-sm">{product.categoryName || "Women's Wear"}</span>
           </div>
           
           <h1 className="text-4xl md:text-[2.75rem] font-medium tracking-tight text-gray-900 mb-4 capitalize">{product.name}</h1>
           
           <div className="flex items-center gap-4 mb-8">
             <span className="text-[1.35rem] font-semibold tracking-tight text-gray-900">USD ${(product.price || 0).toFixed(2)}</span>
           </div>
           
           <p className="text-gray-500 leading-relaxed mb-8 text-[15px] max-w-[420px]">
             {product.description || "Timeless double-breasted design with a removable belt and water-repellent protection."}
           </p>
           
           {addError && (
              <div className="mb-4 bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100 max-w-[420px]">
                {addError}
              </div>
            )}

           <button 
             onClick={handleAddToCart}
             disabled={adding}
             className="w-full max-w-[420px] bg-black text-white py-4 rounded-full font-medium text-[15px] hover:bg-gray-800 transition-colors disabled:bg-gray-400 mb-12"
           >
             {adding ? 'Processing...' : 'Order Now'}
           </button>

           <div className="space-y-0 border-t border-gray-100 max-w-[500px]">
              <div className="flex items-center border-b border-gray-100 py-4 gap-8">
                <span className="text-gray-900 font-medium w-24 flex items-center gap-3 text-sm">
                  <span className="text-base grayscale opacity-80">📦</span> Material
                </span>
                <span className="text-gray-500 text-sm">{product.material || 'Twill weave cotton with coating'}</span>
              </div>
              <div className="flex items-center border-b border-gray-100 py-4 gap-8">
                <span className="text-gray-900 font-medium w-24 flex items-center gap-3 text-sm">
                  <span className="text-base grayscale opacity-80">✂️</span> Care
                </span>
                <span className="text-gray-500 text-sm">Wipe stains with damp cloth</span>
              </div>
              <div className="flex items-center border-b border-gray-100 py-4 gap-8">
                <span className="text-gray-900 font-medium w-24 flex items-center gap-3 text-sm">
                  <span className="text-base grayscale opacity-80">✔️</span> Warranty
                </span>
                <span className="text-gray-500 text-sm">{product.warranty || 'Two year outerwear protection warranty'}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
