
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Users,
  Stethoscope,
  Heart,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const roles = [
  { id: 'patient', name: 'Patient', icon: Users },
  { id: 'doctor', name: 'Doctor', icon: Stethoscope },
  { id: 'blood_donor', name: 'Blood Donor', icon: Heart }
];

export default function AuthModal({
  isOpen,
  onClose,
  initialRole = 'patient'
}) {
  const navigate = useNavigate();
  const { signIn, signUp, profile, refreshProfile } = useAuth();

  const [activeRole, setActiveRole] = useState(initialRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const validRole = roles.some(
        (role) => role.id === initialRole
      );

      setActiveRole(validRole ? initialRole : 'patient');
      setError('');
      setMessage('');
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const handleAuthSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name.');
        }

        if (activeRole === 'doctor' && !licenseNumber.trim()) {
          throw new Error('Please enter your medical license number.');
        }

        const { data, error: authError } = await signUp({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          role: activeRole
        });

        if (authError) throw authError;

        if (data?.session) {
          await refreshProfile();
          setMessage('Registration successful! Your account is ready.');
        } else {
          setMessage(
            'Registration successful! Please verify your email before signing in.'
          );
        }
      } else {
        const { data: authData, error: authError } = await signIn({
          email: email.trim(),
          password
        });

        if (authError) throw authError;

        // Refresh profile to obtain the trusted database role.
        let currentProfile = profile;

        for (let attempt = 0; attempt < 5 && !currentProfile; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          currentProfile = await refreshProfile(authData?.user?.id);
        }

        if (!currentProfile) {
          throw new Error(
            'Login succeeded, but your profile could not be loaded. Please try again.'
          );
        }

        setMessage('Login successful! Redirecting...');

        const destination = `/dashboard/${currentProfile.role}`;

        onClose();
        navigate(destination, { replace: true });
      }
    } catch (authError) {
      setError(
        authError.message || 'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 mb-3">
            <ShieldCheck className="w-4 h-4" />
            Secure CARECONNECT Access
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            {isSignUp ? 'Create an Account' : 'Portal Sign In'}
          </h2>

          <p className="text-xs text-slate-500 mt-2">
            {isSignUp
              ? 'Register for your CARECONNECT account'
              : 'Sign in using your registered email'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl mb-6">
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setActiveRole(role.id);
                  setError('');
                  setMessage('');
                }}
                className={`flex flex-col items-center justify-center py-3 px-1 rounded-xl text-xs font-bold ${activeRole === role.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:bg-white/50'
                  }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                {role.name}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {message}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">

          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>

              <input
                type="text"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          )}

          {isSignUp && activeRole === 'doctor' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Medical License Number
              </label>

              <input
                type="text"
                required
                value={licenseNumber}
                onChange={(event) => setLicenseNumber(event.target.value)}
                placeholder="Enter medical license number"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>

            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading
              ? 'Processing...'
              : isSignUp
                ? `Register as ${activeRole.replace('_', ' ')}`
                : 'Sign In'}

            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
          {isSignUp
            ? 'Already have an account?'
            : "Don't have an account?"}{' '}

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setMessage('');
            }}
            className="text-sky-600 font-bold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Register now'}
          </button>
        </div>
      </div>
    </div>
  );
}

