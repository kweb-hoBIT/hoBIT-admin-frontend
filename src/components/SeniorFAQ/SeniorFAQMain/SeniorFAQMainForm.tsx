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
import { useListCache } from '../../../hooks/listCache';
import { ListEnd, ListHeader, CardMore } from '../../ui/ListKit';
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
  // 상세·수정 화면에 다녀오면 보던 자리로
  const { shown, total, hasMore, sentinelRef, listRef } = useIncremental(
    filteredSeniorFaqs,
    `${selectedFilter}|${filter}|${seniorFaqSortValue}`,
    { restoreFrom: /^\/seniorfaqs\/./ }
  );
  // 지우면 목록에서 바로 빼고 뒤에서 다시 받음 (새로고침하지 않아 보던 자리 그대로)
  const { patch } = useListCache();
  const removeSeniorFaq = (id: number) =>
    patch<GetAllSeniorFAQResponse['data']['seniorFaqs'][number]>('seniorfaqs', 'seniorFaqs', (list) =>
      list.filter((f) => f.senior_faq_id !== id)
    );

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
          <div ref={listRef} className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {shown.map(faq => (
              <div
                key={faq.senior_faq_id}
                ref={revealRef}
                className="relative bg-card-2 p-3.5 sm:p-4 rounded-xl cursor-pointer"
                onClick={() => navigate(`/seniorfaqs/${faq.senior_faq_id}`)}
              >
                <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-2"><strong>세부 카테고리: {faq.detailcategory_ko}</strong></div>
                  <div className="flex flex-col">
                    <div className="mb-0.5 text-sm text-ink-2"><strong>주요 카테고리:</strong> {faq.maincategory_ko}</div>
                    <div className="mb-0.5 text-sm text-ink-2"><strong>하위 카테고리:</strong> {faq.subcategory_ko}</div>
                    <div className="mb-0.5 text-sm text-ink-2"><strong>관리자:</strong> {faq.manager}</div>
                  </div>
                </div>
                {/* 오른쪽: 위는 수정·삭제 아이콘, 아래는 › (예전엔 버튼 줄이 카드 아래 한 줄을 더 차지했음) */}
                <div className="-mr-1.5 -mt-1.5 flex shrink-0 flex-col items-end justify-between self-stretch">
                  <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => navigate(`/seniorfaqs/update/${faq.senior_faq_id}`)}
                      aria-label="수정"
                      title="수정"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors text-ink-2 hover:bg-card hover:text-accent-ink"
                    >
                      <Icon name="pencil" className="h-[18px] w-[18px]" />
                    </button>
                    <SeniorFAQDelete senior_faq_id={String(faq.senior_faq_id)} detailcategory_ko={faq.detailcategory_ko} onSuccess={() => removeSeniorFaq(faq.senior_faq_id)} compact />
                  </div>
                  <span className="pr-1.5"><CardMore /></span>
                </div>
                </div>
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
