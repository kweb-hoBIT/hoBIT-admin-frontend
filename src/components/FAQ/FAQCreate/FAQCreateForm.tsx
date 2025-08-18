import React, { useState } from 'react';
import { CreateFAQRequest, GetAllFAQCategoryResponse } from '../../../types/faq';
import Translate from '../../Translate/Translate';
import FAQPreview from '../FAQPreviewProps';

interface FAQCreateFormProps {
  newFAQ: CreateFAQRequest['body'];
  setNewFAQ: React.Dispatch<React.SetStateAction<CreateFAQRequest['body']>>;
  category: GetAllFAQCategoryResponse['data']['categories'];
  findFilterIndex: (key: string, value: string) => void;
  handleAddAnswer: () => void;
  handleCreate: () => void;
  handleDeleteAnswer: (index: number) => void;
  isCreating: boolean;
  emailList: string[];
  phoneList: string[];
  managerList: string[];
}

const FAQCreateForm: React.FC<FAQCreateFormProps> = ({
  newFAQ,
  setNewFAQ,
  category,
  findFilterIndex,
  handleAddAnswer,
  handleCreate,
  handleDeleteAnswer,
  isCreating,
  emailList,
  phoneList,
  managerList,
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

  const [isMainCateogoryKoInputFocused, setIsMainCateogoryKoInputInputFocused] = useState(false);
  const [isMainCateogoryEnInputFocused, setIsMainCateogoryEnInputInputFocused] = useState(false);
  const [isSubCateogoryKoInputFocused, setIsSubCateogoryKoInputInputFocused] = useState(false);
  const [isSubCateogoryEnInputFocused, setIsSubCateogoryEnInputInputFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isManagerFocused, setIsManagerFocused] = useState(false);



  const getSubcategories = (maincategory: string, lang: 'ko' | 'en') => {
    const selectedCategory = category.find(cat =>
      lang === 'ko' ? cat.maincategory_ko === maincategory : cat.maincategory_en === maincategory
    );
  
    return selectedCategory 
      ? selectedCategory.subcategories 
      : { subcategory_ko: [], subcategory_en: [] };
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">FAQ 생성</h2>

      {/*메인카테고리 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">주요카테고리</h3>
        <div className="relative">
          <label className="block text-lg font-medium text-gray-700 mb-2">주요카테고리 (한글)</label>
          <div>
            <input
              type="text"
              value={maincategory_ko || ''}
              onChange={(e) =>
                setNewFAQ({ ...newFAQ, maincategory_ko: e.target.value })
              }
              onFocus={() => setIsMainCateogoryKoInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsMainCateogoryKoInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="주요카테고리를 입력하세요"
            />
            {isMainCateogoryKoInputFocused && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {category.flatMap(cat => cat.maincategory_ko).filter(cat => cat.includes(maincategory_ko)).map((cat) => (
                  <li
                    key={cat}
                    onClick={() => {
                      findFilterIndex('maincategory_ko', cat);
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
          <Translate sourceText={maincategory_ko} setTargetText={(text) => setNewFAQ({ ...newFAQ, maincategory_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">MainCategory (English)</label>
          <div>
            <input
              type="text"
              value={maincategory_en || ''}
              onChange={(e) =>
                setNewFAQ({ ...newFAQ, maincategory_en: e.target.value })
              }
              onFocus={() => setIsMainCateogoryEnInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsMainCateogoryEnInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter maincategory"
            />
            {isMainCateogoryEnInputFocused && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {category.flatMap(cat => cat.maincategory_en).filter(cat => cat.includes(maincategory_en)).map((cat) => (
                  <li
                    key={cat}
                    onClick={() => {
                      findFilterIndex('maincategory_en', cat);
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
        <h3 className="text-xl font-bold text-gray-800">하위카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">하위카테고리 (한글)</label>
          <div>
            <input
              type="text"
              value={subcategory_ko || ''}
              onChange={(e) =>
                setNewFAQ({ ...newFAQ, subcategory_ko: e.target.value })
              }
              onFocus={() => setIsSubCateogoryKoInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsSubCateogoryKoInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="하위카테고리를 입력하세요"
              disabled={!maincategory_ko}
            />
            {isSubCateogoryKoInputFocused && maincategory_ko && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {getSubcategories(maincategory_ko, 'ko').subcategory_ko.filter(subcategory => subcategory.includes(subcategory_ko)).map((subcategory) => (
                  <li
                    key={`${maincategory_ko}-${subcategory}`}
                    onClick={() => {
                      findFilterIndex('subcategory_ko', subcategory);
                      setIsSubCateogoryKoInputInputFocused(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {subcategory}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Translate sourceText={subcategory_ko || ''} setTargetText={(text) => setNewFAQ({ ...newFAQ, subcategory_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Subcategory (English)</label>
          <div>
            <input
              type="text"
              value={subcategory_en}
              onChange={(e) =>
                setNewFAQ({ ...newFAQ, subcategory_en: e.target.value })
              }
              onFocus={() => setIsSubCateogoryEnInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsSubCateogoryEnInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter subcategory"
              disabled={!maincategory_ko}
            />
            {isSubCateogoryEnInputFocused && maincategory_ko && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {getSubcategories(maincategory_en, 'en').subcategory_en.filter(subcategory => subcategory.includes(subcategory_en)).map((subcategory) => (
                  <li
                    key={`${maincategory_en}-${subcategory}`}
                    onClick={() => {
                      findFilterIndex('subcategory_en', subcategory);
                      setIsSubCateogoryEnInputInputFocused(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {subcategory}
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
              setNewFAQ({ ...newFAQ, question_ko: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="질문을 입력하세요"
          />
          <Translate sourceText={question_ko} setTargetText={(text) => setNewFAQ({ ...newFAQ, question_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Question (English)</label>
          <input
            type="text"
            value={question_en}
            onChange={(e) =>
              setNewFAQ({ ...newFAQ, question_en: e.target.value })
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
                setNewFAQ({
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
                setNewFAQ({
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
                setNewFAQ({
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
                  setNewFAQ({
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
              <div className="relative">
                <input
                  type="text"
                  value={answer.email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewFAQ({
                      ...newFAQ,
                      answer_ko: answer_ko.map((ans, i) =>
                        i === index ? { ...ans, email: val } : ans
                      ),
                      answer_en: answer_en.map((ans, i) =>
                        i === index ? { ...ans, email: val } : ans
                      ),
                    });
                  }}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setTimeout(() => setIsEmailFocused(false), 100)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email"
                />
                {isEmailFocused && (
                  <ul className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                    {emailList
                      .filter((email) => email.includes(answer.email))
                      .map((email) => (
                        <li
                          key={email}
                          onClick={() => {
                            setNewFAQ({
                              ...newFAQ,
                              answer_ko: answer_ko.map((ans, i) =>
                                i === index ? { ...ans, email } : ans
                              ),
                              answer_en: answer_en.map((ans, i) =>
                                i === index ? { ...ans, email } : ans
                              ),
                            });
                            setIsEmailFocused(false);
                          }}
                          className="p-2 cursor-pointer hover:bg-indigo-100"
                        >
                          {email}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={answer.phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewFAQ({
                      ...newFAQ,
                      answer_ko: answer_ko.map((ans, i) =>
                        i === index ? { ...ans, phone: val } : ans
                      ),
                      answer_en: answer_en.map((ans, i) =>
                        i === index ? { ...ans, phone: val } : ans
                      ),
                    });
                  }}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setTimeout(() => setIsPhoneFocused(false), 100)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Phone"
                />
                {isPhoneFocused && (
                  <ul className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                    {phoneList
                      .filter((phone) => phone.includes(answer.phone))
                      .map((phone) => (
                        <li
                          key={phone}
                          onClick={() => {
                            setNewFAQ({
                              ...newFAQ,
                              answer_ko: answer_ko.map((ans, i) =>
                                i === index ? { ...ans, phone } : ans
                              ),
                              answer_en: answer_en.map((ans, i) =>
                                i === index ? { ...ans, phone } : ans
                              ),
                            });
                            setIsPhoneFocused(false);
                          }}
                          className="p-2 cursor-pointer hover:bg-indigo-100"
                        >
                          {phone}
                        </li>
                      ))}
                  </ul>
                )}
              </div>


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
        <div className="relative">
          <input
            type="text"
            value={manager}
            onChange={(e) =>
              setNewFAQ({ ...newFAQ, manager: e.target.value })
            }
            onFocus={() => setIsManagerFocused(true)}
            onBlur={() => setTimeout(() => setIsManagerFocused(false), 100)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="관리자 이름을 입력하세요"
          />
          {isManagerFocused && (
            <ul className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
              {managerList
                .filter((name) => name.includes(manager))
                .map((name) => (
                  <li
                    key={name}
                    onClick={() => {
                      setNewFAQ({ ...newFAQ, manager: name });
                      setIsManagerFocused(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {name}
                  </li>
                ))}
            </ul>
          )}
        </div>
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
