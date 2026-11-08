import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  selectFAQFilter,
  setFAQFilterContent,
  setFAQFilterName,
  setSortValue
} from '../../../redux/filterSlice';
import FAQDelete from './FAQDelete';
import FAQFilter from './FAQFilter';
import FAQSort, { sortFAQs } from './FAQSort';
import { GetAllFAQResponse } from '../../../types/faq';
import { FAQAudienceBadge } from '../FAQAudienceField';
import FAQExcelButtons from '../FAQExcel/FAQExcelButtons';
import { useIncremental } from '../../../hooks/useIncremental';
import { ListEnd, ListHeader, CardFooter } from '../../ui/ListKit';
import { revealRef } from '../../ui/motion';
import Icon from '../../ui/Icon';

interface FAQMainFormProps {
  faqs: GetAllFAQResponse['data']['faqs'];
  view?: 'undergraduate' | 'graduate';
}

const FAQMainForm: React.FC<FAQMainFormProps> = ({ faqs, view = 'undergraduate' }) => {
  const grad = view === 'graduate';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { storedFilterContent, storedFilterName } = useSelector((state: RootState) => selectFAQFilter(state));
  const { storedSortValue } = useSelector((state: RootState) => state.faqSort);

  const [filter, setFilter] = useState<string>(storedFilterContent);
  const [selectedFilter, setSelectedFilter] = useState<
    'maincategory_ko' | 'subcategory_ko' | 'question_ko' | 'manager'
  >(storedFilterName);
  const [faqSortValue, setFAQSortValue] = useState<number>(storedSortValue);

  // 검색어·정렬은 다른 화면에 다녀와도 그대로 (redux + localStorage)
  useEffect(() => {
    dispatch(setFAQFilterContent(filter));
    dispatch(setFAQFilterName(selectedFilter));
    dispatch(setSortValue(faqSortValue));
  }, [dispatch, filter, selectedFilter, faqSortValue]);

  // 거르기·정렬은 바뀔 때만 다시 계산
  const filteredFaqs = useMemo(() => {
    const q = filter.toLowerCase();
    const matched = q ? faqs.filter((faq) => String(faq[selectedFilter] ?? '').toLowerCase().includes(q)) : faqs;
    return sortFAQs(matched, faqSortValue);
  }, [faqs, filter, selectedFilter, faqSortValue]);

  // 처음 20개, 내려가면 20개씩 더 — 검색어·정렬이 바뀌면 처음부터
  const { shown, total, hasMore, sentinelRef } = useIncremental(filteredFaqs, `${selectedFilter}|${filter}|${faqSortValue}`);

  return (
    <div className="my-6 p-3 sm:p-6 bg-surface rounded-2xl border border-line">
      <FAQFilter
        faqs={faqs}
        filter={filter}
        selectedFilter={selectedFilter}
        onFilterChange={setFilter}
        onSelectedFilterChange={setSelectedFilter}
      />

      <div className="p-3 sm:p-6">
        <ListHeader
          title={grad ? '대학원 FAQ' : '학부 FAQ'}
          count={total}
          description={`대상이 ${grad ? '대학원' : '학부'}·공통인 FAQ — 학생 화면 ${grad ? '대학원' : '학부'} 모드에 보여요`}
          action={
            <button
              type="button"
              onClick={() => window.location.assign(grad ? '/faqs/create?audience=graduate' : '/faqs/create')}
              className="inline-flex h-10 items-center gap-1 rounded-xl bg-success px-4 font-semibold text-white hover:bg-success/90"
            >
              <Icon name="plus" />
              추가
            </button>
          }
          left={<FAQSort sort={faqSortValue} onSortChange={setFAQSortValue} />}
          right={<FAQExcelButtons />}
        />
        <div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {shown.map(faq => (
              <div
                key={faq.faq_id}
                ref={revealRef}
                className="relative bg-card-2 p-4 rounded-xl cursor-pointer"
                onClick={() => navigate(`/faqs/${faq.faq_id}`)}
              >
                <div>
                  <div className="mb-2 flex items-start gap-2">
                    <strong>질문: {faq.question_ko}</strong>
                    <FAQAudienceBadge audience={faq.audience} />
                  </div>
                  <div className="flex flex-col">
                    <div className="mb-1 text-sm text-ink-2">
                      <strong>주요 카테고리:</strong> {faq.maincategory_ko}
                    </div>
                    <div className="mb-1 text-sm text-ink-2">
                      <strong>하위 카테고리:</strong> {faq.subcategory_ko}
                    </div>
                    <div className="mb-1 text-sm text-ink-2">
                      <strong>관리자:</strong> {faq.manager}
                    </div>
                  </div>
                </div>
                <CardFooter onMore={() => navigate(`/faqs/${faq.faq_id}`)}>
                  <button onClick={() => navigate(`/faqs/update/${faq.faq_id}`)} className="bg-accent text-white px-4 py-2 rounded-xl hover:bg-accent/90">
                    수정
                  </button>
                  <FAQDelete faq_id={String(faq.faq_id)} question_ko={faq.question_ko} onSuccess={() => window.location.reload()} />
                </CardFooter>
              </div>
            ))}
          </div>
        </div>
          {total === 0 && <p className="py-16 text-center text-sm text-ink-3">{filter ? '검색어에 맞는 FAQ가 없어요' : '아직 FAQ가 없어요'}</p>}
          <ListEnd hasMore={hasMore} total={total} sentinelRef={sentinelRef} />
      </div>
    </div>
  );
};

export default FAQMainForm;
