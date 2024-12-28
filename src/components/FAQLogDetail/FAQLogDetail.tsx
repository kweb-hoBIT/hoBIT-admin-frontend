import React, { useState, useEffect } from "react";
import { useHobitQueryGetApi } from "../../hooks/hobitAdmin";
import { CompareFAQLogRequest, CompareFAQLogResponse } from "../../types/faqLog";
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

  const FAQCompareApi = useHobitQueryGetApi<CompareFAQLogRequest, CompareFAQLogResponse>("faqlogs/compare", {
    params: { faq_log_id },
    query: {},
  });

  function lcsWords(words1: string[], words2: string[]) {
    const m = words1.length;
    const n = words2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (words1[i - 1] === words2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    return dp;
  }

  function findDiffWords(str1: string, str2: string) {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    const dp = lcsWords(words1, words2);
    let i = words1.length;
    let j = words2.length;
    const changes: { type: string; value: string }[] = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && words1[i - 1] === words2[j - 1]) {
        changes.unshift({ type: "equal", value: words1[i - 1] });
        i--;
        j--;
      } else if (i > 0 && (j === 0 || dp[i - 1][j] >= dp[i][j - 1])) {
        changes.unshift({ type: "remove", value: words1[i - 1] });
        i--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] > dp[i - 1][j])) {
        changes.unshift({ type: "add", value: words2[j - 1] });
        j--;
      }
    }

    return changes;
  }

  function make_compare_html(new_str: string, prev_str: string) {
    const diff = findDiffWords(prev_str, new_str);

    let result = "";
    const add_string = "<mark style='background-color:lightgreen; color: black'>";
    const remove_string = "<mark style='background-color:pink; color: black'>";
    const markEnd = "</mark>";

    let tempBuffer: { type: null | string; value: string[] } = { type: null, value: [] };

    diff.forEach((change, index) => {
      if (tempBuffer.type === change.type) {
        tempBuffer.value.push(change.value);
      } else {
        if (tempBuffer.type === "remove") {
          result += `${remove_string}${tempBuffer.value.join(" ")}${markEnd} `;
        } else if (tempBuffer.type === "add") {
          result += `${add_string}${tempBuffer.value.join(" ")}${markEnd} `;
        } else {
          result += `${tempBuffer.value.join(" ")} `;
        }
        tempBuffer = { type: change.type, value: [change.value] };
      }

      if (index === diff.length - 1) {
        if (tempBuffer.type === "remove") {
          result += `${remove_string}${tempBuffer.value.join(" ")}${markEnd}`;
        } else if (tempBuffer.type === "add") {
          result += `${add_string}${tempBuffer.value.join(" ")}${markEnd}`;
        } else {
          result += `${tempBuffer.value.join(" ")}`;
        }
      }
    });

    return result.trim();
  }

  function make_compare_html_answer(new_arr: any[], prev_arr: any[]) {
    return new_arr.map((newItem, index) => {
      const prevItem = prev_arr[index] || {};
      return {
        ...newItem,
        answer: make_compare_html(newItem.answer || "", prevItem.answer || ""),
        phone: make_compare_html(newItem.phone || "", prevItem.phone || ""),
        url: make_compare_html(newItem.url || "", prevItem.url || ""),
        email: make_compare_html(newItem.email || "", prevItem.email || ""),
      };
    });
  }

  useEffect(() => {
    if (!FAQCompareApi.isLoading && FAQCompareApi.data?.payload?.statusCode === 200) {
      const data = FAQCompareApi.data.payload.data;

      setPrevFaq({
        ...data.prev_faq,
        answer_ko: Array.isArray(data.prev_faq.answer_ko) ? data.prev_faq.answer_ko : [],
        answer_en: Array.isArray(data.prev_faq.answer_en) ? data.prev_faq.answer_en : [],
      });

      (async () => {
        const newAnswerKo = Array.isArray(data.new_faq.answer_ko)
          ? make_compare_html_answer(data.new_faq.answer_ko, data.prev_faq.answer_ko)
          : [];
        const newAnswerEn = Array.isArray(data.new_faq.answer_en)
          ? make_compare_html_answer(data.new_faq.answer_en, data.prev_faq.answer_en)
          : [];
        setNewFaq({
          maincategory_ko: make_compare_html(data.new_faq.maincategory_ko, data.prev_faq.maincategory_ko),
          maincategory_en: make_compare_html(data.new_faq.maincategory_en, data.prev_faq.maincategory_en),
          subcategory_ko: make_compare_html(data.new_faq.subcategory_ko, data.prev_faq.subcategory_ko),
          subcategory_en: make_compare_html(data.new_faq.subcategory_en, data.prev_faq.subcategory_en),
          question_ko: make_compare_html(data.new_faq.question_ko, data.prev_faq.question_ko),
          question_en: make_compare_html(data.new_faq.question_en, data.prev_faq.question_en),
          answer_ko: newAnswerKo,
          answer_en: newAnswerEn,
          manager: make_compare_html(data.new_faq.manager, data.prev_faq.manager),
        });
      })();
    }
  }, [FAQCompareApi.isLoading, FAQCompareApi.data]);

  if (FAQCompareApi.isLoading) {
    return <div>Loading...</div>;
  }

  return <FAQLogDetailForm prev_faq={prev_faq} new_faq={new_faq} />;
};

export default FAQLogDetail;
