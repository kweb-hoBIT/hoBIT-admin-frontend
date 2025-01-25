import React from 'react';
import { CompareFAQLogResponse } from "../../types/adminLog";

interface FAQLogDetailFormProps {
  prev_faq: CompareFAQLogResponse["data"]["prev_faq"];
  new_faq: CompareFAQLogResponse["data"]["new_faq"];
}

const FAQLogDetailForm: React.FC<FAQLogDetailFormProps> = ({
  prev_faq,
  new_faq,
}) => {
  // 빈 객체를 넣는 대신 빈 문자열로 초기화
  const prevAnswersKo = prev_faq.answer_ko.length > 0 ? prev_faq.answer_ko : [{ answer: '', url: '', email: '', phone: '' }];
  const prevAnswersEn = prev_faq.answer_en.length > 0 ? prev_faq.answer_en : [{ answer: '', url: '', email: '', phone: '' }];
  const newAnswersKo = new_faq.answer_ko.length > 0 ? new_faq.answer_ko : [{ answer: '', url: '', email: '', phone: '' }];
  const newAnswersEn = new_faq.answer_en.length > 0 ? new_faq.answer_en : [{ answer: '', url: '', email: '', phone: '' }];

  // 이전 값과 새로운 값이 다를 때 배경색을 다르게 표시
  const getColor = (prevValue: string, newValue: string, order: number) => {
    if (prevValue !== newValue) {
      if (order === 0) {
        return prevValue === '' ? 'bg-gray-100' : 'bg-red-100';
      } else if(order === 1) {
        return newValue === '' ? 'bg-gray-100' : 'bg-green-100';
      }
    }
    return 'bg-gray-100';
  };
  
  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-8xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center">FAQ 로그 상세</h2>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Side: prev_faq */}
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
          <h3 className="text-xl font-bold text-gray-800">기존 FAQ</h3>

          {/* 카테고리 및 질문 필드 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">카테고리 (한글)</label>
            <input
              type="text"
              value={prev_faq.maincategory_ko}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_faq.maincategory_ko, new_faq.maincategory_ko, 0)} text-black-500`}
            />
            <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Category (English)</label>
            <input
              type="text"
              value={prev_faq.maincategory_en}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_faq.maincategory_en, new_faq.maincategory_en, 0)} text-black-500`}
            />
          </div>

          {/* 서브카테고리 필드 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">서브카테고리 (한글)</label>
            <input
              type="text"
              value={prev_faq.subcategory_ko}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_faq.subcategory_ko, new_faq.subcategory_ko, 0)} text-black-500`}
            />
            <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Subcategory (English)</label>
            <input
              type="text"
              value={prev_faq.subcategory_en}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_faq.subcategory_en, new_faq.subcategory_en, 0)} text-black-500`}
            />
          </div>

          {/* 질문 필드 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">질문 (한글)</label>
            <input
              type="text"
              value={prev_faq.question_ko}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_faq.question_ko, new_faq.question_ko, 0)} text-black-500`}
            />
            <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Question (English)</label>
            <input
              type="text"
              value={prev_faq.question_en}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_faq.question_en, new_faq.question_en, 0)} text-black-500`}
            />
          </div>

          {/* FAQ 답변 */}
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
            <h3 className="text-xl font-bold text-gray-800">FAQ 답변</h3>
            {prevAnswersKo.map((answer, index) => {
              const answerEn = prevAnswersEn[index] || { answer: '', url: '', email: '', phone: '' };
              return (
                <div key={index} className="p-4 border border-gray-300 rounded-lg bg-white space-y-2">
                  <textarea
                    value={answer.answer || ''}
                    readOnly
                    className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(answer.answer, newAnswersKo[index]?.answer || '', 0)} text-black-500 mb-2`}
                    rows={6}
                  />
                  <textarea
                    value={answerEn.answer || ''}
                    readOnly
                    className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(answerEn.answer, newAnswersEn[index]?.answer || '', 0)} text-black-500 mb-2`}
                    rows={6}
                  />

                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={answer.url || ''}
                      readOnly
                      className={`w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(answer.url, newAnswersKo[index]?.url || '', 0)} text-black-500 mb-2`}
                    />
                    <input
                      type="email"
                      value={answer.email || ''}
                      readOnly
                      className={`w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(answer.email, newAnswersKo[index]?.email || '', 0)} text-black-500 mb-2`}
                    />
                    <input
                      type="tel"
                      value={answer.phone || ''}
                      readOnly
                      className={`w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(answer.phone, newAnswersKo[index]?.phone || '', 0)} text-black-500 mb-2`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 관리자 정보 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">관리자 이름</label>
            <input
              type="text"
              value={prev_faq.manager}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_faq.manager, new_faq.manager, 0)} text-black-500`}
            />
          </div>
        </div>

        {/* Right Side: new_faq */}
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
          <h3 className="text-xl font-bold text-gray-800">새로운 FAQ</h3>

          {/* 카테고리 및 질문 필드 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">카테고리 (한글)</label>
            <input
              type="text"
              value={new_faq.maincategory_ko}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_faq.maincategory_ko, new_faq.maincategory_ko, 1)} text-black-500`}
            />
            <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Category (English)</label>
            <input
              type="text"
              value={new_faq.maincategory_en}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_faq.maincategory_en, new_faq.maincategory_en, 1)} text-black-500`}
            />
          </div>

          {/* 서브카테고리 필드 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">서브카테고리 (한글)</label>
            <input
              type="text"
              value={new_faq.subcategory_ko}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_faq.subcategory_ko, new_faq.subcategory_ko, 1)} text-black-500`}
            />
            <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Subcategory (English)</label>
            <input
              type="text"
              value={new_faq.subcategory_en}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_faq.subcategory_en, new_faq.subcategory_en, 1)} text-black-500`}
            />
          </div>

          {/* 질문 필드 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">질문 (한글)</label>
            <input
              type="text"
              value={new_faq.question_ko}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_faq.question_ko, new_faq.question_ko, 1)} text-black-500`}
            />
            <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Question (English)</label>
            <input
              type="text"
              value={new_faq.question_en}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_faq.question_en, new_faq.question_en, 1)} text-black-500`}
            />
          </div>

          {/* FAQ 답변 */}
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
            <h3 className="text-xl font-bold text-gray-800">FAQ 답변</h3>
            {newAnswersKo.map((answer, index) => {
              const answerEn = newAnswersEn[index] || { answer: '', url: '', email: '', phone: '' };
              return (
                <div key={index} className="p-4 border border-gray-300 rounded-lg bg-white space-y-2">
                  <textarea
                    value={answer.answer || ''}
                    readOnly
                    className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prevAnswersKo[index]?.answer || '', answer.answer, 1)} text-black-500 mb-2`}
                    rows={6}
                  />
                  <textarea
                    value={answerEn.answer || ''}
                    readOnly
                    className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prevAnswersEn[index]?.answer || '', answerEn.answer, 1)} text-black-500 mb-2`}
                    rows={6}
                  />
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={answer.url || ''}
                      readOnly
                      className={`w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prevAnswersKo[index]?.url || '', answer.url, 1)} text-black-500 mb-2`}
                    />
                    <input
                      type="email"
                      value={answer.email || ''}
                      readOnly
                      className={`w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prevAnswersKo[index]?.email || '', answer.email, 1)} text-black-500 mb-2`}
                    />
                    <input
                      type="tel"
                      value={answer.phone || ''}
                      readOnly
                      className={`w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prevAnswersKo[index]?.phone || '', answer.phone, 1)} text-black-500 mb-2`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 관리자 정보 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">관리자 이름</label>
            <input
              type="text"
              value={new_faq.manager}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_faq.manager, new_faq.manager, 1)} text-black-500`}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default FAQLogDetailForm;