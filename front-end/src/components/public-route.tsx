import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';
const PublicRoute: React.FC<{component: React.FC}> = ({
  component: Component,
}) => {
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);

  return !loggedIn ? <Component /> : <Navigate to="/" replace />;
};

export default PublicRoute;
