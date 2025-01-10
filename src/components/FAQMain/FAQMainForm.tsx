import React, { useState } from 'react';
import { GetAllFAQResponse } from '../../types/faq';
import { useNavigate } from 'react-router-dom';
import FAQDelete from './FAQDelete';
import FAQFilter from './FAQFilter';

interface FAQMainFormProps {
  faqs: GetAllFAQResponse['data']['faqs'];
}

const FAQMainForm: React.FC<FAQMainFormProps> = ({ faqs }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'faq_id' | 'maincategory_ko' | 'subcategory_ko' | 'question_ko' | 'manager'>('question_ko');

  const itemsPerPage = 4;
  const pagesPerGroup = 10;

  const lowerCaseFilter = filter.toLowerCase();
  const filteredData = faqs.filter((faq) =>
    String(faq[selectedFilter]).toLowerCase().includes(lowerCaseFilter)
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentPageGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentPageGroup * pagesPerGroup + 1;
  const endPage = Math.min((currentPageGroup + 1) * pagesPerGroup, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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

  // Reset to the first page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, selectedFilter]);

  const formatDateToKST = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  const handleDetailClick = (faq_id: string) => {
    navigate(`/faqs/${faq_id}`);
  };

  const handleEditClick = (faq_id: string) => {
    navigate(`/faqs/update/${faq_id}`);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg" style={{ transform: 'scale(0.80)', transformOrigin: 'top center' }}>
      <FAQFilter
        filter={filter}
        selectedFilter={selectedFilter}
        onFilterChange={setFilter}
        onSelectedFilterChange={setSelectedFilter}
      />
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="flex justify-center items-center mb-6">
          <h4 className="text-2xl font-bold text-gray-800 flex-grow">FAQ 리스트</h4>
          <button
            onClick={() => window.location.assign('/faqs/create')}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            추가
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {currentItems.map((faq) => (
            <div key={faq.faq_id} className="relative bg-gray-200 p-4 rounded-lg">
              <button
                onClick={() => handleEditClick(String(faq.faq_id))}
                className="absolute top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                수정
              </button>

              <div className="absolute bottom-5 right-5">
                <FAQDelete faq_id={String(faq.faq_id)} question_ko={faq.question_ko} onSuccess={() => window.location.reload()} />
              </div>

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
        </div>

        <div className="flex justify-center mt-4 items-center space-x-4">
          <button
            onClick={handlePrevPage}
            className="px-4 py-2 bg-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-400"
            disabled={currentPage === 1}
          >
            이전
          </button>

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
    </div>
  );
};

export default FAQMainForm;
