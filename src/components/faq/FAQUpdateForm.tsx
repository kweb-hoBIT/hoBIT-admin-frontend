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
}) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg">
      {/* 카테고리 및 질문 필드 */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">카테고리 (한글)</label>
        <input
          type="text"
          value={maincategory_ko}
          onChange={(e) => setMaincategoryKo(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base"
          placeholder="카테고리를 입력하세요"
        />
        <Translate sourceText={maincategory_ko} setTargetText={setMaincategoryEn} />
        <label className="block text-lg font-semibold mb-2 mt-4">Category (English)</label>
        <input
          type="text"
          value={maincategory_en}
          onChange={(e) => setMaincategoryEn(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base"
          placeholder="Enter category"
        />
      </div>

      {/* 서브카테고리 필드 */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">서브카테고리 (한글)</label>
        <input
          type="text"
          value={subcategory_ko}
          onChange={(e) => setSubcategoryKo(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base"
          placeholder="서브카테고리를 입력하세요"
        />
        <Translate sourceText={subcategory_ko} setTargetText={setSubcategoryEn} />
        <label className="block text-lg font-semibold mb-2 mt-4">Subcategory (English)</label>
        <input
          type="text"
          value={subcategory_en}
          onChange={(e) => setSubcategoryEn(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base"
          placeholder="Enter subcategory"
        />
      </div>

      {/* 질문 필드 */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">질문 (한글)</label>
        <input
          type="text"
          value={question_ko}
          onChange={(e) => setQuestionKo(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base"
          placeholder="질문을 입력하세요"
        />
        <Translate sourceText={question_ko} setTargetText={setQuestionEn} />
        <label className="block text-lg font-semibold mb-2 mt-4">Question (English)</label>
        <input
          type="text"
          value={question_en}
          onChange={(e) => setQuestionEn(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base"
          placeholder="Enter question"
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
                onChange={(e) =>
                  setAnswersKo((prev) =>
                    prev.map((ans, i) =>
                      i === index ? { ...ans, answer: e.target.value } : ans
                    )
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base mb-2"
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
              {/* 영어 답변 */}
              <input
                type="text"
                placeholder="Answer"
                value={answerEn.answer || ''}
                onChange={(e) =>
                  setAnswersEn((prev) =>
                    prev.map((ans, i) =>
                      i === index ? { ...ans, answer: e.target.value } : ans
                    )
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base mb-2"
              />

              {/* 공통 필드 (URL, 이메일, 전화번호) */}
              <input
                type="text"
                placeholder="URL"
                value={answer.url}
                onChange={(e) => {
                  setAnswersKo((prev) =>
                    prev.map((ans, i) =>
                      i === index ? { ...ans, url: e.target.value } : ans
                    )
                  );
                  setAnswersEn((prev) =>
                    prev.map((ans, i) =>
                      i === index ? { ...ans, url: e.target.value } : ans
                    )
                  );
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base mb-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={answer.email}
                onChange={(e) => {
                  setAnswersKo((prev) =>
                    prev.map((ans, i) =>
                      i === index ? { ...ans, email: e.target.value } : ans
                    )
                  );
                  setAnswersEn((prev) =>
                    prev.map((ans, i) =>
                      i === index ? { ...ans, email: e.target.value } : ans
                    )
                  );
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base mb-2"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={answer.phone}
                onChange={(e) => {
                  setAnswersKo((prev) =>
                    prev.map((ans, i) =>
                      i === index ? { ...ans, phone: e.target.value } : ans
                    )
                  );
                  setAnswersEn((prev) =>
                    prev.map((ans, i) =>
                      i === index ? { ...ans, phone: e.target.value } : ans
                    )
                  );
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base mb-2"
              />
            </div>
          );
        })}
      </div>

      {/* 추가 버튼 */}
      <div className="flex justify-between mb-6">
        <button
          type="button"
          onClick={handleAddAnswer}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Answer
        </button>
      </div>

      {/* 관리자 필드 */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">관리자 이름</label>
        <input
          type="text"
          value={manager}
          onChange={(e) => setManager(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base"
          placeholder="관리자 이름을 입력하세요"
        />
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-between">
        <button
          type="submit"
          onClick={handleUpdate}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          제출
        </button>
      </div>
    </form>
  );
};

export default FAQUpdateForm;
