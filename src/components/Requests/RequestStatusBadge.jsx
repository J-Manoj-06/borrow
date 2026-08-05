import React from 'react';
import Badge from '../Badge';

export const RequestStatusBadge = ({ status = 'Pending' }) => {
  const getBadgeConfig = (st = '') => {
    switch (st.toLowerCase()) {
      case 'approved':
        return { variant: 'success', label: 'Approved' };
      case 'rejected':
        return { variant: 'danger', label: 'Rejected' };
      case 'cancelled':
        return { variant: 'neutral', label: 'Cancelled' };
      case 'returned':
        return { variant: 'neutral', label: 'Returned' };
      case 'expired':
        return { variant: 'danger', label: 'Expired' };
      default:
        return { variant: 'warning', label: 'Pending' };
    }
  };

  const config = getBadgeConfig(status);

  return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
};

export default RequestStatusBadge;
