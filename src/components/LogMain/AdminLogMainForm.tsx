import React, { useState } from 'react';
import { GetAllAdminLogResponse } from '../../types/adminLog';
import { useNavigate } from 'react-router-dom';

interface AdminLogMainFormProps {
  adminLogs: GetAllAdminLogResponse['data']['adminLogs'];
}

const AdminLogMainForm: React.FC<AdminLogMainFormProps> = ({ adminLogs }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const pagesPerGroup = 10;

  const totalPages = Math.ceil(adminLogs.length / itemsPerPage);

  // 현재 페이지 그룹 (1-10, 11-20 등)
  const currentPageGroup = Math.floor((currentPage - 1) / pagesPerGroup);

  // 페이지 그룹의 첫 페이지와 마지막 페이지 계산
  const startPage = currentPageGroup * pagesPerGroup + 1;
  const endPage = Math.min((currentPageGroup + 1) * pagesPerGroup, totalPages);

  // 현재 페이지 그룹에 해당하는 페이지 목록
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = adminLogs.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextGroupStartPage = Math.min((currentPageGroup + 1) * pagesPerGroup + 1, totalPages);
      setCurrentPage(nextGroupStartPage);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevGroupEndPage = Math.max(currentPageGroup * pagesPerGroup, 1);
      setCurrentPage(prevGroupEndPage);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // 한국 시간으로 변환하는 함수
  const formatDateToKST = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  const handleFAQLogClick = (id: string) => {
    navigate(`/adminlogs/faqlogs/${id}`);
  };
  
  const handleSeniorFAQLogClick = (id: string) => {
    navigate(`/adminlogs/seniorfaqlogs/${id}`);
  };

  return (
    <div className="p-6 bg-white-50 rounded-lg">
      <div className="p-6">
        <h4 className="text-2xl font-bold mb-4 text-gray-800">관리자 로그 리스트</h4>
        <div style={{ minHeight: '395px' }}>
          <div className="grid grid-cols-2 gap-4">
          {currentItems.map((log) => (
            <div
            key={`${log.log_id}-${log.log_type}`}
              className="relative bg-gray-200 p-4 rounded-lg cursor-pointer"
              onClick={() =>
                log.log_type === 'faq_log'
                  ? handleFAQLogClick(String(log.log_id))
                  : handleSeniorFAQLogClick(String(log.log_id))
              }
            >
              <div className="mb-2">
                <span className="mb-1 text-m text-gray-600">
                  <strong>수정 유저: {log.username}</strong>
                </span>
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
                  </div>
                ) : log.log_type === 'senior_faq_log' ? (
                  <div className="mb-1 text-sm text-gray-600">
                    <strong>세부 카테고리:</strong> {log.detailcategory}
                  </div>
                ) : null}
                <div className="mb-1 text-sm text-gray-600">
                  <strong>변경 목적:</strong>{' '}
                  <span
                    className={`${
                      log.action_type === '수정'
                        ? 'text-blue-500'
                        : log.action_type === '추가'
                        ? 'text-green-500'
                        : log.action_type === '삭제'
                        ? 'text-red-500'
                        : 'text-gray-600'
                    }`}
                  >
                    {log.action_type}
                  </span>
                </div>
                <div className="mb-1 text-sm text-gray-600">
                  <strong>변경 시각:</strong> {formatDateToKST(log.created_at)}
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-4 items-center space-x-4">
          <button
            onClick={handlePrevPage}
            className="px-4 py-2 bg-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-400"
            disabled={currentPage === 1}
          >
            이전
          </button>

          {/* 페이지 번호 */}
          <div className="flex space-x-2">
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`px-3 py-2 text-sm font-semibold rounded-md ${
                  currentPage === page ? 'bg-crimson text-white' : 'bg-gray-200 text-gray-700'
                }`}
                style={{ width: '40px', textAlign: 'center' }} // 버튼 크기 고정
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            className="px-4 py-2 bg-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-400"
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogMainForm;
