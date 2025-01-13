import React from 'react';
import { CreateFAQRequest } from '../../types/faq';
import Translate from '../Translate/Translate';

interface FAQCreateFormProps {
  newFAQ: CreateFAQRequest['body'];
  setnewFAQ: React.Dispatch<React.SetStateAction<CreateFAQRequest['body']>>;
  handleAddAnswer: () => void;
  handleCreate: () => void;
  handleDeleteAnswer: (index: number) => void;
  isCreating: boolean;
}

const FAQCreateForm: React.FC<FAQCreateFormProps> = ({
  newFAQ,
  setnewFAQ,
  handleAddAnswer,
  handleCreate,
  handleDeleteAnswer,
  isCreating,
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
  } = newFAQ;

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
            onChange={(e) =>
              setnewFAQ({ ...newFAQ, maincategory_ko: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="카테고리를 입력하세요"
          />
          <Translate sourceText={maincategory_ko} setTargetText={(text) => setnewFAQ({ ...newFAQ, maincategory_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Category (English)</label>
          <input
            type="text"
            value={maincategory_en}
            onChange={(e) =>
              setnewFAQ({ ...newFAQ, maincategory_en: e.target.value })
            }
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
            onChange={(e) =>
              setnewFAQ({ ...newFAQ, subcategory_ko: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="서브카테고리를 입력하세요"
          />
          <Translate sourceText={subcategory_ko} setTargetText={(text) => setnewFAQ({ ...newFAQ, subcategory_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Subcategory (English)</label>
          <input
            type="text"
            value={subcategory_en}
            onChange={(e) =>
              setnewFAQ({ ...newFAQ, subcategory_en: e.target.value })
            }
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
            onChange={(e) =>
              setnewFAQ({ ...newFAQ, question_ko: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="질문을 입력하세요"
          />
          <Translate sourceText={question_ko} setTargetText={(text) => setnewFAQ({ ...newFAQ, question_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Question (English)</label>
          <input
            type="text"
            value={question_en}
            onChange={(e) =>
              setnewFAQ({ ...newFAQ, question_en: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter question"
          />
        </div>
      </div>

      {/* 답변 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">답변</h3>
        {answer_ko.map((answer, index) => (
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
                setnewFAQ({
                  ...newFAQ,
                  answer_ko: answer_ko.map((ans, i) =>
                    i === index ? { ...ans, answer: e.target.value } : ans
                  ),
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-y"
              rows={6}
            />
            <Translate
              sourceText={answer.answer}
              setTargetText={(translatedText) => {
                setnewFAQ({
                  ...newFAQ,
                  answer_en: answer_en.map((ans, i) =>
                    i === index ? { ...ans, answer: translatedText } : ans
                  ),
                });
              }}
            />
            <label className="block text-lg font-medium text-gray-700 mb-2">Answer (영어)</label>
            <textarea
              placeholder="Enter Answer"
              value={answer_en[index]?.answer || ''}
              onChange={(e) =>
                setnewFAQ({
                  ...newFAQ,
                  answer_en: answer_en.map((ans, i) =>
                    i === index ? { ...ans, answer: e.target.value } : ans
                  ),
                })
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
                  setnewFAQ({
                    ...newFAQ,
                    answer_ko: answer_ko.map((ans, i) =>
                      i === index ? { ...ans, url: e.target.value } : ans
                    ),
                    answer_en: answer_en.map((ans, i) =>
                      i === index ? { ...ans, url: e.target.value } : ans
                    ),
                  });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Email"
                value={answer.email}
                onChange={(e) => {
                  setnewFAQ({
                    ...newFAQ,
                    answer_ko: answer_ko.map((ans, i) =>
                      i === index ? { ...ans, email: e.target.value } : ans
                    ),
                    answer_en: answer_en.map((ans, i) =>
                      i === index ? { ...ans, email: e.target.value } : ans
                    ),
                  });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Phone"
                value={answer.phone}
                onChange={(e) => {
                  setnewFAQ({
                    ...newFAQ,
                    answer_ko: answer_ko.map((ans, i) =>
                      i === index ? { ...ans, phone: e.target.value } : ans
                    ),
                    answer_en: answer_en.map((ans, i) =>
                      i === index ? { ...ans, phone: e.target.value } : ans
                    ),
                  });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAnswer}
          className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg mt-4 hover:bg-blue-600"
        >
          답변 추가
        </button>
      </div>

      {/* 관리자 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">관리자</h3>
        <label className="block text-lg font-medium text-gray-700 mb-2">관리자 이름</label>
        <input
          type="text"
          value={manager}
          onChange={(e) =>
            setnewFAQ({ ...newFAQ, manager: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="관리자 이름을 입력하세요"
        />
      </div>

      {/* 생성버튼 */}
      <div className="flex justify-center">
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className={`py-3 px-6 rounded-lg ${
            isCreating
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isCreating ? '추가 중...' : '추가'}
        </button>
      </div>
    </form>
  );
};

export default FAQCreateForm;
