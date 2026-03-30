import { useState, useEffect } from 'react';
import HomeHero from '../components/ui/HomeHero';
import ProductGrid from '../components/ui/ProductGrid';
import ProductCard from '../components/ui/ProductCard';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setError(null);
      try {
        const res = await api.get('/products');
        const data = Array.isArray(res.data) ? res.data : res.data.content ?? [];
        setFeaturedProducts(data.slice(0, 10)); // Grab up to 10 products for the extended layout
      } catch (err) {
        console.error('Failed to fetch products', err);
        setError(
          !err.response
            ? `Network error: ${err.message}`
            : `Server error ${err.response.status}: ${err.response.data?.message || err.response.data?.error || 'Failed to load products'}`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <HomeHero />
      {/* Best Sellers */}
      <div>
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading finest pieces...</div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-red-500 font-medium mb-2">Could not load products</p>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        ) : (
          <ProductGrid
            title={<>Our signature<br />best selling pieces</>}
            products={featuredProducts.slice(0, 3)}
            actionText="See all collections"
            actionLink="/shop"
          />
        )}
      </div>

      {/* Category Spotlight 1: Modern Essentials */}
      {!loading && !error && featuredProducts.length > 3 && (
        <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Huge Image */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-full shadow-xl rounded-[32px] overflow-hidden"
            >
              <div className="relative aspect-[4/5] w-full group">
                 <img 
                   src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80" 
                   alt="Modern Essentials" 
                   className="w-full h-full object-cover transform duration-1000 group-hover:scale-105"
                 />
              </div>
            </motion.div>

            {/* Right: Text + Products Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex flex-col max-w-xl mx-auto lg:mx-0"
            >
              <div className="mb-10">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 leading-tight mb-4">
                  Modern <span className="font-serif italic font-light">Essentials</span>.
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-8">
                  Discover pieces designed to transcend seasons. Subdued tones, impeccable tailoring, and luxurious fabrics define our essential wardrobe.
                </p>
                <Link to="/shop" className="inline-flex items-center text-sm font-bold tracking-wider uppercase text-gray-900 hover:text-gray-500 transition-colors gap-2">
                  Shop Essentials <span>→</span>
                </Link>
              </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {featuredProducts.slice(3, 7).map((product, idx) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                 ))}
               </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Category Spotlight 2: Outerwear */}
      {!loading && !error && featuredProducts.length > 7 && (
        <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Text + Products Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex flex-col max-w-xl mx-auto lg:mx-0 order-2 lg:order-1"
            >
              <div className="mb-10">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 leading-tight mb-4">
                  The <span className="font-serif italic font-light">Outerwear</span>.
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-8">
                  Master the elements without compromising on style. Engineered for warmth with a minimalist architectural silhouette.
                </p>
                <Link to="/shop" className="inline-flex items-center text-sm font-bold tracking-wider uppercase text-gray-900 hover:text-gray-500 transition-colors gap-2">
                  Explore Outerwear <span>→</span>
                </Link>
              </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {featuredProducts.slice(7, 10).map((product, idx) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                 ))}
               </div>
            </motion.div>

            {/* Right: Huge Image */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-full shadow-xl rounded-[32px] overflow-hidden order-1 lg:order-2"
            >
              <div className="relative aspect-[4/5] w-full group">
                 <img 
                   src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80" 
                   alt="The Outerwear Collection" 
                   className="w-full h-full object-cover transform duration-1000 group-hover:scale-105"
                 />
              </div>
            </motion.div>

          </div>
        </section>
      )}

      {/* About Us Section */}
      <section id="about" className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80" 
                alt="About us fashion studio" 
                className="w-full aspect-[4/5] object-cover rounded-[32px] shadow-lg"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-gray-900 leading-tight">
                Our legacy of <span className="italic">craftsmanship</span>.
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed font-light">
                Founded on the principles of timeless design and uncompromising quality, Style J brings you modern silhouettes that define the current era of fashion.
              </p>
              <p className="text-lg text-gray-500 leading-relaxed font-light mb-8">
                We believe that every piece should tell a story, woven from the finest fabrics and tailored to absolute perfection. Join us in rewriting the rules of modern luxury.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
