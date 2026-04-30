import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const activeStyle = ({ isActive }) => 
    `text-sm font-bold transition-all ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="text-2xl font-black tracking-tighter text-blue-600">
            LUMIÈRE
          </NavLink>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={activeStyle}>Home</NavLink>
            <NavLink to="/shop" className={activeStyle}>Shop</NavLink>
          </div>

          <div className="flex items-center space-x-6">
            {isAdmin && (
              <Link 
                to="/admin/dashboard" 
                className="flex items-center space-x-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 leading-none">Welcome</span>
                  <span className="text-sm font-bold text-gray-900">{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <User size={16} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
