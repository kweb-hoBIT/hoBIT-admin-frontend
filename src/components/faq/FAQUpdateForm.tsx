import React from 'react';
import Translate from './Translate';

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
  setMaincategoryKo: React.Dispatch<React.SetStateAction<string>>;
  setMaincategoryEn: React.Dispatch<React.SetStateAction<string>>;
  setSubcategoryKo: React.Dispatch<React.SetStateAction<string>>;
  setSubcategoryEn: React.Dispatch<React.SetStateAction<string>>;
  setQuestionKo: React.Dispatch<React.SetStateAction<string>>;
  setQuestionEn: React.Dispatch<React.SetStateAction<string>>;
  setAnswersKo: React.Dispatch<React.SetStateAction<{ answer: string; url: string; email: string; phone: string }[]>>;
  setAnswersEn: React.Dispatch<React.SetStateAction<{ answer: string; url: string; email: string; phone: string }[]>>;
  setManager: React.Dispatch<React.SetStateAction<string>>;
  handleAddAnswer: () => void;
  handleUpdate: () => void;
  handleDeleteAnswer: (index: number) => void;
}

const FAQUpdateForm: React.FC<FAQUpdateFormProps> = ({
  maincategory_ko,
  maincategory_en,
  subcategory_ko,
  subcategory_en,
  question_ko,
  question_en,
  answersKo,
  answersEn,
  manager,
  setMaincategoryKo,
  setMaincategoryEn,
  setSubcategoryKo,
  setSubcategoryEn,
  setQuestionKo,
  setQuestionEn,
  setAnswersKo,
  setAnswersEn,
  setManager,
  handleAddAnswer,
  handleUpdate,
  handleDeleteAnswer,
}) => {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">FAQ 수정</h2>

      {/* 카테고리 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">카테고리 (한글)</label>
          <input
            type="text"
            value={maincategory_ko}
            onChange={(e) => setMaincategoryKo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="카테고리를 입력하세요"
          />
          <Translate sourceText={maincategory_ko} setTargetText={setMaincategoryEn} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Category (English)</label>
          <input
            type="text"
            value={maincategory_en}
            onChange={(e) => setMaincategoryEn(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter category"
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
            onChange={(e) => setSubcategoryKo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="서브카테고리를 입력하세요"
          />
          <Translate sourceText={subcategory_ko} setTargetText={setSubcategoryEn} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Subcategory (English)</label>
          <input
            type="text"
            value={subcategory_en}
            onChange={(e) => setSubcategoryEn(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter subcategory"
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
            onChange={(e) => setQuestionKo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="질문을 입력하세요"
          />
          <Translate sourceText={question_ko} setTargetText={setQuestionEn} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Question (English)</label>
          <input
            type="text"
            value={question_en}
            onChange={(e) => setQuestionEn(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter question"
          />
        </div>
      </div>

      {/* 답변 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">답변</h3>
        {answersKo.map((answer, index) => (
          <div key={index} className="p-4 border border-gray-300 rounded-lg bg-white space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-lg font-medium text-gray-700 mb-2">답변 (한글)</label>
              <button
                type="button"
                onClick={() => handleDeleteAnswer(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg mb-2 hover:bg-red-600"
              >
                답변 제거
              </button>
            </div>
            <input
              type="text"
              placeholder="답변을 입력하세요"
              value={answer.answer}
              onChange={(e) =>
                setAnswersKo((prev) =>
                  prev.map((ans, i) => (i === index ? { ...ans, answer: e.target.value } : ans))
                )
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <Translate
              sourceText={answer.answer}
              setTargetText={(translatedText) => {
                setAnswersEn((prev) => {
                  const updated = [...prev];
                  updated[index] = { ...updated[index], answer: translatedText };
                  return updated;
                });
              }}
            />
            <label className="block text-lg font-medium text-gray-700 mb-2">Answer (영어)</label>
            <input
              type="text"
              placeholder="Enter Answer"
              value={answersEn[index]?.answer || ''}
              onChange={(e) =>
                setAnswersEn((prev) =>
                  prev.map((ans, i) => (i === index ? { ...ans, answer: e.target.value } : ans))
                )
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="URL"
                value={answer.url}
                onChange={(e) => {
                  setAnswersKo((prev) =>
                    prev.map((ans, i) => (i === index ? { ...ans, url: e.target.value } : ans))
                  );
                  setAnswersEn((prev) =>
                    prev.map((ans, i) => (i === index ? { ...ans, url: e.target.value } : ans))
                  );
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={answer.email}
                onChange={(e) => {
                  setAnswersKo((prev) =>
                    prev.map((ans, i) => (i === index ? { ...ans, email: e.target.value } : ans))
                  );
                  setAnswersEn((prev) =>
                    prev.map((ans, i) => (i === index ? { ...ans, email: e.target.value } : ans))
                  );
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={answer.phone}
                onChange={(e) => {
                  setAnswersKo((prev) =>
                    prev.map((ans, i) => (i === index ? { ...ans, phone: e.target.value } : ans))
                  );
                  setAnswersEn((prev) =>
                    prev.map((ans, i) => (i === index ? { ...ans, phone: e.target.value } : ans))
                  );
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddAnswer}
          className="mt-4 w-full py-2 px-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          답변 추가
        </button>
      </div>

      {/* 관리자 정보 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">관리자 정보</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">관리자</label>
          <input
            type="text"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="관리자 이름을 입력하세요"
          />
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-center">
        <button
          onClick={handleUpdate}
          className="py-2 px-6 text-white bg-green-500 rounded-lg hover:bg-green-600"
        >
          FAQ 수정
        </button>
      </div>
    </form>
  );
};

export default FAQUpdateForm;
