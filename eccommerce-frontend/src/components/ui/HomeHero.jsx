import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomeHero = () => {
  return (
    <div className="relative h-[90vh] min-h-[600px] w-full bg-zinc-900 overflow-hidden">
      {/* Full background image */}
      <img
        src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1800&q=80"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-75"
        alt="hero background"
      />
      {/* Subtle dark gradient at bottom for thumbnail readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* Center content - matches reference exactly */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10" style={{paddingBottom: '120px'}}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium mb-8"
        >
          <span className="bg-white text-black px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Soft</span>
          Warm Winter Layers
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Premium wear<br />for modern living
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="text-gray-200 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Discover our new range of soft clothes made for your daily look and your best days with the finest fabrics.
        </motion.p>

        {/* Buttons - exactly like reference: pill white + ghost */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="flex flex-row items-center gap-3"
        >
          <Link
            to="/shop"
            className="bg-white text-black px-7 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            See all collections
          </Link>
          <Link
            to="/contact"
            className="text-white px-7 py-3 rounded-full text-sm font-semibold border border-white/30 hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            Contact us
          </Link>
        </motion.div>
      </div>

      {/* Bottom thumbnail strip - identical to reference layout */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-4 z-20">
        {[
          { seed: 20, label: null },
          { seed: 22, label: null },
          { seed: 24, label: null },
          { seed: 26, label: 'Arctic', active: true },
          { seed: 28, label: null },
          { seed: 30, label: null },
          { seed: 32, label: null },
        ].map((item, i) => (
          <div
            key={i}
            className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 flex-shrink-0
              ${item.active
                ? 'w-20 md:w-28 h-20 md:h-28 ring-2 ring-white'
                : 'w-16 md:w-20 h-16 md:h-20 opacity-60 hover:opacity-90'
              }`}
          >
            <img
              src={`https://picsum.photos/seed/${item.seed}/200/300`}
              className="w-full h-full object-cover"
              alt="thumbnail"
            />
            {item.label && (
              <div className="absolute bottom-1.5 left-0 right-0 text-center text-white text-[10px] font-bold tracking-wider">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeHero;
