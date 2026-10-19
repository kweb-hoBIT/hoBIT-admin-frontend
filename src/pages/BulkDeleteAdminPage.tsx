import React from 'react';
import ProtectedPage from '../components/ProtectedPage';
import BulkDeleteAdmin from '../components/Category/Admin/BulkDeleteAdmin';

const BulkDeleteAdminPage: React.FC = () => {
  return (
    <ProtectedPage>
      <div>
        <main>
          <BulkDeleteAdmin />
        </main>
      </div>
    </ProtectedPage>
  );
};

export default BulkDeleteAdminPage;
