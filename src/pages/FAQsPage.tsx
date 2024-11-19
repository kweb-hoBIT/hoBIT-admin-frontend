import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Header from '../components/Header';
import React, { useState } from "react";

import FaqTitle from '../components/faqs/FaqTitle'
import FaqSearch from '../components/faqs/FaqSearch';
import FaqSearchModal from '../components/faqs/FaqSearchModal';
import FaqFilter from '../components/faqs/FaqFilter';
import FaqMain from '../components/faqs/FaqMain';

const FAQsPage: React.FC = () => {
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);
  const [faqs, setFaqs] = useState<any[]>([]); 
  const [searching, setSearching] = useState<string>(""); 
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 
  const [filter, setFilter] = useState({
    searching: '',
    id: '',
    mainCategory: '',
    subCategory: '',
    manager: ''
  }); 
  
  const filteredFaqs = faqs.filter(faq => 
    faq.question_ko.includes(filter.searching) && 
    faq.maincategory_ko.includes(filter.mainCategory) &&
    faq.subcategory_ko.includes(filter.subCategory) &&
    faq.manager.includes(filter.manager)
  );

  return (
    <div>
      <Header />
      <main>
        <FaqTitle />
        <FaqSearch/>
        <FaqSearchModal 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
          filter={filter} 
          setFilter={setFilter} 
        />
        { /* 왜 이것 없이도 작동하는지는 모름
        <FaqFilter 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen}
          filter={filter}
          setFilter={setFilter}
          searching={searching}
        />
        <FaqMain 
          faqs={filteredFaqs} 
          itemPerPage={6}
          totalPage={Math.ceil(filteredFaqs.length / 6)} // 필터링된 데이터에 따른 총 페이지 수
          setFaqs={setFaqs}
        />
        */ }
      </main>
    </div>
  );
};

export default FAQsPage;
