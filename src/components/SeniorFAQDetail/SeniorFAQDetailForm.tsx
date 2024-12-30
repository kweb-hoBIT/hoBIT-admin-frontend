import React from 'react';
import { GetSeniorFAQResponse } from '../../types/seniorfaq';

interface SeniorFAQDetailFormProps {
  seniorFaqData: GetSeniorFAQResponse['data']['seniorFaq'];
}

const SeniorFAQDetailForm: React.FC<SeniorFAQDetailFormProps> = ({
  seniorFaqData,
}) => {
  const {
    maincategory_ko,
    maincategory_en,
    subcategory_ko,
    subcategory_en,
    detailcategory_ko,
    detailcategory_en,
    answer_ko,
    answer_en,
    manager,
  } = seniorFaqData;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center">선배 FAQ 상세</h2>

      {/* 카테고리 및 질문 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">카테고리 (한글)</label>
          <input
            type="text"
            value={maincategory_ko}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500"
          />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Category (English)</label>
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
        <h3 className="text-xl font-bold text-gray-800">서브카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">서브카테고리 (한글)</label>
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

      {/* 세부카테고리 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">세부카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">세부카테고리 (한글)</label>
          <input
            type="text"
            value={detailcategory_ko}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500"
          />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Detailcategory (English)</label>
          <input
            type="text"
            value={detailcategory_en}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500"
          />
        </div>
      </div>

      {/* 답변 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Senior FAQ 답변</h3>
        {answer_ko.map((answer, index) => {
          const answerEn = answer_en[index] || {};
          return (
            <div key={index} className="p-4 border border-gray-300 rounded-lg bg-white space-y-2">
              {/* 한글 답변 제목 */}
              <label className="block text-lg font-medium text-gray-700 mb-2">답변 제목 (한글)</label>
              <input
                type="text"
                placeholder="답변 제목"
                value={answer.title}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500 mb-4"
              />
              
              {/* 영어 답변 제목 */}
              <label className="block text-lg font-medium text-gray-700 mb-2">Answer Title (English)</label>
              <input
                type="text"
                placeholder="Answer Title"
                value={answerEn.title || ''}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500 mb-4"
              />
              
              {/* 한글 답변 */}
              <label className="block text-lg font-medium text-gray-700 mb-2">답변 (한글)</label>
              <textarea
                placeholder="답변"
                value={answer.answer}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500 mb-4"
                rows={6}
              />
              
              {/* 영어 답변 */}
              <label className="block text-lg font-medium text-gray-700 mb-2">Answer (English)</label>
              <textarea
                placeholder="Answer"
                value={answerEn.answer || ''}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500 mb-4"
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

              {/* 추가 필드 (이미지 링크, 지도) */}
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="이미지 링크"
                  value={answer.image}
                  readOnly
                  className="w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500 mb-2"
                />
                <input
                  type="text"
                  placeholder="위도"
                  value={answer.map.latitude}
                  readOnly
                  className="w-1/4 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500 mb-2"
                />
                <input
                  type="text"
                  placeholder="경도"
                  value={answer.map.longitude}
                  readOnly
                  className="w-1/4 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-black-500 mb-2"
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

export default SeniorFAQDetailForm;