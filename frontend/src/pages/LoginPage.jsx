import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../hooks/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username_or_email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (formData.username_or_email.includes('kitchen') ? '/kitchen/dashboard' : '/student/dashboard');
  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(formData);
      // Determine destination based on role
      const destination = user.role === 'kitchen' ? '/kitchen/dashboard' : '/student/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {isExpired && (
        <div className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm text-center">
          Your session has expired. Please login again.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        
        <Input 
          label="Username or Email" 
          type="text" 
          placeholder="Enter username or email"
          value={formData.username_or_email}
          onChange={(e) => setFormData({ ...formData, username_or_email: e.target.value })}
          required
          disabled={isLoading}
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={isLoading}
        />
        
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-slate-400">
            <input 
              type="checkbox" 
              className="mr-2 rounded border-slate-700 bg-slate-900 focus:ring-blue-500" 
              disabled={isLoading}
            />
            Remember me
          </label>
          <a href="#" className="text-blue-400 hover:underline">Forgot password?</a>
        </div>

        <Button 
          type="submit" 
          className="w-full py-4 text-lg" 
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        <p className="text-center text-slate-400 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline font-medium">Create one</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
