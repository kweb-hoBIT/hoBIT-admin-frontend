import React from 'react';
import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import BulkDeleteAdmin from '../components/Category/Admin/BulkDeleteAdmin';

const BulkDeleteAdminPage: React.FC = () => {
  return (
    <ProtectedPage>
      <div>
        <Header />
        <main>
          <BulkDeleteAdmin />
        </main>
      </div>
    </ProtectedPage>
  );
};

export default BulkDeleteAdminPage;
