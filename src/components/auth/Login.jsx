import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';

const Login = ({ onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, clearError } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6 text-[#006D77]">Login to My WorkSpace</h2>
      
      {error && (
        <div className="bg-[#FFDDD2] border-l-4 border-[#E29578] text-[#E29578] p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[#006D77] text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-[#EDF6F9] focus:outline-none focus:ring-2 focus:ring-[#83C5BE] focus:border-[#83C5BE] transition-colors"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-[#006D77] text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-[#EDF6F9] focus:outline-none focus:ring-2 focus:ring-[#83C5BE] focus:border-[#83C5BE] transition-colors"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="bg-[#006D77] hover:bg-[#006D77]/80 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83C5BE] w-full transition-all shadow-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button 
            className="text-[#006D77] hover:text-[#006D77]/80 font-medium"
            onClick={onToggle}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;