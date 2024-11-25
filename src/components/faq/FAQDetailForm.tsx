import React from 'react';

interface FAQUpdateFormProps {
  maincategory_ko: string;
  maincategory_en: string;
  subcategory_ko: string;
  subcategory_en: string;
  question_ko: string;
  question_en: string;
  answersKo: { answer: string; url: string; email: string; phone: string }[];
  answersEn: { answer: string; url: string; email: string; phone: string }[];
  manager: string;
}

const FAQDetailForm: React.FC<FAQUpdateFormProps> = ({
  maincategory_ko,
  maincategory_en,
  subcategory_ko,
  subcategory_en,
  question_ko,
  question_en,
  answersKo,
  answersEn,
  manager,
}) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg">
      {/* 카테고리 및 질문 필드 */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">카테고리 (한글)</label>
        <input
          type="text"
          value={maincategory_ko}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base"
        />
        <label className="block text-lg font-semibold mb-2 mt-4">Category (English)</label>
        <input
          type="text"
          value={maincategory_en}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base"
        />
      </div>

      {/* 서브카테고리 필드 */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">서브카테고리 (한글)</label>
        <input
          type="text"
          value={subcategory_ko}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base"
        />
        <label className="block text-lg font-semibold mb-2 mt-4">Subcategory (English)</label>
        <input
          type="text"
          value={subcategory_en}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base"
        />
      </div>

      {/* 질문 필드 */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">질문 (한글)</label>
        <input
          type="text"
          value={question_ko}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base"
        />
        <label className="block text-lg font-semibold mb-2 mt-4">Question (English)</label>
        <input
          type="text"
          value={question_en}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base"
        />
      </div>

      {/* 번갈아가며 답변 필드 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">FAQ Answers</h3>
        {answersKo.map((answer, index) => {
          const answerEn = answersEn[index] || {};
          return (
            <div key={index} className="mb-4">
              {/* 한글 답변 */}
              <input
                type="text"
                placeholder="답변"
                value={answer.answer}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base mb-2"
              />
              {/* 영어 답변 */}
              <input
                type="text"
                placeholder="Answer"
                value={answerEn.answer || ''}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base mb-2"
              />

              {/* 공통 필드 (URL, 이메일, 전화번호) */}
              <input
                type="text"
                placeholder="URL"
                value={answer.url}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base mb-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={answer.email}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base mb-2"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={answer.phone}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base mb-2"
              />
            </div>
          );
        })}
      </div>

      {/* 관리자 필드 */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">관리자 이름</label>
        <input
          type="text"
          value={manager}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base"
        />
      </div>
    </form>
  );
};

export default FAQDetailForm;
