import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { selectAdminLogFilter, setAdminLogCurrentPage } from '../../redux/filterSlice';
import { GetAllAdminLogResponse } from '../../types/adminLog';
import { useNavigate } from 'react-router-dom';

interface AdminLogMainFormProps {
  adminLogs: GetAllAdminLogResponse['data']['adminLogs'];
}

const AdminLogMainForm: React.FC<AdminLogMainFormProps> = ({ adminLogs }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { storedCurrentPage } = useSelector((state: RootState) => selectAdminLogFilter(state));
  const [currentPage, setCurrentPage] = useState<number>(storedCurrentPage || 1);

  useEffect(() => {
    dispatch(setAdminLogCurrentPage(currentPage));
  }, [currentPage]);

  const itemsPerPage = 4;
  const pagesPerGroup = 10;
  const totalPages = Math.ceil(adminLogs.length / itemsPerPage);
  const currentPageGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentPageGroup * pagesPerGroup + 1;
  const endPage = Math.min((currentPageGroup + 1) * pagesPerGroup, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  const currentItems = adminLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(Math.min((currentPageGroup + 1) * pagesPerGroup + 1, totalPages));
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(Math.max(currentPageGroup * pagesPerGroup, 1));
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const formatDateToKST = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  const handleLogClick = (log: any) => {
    const path = log.log_type === 'faq_log' ? `/adminlogs/faqlogs/${log.log_id}` : `/adminlogs/seniorfaqlogs/${log.log_id}`;
    navigate(path);
  };

  return (
    <div className="p-6 bg-white-50 rounded-lg">
      <div className="p-6">
        <div className="flex justify-center items-center mb-6">
          <h4 className="text-2xl font-bold text-gray-800 flex-grow">관리자 로그 리스트</h4>
        </div>
        <div style={{ minHeight: '320px' }}>
          <div className="grid grid-cols-2 gap-4">
            {currentItems.map(log => (
              <div
                key={`${log.log_id}-${log.log_type}`}
                className="relative bg-gray-200 p-4 rounded-lg cursor-pointer"
                onClick={() => handleLogClick(log)}
              >
                <div className="pr-24">
                  <div className="mb-2">
                    <strong>수정 유저: {log.username}</strong>
                  </div>
                  <div className="flex flex-col">
                    <div className="mb-1 text-sm text-gray-600">
                      <strong>주요 카테고리:</strong> {log.maincategory}
                    </div>
                    <div className="mb-1 text-sm text-gray-600">
                      <strong>하위 카테고리:</strong> {log.subcategory}
                    </div>
                    {log.log_type === 'faq_log' ? (
                      <div className="mb-1 text-sm text-gray-600">
                        <strong>질문:</strong> {log.question}
                      </div>) : (
                      <div className="mb-1 text-sm text-gray-600">
                        <strong>세부 카테고리 :</strong> {log.detailcategory}
                      </div>
                    )}
                    <div className="mb-1 text-sm text-gray-600">
                      <strong>변경 목적:</strong>
                      <span className={`ml-1 ${
                        log.action_type === '수정' ? 'text-blue-500' :
                        log.action_type === '추가' ? 'text-green-500' :
                        log.action_type === '삭제' ? 'text-red-500' :
                        'text-gray-600'
                      }`}>
                        {log.action_type}
                      </span>
                    </div>
                    <div className="mb-1 text-sm text-gray-600">
                      <strong>변경 시각:</strong> {formatDateToKST(log.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-4 items-center space-x-4">
          <button
            onClick={handlePrevPage}
            className="px-4 py-2 bg-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-400"
            disabled={currentPage === 1}
          >이전</button>
          <div className="flex space-x-2">
            {pageNumbers.map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-semibold rounded-md ${
                  currentPage === page ? 'bg-crimson text-white' : 'bg-gray-200 text-gray-700'
                }`}
                style={{ width: '40px', textAlign: 'center' }}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 bg-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-400"
            disabled={currentPage === totalPages}
          >다음</button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogMainForm;
