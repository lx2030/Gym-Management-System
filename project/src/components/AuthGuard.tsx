import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from '../atoms/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'user')[];
}

function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const [auth] = useAtom(authAtom);
  const location = useLocation();

  if (!auth.user || !auth.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default AuthGuard;