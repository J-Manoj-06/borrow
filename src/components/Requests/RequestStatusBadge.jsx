import React from 'react';
import Badge from '../Badge';
import { getNormalizedRequestStatus } from '../../utils/requestHelpers';

export const RequestStatusBadge = ({ status = 'Pending' }) => {
  const normalizedLabel = getNormalizedRequestStatus(status);

  const getBadgeVariant = (label = '') => {
    switch (label.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'cancelled':
        return 'neutral';
      case 'returned':
        return 'neutral';
      case 'expired':
        return 'danger';
      case 'pending':
      default:
        return 'warning';
    }
  };

  const variant = getBadgeVariant(normalizedLabel);

  return <Badge variant={variant} size="sm">{normalizedLabel}</Badge>;
};

export default RequestStatusBadge;
