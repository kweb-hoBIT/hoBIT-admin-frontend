import React, { useState, useEffect } from "react";
import { useHobitQueryGetApi } from "../../../hooks/hobitAdmin";
import { CompareSeniorFAQLogRequest, CompareSeniorFAQLogResponse } from "../../../types/adminLog";
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
    const fetchSeniorFAQLog = async () => {
      if (SeniorFAQCompareApi.data?.payload?.statusCode === 200) {
        const { prev_senior_faq, new_senior_faq } = SeniorFAQCompareApi.data?.payload?.data;
        setPrevSeniorFaq(prev_senior_faq);
        setNewSeniorFaq(new_senior_faq);
      } else {
        alert("Senior FAQ Log 데이터를 불러오는 데 실패했습니다.");
        console.log("Senior FAQ Log 데이터를 불러오는 데 실패했습니다.", SeniorFAQCompareApi.error);
      }
    };
    if (SeniorFAQCompareApi.isSuccess && SeniorFAQCompareApi.data) {
      fetchSeniorFAQLog();
    }
  }, [SeniorFAQCompareApi.isSuccess, SeniorFAQCompareApi.data]);

  if (SeniorFAQCompareApi.isLoading){
    return <div></div>;
  }

  return <SeniorFAQLogDetailForm prev_senior_faq={prev_senior_faq} new_senior_faq={new_senior_faq} />;
};

export default SeniorFAQLogDetail;
