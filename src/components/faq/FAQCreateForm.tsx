import React, { useState } from 'react';
import Translate from './Translate';

interface FAQCreateFormProps {
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
  handleSubmit: () => void;
  handleDeleteAnswer: (index: number) => void;
}

const FAQCreateForm: React.FC<FAQCreateFormProps> = ({
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
  handleSubmit,
  handleDeleteAnswer,
}) => {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">FAQ 생성</h2>

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
            <textarea
              placeholder="답변을 입력하세요"
              value={answer.answer}
              onChange={(e) =>
                setAnswersKo((prev) =>
                  prev.map((ans, i) => (i === index ? { ...ans, answer: e.target.value } : ans))
                )
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-y"
              rows={6}
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
            <textarea
              placeholder="Enter Answer"
              value={answersEn[index]?.answer || ''}
              onChange={(e) =>
                setAnswersEn((prev) =>
                  prev.map((ans, i) => (i === index ? { ...ans, answer: e.target.value } : ans))
                )
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-y"
              rows={6}
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
                type="text"
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
                type="text"
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
          className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          답변 추가
        </button>
      </div>

      {/* 관리자 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">관리자</h3>
        <input
          type="text"
          value={manager}
          onChange={(e) => setManager(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="관리자명을 입력하세요"
        />
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          제출
        </button>
      </div>
    </form>
  );
};

export default FAQCreateForm;
