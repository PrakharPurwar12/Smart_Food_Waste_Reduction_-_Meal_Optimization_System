import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils, TrendingUp, ShieldCheck, ChevronRight } from 'lucide-react';
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
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full text-emerald-700 dark:text-emerald-400 text-sm font-semibold border border-emerald-100 dark:border-emerald-800"
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Next-Gen Institutional Dining v1.0</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1]"
            >
              Optimize Meals. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
                Eliminate Waste.
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed"
            >
              Enterprise-grade dining management platform. Leverage AI-driven attendance forecasting to reduce institutional food waste by up to 40%.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <Link to="/register" className="w-full sm:w-auto">
                <Button className="w-full px-8 py-4 text-lg shadow-lg shadow-emerald-500/20">Get Started Free</Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full px-8 py-4 text-lg">View Demo</Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative lg:ml-auto"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-50"></div>
            <div className="relative bg-slate-200 dark:bg-slate-800 p-2 rounded-[2rem] shadow-2xl border border-white/20">
              <img 
                src="/hero-pro.png" 
                alt="Smart Mess Analytics Dashboard" 
                className="rounded-[1.5rem] shadow-inner"
              />
            </div>
            
            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hidden md:block"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Accuracy</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">98.4% AI Match</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-white dark:bg-[#0F172A] border-y border-slate-200 dark:border-slate-800/50 relative overflow-hidden">
        {/* Subtle background glow for visibility */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent)]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center text-xs font-bold text-slate-500 dark:text-emerald-500/60 uppercase tracking-[0.3em] mb-12"
          >
            Trusted by Forward-Thinking Institutions
          </motion.p>
          
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-24 opacity-70">
            <div className="flex items-center space-x-3 group cursor-default">
              <ShieldCheck className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors" /> 
              <span className="font-black text-xl tracking-tighter text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">TECH UNIVERSITY</span>
            </div>
            <div className="flex items-center space-x-3 group cursor-default">
              <Utensils className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors" /> 
              <span className="font-black text-xl tracking-tighter text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">GLOBAL CAMPUS</span>
            </div>
            <div className="flex items-center space-x-3 group cursor-default">
              <ShieldCheck className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors" /> 
              <span className="font-black text-xl tracking-tighter text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">METRO COLLEGE</span>
            </div>
            <div className="flex items-center space-x-3 group cursor-default">
              <Utensils className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors" /> 
              <span className="font-black text-xl tracking-tighter text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">CITY INSTITUTE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Everything you need for <span className="text-emerald-600 dark:text-emerald-400">Zero-Waste Dining</span></h2>
            <p className="text-slate-600 dark:text-slate-400">A comprehensive suite of tools designed to handle every aspect of institutional meal management.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Utensils size={24} />, 
                title: "Precision Booking", 
                desc: "Eliminate guesswork with a student-first booking flow that captures exact attendance intent days in advance." 
              },
              { 
                icon: <TrendingUp size={24} />, 
                title: "AI Forecasting", 
                desc: "Our RandomForest models analyze historical trends, exams, and holidays to predict attendance with 98% accuracy." 
              },
              { 
                icon: <ShieldCheck size={24} />, 
                title: "Operational Hub", 
                desc: "Real-time dashboards for kitchen staff provide instant updates on prep requirements and inventory optimization." 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="group p-10 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 bg-slate-900 dark:bg-slate-900/50 overflow-hidden relative border-y border-white/5">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative text-center md:text-left">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
            {[
              { label: "Active Students", value: "12,450+" },
              { label: "Meals Optimized", value: "890k+" },
              { label: "Waste Reduction", value: "42%" },
              { label: "Cost Savings", value: "$1.2M" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2 group">
                <p className="text-4xl md:text-5xl font-black text-white group-hover:text-emerald-400 transition-colors duration-300">
                  {stat.value}
                </p>
                <div className="h-1 w-12 bg-emerald-500 rounded-full mx-auto md:mx-0 group-hover:w-20 transition-all duration-300"></div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900 dark:from-slate-800 dark:to-slate-950 p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl border border-emerald-500/20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent)]"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">Ready to transform your <br /><span className="text-emerald-400">institutional dining?</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">Join the institutions already saving thousands in operational costs while moving toward a sustainable, zero-waste future.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register" className="w-full sm:w-auto">
                <Button className="w-full px-12 py-4 text-lg shadow-xl shadow-emerald-500/20 ring-1 ring-emerald-400/50">Deploy SmartMess Now</Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <button className="w-full px-12 py-4 text-lg font-bold text-white hover:text-emerald-400 transition-all duration-300 border border-white/10 rounded-xl hover:bg-white/5">View Live Demo</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <h2 className="text-3xl font-black text-emerald-600">SmartMess.</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">The global leader in AI-driven institutional food waste reduction. Building a sustainable future for every campus, one meal at a time.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white">Platform</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Kitchen Portal</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white">Company</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
            <p>&copy; 2026 SmartMess Technologies Inc. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-emerald-600 transition-colors">Twitter</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
