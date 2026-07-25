import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, isAuthenticated } = useAuthStore();
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.trim().length !== 6) {
      toast.error('Please enter a valid 6-digit OTP code');
      return;
    }

    setVerifying(true);
    try {
      await api.post('/api/auth/verify-email', {
        email: user?.email,
        code: code.trim(),
      });
      
      if (user) {
        updateUser({ ...user, isVerified: true });
      }
      
      toast.success('Email verified successfully!');
      
      if (user?.role === 'INSTRUCTOR') {
        navigate('/instructor/dashboard');
      } else if (user?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Verification failed. Please check the code.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    try {
      await api.post('/api/auth/send-otp', { email: user?.email });
      toast.success('A new OTP has been sent to your email.');
      setTimer(60); // 60 seconds cooldown
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center relative z-10" glass={true}>
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-brand-900/30 border border-brand-500/20 rounded-2xl mb-4">
            <Mail className="h-8 w-8 text-brand-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Verify Your Email</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xs">
            We sent a verification code to <span className="text-slate-200 font-semibold">{user?.email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <Input
            label="Enter 6-Digit OTP"
            placeholder="000000"
            maxLength={6}
            className="text-center text-lg tracking-[8px] font-black focus:placeholder-transparent"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />

          <Button variant="primary" type="submit" className="w-full py-2.5 mt-2" isLoading={verifying}>
            <ShieldCheck className="h-4 w-4 mr-2" />
            Verify Email
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col items-center gap-2">
          <p className="text-sm text-slate-400">Didn't receive the email?</p>
          <button
            onClick={handleResend}
            disabled={resending || timer > 0}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-400 disabled:opacity-50 disabled:hover:text-brand-500 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${resending ? 'animate-spin' : ''}`} />
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
          </button>
        </div>
      </Card>
    </div>
  );
};
export default VerifyEmailPage;
