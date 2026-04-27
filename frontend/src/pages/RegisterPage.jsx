import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../hooks/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    role: 'student',
    college_name: ''
  });
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
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <Input 
          label="Username" 
          placeholder="johndoe"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          disabled={isLoading}
        />

        <Input 
          label="Email Address" 
          type="email" 
          placeholder="name@university.edu"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isLoading}
        />

        <Input 
          label="College Name" 
          placeholder="e.g. LPU or CU"
          value={formData.college_name}
          onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
          required
          disabled={isLoading}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">I am a...</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`p-3 rounded-xl border font-medium transition-all ${
                formData.role === 'student' 
                ? 'bg-emerald-500 border-emerald-500 text-white' 
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setFormData({ ...formData, role: 'kitchen' })}
              className={`p-3 rounded-xl border font-medium transition-all ${
                formData.role === 'kitchen' 
                ? 'bg-emerald-500 border-emerald-500 text-white' 
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              Kitchen Staff
            </button>
          </div>
        </div>

        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={isLoading}
        />

        <Button 
          type="submit" 
          className="w-full py-3.5"
          disabled={isLoading}
          isLoading={isLoading}
        >
          Create Account
        </Button>

        <p className="text-center text-slate-500 dark:text-slate-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
