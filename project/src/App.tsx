import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Trainees from './pages/Trainees';
import Users from './pages/Users';
import Packages from './pages/Packages';
import Subscriptions from './pages/Subscriptions';
import Finance from './pages/Finance';
import Expenses from './pages/Expenses';
import Products from './pages/Products';
import Settings from './pages/Settings';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="trainees" element={<Trainees />} />
            <Route
              path="users"
              element={
                <AuthGuard allowedRoles={['admin']}>
                  <Users />
                </AuthGuard>
              }
            />
            <Route path="packages" element={<Packages />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route
              path="finance"
              element={
                <AuthGuard allowedRoles={['admin']}>
                  <Finance />
                </AuthGuard>
              }
            />
            <Route
              path="expenses"
              element={
                <AuthGuard allowedRoles={['admin']}>
                  <Expenses />
                </AuthGuard>
              }
            />
            <Route path="products" element={<Products />} />
            <Route
              path="settings"
              element={
                <AuthGuard allowedRoles={['admin']}>
                  <Settings />
                </AuthGuard>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;