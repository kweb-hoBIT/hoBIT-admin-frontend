import Header from '../components/Header/Header';
import ProtectedPage from '../components/ProtectedPage';
import SelectLog from '../components/LogMain/SelectLog';
import AdminLogMain from '../components/LogMain/AdminLogMain';
import QuestionLogMain from '../components/LogMain/QuestionLogMain';
import { selectLogFilter, setLogFilter } from '../redux/filterSlice';
import { RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';

import React from 'react';

const LogsPage: React.FC = () => {
  const { storedLogFilter } = useSelector((state: RootState) => selectLogFilter(state));
  const dispatch = useDispatch();

  return (
    <ProtectedPage>
      <div>
        <Header />
        <main>
          <SelectLog onSelectLog={(log) => dispatch(setLogFilter(log))} />
          {storedLogFilter === 'FAQ' ? <AdminLogMain /> : <QuestionLogMain />}
        </main>
      </div>
    </ProtectedPage>
  );
};

export default LogsPage;
