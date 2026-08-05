import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { toast } from 'react-hot-toast';

export const Login = () => {
  const { user, login, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If user is already authenticated, redirect to /dashboard
  if (user && !authLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, rememberMe);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failure:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErrorMessage('Invalid librarian credentials. Please verify email & password.');
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage('Access blocked due to multiple failed attempts. Try again later.');
      } else {
        setErrorMessage(error.message || 'Failed to authenticate librarian.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Accent Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1A1A1A_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 border-[#2A2A2A] shadow-2xl bg-[#111111]">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-xl mb-4 shadow-lg">
              <FiBook className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Borrow Admin</h1>
            <p className="text-xs text-[#A1A1AA] mt-1 tracking-wide uppercase font-medium">
              Library Management System
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 flex items-start gap-3 text-red-200 text-xs"
            >
              <FiAlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="librarian@borrow.app"
              icon={FiMail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              icon={FiLock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1 pb-2">
              <label className="flex items-center gap-2 text-[#A1A1AA] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#2A2A2A] bg-[#171717] text-white focus:ring-0 accent-white w-4 h-4 cursor-pointer"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => toast.error('Please contact system administrator to reset credentials.')}
                className="text-[#A1A1AA] hover:text-white transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Primary Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-[#2A2A2A] text-center">
            <p className="text-[11px] text-[#A1A1AA]">
              Authorized librarian access only. Sessions are monitored.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
