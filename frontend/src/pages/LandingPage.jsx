import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils, TrendingUp, Users, ShieldCheck, ChevronRight } from 'lucide-react';
import Button from '../components/Button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">SmartMess</h1>
          <div className="flex items-center space-x-6">
            <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">Login</Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full text-emerald-700 dark:text-emerald-400 text-sm font-semibold border border-emerald-100 dark:border-emerald-800"
          >
            <span>v1.0 is now live</span>
            <ChevronRight size={16} />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight"
          >
            The Smarter Way to <br />
            <span className="text-emerald-600 dark:text-emerald-400">Manage University Meals</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            Efficient meal booking, real-time waste prediction, and seamless kitchen management. Join thousands of students reducing food waste today.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/register">
              <Button className="w-full sm:w-auto px-10 py-4 text-lg">Create Student Account</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="w-full sm:w-auto px-10 py-4 text-lg">Kitchen Portal</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: <Utensils size={24} className="text-emerald-600" />, 
              title: "Easy Booking", 
              desc: "Book your meals for the entire week in just 3 clicks. Simple, fast, and intuitive." 
            },
            { 
              icon: <TrendingUp size={24} className="text-emerald-600" />, 
              title: "Waste Prediction", 
              desc: "Advanced AI models predict consumption to minimize food production waste." 
            },
            { 
              icon: <ShieldCheck size={24} className="text-emerald-600" />, 
              title: "Secure Access", 
              desc: "Enterprise-grade authentication ensures your data and meal slots are protected." 
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4"
            >
              <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Students", value: "10k+" },
            { label: "Meals Served", value: "500k+" },
            { label: "Food Waste Reduced", value: "40%" },
            { label: "Partner Universities", value: "25+" }
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 dark:text-slate-400 text-sm">
          <p>&copy; 2026 SmartMess. All rights reserved.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-emerald-600">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600">Terms of Service</a>
            <a href="#" className="hover:text-emerald-600">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
