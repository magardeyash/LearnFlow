import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', data);
      const { token, user } = res.data;
      
      login(token, user);
      toast.success(`Welcome back, ${user.name}!`);

      if (!user.isVerified) {
        navigate('/verify-email');
      } else if (user.role === 'INSTRUCTOR') {
        navigate('/instructor/dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md p-8 relative z-10" glass={true}>
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-brand-900/30 border border-brand-500/20 rounded-2xl mb-4">
            <BookOpen className="h-8 w-8 text-brand-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Sign In</h2>
          <p className="text-slate-400 text-sm mt-1">
            Access your LearnFlow learning account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="flex flex-col gap-1">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="flex justify-end mt-1">
              <Link
                to="/forgot-password"
                className="text-xs text-brand-500 hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button variant="primary" type="submit" className="w-full py-2.5 mt-2" isLoading={loading}>
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 hover:underline font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
export default LoginPage;
