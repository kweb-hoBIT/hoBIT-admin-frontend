import React from 'react';

interface FAQDetailFormProps {
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

const FAQDetailForm: React.FC<FAQDetailFormProps> = ({
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
    <form onSubmit={(e) => e.preventDefault()} className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center">FAQ 상세</h2>

      {/* 카테고리 및 질문 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">카테고리 (한글)</label>
          <input
            type="text"
            value={maincategory_ko}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500"
          />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Category (English)</label>
          <input
            type="text"
            value={maincategory_en}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500"
          />
        </div>
      </div>

      {/* 서브카테고리 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">서브카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">서브카테고리 (한글)</label>
          <input
            type="text"
            value={subcategory_ko}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500"
          />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Subcategory (English)</label>
          <input
            type="text"
            value={subcategory_en}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500"
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
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500"
          />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Question (English)</label>
          <input
            type="text"
            value={question_en}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500"
          />
        </div>
      </div>

            {/* 번갈아가며 답변 필드 */}
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">FAQ 답변</h3>
        {answersKo.map((answer, index) => {
          const answerEn = answersEn[index] || {};
          return (
            <div key={index} className="p-4 border border-gray-300 rounded-lg bg-white space-y-2">
              {/* 한글 답변 */}
              <input
                type="text"
                placeholder="답변"
                value={answer.answer}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500 mb-2"
              />
              {/* 영어 답변 */}
              <input
                type="text"
                placeholder="Answer"
                value={answerEn.answer || ''}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500 mb-2"
              />

              {/* 공통 필드 (URL, 이메일, 전화번호) */}
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="URL"
                  value={answer.url}
                  readOnly
                  className="w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500 mb-2"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={answer.email}
                  readOnly
                  className="w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500 mb-2"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={answer.phone}
                  readOnly
                  className="w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500 mb-2"
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
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500"
          />
        </div>
      </div>
    </form>
  );
};

export default FAQDetailForm;
