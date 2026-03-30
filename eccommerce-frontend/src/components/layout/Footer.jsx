import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-12 border-b border-gray-800">
          <h3 className="text-3xl md:text-4xl font-normal tracking-tight mb-6 md:mb-0">
            Subscribe to<br/>our news later
          </h3>
          <div className="flex w-full md:w-auto mt-4 md:mt-0 gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-[#1a1a1a] text-white px-5 py-3 rounded-full border-none focus:ring-1 focus:ring-white outline-none w-full md:w-64"
            />
            <button className="bg-white text-black px-6 py-3 rounded-full font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-serif tracking-tight mb-4">Style <span className="italic font-semibold">J</span>.</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              A sophisticated e-commerce template designed for modern and minimalist brands.
            </p>
            <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
              Contact Wearix
            </button>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/reviews" className="hover:text-white transition-colors">Reviews</Link></li>
              <li><Link to="/styles" className="hover:text-white transition-colors">Styles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Follow us:</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dribbble</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Youtube</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Get in touch</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="bg-blue-600/[0.15] text-blue-500 px-2 py-0.5 rounded">test@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-blue-600/[0.15] text-blue-500 px-2 py-0.5 rounded">+001 234 567 890</span>
              </li>
              <li className="flex items-center gap-2 mt-4 text-gray-400">
                London, England
              </li>
            </ul>
          </div>
        </div>

        {/* Big Text Bottom */}
        <div className="pt-8 text-center overflow-hidden">
          <h1 
            className="text-[17vw] leading-none font-serif tracking-tighter text-white/30 select-none pb-6"
            style={{ textShadow: '0 20px 60px rgba(255,255,255,0.1)' }}
          >
            Style <span className="italic font-light pr-4">J</span>.
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
