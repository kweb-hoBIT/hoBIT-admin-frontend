import React from 'react';
import { CompareSeniorFAQLogResponse } from "../../types/adminLog";

interface SeniorFAQLogDetailFormProps {
  prev_senior_faq: CompareSeniorFAQLogResponse["data"]["prev_senior_faq"];
  new_senior_faq: CompareSeniorFAQLogResponse["data"]["new_senior_faq"];
}

const SeniorFAQLogDetailForm: React.FC<SeniorFAQLogDetailFormProps> = ({
  prev_senior_faq,
  new_senior_faq,
}) => {
  // 빈 객체를 넣는 대신 빈 문자열로 초기화
  const prevAnswersKo = prev_senior_faq.answer_ko.length > 0 ? prev_senior_faq.answer_ko : [{ title: '', answer: '', url: '', map: { latitude: '', longitude: '' } }];
  const prevAnswersEn = prev_senior_faq.answer_en.length > 0 ? prev_senior_faq.answer_en : [{ title: '', answer: '', url: '', map: { latitude: '', longitude: '' } }];
  const newAnswersKo = new_senior_faq.answer_ko.length > 0 ? new_senior_faq.answer_ko : [{ title: '', answer: '', url: '', map: { latitude: '', longitude: '' } }];
  const newAnswersEn = new_senior_faq.answer_en.length > 0 ? new_senior_faq.answer_en : [{ title: '', answer: '', url: '', map: { latitude: '', longitude: '' } }];

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
      <h2 className="text-2xl font-bold text-gray-800 text-center">Senior FAQ 로그 상세</h2>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Side: prev_senior_faq */}
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
          <h3 className="text-xl font-bold text-gray-800">기존 Senior FAQ</h3>

          {/* 카테고리 및 상세카테고리 필드 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">카테고리 (한글)</label>
            <input
              type="text"
              value={prev_senior_faq.maincategory_ko}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_senior_faq.maincategory_ko, new_senior_faq.maincategory_ko, 0)} text-black-500`}
            />
            <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Category (English)</label>
            <input
              type="text"
              value={prev_senior_faq.maincategory_en}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_senior_faq.maincategory_en, new_senior_faq.maincategory_en, 0)} text-black-500`}
            />
          </div>

          {/* 서브카테고리 필드 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">서브카테고리 (한글)</label>
            <input
              type="text"
              value={prev_senior_faq.subcategory_ko}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_senior_faq.subcategory_ko, new_senior_faq.subcategory_ko, 0)} text-black-500`}
            />
            <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Subcategory (English)</label>
            <input
              type="text"
              value={prev_senior_faq.subcategory_en}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_senior_faq.subcategory_en, new_senior_faq.subcategory_en, 0)} text-black-500`}
            />
          </div>

          {/* 상세카테고리 필드 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">상세카테고리 (한글)</label>
            <input
              type="text"
              value={prev_senior_faq.detailcategory_ko}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_senior_faq.detailcategory_ko, new_senior_faq.detailcategory_ko, 0)} text-black-500`}
            />
            <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Detail Category (English)</label>
            <input
              type="text"
              value={prev_senior_faq.detailcategory_en}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_senior_faq.detailcategory_en, new_senior_faq.detailcategory_en, 0)} text-black-500`}
            />
          </div>

          {/* FAQ 답변 */}
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
            <h3 className="text-xl font-bold text-gray-800">FAQ 답변</h3>
            {prevAnswersKo.map((answer, index) => {
              const answerEn = prevAnswersEn[index] || { title: '', answer: '', url: '', map: { latitude: '', longitude: '' } };
              return (
                <div key={index} className="p-4 border border-gray-300 rounded-lg bg-white space-y-2">
                  <input
                    type="text"
                    value={answer.title || ''}
                    readOnly
                    className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(answer.title, newAnswersKo[index]?.title || '', 0)} text-black-500 mb-2`}
                  />          
                  <input
                    type="text"
                    value={answerEn.title || ''}
                    readOnly
                    className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(answerEn.title, newAnswersEn[index]?.title || '', 0)} text-black-500 mb-2`}
                  />
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
                      type="text"
                      value={answer.map.latitude || ''}
                      readOnly
                      className={`w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(answer.map.latitude, newAnswersKo[index]?.map.latitude || '', 0)} text-black-500 mb-2`}
                    />
                    <input
                      type="text"
                      value={answer.map.longitude || ''}
                      readOnly
                      className={`w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(answer.map.longitude, newAnswersKo[index]?.map.longitude || '', 0)} text-black-500 mb-2`}
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
              value={prev_senior_faq.manager}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_senior_faq.manager, new_senior_faq.manager, 0)} text-black-500`}
            />
          </div>
        </div>

        {/* Right Side: new_senior_faq */}
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
          <h3 className="text-xl font-bold text-gray-800">새로운 Senior FAQ</h3>

          {/* 카테고리 및 상세카테고리 필드 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">카테고리 (한글)</label>
            <input
              type="text"
              value={new_senior_faq.maincategory_ko}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_senior_faq.maincategory_ko, new_senior_faq.maincategory_ko, 1)} text-black-500`}
            />
            <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Category (English)</label>
            <input
              type="text"
              value={new_senior_faq.maincategory_en}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_senior_faq.maincategory_en, new_senior_faq.maincategory_en, 1)} text-black-500`}
            />
          </div>

          {/* 서브카테고리 필드 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">서브카테고리 (한글)</label>
            <input
              type="text"
              value={new_senior_faq.subcategory_ko}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_senior_faq.subcategory_ko, new_senior_faq.subcategory_ko, 1)} text-black-500`}
            />
            <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Subcategory (English)</label>
            <input
              type="text"
              value={new_senior_faq.subcategory_en}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_senior_faq.subcategory_en, new_senior_faq.subcategory_en, 1)} text-black-500`}
            />
          </div>

          {/* 상세카테고리 필드 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">상세카테고리 (한글)</label>
            <input
              type="text"
              value={new_senior_faq.detailcategory_ko}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_senior_faq.detailcategory_ko, new_senior_faq.detailcategory_ko, 1)} text-black-500`}
            />
            <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Detail Category (English)</label>
            <input
              type="text"
              value={new_senior_faq.detailcategory_en}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_senior_faq.detailcategory_en, new_senior_faq.detailcategory_en, 1)} text-black-500`}
            />
          </div>

          {/* FAQ 답변 */}
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
            <h3 className="text-xl font-bold text-gray-800">FAQ 답변</h3>
            {newAnswersKo.map((answer, index) => {
              const answerEn = newAnswersEn[index] || { title: '', answer: '', url: '', map: { latitude: '', longitude: '' } };
              return (
                <div key={index} className="p-4 border border-gray-300 rounded-lg bg-white space-y-2">
                  <input
                    type="text"
                    value={answer.title || ''}
                    readOnly
                    className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prevAnswersKo[index]?.title || '', answer.title, 1)} text-black-500 mb-2`}
                  />
                  <input
                    type="text"
                    value={answerEn.title || ''}
                    readOnly
                    className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prevAnswersEn[index]?.title || '', answerEn.title, 1)} text-black-500 mb-2`}
                  />
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
                      type="text"
                      value={answer.map.latitude || ''}
                      readOnly
                      className={`w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prevAnswersKo[index]?.map.latitude || '', answer.map.latitude, 1)} text-black-500 mb-2`}
                    />
                    <input
                      type="text"
                      value={answer.map.longitude || ''}
                      readOnly
                      className={`w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prevAnswersKo[index]?.map.longitude || '', answer.map.longitude, 1)} text-black-500 mb-2`}
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
              value={new_senior_faq.manager}
              readOnly
              className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm ${getColor(prev_senior_faq.manager, new_senior_faq.manager, 1)} text-black-500`}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default SeniorFAQLogDetailForm;

