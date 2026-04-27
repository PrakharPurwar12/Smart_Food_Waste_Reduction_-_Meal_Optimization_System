import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              SmartMess
            </h1>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Smarter meals, zero waste.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800">
          <Outlet />
        </div>

        <p className="text-center text-sm text-slate-400 dark:text-slate-500">
          &copy; 2026 SmartMess. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
