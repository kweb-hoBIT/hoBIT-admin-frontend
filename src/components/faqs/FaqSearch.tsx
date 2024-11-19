import React, { useState } from "react";
import InputField from "../InputField";
import FaqSearchModal from "./FaqSearchModal";
import FaqFilter from "./FaqFilter";

const FaqSearch: React.FC = () => {
    const [searching, setSearching] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({
        searching: '',
        id: '',
        mainCategory: '',
        subCategory: '',
        manager: ''
    });

    return (
        <div className="search_back" style={{ position: 'relative' }}>
            <div className="search">
                <div className="search_inner">
                    <div className="detail_btn" style={{ position: 'relative', display: 'inline-block' }}>
                        <span onClick={() => setIsModalOpen(true)}>필터 열기</span>
                    </div>
                    <InputField
                        id='search_box'
                        label="검색어"
                        type="text"
                        value={searching}
                        onChange={(e) => setSearching(e.target.value)}
                        placeholder="search for faqs"
                        className="search_box"
                    />
                </div>
            </div>

            <FaqFilter
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                filter={filter}
                setFilter={setFilter}
                searching={searching}
            />
            
            <FaqSearchModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen} 
                filter={filter}
                setFilter={setFilter}
                />
        </div>
    );
}

export default FaqSearch;
