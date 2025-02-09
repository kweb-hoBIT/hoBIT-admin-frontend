import React, {useState} from 'react';
import { UpdateFAQRequest, GetAllFAQCategoryResponse } from '../../types/faq';
import Translate from '../Translate/Translate';
import FAQPreview from '../FAQCreate/FAQPreviewProps';

interface FAQUpdateFormProps {
  updatedFAQ: UpdateFAQRequest['body'];
  setupdatedFAQ: React.Dispatch<React.SetStateAction<UpdateFAQRequest['body']>>;
  category: GetAllFAQCategoryResponse['data']['categories'];
  handleAddAnswer: () => void;
  handleUpdate: () => void;
  handleDeleteAnswer: (index: number) => void;
  isUpdating: boolean;
}

const FAQUpdateForm: React.FC<FAQUpdateFormProps> = ({
  updatedFAQ,
  setupdatedFAQ,
  category,
  handleAddAnswer,
  handleUpdate,
  handleDeleteAnswer,
  isUpdating,
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
  } = updatedFAQ;

  const [isMainCateogoryKoInputFocused, setIsMainCateogoryKoInputInputFocused] = useState(false);
  const [isMainCateogoryEnInputFocused, setIsMainCateogoryEnInputInputFocused] = useState(false);
  const [isSubCateogoryKoInputFocused, setIsSubCateogoryKoInputInputFocused] = useState(false);
  const [isSubCateogoryEnInputFocused, setIsSubCateogoryEnInputInputFocused] = useState(false);

  const getSubcategories = (maincategory: string, lang: 'ko' | 'en') => {
    const selectedCategory = category.find(cat => 
      lang === 'ko' ? cat.maincategory_ko.includes(maincategory) : cat.maincategory_en.includes(maincategory)
    );
    return selectedCategory ? selectedCategory.subcategories : [];
  };


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
          <div>
            <input
              type="text"
              value={maincategory_ko || ''}
              onChange={(e) =>
                setupdatedFAQ({ ...updatedFAQ, maincategory_ko: e.target.value })
              }
              onFocus={() => setIsMainCateogoryKoInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsMainCateogoryKoInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="카테고리를 입력하세요"
            />
            {isMainCateogoryKoInputFocused && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {category.flatMap(cat => cat.maincategory_ko).filter(cat => cat.includes(maincategory_ko)).map((cat) => (
                  <li
                    key={cat}
                    onClick={() => {
                      setupdatedFAQ({ ...updatedFAQ, maincategory_ko: cat });
                      setIsMainCateogoryKoInputInputFocused(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Translate
            sourceText={maincategory_ko}
            setTargetText={(text) =>
              setupdatedFAQ({ ...updatedFAQ, maincategory_en: text })
            }
          />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Category (English)</label>
          <div>
            <input
              type="text"
              value={maincategory_en}
              onChange={(e) =>
                setupdatedFAQ({ ...updatedFAQ, maincategory_en: e.target.value })
              }
              onFocus={() => setIsMainCateogoryEnInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsMainCateogoryEnInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter category"
            />
            {isMainCateogoryEnInputFocused && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {category.flatMap(cat => cat.maincategory_en).filter(cat => cat.includes(maincategory_en)).map((cat) => (
                  <li
                    key={cat}
                    onClick={() => {
                      setupdatedFAQ({ ...updatedFAQ, maincategory_en: cat });
                      setIsMainCateogoryEnInputInputFocused(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 서브카테고리 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">서브카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">서브카테고리 (한글)</label>
          <div>
            <input
              type="text"
              value={subcategory_ko || ''}
              onChange={(e) =>
                setupdatedFAQ({ ...updatedFAQ, subcategory_ko: e.target.value })
              }
              onFocus={() => setIsSubCateogoryKoInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsSubCateogoryKoInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="서브카테고리를 입력하세요"
            />
            {isSubCateogoryKoInputFocused && maincategory_ko && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {getSubcategories(maincategory_ko, 'ko').map((subcategory) => (
                  <li
                    key={subcategory.subcategory_ko.join(',')}
                    onClick={() => {
                      setupdatedFAQ({ ...updatedFAQ, subcategory_ko: subcategory.subcategory_ko.join(',') });
                      setIsSubCateogoryKoInputInputFocused(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {subcategory.subcategory_ko.join(',')}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Translate
            sourceText={subcategory_ko}
            setTargetText={(text) =>
              setupdatedFAQ({ ...updatedFAQ, subcategory_en: text })
            }
          />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Subcategory (English)</label>
          <div>
            <input
              type="text"
              value={subcategory_en}
              onChange={(e) =>
                setupdatedFAQ({ ...updatedFAQ, subcategory_en: e.target.value })
              }
              onFocus={() => setIsSubCateogoryEnInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsSubCateogoryEnInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter subcategory"
            />
            {isSubCateogoryEnInputFocused && maincategory_ko && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {getSubcategories(maincategory_ko, 'ko').map((subcategory) => (
                  <li
                    key={subcategory.subcategory_en.join(',')}
                    onClick={() => {
                      setupdatedFAQ({ ...updatedFAQ, subcategory_en: subcategory.subcategory_en.join(',') });
                      setIsSubCateogoryEnInputInputFocused(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {subcategory.subcategory_en.join(',')}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
              setupdatedFAQ({ ...updatedFAQ, question_ko: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="질문을 입력하세요"
          />
          <Translate
            sourceText={question_ko}
            setTargetText={(text) =>
              setupdatedFAQ({ ...updatedFAQ, question_en: text })
            }
          />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Question (English)</label>
          <input
            type="text"
            value={question_en}
            onChange={(e) =>
              setupdatedFAQ({ ...updatedFAQ, question_en: e.target.value })
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
                setupdatedFAQ({
                  ...updatedFAQ,
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
                setupdatedFAQ({
                  ...updatedFAQ,
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
                setupdatedFAQ({
                  ...updatedFAQ,
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
                  setupdatedFAQ({
                    ...updatedFAQ,
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
                  setupdatedFAQ({
                    ...updatedFAQ,
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
                  setupdatedFAQ({
                    ...updatedFAQ,
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
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleAddAnswer}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            답변 추가
          </button>
        </div>
      </div>

      {/* 관리자 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">관리자</h3>
        <label className="block text-lg font-medium text-gray-700 mb-2">관리자 이름</label>
        <input
          type="text"
          value={manager}
          onChange={(e) =>
            setupdatedFAQ({ ...updatedFAQ, manager: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="관리자 이름을 입력하세요"
        />
      </div>

      <FAQPreview 
        question_ko={question_ko} 
        question_en={question_en} 
        answer_ko={answer_ko} 
        answer_en={answer_en}
        manager={manager}
        maincategory_ko={maincategory_ko}
        maincategory_en={maincategory_en}
        subcategory_ko={subcategory_ko}
        subcategory_en={subcategory_en}
      />

      {/* 업데이트 버튼 */}
      <div className="text-center mt-8">
        <button
          type="button"
          onClick={handleUpdate}
          className={`px-6 py-3 rounded-lg ${
            isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          disabled={isUpdating}
        >
          {isUpdating ? '수정 중...' : '수정'}
        </button>
      </div>
    </form>
  );
};

export default FAQUpdateForm;
