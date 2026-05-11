import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, Utensils, Leaf, ArrowRight } from 'lucide-react';

const features = [
  { icon: <TrendingUp size={15} />, text: 'AI-powered attendance forecasting' },
  { icon: <Leaf size={15} />,       text: 'Reduce food waste by up to 42%' },
  { icon: <ShieldCheck size={15} />, text: 'Multi-tenant college data isolation' },
];

const stats = [
  { val: '12k+', label: 'Students' },
  { val: '42%',  label: 'Waste Cut' },
  { val: '98%',  label: 'AI Accuracy' },
];

const AuthLayout = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-slate-950 transition-colors duration-300">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col justify-center p-12 xl:p-16 h-full border-r border-white/5 overflow-hidden bg-[#0B1120]">

        {/* Ambient blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[140px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

        {/* Grid overlay — subtle texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)', backgroundSize: '48px 48px' }}
        />

        <div className="relative z-10 flex flex-col gap-10 max-w-lg">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30 flex-shrink-0">
              <Utensils className="text-white" size={18} />
            </div>
            <Link to="/" className="text-2xl font-extrabold text-white tracking-tight">SmartMess</Link>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/12 border border-teal-500/20 text-teal-400 text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              AI-Powered Platform
            </span>

            <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-[1.15] tracking-tight">
              Smarter meals.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                Zero waste.
              </span>
            </h1>

            <p className="text-slate-400 text-[15px] leading-relaxed max-w-sm">
              Enterprise dining management powered by predictive AI — built for modern campuses.
            </p>
          </motion.div>

          {/* Feature list */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="space-y-3"
          >
            {features.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 text-slate-300 text-sm"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-teal-500/12 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                  {f.icon}
                </span>
                {f.text}
              </motion.li>
            ))}
          </motion.ul>

          {/* Divider */}
          <div className="h-px bg-white/5" />

          {/* Stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="grid grid-cols-3 gap-3"
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white/4 border border-white/8 rounded-xl p-4 text-center hover:bg-white/6 hover:border-teal-500/20 transition-colors duration-300"
              >
                <p className="text-xl font-black text-white tracking-tight">{s.val}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1.5">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Back to home link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-teal-400 transition-colors duration-200 group"
            >
              <ArrowRight size={13} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
              Back to homepage
            </Link>
          </motion.div>

        </div>
      </div>

      {/* ── RIGHT PANEL (form area) ── */}
      <div className="flex-1 flex flex-col items-center h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 py-10 sm:py-14 px-6 sm:px-10 lg:px-14">

        {/* Mobile brand */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex lg:hidden items-center gap-2.5 mb-10"
        >
          <div className="w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Utensils className="text-white" size={16} />
          </div>
          <Link to="/" className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">SmartMess</Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="w-full max-w-[400px] my-auto"
        >
          <Outlet />
        </motion.div>

        <p className="mt-10 text-center text-xs text-slate-400 dark:text-slate-600">
          &copy; 2026 SmartMess Technologies. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
