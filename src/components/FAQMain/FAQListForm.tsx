import React, { useState } from 'react';
import { GetAllFAQResponse } from '../../types/faq';
import { useNavigate } from 'react-router-dom';
import FAQDelete from './FAQDelete';

interface FAQListFormProps {
  faqs: GetAllFAQResponse['data']['faqs'];
}

const FAQListForm: React.FC<FAQListFormProps> = ({ faqs }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const pagesPerGroup = 10; // 한 그룹에 표시할 페이지 수
  
    const totalPages = Math.ceil(faqs.length / itemsPerPage);
  
    // 현재 페이지 그룹 (1-10, 11-20 등)
    const currentPageGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  
    // 페이지 그룹의 첫 페이지와 마지막 페이지 계산
    const startPage = currentPageGroup * pagesPerGroup + 1;
    const endPage = Math.min((currentPageGroup + 1) * pagesPerGroup, totalPages);
  
    // 현재 페이지 그룹에 해당하는 페이지 목록
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = faqs.slice(indexOfFirstItem, indexOfLastItem);
  
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
  

  // FAQDetail 페이지로 이동하는 함수
  const handleDetailClick = (faq_id: String) => {
    navigate(`/faqs/${faq_id}`);
  };

  // 수정 버튼 클릭 핸들러
  const handleEditClick = (faq_id: String) => {
    navigate(`/faqs/update/${faq_id}`);
  };

  return (
    <div className="p-6 bg-white-50">
      <div className="flex justify-center items-center mb-6">
        <h4 className="text-2xl font-bold text-gray-800 flex-grow">FAQ 리스트</h4>
        <button
          onClick={() => window.location.assign('/faqs/create')}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          추가
        </button>
      </div>
      {currentItems.map((faq) => (
        <div key={faq.faq_id} className="relative bg-gray-200 p-4 mb-3 rounded-lg">
          {/* 수정 버튼 */}
          <button
            onClick={() => handleEditClick(String(faq.faq_id))}
            className="absolute top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            수정
          </button>

          {/* 삭제 버튼 (오른쪽 아래) */}
          <div className="absolute bottom-5 right-5">
            <FAQDelete faq_id={String(faq.faq_id)} question_ko={faq.question_ko} onSuccess={() => window.location.reload()} />
          </div>

          {/* FAQ ID 클릭 이벤트 추가 */}
          <div
            className="mb-2 cursor-pointer"
            onClick={() => handleDetailClick(String(faq.faq_id))}
          >
            <span className="mb-1 text-m text-gray-600">
            <strong>FAQ ID: {faq.faq_id}</strong>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="mb-1 text-sm text-gray-600">
              <strong>주요 카테고리:</strong> {faq.maincategory_ko}
            </div>
            <div className="mb-1 text-sm text-gray-600">
              <strong>하위 카테고리:</strong> {faq.subcategory_ko}
            </div>
            <div className="mb-1 text-sm text-gray-600">
              <strong>질문:</strong> {faq.question_ko}
            </div>
            <div className="mb-1 text-sm text-gray-600">
              <strong>관리자:</strong> {faq.manager}
            </div>
            <div className="mb-1 text-sm text-gray-600">
              <strong>생성 시간:</strong> {formatDateToKST(faq.created_at)}
            </div>
            <div className="mb-1 text-sm text-gray-600">
              <strong>수정 시간:</strong> {formatDateToKST(faq.updated_at)}
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
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
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
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default FAQListForm;
