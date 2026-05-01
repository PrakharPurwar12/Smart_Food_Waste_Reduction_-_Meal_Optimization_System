import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, AlertCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../hooks/AuthContext';
import { setCollege } from '../services/authService';

const SelectCollegePage = () => {
  const [collegeName, setCollegeName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  // If user already has a college, redirect to dashboard
  useEffect(() => {
    if (user && user.college) {
      navigate('/student/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!collegeName.trim()) {
      setError('Please enter a college name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await setCollege({ college_name: collegeName });
      if (res.success) {
        // Refresh the user context so it picks up the newly assigned college
        await refreshUser();
        navigate('/student/dashboard');
      } else {
        setError(res.error || 'Failed to assign college.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="p-8 sm:p-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
              <Building2 size={32} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Select College</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Please enter your college name to continue using the Smart Food System.
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1 text-left">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">College Name</label>
                <Input
                    icon={<Building2 size={20} className="text-slate-400" />}
                    type="text"
                    placeholder="Enter your college name (e.g. NIT Kurukshetra)"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    required
                />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base shadow-indigo-500/20 group"
              isLoading={loading}
              rightIcon={<ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            >
              Continue to Dashboard
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectCollegePage;
