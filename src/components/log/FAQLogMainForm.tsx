import React, { useState } from 'react';
import { GetAllFAQLogResponse } from '../../types/faqLog';
import { useNavigate } from 'react-router-dom';

interface FAQLogMainFormProps {
  faqLogs: GetAllFAQLogResponse['data']['faqLogs'];
}

const FAQLogMainForm: React.FC<FAQLogMainFormProps> = ({ faqLogs }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = faqLogs.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(faqLogs.length / itemsPerPage)) {
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

  const totalPages = Math.ceil(faqLogs.length / itemsPerPage);

  // 한국 시간으로 변환하는 함수
  const formatDateToKST = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  const handleLogClick = (id: string) => {
    navigate(`/logs/${id}`);
  };

  return (
    <div className="p-6 bg-gray-50">
      <h4 className="text-2xl font-bold mb-6 text-gray-800">관리자 로그 리스트</h4>
      {currentItems.map((log) => (
        <div
          key={log.faq_log_id}
          className="relative bg-red-100 p-4 mb-3 rounded-lg shadow-sm"
        >
          {/* FAQLog ID 클릭 이벤트 추가 */}
          <div
            className="mb-2 cursor-pointer"
            onClick={() => handleLogClick(String(log.faq_log_id))}
          >
            <span className="text-lg text-gray-500 hover:underline">
              FAQLog ID: {log.faq_log_id}
            </span>
          </div>
          <div className="flex flex-col">
            <div className="mb-1 text-sm text-gray-600">
              <strong>수정한 유저:</strong> {log.username}
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
              <strong>액션 타입:</strong> {log.action_type}
            </div>
            <div className="mb-1 text-sm text-gray-600">
              <strong>생성일:</strong> {formatDateToKST(log.created_at)}
            </div>
          </div>
        </div>
      ))}

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
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-2 text-sm font-semibold rounded-md ${
                currentPage === page ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
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
  );
};

export default FAQLogMainForm;
