import React, { useState } from 'react';
import { GetAllFAQResponse } from '../../types/faq';
import { useNavigate } from 'react-router-dom';
import FAQDelete from './FAQDelete';

interface FAQMainFormProps {
  faqs: GetAllFAQResponse['data']['faqs'];
}

const FAQMainForm: React.FC<FAQMainFormProps> = ({ faqs }) => {
  const navigate = useNavigate();
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
  

  // FAQDetail 페이지로 이동하는 함수
  const handleDetailClick = (faq_id: String) => {
    navigate(`/faqs/${faq_id}`);
  };

  // 수정 버튼 클릭 핸들러
  const handleEditClick = (faq_id: String) => {
    navigate(`/faqs/update/${faq_id}`);
  };

  return (
    <div className="p-6 bg-gray-50">
      <h4 className="text-2xl font-bold mb-6 text-gray-800">FAQ 리스트</h4>
      {currentItems.map((faq) => (
        <div key={faq.faq_id} className="relative bg-red-100 p-4 mb-3 rounded-lg">
          {/* 수정 버튼 */}
          <button
            onClick={() => handleEditClick(String(faq.faq_id))}
            className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-md hover:bg-blue-600"
          >
            수정
          </button>

          {/* 삭제 버튼 (오른쪽 아래) */}
          <div className="absolute bottom-2 right-2">
            <FAQDelete faq_id={String(faq.faq_id)} onSuccess={() => window.location.reload()} />
          </div>

          <div className="mb-2">
            <span className="text-lg text-gray-500">FAQ ID: {faq.faq_id}</span>
          </div>

          {/* Question 부분 클릭 이벤트 추가 */}
          <div
            className="mb-2 cursor-pointer"
            onClick={() => handleDetailClick(String(faq.faq_id))}
          >
            <h5 className="text-lg font-semibold text-gray-800 hover:underline">
              {faq.question_ko}
            </h5>
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

export default FAQMainForm;
