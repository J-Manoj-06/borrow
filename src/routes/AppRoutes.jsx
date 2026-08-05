import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ProtectedLayout from '../layout/ProtectedLayout';
import Loader from '../components/Loader';
import ErrorBoundary from '../components/ErrorBoundary';

// Route Code Splitting via React.lazy()
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Inventory = lazy(() => import('../pages/Inventory'));
const AddBook = lazy(() => import('../pages/AddBook'));
const BookDetails = lazy(() => import('../pages/BookDetails'));
const BorrowRequests = lazy(() => import('../pages/BorrowRequests'));
const Transactions = lazy(() => import('../pages/Transactions'));
const Users = lazy(() => import('../pages/Users'));
const Reports = lazy(() => import('../pages/Reports'));
const Settings = lazy(() => import('../pages/Settings'));
const Notifications = lazy(() => import('../pages/Notifications'));
const NotFound = lazy(() => import('../pages/NotFound'));

export const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader fullScreen text="Loading Borrow Module..." />}>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Layout Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/add" element={<AddBook />} />
              <Route path="/inventory/:bookId" element={<BookDetails />} />
              <Route path="/borrow-requests" element={<BorrowRequests />} />
              <Route path="/requests" element={<Navigate to="/borrow-requests" replace />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/users" element={<Users />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/404" element={<NotFound />} />
            </Route>
          </Route>

          {/* Default Fallback Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
