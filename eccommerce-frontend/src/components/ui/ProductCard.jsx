import { Link } from 'react-router-dom';
import { ArrowUpRight, Crown } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group cursor-pointer flex flex-col gap-4">
      <div className="relative bg-[#f5f5f5] rounded-2xl aspect-[4/5] overflow-hidden flex items-center justify-center p-6 transition-colors duration-300 group-hover:bg-[#ebebeb]">
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-semibold z-10 shadow-sm text-gray-900">
          <Crown size={14} />
          Best seller
        </div>
        
        <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm z-10 text-gray-900">
          <ArrowUpRight size={20} />
        </div>
        
        <img 
          src={product.imageUrls?.[0] || 'https://via.placeholder.com/400x500?text=Product'} 
          alt={product.name}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="flex flex-col items-center text-center px-2 mt-5 mb-2">
        <h3 className="text-[16px] font-medium tracking-tight text-gray-900 leading-tight mb-1.5 capitalize">
          {product.name}
        </h3>
        <span className="text-[15px] font-serif font-medium text-gray-500">
          ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
