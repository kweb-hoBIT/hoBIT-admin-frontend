import { GetAllFAQResponse } from "../../../types/faq";
import { useEffect } from "react";

type FAQSortProps = {
    filteredFaqs: GetAllFAQResponse['data']['faqs'];
    sort: number;
    onSortChange: (value: number) => void;
    setFilteredFaqs: (value: GetAllFAQResponse['data']['faqs']) => void;
};

const FAQSort: React.FC<FAQSortProps> = ({ filteredFaqs, sort, onSortChange, setFilteredFaqs }) => {
    const filter = ["created_at", "maincategory_ko", "subcategory_ko", "question_ko"] as const;

    useEffect(() => {
        if (!filteredFaqs.length) return;

        const index = Math.floor(sort / 2);
        const sortField = filter[index] as keyof GetAllFAQResponse['data']['faqs'][number];
        const isAsc = sort % 2 === 0;

        const sortedFaqs = [...filteredFaqs].sort((a, b) => {
            return isAsc
                ? String(a[sortField]).localeCompare(String(b[sortField]), "ko-KR")
                : String(b[sortField]).localeCompare(String(a[sortField]), "ko-KR");
        });

        setFilteredFaqs(sortedFaqs);
    }, [sort]);

    return (
        <div className="px-6">
            <select
                value={sort}
                onChange={(e) => onSortChange(Number(e.target.value))}
                className="p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value={1}>최신순</option>
                <option value={0}>오래된순</option>
                <option value={2}>주요 카테고리(가나다순)</option>
                <option value={3}>주요 카테고리(역순)</option>
                <option value={4}>하위 카테고리(가나다순)</option>
                <option value={5}>하위 카테고리(역순)</option>
                <option value={6}>질문(가나다순)</option>
                <option value={7}>질문(역순)</option>
            </select>
        </div>
    );
};

export default FAQSort;
