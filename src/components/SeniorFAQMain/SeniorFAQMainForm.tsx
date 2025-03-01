import React, { useState, useEffect, useRef } from 'react';
import { GetAllSeniorFAQResponse } from '../../types/seniorfaq';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { selectSeniorFAQFilter, setSeniorFAQCurrentPage, setSeniorFAQFilterContent, setSeniorFAQFilterName } from '../../redux/filterSlice';
import SeniorFAQDelete from './SeniorFAQDelete';
import SeniorFAQFilter from './SeniorFAQFilter';
import SeniorFAQSort from './SeniorFAQSort';
import { selectSeniorFAQItemsPerPage, setSeniorFAQItemsPerPage } from '../../redux/itemSlice';

interface SeniorFAQMainFormProps {
  seniorFaqs: GetAllSeniorFAQResponse['data']['seniorFaqs'];
}

const SeniorFAQMainForm: React.FC<SeniorFAQMainFormProps> = ({ seniorFaqs }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isFirstRender = useRef(true);

  const { storedCurrentPage, storedFilterContent, storedFilterName } = useSelector(
    (state: RootState) => selectSeniorFAQFilter(state)
  );
  
  const [currentPage, setCurrentPage] = useState<number>(storedCurrentPage);
  const [filter, setFilter] = useState<string>(storedFilterContent);
  const [selectedFilter, setSelectedFilter] = useState<'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager'>(
    storedFilterName
  );
  const [seniorFaqSortValue, setseniorFAQSortValue] = useState<number>(1);
  const [orderedseniorFaqs, setOrderedseniorFaqs] = useState(seniorFaqs);

  useEffect(() => {
    dispatch(setSeniorFAQCurrentPage(currentPage));
    dispatch(setSeniorFAQFilterContent(filter));
    dispatch(setSeniorFAQFilterName(selectedFilter));
  }, [currentPage, filter, selectedFilter]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCurrentPage(1);
  }, [filter, selectedFilter]);

  const filteredData = orderedseniorFaqs.filter(faq =>
    String(faq[selectedFilter]).toLowerCase().includes(filter.toLowerCase())
  );

  const itemsPerPage = useSelector(selectSeniorFAQItemsPerPage);
  const pagesPerGroup = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentPageGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentPageGroup * pagesPerGroup + 1;
  const endPage = Math.min((currentPageGroup + 1) * pagesPerGroup, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(Math.min((currentPageGroup + 1) * pagesPerGroup + 1, totalPages));
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(Math.max(currentPageGroup * pagesPerGroup, 1));

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  return (
    <div className="p-6 bg-white-50 rounded-lg">
      <SeniorFAQFilter
        seniorFaqs={seniorFaqs}
        filter={filter}
        selectedFilter={selectedFilter}
        onFilterChange={setFilter}
        onSelectedFilterChange={setSelectedFilter}
      />
      <SeniorFAQSort
        seniorFaqs={seniorFaqs}
        sort={seniorFaqSortValue}
        onSortChange={setseniorFAQSortValue}
        setOrderedseniorFaqs={setOrderedseniorFaqs}
      />
      <div className="p-6">
        <div className="flex justify-center items-center mb-6">
          <h4 className="text-2xl font-bold text-gray-800 flex-grow">선배 FAQ 리스트</h4>
            <div className="flex items-center space-x-4">
              <select
                value={itemsPerPage}
                onChange={(e) => dispatch(setSeniorFAQItemsPerPage(Number(e.target.value)))}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                <option value={4}>4개씩 보기</option>
                <option value={6}>6개씩 보기</option>
                <option value={8}>8개씩 보기</option>
                <option value={10}>10개씩 보기</option>
              </select>
          <button
            onClick={() => window.location.assign('/seniorfaqs/create')}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            추가
          </button>
          </div>
        </div>
        <div style={{ minHeight: '320px' }}>
          <div className="grid grid-cols-2 gap-4">
            {currentItems.map(faq => (
              <div
                key={faq.senior_faq_id}
                className="relative bg-gray-200 p-4 rounded-lg cursor-pointer"
                onClick={() => navigate(`/seniorfaqs/${faq.senior_faq_id}`)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/seniorfaqs/update/${faq.senior_faq_id}`);
                  }}
                  className="absolute top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  수정
                </button>
                <div className="absolute bottom-5 right-5" onClick={(e) => e.stopPropagation()}>
                  <SeniorFAQDelete
                    senior_faq_id={String(faq.senior_faq_id)}
                    detailcategory_ko={faq.detailcategory_ko}
                    onSuccess={() => {
                      if (currentItems.length === 1 && currentPage > 1) {
                        setCurrentPage(prev => prev - 1);
                      }
                      window.location.reload();
                    }}
                  />
                </div>
                <div className="pr-24">
                  <div className="mb-2"><strong>세부 카테고리: {faq.detailcategory_ko}</strong></div>
                  <div className="flex flex-col">
                    <div className="mb-1 text-sm text-gray-600"><strong>주요 카테고리:</strong> {faq.maincategory_ko}</div>
                    <div className="mb-1 text-sm text-gray-600"><strong>하위 카테고리:</strong> {faq.subcategory_ko}</div>
                    <div className="mb-1 text-sm text-gray-600"><strong>관리자:</strong> {faq.manager}</div>
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
            {pageNumbers.map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-semibold rounded-md ${currentPage === page ? 'bg-crimson text-white' : 'bg-gray-200 text-gray-700'}`}
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
