import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy load pages
const LandingPage = React.lazy(() => import('../pages/LandingPage'));
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/RegisterPage'));
const StudentDashboard = React.lazy(() => import('../pages/StudentDashboard'));
const MealBookingPage = React.lazy(() => import('../pages/MealBookingPage'));
const KitchenDashboard = React.lazy(() => import('../pages/KitchenDashboard'));
const SelectCollegePage = React.lazy(() => import('../pages/SelectCollegePage'));

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500">Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes (Public) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected - Select College */}
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout role="student" />
            </ProtectedRoute>
          }
        >
          <Route path="/select-college" element={<SelectCollegePage />} />
        </Route>

        {/* Student Routes (Protected) */}
        <Route 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout role="student" />
            </ProtectedRoute>
          }
        >
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/booking" element={<MealBookingPage />} />
        </Route>

        {/* Kitchen Routes (Protected) */}
        <Route 
          element={
            <ProtectedRoute allowedRoles={['kitchen']}>
              <DashboardLayout role="kitchen" />
            </ProtectedRoute>
          }
        >
          <Route path="/kitchen/dashboard" element={<KitchenDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
