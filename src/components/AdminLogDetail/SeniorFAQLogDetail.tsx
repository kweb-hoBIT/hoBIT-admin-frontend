import React, { useState, useEffect } from "react";
import { useHobitQueryGetApi } from "../../hooks/hobitAdmin";
import { CompareSeniorFAQLogRequest, CompareSeniorFAQLogResponse } from "../../types/adminLog";
import SeniorFAQLogDetailForm from "./SeniorFAQLogDetailForm";

interface SeniorFAQLogDetailProps {
  senior_faq_log_id: string;
}

const SeniorFAQLogDetail: React.FC<SeniorFAQLogDetailProps> = ({ senior_faq_log_id }) => {
  const [prev_senior_faq, setPrevSeniorFaq] = useState<CompareSeniorFAQLogResponse["data"]["prev_senior_faq"]>({
    maincategory_ko: '',
    maincategory_en: '',
    subcategory_ko: '',
    subcategory_en: '',
    detailcategory_ko: '',
    detailcategory_en: '',
    answer_ko: [{ title: '', answer: '', url: '', map: { latitude: '', longitude: '' } }],
    answer_en: [{ title: '', answer: '', url: '', map: { latitude: '', longitude: '' } }],
    manager: '',
  });

  const [new_senior_faq, setNewSeniorFaq] = useState<CompareSeniorFAQLogResponse["data"]["new_senior_faq"]>({
    maincategory_ko: '',
    maincategory_en: '',
    subcategory_ko: '',
    subcategory_en: '',
    detailcategory_ko: '',
    detailcategory_en: '',
    answer_ko: [{ title: '', answer: '', url: '', map: { latitude: '', longitude: '' } }],
    answer_en: [{ title: '', answer: '', url: '', map: { latitude: '', longitude: '' } }],
    manager: '',
  });

  const SeniorFAQCompareApi = useHobitQueryGetApi<CompareSeniorFAQLogRequest, CompareSeniorFAQLogResponse>(
    "adminlogs/seniorfaqlogs/compare",
    {
      params: { senior_faq_log_id },
    }
  );

  useEffect(() => {
    if (!SeniorFAQCompareApi.isLoading && SeniorFAQCompareApi.data?.payload?.statusCode === 200) {
      const data = SeniorFAQCompareApi.data.payload.data;
      setPrevSeniorFaq({
        ...data.prev_senior_faq,
        answer_ko: Array.isArray(data.prev_senior_faq.answer_ko) ? data.prev_senior_faq.answer_ko : [],
        answer_en: Array.isArray(data.prev_senior_faq.answer_en) ? data.prev_senior_faq.answer_en : [],
      });
      setNewSeniorFaq({
        ...data.new_senior_faq,
        answer_ko: Array.isArray(data.new_senior_faq.answer_ko) ? data.new_senior_faq.answer_ko : [],
        answer_en: Array.isArray(data.new_senior_faq.answer_en) ? data.new_senior_faq.answer_en : [],
      });
    }
  }, [SeniorFAQCompareApi.isLoading, SeniorFAQCompareApi.data]);

  return <SeniorFAQLogDetailForm prev_senior_faq={prev_senior_faq} new_senior_faq={new_senior_faq} />;
};

export default SeniorFAQLogDetail;
