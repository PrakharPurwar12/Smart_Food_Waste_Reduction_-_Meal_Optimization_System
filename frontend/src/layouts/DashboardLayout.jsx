import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Utensils, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Sun,
  Moon,
  School
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/AuthContext';
import { useTheme } from '../hooks/ThemeContext';

const DashboardLayout = ({ role }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const menuItems = role === 'student' ? [
    { title: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
    { title: 'Book Meals', path: '/student/booking', icon: <Utensils size={20} /> },
  ] : [
    { title: 'Dashboard', path: '/kitchen/dashboard', icon: <LayoutDashboard size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            className="w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col z-20 shadow-xl transition-colors duration-300"
          >
            <div className="p-8 flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Utensils className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">SmartMess</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 p-3.5 rounded-xl transition-all duration-200 group ${
                    location.pathname === item.path
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600'
                  }`}
                >
                  <span className={location.pathname === item.path ? 'text-white' : 'group-hover:text-emerald-500'}>
                    {item.icon}
                  </span>
                  <span className="font-semibold">{item.title}</span>
                  {location.pathname === item.path && (
                    <ChevronRight size={16} className="ml-auto opacity-70" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 w-full text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="hidden md:block font-semibold text-slate-700 dark:text-slate-200">
              {menuItems.find(i => i.path === location.pathname)?.title || 'Overview'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all border border-slate-200 dark:border-slate-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <div className="flex items-center space-x-3 pl-6 border-l border-slate-200 dark:border-slate-800">
              <div className="flex flex-col items-end mr-1">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {user?.username}
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center">
                  <School size={10} className="mr-1" />
                  {user?.college?.name || 'No College'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
