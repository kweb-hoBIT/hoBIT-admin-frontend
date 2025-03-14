import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { selectLogFilter, setLogFilter } from '../../../redux/filterSlice';
import SelectLog from './SelectLog';
import AdminLogMain from './AdminLogMain';
import QuestionLogMain from './QuestionLogMain';

const LogMain: React.FC = () => {
  const { storedLogFilter } = useSelector((state: RootState) => selectLogFilter(state));
  const dispatch = useDispatch();
  const [selectedLog, setSelectedLog] = useState<'FAQ' | 'Question'>(storedLogFilter);

  useEffect(() => {
    dispatch(setLogFilter(selectedLog));
  }, [selectedLog, dispatch]);

  const handleFilterChange = (filterValue: 'FAQ' | 'Question') => {
    setSelectedLog(filterValue);
  };

  return (
    <>
      <SelectLog selectedLog={selectedLog} onFilterChange={handleFilterChange}/>
      {selectedLog === 'FAQ' ?
        <AdminLogMain />
        :
        <QuestionLogMain />
      }
    </>
  );
};

export default LogMain;
