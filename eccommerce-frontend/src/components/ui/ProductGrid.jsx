import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductGrid = ({ products, title, actionText, actionLink }) => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-t border-gray-100 pt-16 mt-8">
        <div>
          {title && (
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter max-w-md leading-tight text-gray-900">
              {title}
            </h2>
          )}
        </div>
        
        {actionText && actionLink && (
          <Link 
            to={actionLink}
            className="mt-6 md:mt-0 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {actionText}
          </Link>
        )}
      </div>
      
      {products?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <h3 className="text-xl font-medium text-gray-500">No products found.</h3>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
