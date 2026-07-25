import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      toast.success('Password reset OTP sent to your email.');
      setStep(2);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to send OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.trim().length !== 6) {
      toast.error('Please enter a valid 6-digit OTP code');
      return;
    }
    // Proceed to password step (validation will happen server-side along with reset)
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', {
        email,
        code: code.trim(),
        newPassword,
      });
      toast.success('Password reset successful! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to reset password. The OTP may be invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 relative z-10" glass={true}>
        {/* Back Link */}
        {step > 1 && (
          <button
            onClick={() => setStep((prev) => (prev - 1) as any)}
            className="absolute top-6 left-6 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}

        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-brand-900/30 border border-brand-500/20 rounded-2xl mb-4">
            <KeyRound className="h-8 w-8 text-brand-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Reset Password</h2>
          <p className="text-slate-400 text-sm mt-1">
            {step === 1 && 'Enter your email to receive a password reset OTP'}
            {step === 2 && `Enter the 6-digit code sent to ${email}`}
            {step === 3 && 'Enter your new secure password'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="primary" type="submit" className="w-full py-2.5 mt-2" isLoading={loading}>
              <Mail className="h-4 w-4 mr-2" />
              Send Reset OTP
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <Input
              label="6-Digit OTP"
              placeholder="000000"
              maxLength={6}
              className="text-center text-lg tracking-[8px] font-black focus:placeholder-transparent"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
            <Button variant="primary" type="submit" className="w-full py-2.5 mt-2">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Verify & Continue
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button variant="primary" type="submit" className="w-full py-2.5 mt-2" isLoading={loading}>
              Reset Password
            </Button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};
export default ForgotPasswordPage;
