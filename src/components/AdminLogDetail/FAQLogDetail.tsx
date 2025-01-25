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
    if (!FAQCompareApi.isLoading && FAQCompareApi.data?.payload?.statusCode === 200) {
      const data = FAQCompareApi.data.payload.data;
      setPrevFaq({
        ...data.prev_faq,
        answer_ko: Array.isArray(data.prev_faq.answer_ko) ? data.prev_faq.answer_ko : [],
        answer_en: Array.isArray(data.prev_faq.answer_en) ? data.prev_faq.answer_en : [],
      });
      setNewFaq({
        ...data.new_faq,
        answer_ko: Array.isArray(data.new_faq.answer_ko) ? data.new_faq.answer_ko : [],
        answer_en: Array.isArray(data.new_faq.answer_en) ? data.new_faq.answer_en : [],
      });
    }
  }, [FAQCompareApi.isLoading, FAQCompareApi.data]);

  return <FAQLogDetailForm prev_faq={prev_faq} new_faq={new_faq} />;
};

export default FAQLogDetail;