import React, { useState, useEffect } from "react";
import { useHobitQueryGetApi } from "../../hooks/hobitAdmin";
import { CompareFAQLogRequest, CompareFAQLogResponse } from "../../types/adminLog";
import FAQLogDetailForm from "./FAQLogDetailForm";

interface FAQLogDetailProps {
  faq_log_id: string;
}

const FAQLogDetail: React.FC<FAQLogDetailProps> = ({ faq_log_id }) => {
  const [prev_faq, setPrevFaq] = useState<CompareFAQLogResponse["data"]["prev_faq"]>({
    maincategory_ko: '',
    maincategory_en: '',
    subcategory_ko: '',
    subcategory_en: '',
    question_ko: '',
    question_en: '',
    answer_ko: [{ answer: '', url: '', email: '', phone: '' }],
    answer_en: [{ answer: '', url: '', email: '', phone: '' }],
    manager: '',
  });

  const [new_faq, setNewFaq] = useState<CompareFAQLogResponse["data"]["new_faq"]>({
    maincategory_ko: '',
    maincategory_en: '',
    subcategory_ko: '',
    subcategory_en: '',
    question_ko: '',
    question_en: '',
    answer_ko: [{ answer: '', url: '', email: '', phone: '' }],
    answer_en: [{ answer: '', url: '', email: '', phone: '' }],
    manager: '',
  });

  const FAQCompareApi = useHobitQueryGetApi<CompareFAQLogRequest, CompareFAQLogResponse>("adminlogs/faqlogs/compare", {
    params: { faq_log_id },
  });

  useEffect(() => {
    const fetchFAQLog = async () => {
      if (FAQCompareApi.data?.payload?.statusCode === 200) {
        const { prev_faq, new_faq } = FAQCompareApi.data?.payload?.data;
        setPrevFaq(prev_faq);
        setNewFaq(new_faq);
      } else {
        alert("FAQ Log 데이터를 불러오는 데 실패했습니다.");
        console.log("FAQ Log 데이터를 불러오는 데 실패했습니다.", FAQCompareApi.error);
      }
    };
    if (FAQCompareApi.isSuccess && FAQCompareApi.data) {
      fetchFAQLog();
    }
  }, [FAQCompareApi.isSuccess, FAQCompareApi.data]);

  return <FAQLogDetailForm prev_faq={prev_faq} new_faq={new_faq} />;
};

export default FAQLogDetail;