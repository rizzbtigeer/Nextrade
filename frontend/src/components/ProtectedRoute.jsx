import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ADMIN_BASE_PATH } from '../config.js';
import NoIndexMeta from './NoIndexMeta.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to={`/${ADMIN_BASE_PATH}/login`} replace />;
  return (
    <>
      <NoIndexMeta />
      {children}
    </>
  );
}
