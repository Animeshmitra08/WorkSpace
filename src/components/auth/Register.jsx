import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';

const Register = ({ onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, error, clearError } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setPasswordError('');
    
    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await register(email, password);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6 text-[#006D77]">Create an Account</h2>
      
      {error && (
        <div className="bg-[#FFDDD2] border-l-4 border-[#E29578] text-[#E29578] p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[#006D77] text-sm font-medium mb-2" htmlFor="reg-email">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-[#EDF6F9] focus:outline-none focus:ring-2 focus:ring-[#83C5BE] focus:border-[#83C5BE] transition-colors"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-[#006D77] text-sm font-medium mb-2" htmlFor="reg-password">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-[#EDF6F9] focus:outline-none focus:ring-2 focus:ring-[#83C5BE] focus:border-[#83C5BE] transition-colors"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        
        <div>
          <label className="block text-[#006D77] text-sm font-medium mb-2" htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            className={`w-full px-4 py-2.5 border rounded-lg bg-[#EDF6F9] focus:outline-none focus:ring-2 transition-colors ${
              passwordError ? 'border-[#E29578] focus:ring-[#FFDDD2] focus:border-[#E29578]' : 'border-gray-200 focus:ring-[#83C5BE] focus:border-[#83C5BE]'
            }`}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordError && (
            <p className="text-[#E29578] text-sm mt-1.5">{passwordError}</p>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            className="bg-[#006D77] hover:bg-[#006D77]/80 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83C5BE] w-full transition-all shadow-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button 
            className="text-[#006D77] hover:text-[#006D77]/80 font-medium"
            onClick={onToggle}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;