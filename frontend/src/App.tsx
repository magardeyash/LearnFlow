import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Common Components
import { Navbar } from './components/common/Navbar';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { Unauthorized } from './pages/Unauthorized';

// Student Pages
import { Browse } from './pages/student/Browse';
import { CourseDetail } from './pages/student/CourseDetail';
import { CartPage } from './pages/student/CartPage';
import { StudentDashboard } from './pages/student/Dashboard';
import { CourseViewer } from './pages/student/CourseViewer';
import { InstructorRegister } from './pages/instructor/InstructorRegister';

// Instructor Pages
import { InstructorDashboard } from './pages/instructor/Dashboard';
import { CourseManagement } from './pages/instructor/CourseManagement';
import { QuizManagement } from './pages/instructor/QuizManagement';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-slate-950">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/browse" replace />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Verified Protected Student Routes */}
              <Route
                path="/verify-email"
                element={
                  <ProtectedRoute requireVerified={false}>
                    <VerifyEmailPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/course/:id/learn"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                    <CourseViewer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <CartPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/instructor/register"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <InstructorRegister />
                  </ProtectedRoute>
                }
              />

              {/* Instructor Protected Routes */}
              <Route
                path="/instructor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/instructor/course/:id"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                    <CourseManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/instructor/quiz/:lessonId"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                    <QuizManagement />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/browse" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-slate-900 text-slate-100 border border-slate-800 rounded-xl',
          duration: 4000,
        }}
      />
    </QueryClientProvider>
  );
};
export default App;
