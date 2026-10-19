import React, {useState} from 'react';
import { UpdateFAQRequest, GetAllFAQCategoryResponse } from '../../../types/faq';
import Translate from '../../Translate/Translate';
import FAQPreview from '../FAQPreviewProps';

interface FAQUpdateFormProps {
  updatedFAQ: UpdateFAQRequest['body'];
  setupdatedFAQ: React.Dispatch<React.SetStateAction<UpdateFAQRequest['body']>>;
  category: GetAllFAQCategoryResponse['data']['categories'];
  findFilterIndex: (key: string, value: string) => void;
  handleAddAnswer: () => void;
  handleUpdate: () => void;
  handleDeleteAnswer: (index: number) => void;
  isUpdating: boolean;
  emailList: string[];
  phoneList: string[];
  managerList: string[];
}

const FAQUpdateForm: React.FC<FAQUpdateFormProps> = ({
  updatedFAQ,
  setupdatedFAQ,
  category,
  findFilterIndex,
  handleAddAnswer,
  handleUpdate,
  handleDeleteAnswer,
  isUpdating,
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
  } = updatedFAQ;

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
    return selectedCategory ? selectedCategory.subcategories : [];
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="max-w-4xl mx-auto p-8 bg-surface rounded-xl shadow-lg space-y-8"
    >
      <h2 className="text-2xl font-bold text-ink text-center">FAQ 수정</h2>

      {/* 카테고리 필드 */}
      <div className="p-6 border border-line rounded-xl bg-card space-y-4">
        <h3 className="text-xl font-bold text-ink">주요카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-ink mb-2">주요카테고리 (한글)</label>
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
              className="w-full p-3 border border-line rounded-xl shadow-sm focus:ring-accent-ink/40 focus:border-accent-ink"
              placeholder="주요카테고리를 입력하세요"
            />
            {isMainCateogoryKoInputFocused && (
              <ul className="mt-2 bg-surface border border-line rounded-xl shadow-md max-h-[120px] overflow-y-auto">
                {category.flatMap(cat => cat.maincategory_ko).filter(cat => cat.includes(maincategory_ko)).map((cat) => (
                  <li
                    key={cat}
                    onClick={() => {
                      findFilterIndex('maincategory_ko', cat);
                      setIsMainCateogoryKoInputInputFocused(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-card"
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
          <label className="block text-lg font-medium text-ink mt-4 mb-2">MainCategory (English)</label>
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
              className="w-full p-3 border border-line rounded-xl shadow-sm focus:ring-accent-ink/40 focus:border-accent-ink"
              placeholder="Enter maincategory"
            />
            {isMainCateogoryEnInputFocused && (
              <ul className="mt-2 bg-surface border border-line rounded-xl shadow-md max-h-[120px] overflow-y-auto">
                {category.flatMap(cat => cat.maincategory_en).filter(cat => cat.includes(maincategory_en)).map((cat) => (
                  <li
                    key={cat}
                    onClick={() => {
                      findFilterIndex('maincategory_en', cat);
                      setIsMainCateogoryEnInputInputFocused(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-card"
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
      <div className="p-6 border border-line rounded-xl bg-card space-y-4">
        <h3 className="text-xl font-bold text-ink">하위카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-ink mb-2">하위카테고리 (한글)</label>
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
              className="w-full p-3 border border-line rounded-xl shadow-sm focus:ring-accent-ink/40 focus:border-accent-ink"
              placeholder="하위카테고리를 입력하세요"
              disabled={!maincategory_ko}
            />
            {isSubCateogoryKoInputFocused && maincategory_ko && (
              <ul className="mt-2 bg-surface border border-line rounded-xl shadow-md max-h-[120px] overflow-y-auto">
                {getSubcategories(maincategory_ko, 'ko').filter(sub => sub.subcategory_ko.includes(subcategory_ko)).map((sub) => (
                  <li
                    key={`${maincategory_ko}-${sub.subcategory_ko}`}
                    onClick={() => {
                      findFilterIndex('subcategory_ko', sub.subcategory_ko);
                      setIsSubCateogoryKoInputInputFocused(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-card"
                  >
                    {sub.subcategory_ko}
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
          <label className="block text-lg font-medium text-ink mt-4 mb-2">Subcategory (English)</label>
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
              className="w-full p-3 border border-line rounded-xl shadow-sm focus:ring-accent-ink/40 focus:border-accent-ink"
              placeholder="Enter subcategory"
              disabled={!maincategory_ko}
            />
            {isSubCateogoryEnInputFocused && maincategory_ko && (
              <ul className="mt-2 bg-surface border border-line rounded-xl shadow-md max-h-[120px] overflow-y-auto">
                {getSubcategories(maincategory_en, 'en').filter(sub => sub.subcategory_en.includes(subcategory_en)).map((sub) => (
                  <li
                    key={`${maincategory_en}-${sub.subcategory_en}`}
                    onClick={() => {
                      findFilterIndex('subcategory_en', sub.subcategory_en);
                      setIsSubCateogoryEnInputInputFocused(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-card"
                  >
                    {sub.subcategory_en}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 질문 필드 */}
      <div className="p-6 border border-line rounded-xl bg-card space-y-4">
        <h3 className="text-xl font-bold text-ink">질문</h3>
        <div>
          <label className="block text-lg font-medium text-ink mb-2">질문 (한글)</label>
          <input
            type="text"
            value={question_ko}
            onChange={(e) =>
              setupdatedFAQ({ ...updatedFAQ, question_ko: e.target.value })
            }
            className="w-full p-3 border border-line rounded-xl shadow-sm focus:ring-accent-ink/40 focus:border-accent-ink"
            placeholder="질문을 입력하세요"
          />
          <Translate
            sourceText={question_ko}
            setTargetText={(text) =>
              setupdatedFAQ({ ...updatedFAQ, question_en: text })
            }
          />
          <label className="block text-lg font-medium text-ink mt-4 mb-2">Question (English)</label>
          <input
            type="text"
            value={question_en}
            onChange={(e) =>
              setupdatedFAQ({ ...updatedFAQ, question_en: e.target.value })
            }
            className="w-full p-3 border border-line rounded-xl shadow-sm focus:ring-accent-ink/40 focus:border-accent-ink"
            placeholder="Enter question"
          />
        </div>
      </div>

      {/* 답변 필드 */}
      <div className="p-6 border border-line rounded-xl bg-card space-y-4">
        <h3 className="text-xl font-bold text-ink">답변</h3>
        {answer_ko.map((answer, index) => (
          <div key={index} className="p-4 border border-line rounded-xl bg-surface space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-lg font-medium text-ink mb-2">답변 (한글)</label>
              <button
                type="button"
                onClick={() => handleDeleteAnswer(index)}
                className="bg-danger text-white px-4 py-2 rounded-xl mb-2 hover:bg-danger/90"
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
              className="w-full p-3 border border-line rounded-xl shadow-sm focus:ring-accent-ink/40 focus:border-accent-ink resize-y"
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
            <label className="block text-lg font-medium text-ink mb-2">Answer (영어)</label>
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
              className="w-full p-3 border border-line rounded-xl shadow-sm focus:ring-accent-ink/40 focus:border-accent-ink resize-y"
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
                className="w-full p-3 border border-line rounded-xl shadow-sm focus:ring-accent-ink/40 focus:border-accent-ink"
              />
              <div className="relative">
                <input
                  type="text"
                  value={answer.email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setupdatedFAQ({
                      ...updatedFAQ,
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
                  className="w-full p-3 border border-line rounded-xl shadow-sm focus:ring-accent-ink/40 focus:border-accent-ink"
                  placeholder="Email"
                />
                {isEmailFocused && emailList?.filter((email) => email.includes(answer.email)).length > 0 && (
                  <ul className="absolute left-0 right-0 z-10 mt-1 bg-surface border border-line rounded-xl shadow-md max-h-[120px] overflow-y-auto">
                    {emailList
                      ?.filter((email) => email.includes(answer.email))
                      .map((email) => (
                        <li
                          key={email}
                          onClick={() => {
                            setupdatedFAQ({
                              ...updatedFAQ,
                              answer_ko: answer_ko.map((ans, i) =>
                                i === index ? { ...ans, email } : ans
                              ),
                              answer_en: answer_en.map((ans, i) =>
                                i === index ? { ...ans, email } : ans
                              ),
                            });
                            setIsEmailFocused(false);
                          }}
                          className="p-2 cursor-pointer hover:bg-card"
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
                    setupdatedFAQ({
                      ...updatedFAQ,
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
                  className="w-full p-3 border border-line rounded-xl shadow-sm focus:ring-accent-ink/40 focus:border-accent-ink"
                  placeholder="Phone"
                />
                {isPhoneFocused && phoneList?.filter((phone) => phone.includes(answer.phone)).length > 0 && (
                  <ul className="absolute left-0 right-0 z-10 mt-1 bg-surface border border-line rounded-xl shadow-md max-h-[120px] overflow-y-auto">
                    {phoneList
                      ?.filter((phone) => phone.includes(answer.phone))
                      .map((phone) => (
                        <li
                          key={phone}
                          onClick={() => {
                            setupdatedFAQ({
                              ...updatedFAQ,
                              answer_ko: answer_ko.map((ans, i) =>
                                i === index ? { ...ans, phone } : ans
                              ),
                              answer_en: answer_en.map((ans, i) =>
                                i === index ? { ...ans, phone } : ans
                              ),
                            });
                            setIsPhoneFocused(false);
                          }}
                          className="p-2 cursor-pointer hover:bg-card"
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
            className="bg-accent text-white px-4 py-2 rounded-xl hover:bg-accent/90"
          >
            답변 추가
          </button>
        </div>
      </div>

      {/* 관리자 필드 */}
      <div className="p-6 border border-line rounded-xl bg-card space-y-4">
        <h3 className="text-xl font-bold text-ink">관리자</h3>
        <label className="block text-lg font-medium text-ink mb-2">관리자 이름</label>
        <div className="relative">
          <input
            type="text"
            value={manager}
            onChange={(e) =>
              setupdatedFAQ({ ...updatedFAQ, manager: e.target.value })
            }
            onFocus={() => setIsManagerFocused(true)}
            onBlur={() => setTimeout(() => setIsManagerFocused(false), 100)}
            className="w-full p-3 border border-line rounded-xl shadow-sm focus:ring-accent-ink/40 focus:border-accent-ink"
            placeholder="관리자 이름을 입력하세요"
          />
          {isManagerFocused && (
            <ul className="absolute left-0 right-0 z-10 mt-1 bg-surface border border-line rounded-xl shadow-md max-h-[120px] overflow-y-auto">
              {managerList
                ?.filter((name) => name.includes(manager))
                .map((name) => (
                  <li
                    key={name}
                    onClick={() => {
                      setupdatedFAQ({ ...updatedFAQ, manager: name });
                      setIsManagerFocused(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-card"
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

      {/* 업데이트 버튼 */}
      <div className="text-center mt-8">
        <button
          type="button"
          onClick={handleUpdate}
          className={`px-6 py-3 rounded-xl ${
            isUpdating ? 'bg-card-3 cursor-not-allowed' : 'bg-success hover:bg-success/90 text-white'
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
