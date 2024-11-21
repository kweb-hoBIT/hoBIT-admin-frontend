import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Header from '../components/Header';
import React, { useState } from "react";

import FaqTitle from '../components/faqs/FaqTitle'
import FaqSearch from '../components/faqs/FaqSearch';
import FaqSearchModal from '../components/faqs/FaqSearchModal';
import FaqFilter from '../components/faqs/FaqFilter';
import FaqMain from '../components/faqs/FaqMain';
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
          <FaqTitle />
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
