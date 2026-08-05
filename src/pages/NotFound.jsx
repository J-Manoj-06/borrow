import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../layout/PageContainer';
import Button from '../components/Button';
import { FiAlertCircle, FiGrid } from 'react-icons/fi';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center select-none">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#171717] border border-[#2A2A2A] text-[#A1A1AA] flex items-center justify-center mx-auto font-mono text-2xl font-bold">
            404
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Page Not Found</h2>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              The resource or route you requested does not exist or has been relocated in the Borrow Admin System.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={FiGrid}
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default NotFound;
