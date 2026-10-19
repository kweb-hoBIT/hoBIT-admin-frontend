import React, { useState, useEffect, useRef } from 'react';
import { GetAllSeniorFAQResponse } from '../../../types/seniorfaq';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { selectSeniorFAQFilter, 
  setSeniorFAQCurrentPage, 
  setSeniorFAQFilterContent,
  setSeniorFAQFilterName, 
  setSeniorSortValue 
} from '../../../redux/filterSlice';
import SeniorFAQDelete from './SeniorFAQDelete';
import SeniorFAQFilter from './SeniorFAQFilter';
import SeniorFAQSort from './SeniorFAQSort';
import { selectSeniorFAQItemsPerPage, setSeniorFAQItemsPerPage } from '../../../redux/itemSlice';
import Select from '../../ui/Select';

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

  const { storedSortValue } = useSelector((state: RootState) => state.seniorFaqSort);
  
  const [currentPage, setCurrentPage] = useState<number>(storedCurrentPage);
  const [filter, setFilter] = useState<string>(storedFilterContent);
  const [selectedFilter, setSelectedFilter] = useState<'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager'>(
    storedFilterName
  );
  const [filteredSeniorFaqs, setFilteredSeniorFaqs] = useState(seniorFaqs);
  const [seniorFaqSortValue, setseniorFAQSortValue] = useState<number>(storedSortValue);

  useEffect(() => {
    dispatch(setSeniorFAQCurrentPage(currentPage));
    dispatch(setSeniorFAQFilterContent(filter));
    dispatch(setSeniorFAQFilterName(selectedFilter));
    dispatch(setSeniorSortValue(seniorFaqSortValue));
  }, [currentPage, filter, selectedFilter, seniorFaqSortValue]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCurrentPage(1);
  }, [filter, selectedFilter]);

  const itemsPerPage = useSelector(selectSeniorFAQItemsPerPage);
  const pagesPerGroup = 10;
  const totalPages = Math.ceil(filteredSeniorFaqs.length / itemsPerPage);
  const currentPageGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentPageGroup * pagesPerGroup + 1;
  const endPage = Math.min((currentPageGroup + 1) * pagesPerGroup, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  const currentItems = filteredSeniorFaqs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(Math.min((currentPageGroup + 1) * pagesPerGroup + 1, totalPages));
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(Math.max(currentPageGroup * pagesPerGroup, 1));

  return (
    <div className="my-6 p-6 bg-surface rounded-2xl border border-line">
      <SeniorFAQFilter
        seniorFaqs={seniorFaqs}
        filter={filter}
        selectedFilter={selectedFilter}
        onFilterChange={setFilter}
        onSelectedFilterChange={setSelectedFilter}
        setFilteredseniorFaqs={setFilteredSeniorFaqs}
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
          <h4 className="text-xl font-bold text-ink flex-grow">선배 FAQ 리스트</h4>
          <SeniorFAQSort
            filteredSeniorFaqs={filteredSeniorFaqs}
            sort={seniorFaqSortValue}
            onSortChange={setseniorFAQSortValue}
            setFilteredseniorFaqs={setFilteredSeniorFaqs}
          />
          </div>
            <div className="flex items-center space-x-4">
              <Select
                value={itemsPerPage}
                onChange={(e) => {
                  dispatch(setSeniorFAQItemsPerPage(Number(e.target.value)))
                  setCurrentPage(1);
                }}
                className="p-2 rounded-xl border-2 border-line focus:outline-none focus:ring-2 focus:ring-accent-ink/40"
              >
                <option value={4}>4개씩 보기</option>
                <option value={6}>6개씩 보기</option>
                <option value={8}>8개씩 보기</option>
                <option value={10}>10개씩 보기</option>
              </Select>
          <button
            onClick={() => window.location.assign('/seniorfaqs/create')}
            className="bg-success text-white px-4 py-2 rounded-xl hover:bg-success/90"
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
                className="relative bg-card-2 p-4 rounded-xl cursor-pointer"
                onClick={() => navigate(`/seniorfaqs/${faq.senior_faq_id}`)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/seniorfaqs/update/${faq.senior_faq_id}`);
                  }}
                  className="absolute top-5 right-5 bg-accent text-white px-4 py-2 rounded-xl hover:bg-accent/90"
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
                    <div className="mb-1 text-sm text-ink-2"><strong>주요 카테고리:</strong> {faq.maincategory_ko}</div>
                    <div className="mb-1 text-sm text-ink-2"><strong>하위 카테고리:</strong> {faq.subcategory_ko}</div>
                    <div className="mb-1 text-sm text-ink-2"><strong>관리자:</strong> {faq.manager}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-4 items-center space-x-4">
          <button
            onClick={handlePrevPage}
            className="px-4 py-2 bg-card-2 rounded-xl text-sm font-semibold text-ink hover:bg-card-3"
            disabled={currentPage === 1}
          >
            이전
          </button>
          <div className="flex space-x-2">
            {pageNumbers.map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-semibold rounded-xl ${currentPage === page ? 'bg-accent text-white' : 'bg-card-2 text-ink'}`}
                style={{ width: '40px', textAlign: 'center' }}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 bg-card-2 rounded-xl text-sm font-semibold text-ink hover:bg-card-3"
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
