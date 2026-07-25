import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, Users, Star, ArrowLeft, Play, ShieldCheck, ShoppingCart, Award, CheckCircle, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useCourseDetail, useLessons } from '../../hooks/queries';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import ReactPlayer from 'react-player';

// Helper to load Razorpay SDK dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user, isAuthenticated, updateUser } = useAuthStore();
  const { items: cartItems, addToCart, removeFromCart } = useCartStore();

  const { data: course, isLoading: loadingCourse } = useCourseDetail(id);
  const { data: lessons, isLoading: loadingLessons } = useLessons(id);

  const [buying, setBuying] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  const isEnrolled = user?.enrolledCourses.includes(id || '') || false;
  const isInCart = cartItems.some((item) => item.id === id);

  const handleCartAction = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add courses to your cart');
      navigate('/login');
      return;
    }
    if (!course) return;

    setAddingToCart(true);
    try {
      if (isInCart) {
        await removeFromCart(course.id);
        toast.success('Course removed from cart');
      } else {
        await addToCart(course);
        toast.success('Course added to cart');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to update cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase courses');
      navigate('/login');
      return;
    }
    if (!course) return;

    setBuying(true);
    try {
      // 1. Create order on server
      const orderRes = await api.post('/api/payments/create-order', { courseId: course.id });
      const orderData = orderRes.data;

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Razorpay SDK failed to load. Are you offline?');
        setBuying(false);
        return;
      }

      // 3. Open Checkout widget
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_key_id',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'LearnFlow LMS',
        description: `Enroll in ${course.title}`,
        order_id: orderData.id,
        handler: async (response: any) => {
          // Signature verification
          try {
            await api.post('/api/payments/verify', {
              orderId: orderData.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              courseId: course.id,
            });

            toast.success('Payment verified! Welcome to the course.');
            
            // Invalidate user details and progress queries
            if (user) {
              updateUser({
                ...user,
                enrolledCourses: [...user.enrolledCourses, course.id],
              });
            }
            queryClient.invalidateQueries({ queryKey: ['course', course.id] });
            queryClient.invalidateQueries({ queryKey: ['progress', course.id] });
            queryClient.invalidateQueries({ queryKey: ['lessons', course.id] });
            queryClient.invalidateQueries({ queryKey: ['cart'] });

            navigate(`/course/${course.id}/learn`);
          } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.error || 'Signature verification failed');
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
      rzp.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to initiate purchase');
    } finally {
      setBuying(false);
    }
  };

  if (loadingCourse) {
    return <Spinner size="lg" className="my-24" />;
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-400">
        Course not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/browse')}
        className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-sm font-semibold mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Catalog
      </button>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Course Hero and Syllabus */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="brand">{course.category}</Badge>
              <Badge variant="secondary">{course.level}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-100 tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              {course.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 font-medium">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4 text-slate-400" />
                {course.totalEnrolledStudents} students enrolled
              </span>
              <span className="flex items-center gap-0.5 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                {course.rating > 0 ? course.rating.toFixed(1) : 'New'}
              </span>
            </div>
          </div>

          {/* Skills Cover */}
          {course.skills && course.skills.length > 0 && (
            <Card glass={true}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-350 text-slate-350 text-slate-300 mb-4">
                What you'll learn
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-md border border-slate-700/50"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-brand-500" />
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Syllabus/Curriculum */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-200">Course Syllabus</h2>

            {loadingLessons ? (
              <Spinner size="md" className="my-8" />
            ) : !lessons || lessons.length === 0 ? (
              <div className="text-slate-500 text-sm">No lectures have been added yet.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-400">
                        {lesson.order}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">{lesson.title}</h4>
                        <span className="text-[10px] text-slate-500">{lesson.duration} mins</span>
                      </div>
                    </div>

                    {lesson.isFree ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                        onClick={() => setPreviewVideoUrl(lesson.videoUrl)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
                        Locked
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Checkout Pricing Card */}
        <div className="lg:col-span-1">
          <Card glass={true} className="sticky top-20 border-slate-800 p-0 overflow-hidden flex flex-col">
            <div className="h-48 w-full bg-slate-950 relative overflow-hidden">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-700">
                  <BookOpen className="h-12 w-12" />
                </div>
              )}
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-100">
                  {course.price === 0 ? 'FREE' : `$${course.price.toFixed(2)}`}
                </span>
                {course.price > 0 && (
                  <span className="text-xs text-slate-500 font-medium line-through">$199.99</span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {isEnrolled ? (
                  <Link to={`/course/${course.id}/learn`} className="w-full">
                    <Button variant="primary" className="w-full py-3">
                      Go to Course
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Button variant="primary" className="w-full py-3" onClick={handleBuyNow} isLoading={buying}>
                      Buy Course Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full py-3"
                      onClick={handleCartAction}
                      isLoading={addingToCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                    </Button>
                  </>
                )}
              </div>

              <div className="text-xs text-slate-500 font-medium space-y-2 border-t border-slate-850 pt-4">
                <p className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-brand-500" /> Full lifetime access</p>
                <p className="flex items-center gap-1.5"><Award className="h-4 w-4 text-brand-500" /> Certificate of completion</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Free Preview Video Modal */}
      <Modal
        isOpen={!!previewVideoUrl}
        onClose={() => setPreviewVideoUrl(null)}
        title="Lecture Preview"
        size="lg"
      >
        {previewVideoUrl && (
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
            <ReactPlayer
              url={previewVideoUrl}
              controls={true}
              width="100%"
              height="100%"
              playing={true}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
export default CourseDetail;
