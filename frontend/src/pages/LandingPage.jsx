import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Utensils, TrendingUp, ShieldCheck, ArrowRight, Zap, BarChart3, Lock, ChevronRight, Leaf } from 'lucide-react';

const FadeUp = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
};

const FEATURES = [
  { icon: <Utensils size={18} />, tag: 'Booking', title: 'Precision Meal Booking', desc: 'Students commit to meals days ahead — eliminating overproduction at its source.' },
  { icon: <BarChart3 size={18} />, tag: 'AI Engine', title: 'Attendance Forecasting', desc: 'RandomForest models trained on history, exams & holidays reach 98% daily accuracy.' },
  { icon: <Zap size={18} />, tag: 'Ops', title: 'Live Kitchen Dashboard', desc: 'Real-time prep counts the moment bookings roll in — zero manual tallying.' },
  { icon: <Lock size={18} />, tag: 'Security', title: 'Multi-Tenant Isolation', desc: 'Every college is a fully isolated tenant. Data never crosses institutional lines.' },
  { icon: <TrendingUp size={18} />, tag: 'Analytics', title: 'Waste Reduction Reports', desc: 'Weekly insights surface exactly where waste occurred and what to fix next cycle.' },
  { icon: <ShieldCheck size={18} />, tag: 'Compliance', title: 'Audit-Ready Records', desc: 'Every booking and cancellation is logged — always ready for institutional audits.' },
];

const STATS = [
  { value: '12,450+', label: 'Active Students', color: 'emerald' },
  { value: '890k+', label: 'Meals Optimized', color: 'teal' },
  { value: '42%', label: 'Waste Reduction', color: 'cyan' },
  { value: '$1.2M', label: 'Cost Saved', color: 'emerald' },
];

const SLIDES = [
  '/slide_1.png', 
  '/slide_2.png', 
  '/slide_3.png', 
  '/slide_4.png', 
  '/slide_5.png', 
  '/slide_6.png',
  '/hero.png'
];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafb] dark:bg-[#060b14] text-slate-900 dark:text-white font-['Outfit',_sans-serif] scroll-smooth overflow-x-hidden selection:bg-emerald-100 dark:selection:bg-emerald-900/30">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 w-full z-50 h-16 flex items-center border-b border-black/5 dark:border-white/5 bg-white/70 dark:bg-[#060b14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Utensils size={15} className="text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">SmartMess</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
            <a href="#features" onClick={e => handleNavClick(e, 'features')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</a>
            <a href="#metrics" onClick={e => handleNavClick(e, 'metrics')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Metrics</a>
            <a href="#cta" onClick={e => handleNavClick(e, 'cta')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Get Started</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-2">Sign in</Link>
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all">
                Get Started <ArrowRight size={13} />
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-0 pb-0 overflow-hidden">
        {/* Full Width Hero Container */}
        <div className="w-full">
          {/* Edge-to-Edge Visual Stage */}
          <div className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black group">
            
            {/* Sliding Background Images */}
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentSlide}
                  src={SLIDES[currentSlide]} 
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </AnimatePresence>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex gap-3">
              {SLIDES.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>

            {/* Floating Quote Inside Image */}
            <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 w-full z-20 text-center px-8">
              <FadeUp delay={0.2} className="space-y-3">
                <p className="text-[10px] md:text-sm font-bold tracking-[0.4em] uppercase text-white/60 drop-shadow-md">
                  Future of Institutional Dining
                </p>
                <h2 className="text-lg md:text-3xl font-medium tracking-tight text-white italic drop-shadow-xl leading-relaxed max-w-2xl mx-auto px-4">
                  "Smarter dining begins with smarter decisions."
                </h2>
              </FadeUp>
            </div>
            
            {/* Professional Scrim - Edge-to-Edge */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.4)_0%,transparent_75%)] pointer-events-none z-10" />

            {/* Content Box (Centered) */}
            <div className="absolute inset-0 flex items-center justify-center z-30 px-6">
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="w-full max-w-5xl text-center space-y-10 sm:space-y-12"
              >
                <div className="space-y-6 sm:space-y-8 relative">
                  {/* Localized dimming scrim */}
                  <div className="absolute inset-0 -inset-x-20 bg-black/30 blur-[100px] sm:blur-[140px] -z-10 rounded-full" />
                  
                  <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-[100px] font-bold tracking-[-0.04em] leading-[1] text-white drop-shadow-[0_15px_50px_rgba(0,0,0,0.8)]">
                    Optimize Meals. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-black">Eliminate Waste.</span>
                  </h1>
                  <p className="text-base sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-bold leading-relaxed drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
                    Helping institutional kitchens prepare the right amount of food — every single day.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8">
                  <Link to="/register" className="w-full sm:w-auto">
                    <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-3 px-10 py-5 sm:px-14 sm:py-6 text-base sm:text-lg font-bold rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_25px_50px_-12px_rgba(16,185,129,0.4)] transition-all">
                      Get Started <ArrowRight size={22} />
                    </motion.button>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-3 px-10 py-5 sm:px-14 sm:py-6 text-base sm:text-lg font-extrabold rounded-2xl bg-transparent text-white border-2 border-white/50 hover:bg-white/10 shadow-2xl transition-all drop-shadow-xl">
                      Sign In
                    </motion.button>
                  </Link>
                </div>

                {/* Trust Indicator */}
                <div className="flex items-center justify-center gap-10 opacity-30 pt-4">
                  <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    <TrendingUp size={12} /> High Accuracy
                  </div>
                  <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    <ShieldCheck size={12} /> Institutional Grade
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-20 border-y border-slate-100 dark:border-white/5 bg-white dark:bg-[#060b14]">
        <FadeUp className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-12">Institutional partners optimizing at scale</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {['OXFORD TECH', 'STANFORD CAMPUS', 'METRO UNIVERSITY', 'GLOBAL INSTITUTE'].map((n, i) => (
              <span key={i} className="text-lg font-black tracking-tighter text-slate-400 dark:text-slate-600 cursor-default select-none">
                {n}
              </span>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-32 px-6 bg-[#f8fafb] dark:bg-[#060b14] relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Platform Capabilities
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Engineered for efficiency. <br />
              <span className="text-slate-400">Built for scale.</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              A comprehensive toolset designed to eliminate guesswork and food waste across large-scale institutional dining.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <motion.div 
                  whileHover={{ y: -8 }}
                  className="group relative p-10 rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 hover:border-emerald-500/30 transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    {f.icon}
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/60 dark:text-emerald-400/50">{f.tag}</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{f.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">{f.desc}</p>
                  </div>
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section id="metrics" className="py-32 relative overflow-hidden bg-slate-950">
        {/* Cinematic dark background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)', backgroundSize: '64px 64px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20">
            <FadeUp className="max-w-2xl space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Real-time Impact</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                Proven results in <br />
                <span className="text-emerald-400">high-density</span> environments.
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-slate-400 text-lg max-w-sm lg:text-right font-medium">
                Our predictive models achieve industry-leading accuracy in large-scale dining halls.
              </p>
            </FadeUp>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
            {STATS.map((s, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="relative group">
                  <p className="text-5xl sm:text-7xl font-black text-white mb-2 tracking-tighter group-hover:text-emerald-400 transition-colors duration-500">
                    {s.value}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">
                    {s.label}
                  </p>
                  {/* Vertical bar */}
                  <div className="absolute -left-6 top-0 bottom-0 w-px bg-white/5 hidden md:block" />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section id="cta" className="py-32 px-6 bg-white dark:bg-[#060b14]">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 px-8 py-20 md:py-28 text-center shadow-2xl">
            {/* Background design */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.2),transparent_70%)]" />
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-12">
              <FadeUp className="space-y-6">
                <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-[0.3em] px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Join the Future
                </span>
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                  Ready to transform <br />
                  <span className="text-emerald-400">your institution?</span>
                </h2>
                <p className="text-xl text-slate-400 font-medium leading-relaxed">
                  Join the forward-thinking campuses eliminating food waste and optimizing meal production with SmartMess.
                </p>
              </FadeUp>

              <FadeUp delay={0.2} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/register" className="w-full sm:w-auto">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-full px-12 py-6 text-lg font-bold rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 transition-all">
                    Apply for Access
                  </motion.button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-full px-12 py-6 text-lg font-bold rounded-2xl bg-white/5 text-white border border-white/10 hover:bg-white/10 backdrop-blur-sm transition-all">
                    View Live Demo
                  </motion.button>
                </Link>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#060b14] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/30">
                  <Utensils size={15} className="text-white" />
                </div>
                <span className="text-base font-extrabold tracking-tight">SmartMess</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                AI-driven meal management for institutional campuses. Smarter food, less waste, better margins.
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Features', 'Kitchen Portal', 'Analytics', 'Pricing'] },
              { title: 'Company', links: ['About Us', 'Sustainability', 'Privacy', 'Terms'] },
            ].map(col => (
              <div key={col.title} className="space-y-4">
                <h4 className="text-sm font-bold">{col.title}</h4>
                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  {col.links.map(l => <li key={l}><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 dark:border-white/5 text-xs text-slate-400 dark:text-slate-600 gap-4">
            <p>&copy; 2026 SmartMess Technologies Inc. All rights reserved.</p>
            <div className="flex gap-6">
              {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
                <a key={s} href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
