import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'STUDENT',
      });
      const { token, user } = res.data;
      
      login(token, user);
      toast.success('Registration successful! OTP sent to your email.');
      navigate('/verify-email');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md p-8 relative z-10" glass={true}>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-brand-900/30 border border-brand-500/20 rounded-2xl mb-4">
            <BookOpen className="h-8 w-8 text-brand-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Create Account</h2>
          <p className="text-slate-400 text-sm mt-1">
            Join LearnFlow to browse, purchase, and learn
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4.5">
          <Input
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button variant="primary" type="submit" className="w-full py-2.5 mt-2" isLoading={loading}>
            <UserPlus className="h-4 w-4 mr-2" />
            Create Account
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
export default RegisterPage;
