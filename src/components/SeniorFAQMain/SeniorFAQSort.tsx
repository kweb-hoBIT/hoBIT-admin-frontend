import React, { useEffect } from 'react';
import { GetAllSeniorFAQResponse } from '../../types/seniorfaq';

type SeniorFAQSortProps = {
    filteredSeniorFaqs: GetAllSeniorFAQResponse['data']['seniorFaqs'];
    sort: number;
    onSortChange: (value: number) => void;
    setFilteredseniorFaqs: (value: GetAllSeniorFAQResponse['data']['seniorFaqs']) => void;
};

const SeniorFAQSort: React.FC<SeniorFAQSortProps> = ({ filteredSeniorFaqs: filteredFaqs, sort, onSortChange, setFilteredseniorFaqs }) => {
    const filter = ["created_at", "maincategory_ko", "subcategory_ko", "detailcategory_ko"] as const;

    useEffect(() => {
        if (!filteredFaqs.length) return;

        const index = Math.floor(sort / 2);
        const sortField = filter[index] as keyof GetAllSeniorFAQResponse['data']['seniorFaqs'][number];
        const isAsc = sort % 2 === 0;

        const sortedFaqs = [...filteredFaqs].sort((a, b) => {
            return isAsc
                ? String(a[sortField]).localeCompare(String(b[sortField]), "ko-KR")
                : String(b[sortField]).localeCompare(String(a[sortField]), "ko-KR");
        });

        setFilteredseniorFaqs(sortedFaqs);
    }, [filteredFaqs, sort]);

    return (
        <div className="px-6">
            <select
                value={sort}
                onChange={(e) => onSortChange(Number(e.target.value))}
                className="p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value={1}>최신순</option>
                <option value={0}>오래된순</option>
                <option value={2}>메인 카테고리(가나다순)</option>
                <option value={3}>메인 카테고리(역순)</option>
                <option value={4}>서브 카테고리(가나다순)</option>
                <option value={5}>서브 카테고리(역순)</option>
                <option value={6}>세부 카테고리(가나다순)</option>
                <option value={7}>세부 카테고리(역순)</option>
            </select>
        </div>
    );
};

export default SeniorFAQSort;
