import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ui/ProductCard';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({ id: 'ALL', name: 'All Products' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts('ALL');
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failure fetching categories', err);
    }
  };

  const fetchProducts = async (categoryId) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (categoryId === 'ALL') {
        res = await api.get('/products');
      } else {
        res = await api.get(`/products/category/${categoryId}`);
      }
      // Handle both plain array and paginated (Spring Page) responses
      const data = Array.isArray(res.data) ? res.data : res.data.content ?? [];
      setProducts(data);
    } catch (err) {
      console.error('Failure fetching products', err);
      setError(
        !err.response
          ? `Network error: ${err.message}`
          : `Error ${err.response.status}: ${err.response.data?.message || 'Failed to load products'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    fetchProducts(cat.id);
  };

  return (
    <div className="pt-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh]">
      <div className="flex flex-col md:flex-row gap-12 border-t border-gray-100 pt-16 mt-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-xl font-bold tracking-tighter mb-6 text-gray-900">Categories</h2>
          <ul className="space-y-4">
            <li>
              <button 
                onClick={() => handleCategoryChange({ id: 'ALL', name: 'All Products' })}
                className={`text-sm font-medium transition-colors ${activeCategory.id === 'ALL' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
              >
                All Products
              </button>
            </li>
            {categories.map(c => (
              <li key={c.id}>
                <button 
                  onClick={() => handleCategoryChange(c)}
                  className={`text-sm font-medium transition-colors text-left ${activeCategory.id === c.id ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-gray-900 leading-tight">
              {activeCategory.name}
            </h1>
          </div>

          {loading ? (
             <div className="py-20 text-center text-gray-400">Loading fine collections...</div>
          ) : error ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-red-500 font-medium mb-2">Could not load products</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? products.map(p => (
                 <ProductCard key={p.id} product={p} />
              )) : (
                 <div className="col-span-full py-20 text-center text-gray-500 bg-gray-50 rounded-2xl">
                   No products available in this category.
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
