import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';
import BaseLayout from './base-layout';
const ProtectedRoute: React.FC<{component: React.FC}> = ({
  component: Component,
}) => {
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);

  return loggedIn ? <BaseLayout><Component /></BaseLayout> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
