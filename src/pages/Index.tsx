
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
