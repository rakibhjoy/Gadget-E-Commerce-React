import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const validate = () => {
    if (!email.trim()) {
      return 'Email address is required.';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Please enter a valid email address.';
    }
    if (!password) {
      return 'Password is required.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    const result = login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(redirectPath);
    } else {
      setError(result.error);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@joymart.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#E98545] text-white items-center justify-center font-extrabold text-base mb-4 shadow-sm glow-accent">
            JM
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
            Welcome to Joy Mart
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Access your Bangladesh orders, express checkout, and VIP warranty service
          </p>
        </div>

        {/* Form Container — Glass */}
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-glass-card">
          
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-[#D9534F] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#D9534F]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#252525] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-3 text-sm bg-[#F3F1ED] border border-[#E7E5E1] rounded-xl focus:outline-none focus:border-[#E98545] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#252525]">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 text-sm bg-[#F3F1ED] border border-[#E7E5E1] rounded-xl focus:outline-none focus:border-[#E98545] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 bg-[#E98545] hover:bg-[#D6742F] active:scale-95 text-white rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In to Joy Mart'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Box */}
          <div className="mt-6 pt-5 border-t border-[#E7E5E1] bg-[#F3F1ED]/80 rounded-2xl p-4 text-center">
            <p className="text-[11px] text-[#777777] mb-2 font-medium">
              For testing convenience, use the pre-configured demo account:
            </p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E7E5E1] text-[#252525] text-xs font-bold hover:border-[#E98545] transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E98545]" />
              <span>Fill Demo Credentials (demo@joymart.com)</span>
            </button>
          </div>

          {/* Create Account Link */}
          <div className="mt-6 text-center text-xs text-[#777777]">
            Don't have an account yet?{' '}
            <Link
              to={redirectPath !== '/' ? `/register?redirect=${encodeURIComponent(redirectPath)}` : '/register'}
              className="font-bold text-[#252525] hover:text-[#E98545] hover:underline"
            >
              Create Joy Mart Account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
