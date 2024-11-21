import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Header from '../components/Header';
import React, { useState } from "react";

import FaqSearch from '../components/faqs/FaqPageForm1';
import FaqSearchModal from '../components/faqs/FaqPage1';
import FaqFilter from '../components/faqs/FaqPage2';
import FaqMain from '../components/faqs/FaqPageForm2';
import ProtectedPage from '../components/ProtectedPage';

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
      <ProtectedPage>
        <Header />
        <main>
          <h1 className="text-xl font-bold mb-4">FAQ 검색</h1>
          <FaqSearch />
          <FaqSearchModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            filter={filter}
            setFilter={setFilter}
          />
        </main>
      </ProtectedPage>
    </div>
  );
};

export default FAQsPage;
