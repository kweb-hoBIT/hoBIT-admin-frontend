import React from 'react';
import ProtectedPage from '../components/ProtectedPage';
import BulkUpdateAdmin from '../components/Category/Admin/BulkUpdateAdmin';

const BulkUpdateAdminPage: React.FC = () => {
  return (
    <ProtectedPage>
      <div>
        <main>
          <BulkUpdateAdmin />
        </main>
      </div>
    </ProtectedPage>
  );
};

export default BulkUpdateAdminPage;
