import React, { useState, useEffect } from 'react';
import { GetAllFAQResponse } from '../../types/faq';

interface FAQsGetFormProps {
  faqs: GetAllFAQResponse['data']['faqs'];
}

const FAQsGetForm: React.FC<FAQsGetFormProps> = ({ faqs }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = faqs.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(faqs.length / itemsPerPage)) {
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

  const totalPages = Math.ceil(faqs.length / itemsPerPage);

  // 한국 시간으로 변환하는 함수
  const formatDateToKST = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  return (
    <div className="p-6 bg-gray-50">
      <h4 className="text-2xl font-bold mb-6 text-gray-800">FAQ 리스트</h4>
      {currentItems.map((faq) => (
        <div key={faq.faq_id} className="bg-red-100 p-4 mb-3 rounded-lg shadow-sm">
          <div className="mb-2">
            <span className="text-lg text-gray-500">ID: {faq.faq_id}</span>
          </div>
          <div className="mb-2">
            <h5 className="text-lg font-semibold text-gray-800">{faq.question_ko}</h5>
          </div>
          <div className="flex flex-col">
            <div className="mb-1 text-sm text-gray-600">
              <strong>주요 카테고리:</strong> {faq.maincategory_ko}
            </div>
            <div className="mb-1 text-sm text-gray-600">
              <strong>하위 카테고리:</strong> {faq.subcategory_ko}
            </div>
            <div className="mb-1 text-sm text-gray-600">
              <strong>관리자:</strong> {faq.manager}
            </div>
            <div className="mb-1 text-sm text-gray-600">
              <strong>생성일:</strong> {formatDateToKST(faq.created_at)}
            </div>
            <div className="mb-1 text-sm text-gray-600">
              <strong>수정일:</strong> {formatDateToKST(faq.updated_at)}
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
              className={`px-3 py-2 text-sm font-semibold rounded-md ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
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

export default FAQsGetForm;
