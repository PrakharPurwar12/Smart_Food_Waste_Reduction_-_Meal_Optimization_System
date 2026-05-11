import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../services/authService';
import Button from '../components/Button';
import Input from '../components/Input';

const ResetPasswordPage = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      // If someone tries to access this page directly without an email, send them back
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resetPassword({ email, otp, new_password: newPassword });
      navigate('/login', { state: { message: 'Password has been reset successfully. You can now login.' } });
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please check your OTP and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4">
          <KeyRound size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Set New Password</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Enter the 6-digit OTP sent to <br/><span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        
        <Input 
          label="6-Digit OTP" 
          type="text" 
          placeholder="Enter OTP (check console)"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          icon={<KeyRound size={18} />}
          required
        />

        <Input 
          label="New Password" 
          type="password" 
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          icon={<Lock size={18} />}
          required
        />

        <Button 
          type="submit" 
          className="w-full py-3" 
          isLoading={isLoading}
        >
          Reset Password <ArrowRight size={18} className="ml-2" />
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link to="/login" className="inline-flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
