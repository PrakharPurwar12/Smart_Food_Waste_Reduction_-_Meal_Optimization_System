import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Lock, Building2, ChefHat, GraduationCap, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

const ROLES = [
  {
    id: 'student',
    label: 'Student',
    desc: 'Book meals and track your dining history.',
    icon: <GraduationCap size={22} />,
  },
  {
    id: 'kitchen',
    label: 'Kitchen Staff',
    desc: 'Manage menus, view bookings & analytics.',
    icon: <ChefHat size={22} />,
  },
];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
    college_name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(formData);
      navigate('/login', { state: { message: 'Account created! Welcome to SmartMess.' } });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border-slate-200 dark:border-white/10 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:focus:ring-teal-500/15 transition-all duration-200 disabled:opacity-60 text-sm';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create your account
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Join thousands of students optimizing campus dining.
        </p>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            key="err"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">I am a...</label>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((role) => {
            const active = formData.role === role.id;
            return (
              <motion.button
                key={role.id}
                type="button"
                disabled={isLoading}
                onClick={() => setFormData({ ...formData, role: role.id })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  active
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 shadow-sm shadow-teal-500/10'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:border-teal-300 dark:hover:border-teal-500/40'
                }`}
              >
                <span className={active ? 'text-teal-500' : 'text-slate-400'}>{role.icon}</span>
                <span className={`font-semibold text-sm ${active ? 'text-teal-700 dark:text-teal-300' : 'text-slate-700 dark:text-slate-200'}`}>
                  {role.label}
                </span>
                <span className="text-[11px] leading-tight text-slate-400 dark:text-slate-500">{role.desc}</span>
                {active && (
                  <motion.div
                    layoutId="role-indicator"
                    className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-teal-500"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Username */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={isLoading}
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="email"
              placeholder="name@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isLoading}
              className={inputClass}
            />
          </div>
        </div>

        {/* College */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">College Name</label>
          <div className="relative">
            <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. Lovely Professional University"
              value={formData.college_name}
              onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
              required
              disabled={isLoading}
              className={inputClass}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="min. 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
              disabled={isLoading}
              className="w-full pl-10 pr-11 py-3 rounded-xl border bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border-slate-200 dark:border-white/10 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:focus:ring-teal-500/15 transition-all duration-200 disabled:opacity-60 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {/* Password strength hint */}
          {formData.password.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    formData.password.length >= i * 4
                      ? i === 3
                        ? 'bg-teal-500'
                        : i === 2
                        ? 'bg-amber-400'
                        : 'bg-red-400'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading || !formData.username || !formData.email || !formData.password || !formData.college_name}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-teal-500/25 hover:shadow-teal-500/35 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-teal-500/20 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
