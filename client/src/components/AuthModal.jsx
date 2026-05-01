import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    try {
      const res = await fetch(`/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onAuthSuccess(data.user);
        onClose();
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch {
      setError('Connection to server failed');
    }
  };

  const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="text-orange-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text" placeholder="Username" required
              className="w-full border-gray-200 border p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.username} onChange={update('username')}
            />
          )}
          <input
            type="email" placeholder="Email" required
            className="w-full border-gray-200 border p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
            value={formData.email} onChange={update('email')}
          />
          <input
            type="password" placeholder="Password" required
            className="w-full border-gray-200 border p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
            value={formData.password} onChange={update('password')}
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors"
          >
            {isLogin ? 'Sign In' : 'Get Started'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-orange-600 font-bold hover:underline"
          >
            {isLogin ? 'Create an account' : 'Login instead'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;