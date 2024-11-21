import React, { useState, useEffect } from "react";
import FaqMain from "./FaqPageForm2";
import { useHobitQueryGetApi } from "../../hooks/hobitAdmin";
import { FaqGetRequest, FaqGetResponse } from "../../types/faq";

interface FaqFilterProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    filter: {
        searching: string;
        id: string;
        mainCategory: string;
        subCategory: string;
        manager: string;
    };
    setFilter: React.Dispatch<React.SetStateAction<any>>;
    searching: string;
}

const FaqFilter: React.FC<FaqFilterProps> = ({ isModalOpen, setIsModalOpen, filter, setFilter, searching }) => {
    const [faqs, setFaqs] = useState<any[]>([]);
    const [sort_option, setSortOption] = useState<'id' | 'latest'>('id');
    
    const faqGetApi = useHobitQueryGetApi<FaqGetRequest, FaqGetResponse>('faqs');

    useEffect(() => {
        async function fetchFAQs() {
            try {
                const response = await faqGetApi();
                const data: any = response.payload?.faq;
                setFaqs(data.faqs);
            } catch (error) {
                console.error('Failed to fetch FAQs:', error);
            }
        }

        fetchFAQs();
    }, []);

    const filteredFAQs = [...faqs]
        .filter((faq) => {
            const matchesSearchTerm =
                String(faq.faq_id).toLowerCase().includes(searching.toLowerCase()) ||
                faq.maincategory_ko.toLowerCase().includes(searching.toLowerCase()) ||
                faq.subcategory_ko.toLowerCase().includes(searching.toLowerCase()) ||
                faq.question_ko.toLowerCase().includes(searching.toLowerCase()) ||
                faq.manager.toLowerCase().includes(searching.toLowerCase());

            const matchesFilter =
                (!filter.mainCategory || faq.maincategory_ko.toLowerCase().includes(filter.mainCategory.toLowerCase())) &&
                (!filter.subCategory || faq.subcategory_ko.toLowerCase().includes(filter.subCategory.toLowerCase())) &&
                (!filter.manager || faq.manager.toLowerCase().includes(filter.manager.toLowerCase())) &&
                (!String(filter.id) || String(faq.faq_id).toLowerCase().includes(filter.id.toLowerCase()));

            if (isModalOpen) {
                return matchesFilter;
            } else {
                return matchesSearchTerm && matchesFilter;
            }
        })
        .sort((a, b) => {
            if (sort_option === 'id') {
                return a.faq_id - b.faq_id;
            } else if (sort_option === 'latest') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            return 0;
        });

    const itemPerPage = 6;
    const totalPage = Math.ceil(filteredFAQs.length / itemPerPage);

    return (
        <div>
            <div className="filter_back" style={{ position: 'relative' }}>
                <div className="filter">
                    <div className="filter_inner">
                        <div className="order_by" style={{ position: 'relative', display: 'inline-block' }}>
                            <label className="order_by_list">
                                <span>∇</span>
                                <select
                                    value={sort_option}
                                    onChange={(e) => setSortOption(e.target.value as 'id' | 'latest')}
                                >
                                    <option value="id">ID</option>
                                    <option value="latest">최신 등록순</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <FaqMain 
                totalPage={totalPage} 
                faqs={filteredFAQs} 
                itemPerPage={itemPerPage} 
                setFaqs={setFaqs}
            />
        </div>
    )
}

export default FaqFilter;
