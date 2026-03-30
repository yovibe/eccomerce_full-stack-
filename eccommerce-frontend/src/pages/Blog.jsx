import { motion } from 'framer-motion';

const Blog = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[60vh]">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-serif tracking-tight text-gray-900 mb-6"
        >
          The <span className="italic">Style J</span> Journal
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-500 max-w-2xl mx-auto"
        >
          A curated perspective on timeless fashion, modern silhouettes, and the art of craftsmanship.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: "The Minimalist Wardrobe Essentials",
            cat: "Style Guide",
            date: "Nov 12, 2024",
            img: "https://images.unsplash.com/photo-1434389678369-183424d5280c?auto=format&fit=crop&w=800&q=80"
          },
          {
            title: "Behind the Seams: Our Craftsmanship",
            cat: "Inside Style J",
            date: "Nov 05, 2024",
            img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
          },
          {
            title: "Winter Textures: Cashmere & Wool",
            cat: "Editorial",
            date: "Oct 28, 2024",
            img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
          }
        ].map((post, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="group cursor-pointer"
          >
            <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-5">
              <img 
                src={post.img} 
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" 
                alt={post.title} 
              />
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold tracking-wider uppercase text-gray-400 mb-3">
              <span className="text-gray-900 bg-gray-100 px-2.5 py-1 rounded-sm">{post.cat}</span>
              <span>{post.date}</span>
            </div>
            <h3 className="text-xl font-serif text-gray-900 group-hover:text-gray-600 transition-colors leading-snug">
              {post.title}
            </h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
