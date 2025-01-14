import React, { useState } from 'react';
import { GetAllFAQLogResponse } from '../../types/faqLog';
import { useNavigate } from 'react-router-dom';

interface FAQLogMainFormProps {
  faqLogs: GetAllFAQLogResponse['data']['faqLogs'];
}

const FAQLogMainForm: React.FC<FAQLogMainFormProps> = ({ faqLogs }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 한 페이지에 4개 항목 표시
  const pagesPerGroup = 10; // 한 그룹에 표시할 페이지 수

  const totalPages = Math.ceil(faqLogs.length / itemsPerPage);

  // 현재 페이지 그룹 (1-10, 11-20 등)
  const currentPageGroup = Math.floor((currentPage - 1) / pagesPerGroup);

  // 페이지 그룹의 첫 페이지와 마지막 페이지 계산
  const startPage = currentPageGroup * pagesPerGroup + 1;
  const endPage = Math.min((currentPageGroup + 1) * pagesPerGroup, totalPages);

  // 현재 페이지 그룹에 해당하는 페이지 목록
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = faqLogs.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
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

  const handleLogClick = (id: string) => {
    navigate(`/logs/${id}`);
  };

  return (
    <div className="p-6 bg-white-50 rounded-lg" style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
      <div className="p-6">
        <h4 className="text-2xl font-bold mb-4 text-gray-800">관리자 로그 리스트(FAQ 수정사항만 반영)</h4>
        <div style={{ minHeight: '505px' }}>
          <div className="grid grid-cols-2 gap-4"> {/* 두 개씩 가로로 배치 */}
            {currentItems.map((log) => (
              <div
                key={log.faq_log_id}
                className="relative bg-gray-200 p-4 mb-3 rounded-lg shadow-sm"
              >
                <div
                  className="mb-2 cursor-pointer"
                  onClick={() => handleLogClick(String(log.faq_log_id))}
                >
                  <span className="mb-1 text-m text-gray-600">
                    <strong>관리자 로그 ID: {log.faq_log_id}</strong>
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="mb-1 text-sm text-gray-600">
                    <strong>수정 유저:</strong> {log.username}
                  </div>
                  <div className="mb-1 text-sm text-gray-600">
                    <strong>FAQ ID:</strong> {log.faq_id}
                  </div>
                  <div className="mb-1 text-sm text-gray-600">
                    <strong>주요 카테고리:</strong> {log.faq_maincategory}
                  </div>
                  <div className="mb-1 text-sm text-gray-600">
                    <strong>하위 카테고리:</strong> {log.faq_subcategory}
                  </div>
                  <div className="mb-1 text-sm text-gray-600">
                    <strong>질문:</strong> {log.faq_question}
                  </div>
                  <div className="mb-1 text-sm text-gray-600">
                    <strong>변경 목적:</strong> {log.action_type}
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

export default FAQLogMainForm;
