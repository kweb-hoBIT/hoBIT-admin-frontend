import React, { useState, useEffect } from 'react';
import { GetAllSeniorFAQResponse } from '../../types/seniorfaq';
import { useNavigate } from 'react-router-dom';
import SeniorFAQDelete from './SeniorFAQDelete';
import SeniorFAQFilter from './SeniorFAQFilter';

interface SeniorFAQMainFormProps {
  seniorFaqs: GetAllSeniorFAQResponse['data']['seniorFaqs'];
}

const SeniorFAQMainForm: React.FC<SeniorFAQMainFormProps> = ({ seniorFaqs }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager'>('detailcategory_ko');

  const itemsPerPage = 4;
  const pagesPerGroup = 10;

  const lowerCaseFilter = filter.toLowerCase();
  const filteredData = seniorFaqs.filter((faq) =>
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

  // Reset to the first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, selectedFilter]);

  const formatDateToKST = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  const handleDetailClick = (senior_faq_id: string) => {
    navigate(`/seniorfaqs/${senior_faq_id}`);
  };

  const handleEditClick = (senior_faq_id: string) => {
    navigate(`/seniorfaqs/update/${senior_faq_id}`);
  };

  return (
    <div className="p-6 bg-white-50 rounded-lg">
      <SeniorFAQFilter
        filter={filter}
        selectedFilter={selectedFilter}
        onFilterChange={setFilter}
        onSelectedFilterChange={setSelectedFilter}
      />
      <div className="p-6">
        <div className="flex justify-center items-center mb-6">
          <h4 className="text-2xl font-bold text-gray-800 flex-grow">선배 FAQ 리스트</h4>
          <button
            onClick={() => window.location.assign('/seniorfaqs/create')}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            추가
          </button>
        </div>
          <div style={{ minHeight: '320px' }}>
            <div className="grid grid-cols-2 gap-4">
              {currentItems.map((seniorFaq) => (
                <div key={seniorFaq.senior_faq_id}  className="relative bg-gray-200 p-4 rounded-lg cursor-pointer" onClick={() => handleDetailClick(String(seniorFaq.senior_faq_id))}>
                  <button
                    onClick={(e) => { 
                      e.stopPropagation();
                      handleEditClick(String(seniorFaq.senior_faq_id)); 
                    }}
                    className="absolute top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    수정
                  </button>

                  <div
                    className="absolute bottom-5 right-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SeniorFAQDelete
                      senior_faq_id={String(seniorFaq.senior_faq_id)}
                      detailcategory_ko={seniorFaq.detailcategory_ko}
                      onSuccess={() => window.location.reload()}
                    />
                  </div>


                  <div className="pr-24">
                    <div className="mb-2">
                      <span className="mb-1 text-m text-gray-600">
                        <strong>세부 카테고리: {seniorFaq.detailcategory_ko}</strong>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="mb-1 text-sm text-gray-600">
                        <strong>주요 카테고리:</strong> {seniorFaq.maincategory_ko}
                      </div>
                      <div className="mb-1 text-sm text-gray-600">
                        <strong>하위 카테고리:</strong> {seniorFaq.subcategory_ko}
                      </div>
                      <div className="mb-1 text-sm text-gray-600">
                        <strong>관리자:</strong> {seniorFaq.manager}
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

export default SeniorFAQMainForm;
