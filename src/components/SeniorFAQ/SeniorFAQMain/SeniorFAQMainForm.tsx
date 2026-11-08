import React, { useState, useEffect, useMemo } from 'react';
import { GetAllSeniorFAQResponse } from '../../../types/seniorfaq';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  selectSeniorFAQFilter,
  setSeniorFAQFilterContent,
  setSeniorFAQFilterName,
  setSeniorSortValue,
} from '../../../redux/filterSlice';
import SeniorFAQDelete from './SeniorFAQDelete';
import SeniorFAQFilter from './SeniorFAQFilter';
import SeniorFAQSort, { sortSeniorFAQs } from './SeniorFAQSort';
import FAQExcelButtons from '../../FAQ/FAQExcel/FAQExcelButtons';
import { useChat } from '../../Chat/ChatProvider';
import { useIncremental } from '../../../hooks/useIncremental';
import { ListEnd, ListHeader, CardFooter } from '../../ui/ListKit';
import { revealRef } from '../../ui/motion';
import Icon from '../../ui/Icon';

interface SeniorFAQMainFormProps {
  seniorFaqs: GetAllSeniorFAQResponse['data']['seniorFaqs'];
}

const SeniorFAQMainForm: React.FC<SeniorFAQMainFormProps> = ({ seniorFaqs }) => {
  const { role } = useChat();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { storedFilterContent, storedFilterName } = useSelector((state: RootState) => selectSeniorFAQFilter(state));
  const { storedSortValue } = useSelector((state: RootState) => state.seniorFaqSort);

  const [filter, setFilter] = useState<string>(storedFilterContent);
  const [selectedFilter, setSelectedFilter] = useState<'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager'>(
    storedFilterName
  );
  const [seniorFaqSortValue, setseniorFAQSortValue] = useState<number>(storedSortValue);

  // 검색어·정렬은 다른 화면에 다녀와도 그대로 (redux + localStorage)
  useEffect(() => {
    dispatch(setSeniorFAQFilterContent(filter));
    dispatch(setSeniorFAQFilterName(selectedFilter));
    dispatch(setSeniorSortValue(seniorFaqSortValue));
  }, [dispatch, filter, selectedFilter, seniorFaqSortValue]);

  // 거르기·정렬은 바뀔 때만 다시 계산
  const filteredSeniorFaqs = useMemo(() => {
    const q = filter.toLowerCase();
    const matched = q ? seniorFaqs.filter((faq) => String(faq[selectedFilter] ?? '').toLowerCase().includes(q)) : seniorFaqs;
    return sortSeniorFAQs(matched, seniorFaqSortValue);
  }, [seniorFaqs, filter, selectedFilter, seniorFaqSortValue]);

  // 처음 20개, 내려가면 20개씩 더 — 검색어·정렬이 바뀌면 처음부터
  const { shown, total, hasMore, sentinelRef } = useIncremental(filteredSeniorFaqs, `${selectedFilter}|${filter}|${seniorFaqSortValue}`);

  return (
    <div className="my-6 p-3 sm:p-6 bg-surface rounded-2xl border border-line">
      <SeniorFAQFilter
        seniorFaqs={seniorFaqs}
        filter={filter}
        selectedFilter={selectedFilter}
        onFilterChange={setFilter}
        onSelectedFilterChange={setSelectedFilter}
      />
      <div className="p-3 sm:p-6">
        <ListHeader
          title="선배 FAQ"
          count={total}
          description="학생 화면 선배 모드에 보이는 FAQ예요"
          action={
            <button
              type="button"
              onClick={() => window.location.assign('/seniorfaqs/create')}
              className="inline-flex h-10 items-center gap-1 rounded-xl bg-success px-4 font-semibold text-white hover:bg-success/90"
            >
              <Icon name="plus" />
              추가
            </button>
          }
          left={<SeniorFAQSort sort={seniorFaqSortValue} onSortChange={setseniorFAQSortValue} />}
          // 엑셀 파일 하나에 행정실 FAQ·선배 FAQ·담당자·이메일 — 근로장학생 계정은 선배 FAQ만 다뤄서 숨김
          right={role !== 'senior' ? <FAQExcelButtons /> : undefined}
        />
        <div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {shown.map(faq => (
              <div
                key={faq.senior_faq_id}
                ref={revealRef}
                className="relative bg-card-2 p-4 rounded-xl cursor-pointer"
                onClick={() => navigate(`/seniorfaqs/${faq.senior_faq_id}`)}
              >
                <div>
                  <div className="mb-2"><strong>세부 카테고리: {faq.detailcategory_ko}</strong></div>
                  <div className="flex flex-col">
                    <div className="mb-1 text-sm text-ink-2"><strong>주요 카테고리:</strong> {faq.maincategory_ko}</div>
                    <div className="mb-1 text-sm text-ink-2"><strong>하위 카테고리:</strong> {faq.subcategory_ko}</div>
                    <div className="mb-1 text-sm text-ink-2"><strong>관리자:</strong> {faq.manager}</div>
                  </div>
                </div>
                <CardFooter onMore={() => navigate(`/seniorfaqs/${faq.senior_faq_id}`)}>
                  <button onClick={() => navigate(`/seniorfaqs/update/${faq.senior_faq_id}`)} className="bg-accent text-white px-4 py-2 rounded-xl hover:bg-accent/90">
                    수정
                  </button>
                  <SeniorFAQDelete senior_faq_id={String(faq.senior_faq_id)} detailcategory_ko={faq.detailcategory_ko} onSuccess={() => window.location.reload()} />
                </CardFooter>
              </div>
            ))}
          </div>
        </div>
        {total === 0 && <p className="py-16 text-center text-sm text-ink-3">{filter ? '검색어에 맞는 선배 FAQ가 없어요' : '아직 선배 FAQ가 없어요'}</p>}
        <ListEnd hasMore={hasMore} total={total} sentinelRef={sentinelRef} />
      </div>
    </div>
  );
};

export default SeniorFAQMainForm;
