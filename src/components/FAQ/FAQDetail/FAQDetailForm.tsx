import React from 'react';
import { GetFAQResponse } from '../../../types/faq';

interface FAQDetailFormProps {
  faqData: GetFAQResponse['data']['faq'];
}

const FAQDetailForm: React.FC<FAQDetailFormProps> = ({
  faqData
}) => {
  const {
    maincategory_ko,
    maincategory_en,
    subcategory_ko,
    subcategory_en,
    question_ko,
    question_en,
    answer_ko,
    answer_en,
    manager,
    created_at,
    updated_at
  } = faqData;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
  
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return new Date(dateString).toLocaleString('ko-KR', options);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center">FAQ 상세</h2>

      { /* 생성 및 수정일자 */ }
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">일자</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">생성일</label>
          <input
            type="text"
            value={formatDate(created_at)}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500"
          />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">수정일</label>
          <input
            type="text"
            value={formatDate(updated_at)}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500"
          />
        </div>
      </div>
      
      {/* 카테고리 및 질문 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">주요카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">주요카테고리 (한글)</label>
          <input
            type="text"
            value={maincategory_ko}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500"
          />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">MainCategory (English)</label>
          <input
            type="text"
            value={maincategory_en}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500"
          />
        </div>
      </div>

      {/* 서브카테고리 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">하위카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">하위카테고리 (한글)</label>
          <input
            type="text"
            value={subcategory_ko}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500"
          />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Subcategory (English)</label>
          <input
            type="text"
            value={subcategory_en}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500"
          />
        </div>
      </div>

      {/* 질문 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">질문</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">질문 (한글)</label>
          <input
            type="text"
            value={question_ko}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500"
          />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Question (English)</label>
          <input
            type="text"
            value={question_en}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500"
          />
        </div>
      </div>

      {/* 번갈아가며 답변 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">FAQ 답변</h3>
        {answer_ko.map((answer, index) => {
          const answerEn = answer_en[index] || {};
          return (
            <div key={index} className="p-4 border border-gray-300 rounded-lg bg-white space-y-2">
              {/* 한글 답변 */}
              <label className="block text-lg font-medium text-gray-700 mb-2">답변 (한글)</label>
              <textarea
                placeholder="답변"
                value={answer.answer}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500"
                rows={6}
              />
              {/* 영어 답변 */}
              <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Answer (English)</label>
              <textarea
                placeholder="Answer"
                value={answerEn.answer || ''}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500"
                rows={6}
              />

              {/* 공통 필드 (URL, 이메일, 전화번호) */}
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="URL"
                  value={answer.url}
                  readOnly
                  className="w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500 mb-2"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={answer.email}
                  readOnly
                  className="w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500 mb-2"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={answer.phone}
                  readOnly
                  className="w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500 mb-2"
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 관리자 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">관리자 정보</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">관리자 이름</label>
          <input
            type="text"
            value={manager}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500"
          />
        </div>
      </div>
    </form>
  );
};

export default FAQDetailForm;
