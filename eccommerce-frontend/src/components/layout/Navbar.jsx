import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Announcement Bar - marquee */}
      <div className="bg-black text-white/90 text-xs py-1.5 w-full overflow-hidden whitespace-nowrap">
        <div style={{ display: 'inline-block', animation: 'marquee 25s linear infinite' }}>
          {Array(10).fill('Black friday sale 50% off').map((t, i) => (
            <span key={i} className="mx-8">{t}</span>
          ))}
        </div>
      </div>

      {/* Main Navbar - transparent with blur, exactly like reference */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">

            {/* Logo - left aligned, bold branding */}
            <Link
              to="/"
              className="text-[22px] font-serif tracking-tight text-gray-900 select-none mb-1"
            >
              Style <span className="italic font-semibold text-[24px]">J</span>.
            </Link>

            {/* Center navigation links */}
            <div className="hidden md:flex items-center gap-7">
              {[['/', 'Home'], ['/#about', 'About'], ['/shop', 'Shop'], ['/blog', 'Blog'], ['/contact', 'Contact']].map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  onClick={(e) => {
                    if (to.startsWith('/#')) {
                      const id = to.substring(2);
                      if (window.location.pathname === '/') {
                        e.preventDefault();
                        const element = document.getElementById(id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }
                  }}
                  className="text-[13.5px] font-medium text-gray-800 hover:text-black transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right: search icon + cart + CTA button */}
            <div className="hidden md:flex items-center gap-5">
              <button className="text-gray-700 hover:text-black transition-colors">
                <Search size={18} strokeWidth={2} />
              </button>

              <Link to="/cart" className="relative text-gray-700 hover:text-black transition-colors">
                <ShoppingCart size={18} strokeWidth={2} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center leading-none">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="text-[11px] font-bold bg-gray-100 px-3 py-1 rounded-full tracking-wider text-gray-700 hover:bg-gray-200 transition">
                      ADMIN
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-gray-700 hover:text-black transition" title="Logout">
                    <LogOut size={18} strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-gray-700 hover:text-black transition-colors" title="Login">
                  <User size={18} strokeWidth={2} />
                </Link>
              )}

              <Link
                to="/shop"
                className="bg-black text-white px-5 py-2 rounded-full text-[13px] font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Shop all items
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="flex items-center md:hidden gap-4">
              <Link to="/cart" className="relative text-gray-700">
                <ShoppingCart size={20} strokeWidth={2} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-900">
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 shadow-xl">
            {[['/', 'Home'], ['/#about', 'About'], ['/shop', 'Shop'], ['/blog', 'Blog'], ['/contact', 'Contact']].map(([to, label]) => (
              <Link 
                key={to} 
                to={to} 
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (to.startsWith('/#') && window.location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById(to.substring(2))?.scrollIntoView({ behavior: 'smooth' });
                  }
                }} 
                className="block text-base font-medium text-gray-900 py-1"
              >
                {label}
              </Link>
            ))}
            {!user && (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-gray-700 py-1">
                Login
              </Link>
            )}
            {user && (
              <>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-semibold text-indigo-600 py-1">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left text-base font-medium text-red-500 py-1">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
};

export default Navbar;
