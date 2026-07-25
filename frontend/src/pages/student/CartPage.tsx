import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash, ShoppingBag, CreditCard, ShieldCheck, ArrowRight, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const { items: cartItems, fetchCart, removeFromCart, loading } = useCartStore();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to view your cart');
      navigate('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const handleRemove = async (courseId: string) => {
    try {
      await removeFromCart(courseId);
      toast.success('Course removed from cart');
    } catch (e) {
      toast.error('Failed to remove course');
    }
  };

  const handleCheckout = async (courseId: string, courseTitle: string, price: number) => {
    setCheckoutLoading(courseId);
    try {
      const orderRes = await api.post('/api/payments/create-order', { courseId });
      const orderData = orderRes.data;

      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        toast.error('Razorpay SDK failed to load. Please try again.');
        setCheckoutLoading(null);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_key_id',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'LearnFlow LMS',
        description: `Purchase ${courseTitle}`,
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            await api.post('/api/payments/verify', {
              orderId: orderData.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              courseId,
            });

            toast.success('Payment successful! You are now enrolled.');
            
            if (user) {
              updateUser({
                ...user,
                enrolledCourses: [...user.enrolledCourses, courseId],
              });
            }

            queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            fetchCart();
            
            navigate(`/course/${courseId}/learn`);
          } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.error || 'Verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#16a34a',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Checkout initiation failed');
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <ShoppingBag className="h-7 w-7 text-brand-500" />
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Shopping Cart</h1>
      </div>

      {loading ? (
        <Spinner size="lg" className="my-16" />
      ) : cartItems.length === 0 ? (
        <Card glass={true} className="text-center py-20 flex flex-col items-center">
          <ShoppingBag className="h-12 w-12 text-slate-700 mb-4" />
          <h3 className="text-lg font-bold text-slate-300">Your cart is empty</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mb-6">
            Find courses to learn, add them to your cart, and check out securely.
          </p>
          <Link to="/browse">
            <Button variant="primary">
              Explore Catalog
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((course) => (
              <Card key={course.id} glass={true} className="flex flex-col sm:flex-row items-center gap-4 p-4 border-slate-800">
                <div className="h-20 w-32 bg-slate-950 rounded-lg overflow-hidden flex-shrink-0">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-700">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3 className="text-sm font-bold text-slate-100 truncate">{course.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{course.category}</p>
                  <p className="text-sm font-black text-brand-500 mt-2">${course.price.toFixed(2)}</p>
                </div>

                <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto mt-2 sm:mt-0">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => handleCheckout(course.id, course.title, course.price)}
                    isLoading={checkoutLoading === course.id}
                  >
                    <CreditCard className="h-4 w-4 mr-1.5" />
                    Checkout
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-450 hover:bg-rose-950/20 text-rose-450 text-rose-400 hover:text-rose-400 w-full sm:w-auto"
                    onClick={() => handleRemove(course.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <Card glass={true} className="flex flex-col gap-6">
              <h2 className="text-lg font-bold text-slate-100 pb-3 border-b border-slate-800">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Selected Courses</span>
                  <span className="font-semibold text-slate-200">{cartItems.length}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-150 border-t border-slate-850 pt-3">
                  <span className="text-slate-200">Total Price</span>
                  <span className="text-brand-500">
                    ${cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 text-xs text-slate-500 space-y-2">
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-brand-500" /> Secure Payment verification
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
export default CartPage;
