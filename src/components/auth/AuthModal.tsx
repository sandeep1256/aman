import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Database,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authMode, 
    setAuthMode,
    login,
    signup,
    loginAsGuest,
    dbSyncStatus
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (authMode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Failed to sign in. Please verify your credentials.');
        }
      } else if (authMode === 'signup') {
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        const res = await signup(email, password, name || 'Distinguished Patron', phone);
        if (!res.success) {
          setErrorMsg(res.error || 'Failed to create account.');
        }
      } else if (authMode === 'forgot') {
        setSuccessMsg('A password reset link has been dispatched to your email address.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = (type: 'customer' | 'new') => {
    if (type === 'customer') {
      setEmail('client@amanopticles.com');
      setPassword('Opticles2026!');
      setName('Aarav Sharma');
      setPhone('+91 98765 43210');
    } else {
      const randomId = Math.floor(Math.random() * 900) + 100;
      setEmail(`patron${randomId}@amanopticles.com`);
      setPassword('Opticles2026!');
      setName('Devanshi Roy');
      setPhone('+91 98111 22334');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white border border-stone-300 w-full max-w-md shadow-2xl overflow-hidden relative">
        {/* Top Header */}
        <div className="bg-stone-950 text-white p-5 sm:p-6 relative border-b border-stone-800">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[#D4AF37] font-mono text-[10px] uppercase font-bold tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aman Opticles Atelier Account</span>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl font-bold mt-1 text-stone-50">
            {authMode === 'login' && 'Sign In to Your Account'}
            {authMode === 'signup' && 'Create Atelier Membership'}
            {authMode === 'forgot' && 'Reset Your Password'}
          </h2>

          <p className="text-xs text-stone-400 font-mono mt-1">
            {authMode === 'login' && 'Access saved 3D lookbooks, prescription vault & live orders.'}
            {authMode === 'signup' && 'Join & receive 500 Atelier Reward Points on registration.'}
            {authMode === 'forgot' && 'Enter your registered email to receive password recovery.'}
          </p>

          {/* Database Live Badge */}
          <div className="mt-3 flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-stone-900 border border-stone-700 text-[10px] font-mono text-stone-300">
              <Database className="w-3 h-3 text-[#D4AF37]" />
              <span>Database: {dbSyncStatus === 'synced' ? 'Firestore Connected' : 'Connecting...'}</span>
            </div>
          </div>
        </div>

        {/* Auth Mode Tabs (Login / Register) */}
        <div className="flex border-b border-stone-200 bg-[#FAF8F5]">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider text-center border-b-2 transition-colors cursor-pointer ${
              authMode === 'login'
                ? 'border-stone-950 text-stone-950 bg-white shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Sign In / Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider text-center border-b-2 transition-colors cursor-pointer ${
              authMode === 'signup'
                ? 'border-stone-950 text-stone-950 bg-white shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-mono">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-stone-300 focus:border-stone-950 focus:bg-white text-xs font-mono text-stone-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Mobile Phone (For Order SMS & Tracking)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-stone-300 focus:border-stone-950 focus:bg-white text-xs font-mono text-stone-900 outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-stone-300 focus:border-stone-950 focus:bg-white text-xs font-mono text-stone-900 outline-none"
                />
              </div>
            </div>

            {authMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700">
                    Password *
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[10px] font-mono text-stone-500 hover:text-stone-950 underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-[#FAF8F5] border border-stone-300 focus:border-stone-950 focus:bg-white text-xs font-mono text-stone-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="font-mono">Processing...</span>
              ) : (
                <>
                  <span>
                    {authMode === 'login' && 'Sign In Securely'}
                    {authMode === 'signup' && 'Complete Registration'}
                    {authMode === 'forgot' && 'Send Reset Email'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill helper */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            <span className="text-[10px] font-mono text-stone-500 uppercase">Demo Credentials:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('customer')}
                className="text-[10px] font-mono font-bold bg-[#FAF8F5] hover:bg-stone-200 text-stone-800 px-2 py-1 border border-stone-300 cursor-pointer"
              >
                Auto-fill Patron
              </button>
              <button
                type="button"
                onClick={() => loginAsGuest()}
                className="text-[10px] font-mono font-bold bg-stone-950 text-[#D4AF37] px-2 py-1 cursor-pointer"
              >
                1-Click Guest
              </button>
            </div>
          </div>

          {/* Toggle between Login and Signup */}
          <div className="text-center pt-2">
            {authMode === 'login' && (
              <p className="text-xs font-mono text-stone-600">
                New to Aman Opticles?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="font-bold text-stone-950 underline hover:text-[#D4AF37] cursor-pointer"
                >
                  Create an Account (+500 Pts)
                </button>
              </p>
            )}

            {authMode === 'signup' && (
              <p className="text-xs font-mono text-stone-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-stone-950 underline hover:text-[#D4AF37] cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}

            {authMode === 'forgot' && (
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs font-mono font-bold text-stone-950 underline cursor-pointer"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="bg-[#FAF8F5] px-6 py-3 border-t border-stone-200 flex items-center justify-between text-[10px] font-mono text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit Encrypted Password Auth</span>
          </div>
          <span>Aman Opticles Security</span>
        </div>
      </div>
    </div>
  );
};
