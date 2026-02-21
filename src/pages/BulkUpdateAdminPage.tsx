import React from 'react';
import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import BulkUpdateAdmin from '../components/Category/Admin/BulkUpdateAdmin';

const BulkUpdateAdminPage: React.FC = () => {
  return (
    <ProtectedPage>
      <div>
        <Header />
        <main>
          <BulkUpdateAdmin />
        </main>
      </div>
    </ProtectedPage>
  );
};

export default BulkUpdateAdminPage;
