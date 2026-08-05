import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardTitle, CardDescription } from '../Card';
import Button from '../Button';
import { FiPlus, FiBookOpen, FiList, FiUsers } from 'react-icons/fi';

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <div className="pb-4 border-b border-[#2A2A2A] mb-4">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Shortcuts to key management views</CardDescription>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Button
          variant="secondary"
          size="sm"
          icon={FiPlus}
          onClick={() => navigate('/inventory/add')}
          className="justify-start text-left py-3 px-3"
        >
          Add Book
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={FiBookOpen}
          onClick={() => navigate('/inventory')}
          className="justify-start text-left py-3 px-3"
        >
          Manage Inventory
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={FiList}
          onClick={() => navigate('/transactions')}
          className="justify-start text-left py-3 px-3"
        >
          View Requests
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={FiUsers}
          onClick={() => navigate('/users')}
          className="justify-start text-left py-3 px-3"
        >
          Manage Users
        </Button>
      </div>
    </Card>
  );
};

export default QuickActions;
