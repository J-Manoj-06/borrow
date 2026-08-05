// Barcode page deprecated and removed.
import React from 'react';
import { Navigate } from 'react-router-dom';

export const Barcode = () => <Navigate to="/dashboard" replace />;
export default Barcode;
