import React, { useEffect } from 'react';
import { GetAllSeniorFAQResponse } from '../../types/seniorfaq';

type SeniorFAQSortProps = {
    seniorFaqs: GetAllSeniorFAQResponse['data']['seniorFaqs'];
    sort: number;
    onSortChange: (value: number) => void;
    setOrderedseniorFaqs: (value: GetAllSeniorFAQResponse['data']['seniorFaqs']) => void;
};

const SeniorFAQSort: React.FC<SeniorFAQSortProps> = ({ seniorFaqs, sort, onSortChange, setOrderedseniorFaqs }) => {
    const filter = ["created_at", "maincategory_ko", "subcategory_ko"] as const;

    useEffect(() => {
        if (!seniorFaqs.length) return;

        const index = Math.floor(sort / 2);
        const sortField = filter[index] as keyof GetAllSeniorFAQResponse['data']['seniorFaqs'][number];
        const isAsc = sort % 2 === 0;

        const sortedFaqs = [...seniorFaqs].sort((a, b) => {
            return isAsc
                ? String(a[sortField]).localeCompare(String(b[sortField]), "ko-KR")
                : String(b[sortField]).localeCompare(String(a[sortField]), "ko-KR");
        });

        setOrderedseniorFaqs(sortedFaqs);
    }, [seniorFaqs, sort]);

    return (
        <div className="p-6">
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
            </select>
        </div>
    );
};

export default SeniorFAQSort;
