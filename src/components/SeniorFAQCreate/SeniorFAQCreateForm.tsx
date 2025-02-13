import React, {useState} from 'react';
import { CreateSeniorFAQRequest, GetAllSeniorFAQCategoryResponse } from '../../types/seniorfaq';
import Translate from '../Translate/Translate';
import SeniorFAQPreview from './SeniorFAQPreview';

interface SeniorFAQCreateFormProps {
  newSeniorFAQ: CreateSeniorFAQRequest['body'];
  setNewSeniorFAQ: React.Dispatch<React.SetStateAction<CreateSeniorFAQRequest['body']>>;
  category: GetAllSeniorFAQCategoryResponse['data']['categories'];
  findFilterIndex: (key: string, value: string) => void;
  handleAddAnswer: () => void;
  handleSubmit: () => void;
  handleDeleteAnswer: (index: number) => void;
}

const SeniorFAQCreateForm: React.FC<SeniorFAQCreateFormProps> = ({
  newSeniorFAQ,
  setNewSeniorFAQ,
  category,
  findFilterIndex,
  handleAddAnswer,
  handleSubmit,
  handleDeleteAnswer,
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
  } = newSeniorFAQ;

  const [isMainCateogoryKoInputFocused, setIsMainCateogoryKoInputInputFocused] = useState(false);
  const [isMainCateogoryEnInputFocused, setIsMainCateogoryEnInputInputFocused] = useState(false);
  const [isSubCateogoryKoInputFocused, setIsSubCateogoryKoInputInputFocused] = useState(false);
  const [isSubCateogoryEnInputFocused, setIsSubCateogoryEnInputInputFocused] = useState(false);
  const [isDetailCateogoryKoInputFocused, setIsDetailCateogoryKoInputInputFocused] = useState(false);
  const [isDetailCateogoryEnInputFocused, setIsDetailCateogoryEnInputInputFocused] = useState(false);
  
  const getSubcategories = (maincategory: string, lang: 'ko' | 'en') => {
    const selectedCategory = category.find(cat =>
      lang === 'ko' ? cat.maincategory_ko === maincategory : cat.maincategory_en === maincategory
    );
    return selectedCategory ? selectedCategory.subcategories : [];
  };

  const getDetailcategories = (maincategory: string, subcategory: string, lang: 'ko' | 'en') => {
    const selectedCategory = category.find(cat =>
      lang === 'ko' ? cat.maincategory_ko === maincategory : cat.maincategory_en === maincategory
    );

    const selectedSubcategory = selectedCategory?.subcategories.find(sub =>
      lang === 'ko' ? sub.subcategory_ko === subcategory : sub.subcategory_en === subcategory
    );

    return selectedSubcategory ? selectedSubcategory.detailcategories : { detailcategory_ko: [], detailcategory_en: [] };
  };


  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">선배 FAQ 생성</h2>

      {/*메인 카테고리 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">카테고리 (한글)</label>
          <div>
            <input
              type="text"
              value={maincategory_ko}
              onChange={(e) =>
                setNewSeniorFAQ({ ...newSeniorFAQ, maincategory_ko: e.target.value })
              }
              onFocus={() => setIsMainCateogoryKoInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsMainCateogoryKoInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="메인카테고리를 입력하세요"
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
          <Translate sourceText={maincategory_ko} setTargetText={(text) => setNewSeniorFAQ({ ...newSeniorFAQ, maincategory_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Category (English)</label>
          <div>
            <input
              type="text"
              value={maincategory_en}
              onChange={(e) =>
                setNewSeniorFAQ({ ...newSeniorFAQ, maincategory_en: e.target.value })
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
        <h3 className="text-xl font-bold text-gray-800">서브카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">서브카테고리 (한글)</label>
          <div>
            <input
              type="text"
              value={subcategory_ko}
              onChange={(e) =>
                setNewSeniorFAQ({ ...newSeniorFAQ, subcategory_ko: e.target.value })
              }
              onFocus={() => setIsSubCateogoryKoInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsSubCateogoryKoInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="서브카테고리를 입력하세요"
              disabled={!maincategory_ko}
            />
            {isSubCateogoryKoInputFocused && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
              {getSubcategories(maincategory_ko, 'ko').flatMap((subcategory) => subcategory.subcategory_ko).filter((subcategory) => subcategory.includes(subcategory_ko)).map((subcategory) => (
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
          <Translate sourceText={subcategory_ko} setTargetText={(text) => setNewSeniorFAQ({ ...newSeniorFAQ, subcategory_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Subcategory (English)</label>
          <div>
            <input
              type="text"
              value={subcategory_en}
              onChange={(e) =>
                setNewSeniorFAQ({ ...newSeniorFAQ, subcategory_en: e.target.value })
              }
              onFocus={() => setIsSubCateogoryEnInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsSubCateogoryEnInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter subcategory"
              disabled={!maincategory_en}
            />
            {isSubCateogoryEnInputFocused && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {getSubcategories(maincategory_en, 'en').flatMap((subcategory) => subcategory.subcategory_en).filter((subcategory) => subcategory.includes(subcategory_en)).map((subcategory) => (
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

      {/* 세부 카테고리 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">세부카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">세부카테고리 (한글)</label>
          <div>
            <input
              type="text"
              value={detailcategory_ko}
              onChange={(e) =>
                setNewSeniorFAQ({ ...newSeniorFAQ, detailcategory_ko: e.target.value })
              }
              onFocus={() => setIsDetailCateogoryKoInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsDetailCateogoryKoInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="세부카테고리를 입력하세요"
              disabled={!subcategory_ko}
            />
            {isDetailCateogoryKoInputFocused && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {getDetailcategories(maincategory_ko, subcategory_ko, 'ko').detailcategory_ko.filter((detailcategory) => detailcategory.includes(detailcategory_ko)).map((detailcategory) => (
                  <li
                  key={`${maincategory_ko}-${subcategory_ko}-${detailcategory}`}
                    onClick={() => {
                      findFilterIndex('detailcategory_ko', detailcategory);
                      setIsDetailCateogoryKoInputInputFocused(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {detailcategory}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Translate sourceText={detailcategory_ko} setTargetText={(text) => setNewSeniorFAQ({ ...newSeniorFAQ, detailcategory_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">DetailCategory (English)</label>
          <div>
            <input
              type="text"
              value={detailcategory_en}
              onChange={(e) =>
                setNewSeniorFAQ({ ...newSeniorFAQ, detailcategory_en: e.target.value })
              }
              onFocus={() => setIsDetailCateogoryEnInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsDetailCateogoryEnInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter detailcategory"
              disabled={!subcategory_en}
            />
            {isDetailCateogoryEnInputFocused && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {getDetailcategories(maincategory_en, subcategory_en, 'en').detailcategory_en.filter((detailcategory) => detailcategory.includes(detailcategory_en)).map((detailcategory) => (
                  <li
                  key={`${maincategory_en}-${subcategory_en}-${detailcategory}`}
                    onClick={() => {
                      findFilterIndex('detailcategory_en', detailcategory);
                      setIsDetailCateogoryEnInputInputFocused(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {detailcategory}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 답변 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">답변</h3>
        {answer_ko.map((answer, index) => (
          <div key={index} className="p-4 border border-gray-300 rounded-lg bg-white space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-lg font-medium text-gray-700 mt-2">답변 제목 (한글)</label>
              <button
                type="button"
                onClick={() => handleDeleteAnswer(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg mb-2 hover:bg-red-600"
              >
                답변 제거
              </button>
            </div>
            <input
              placeholder="답변 제목을 입력하세요"
              value={answer.title}
              onChange={(e) =>
                setNewSeniorFAQ({
                  ...newSeniorFAQ,
                  answer_ko: answer_ko.map((ans, i) =>
                    i === index ? { ...ans, title: e.target.value } : ans
                  ),
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <Translate
              sourceText={answer.title}
              setTargetText={(translatedText) => {
                setNewSeniorFAQ({
                  ...newSeniorFAQ,
                  answer_en: answer_en.map((ans, i) =>
                    i === index ? { ...ans, title: translatedText } : ans
                  ),
                });
              }}
            />
            <label className="block text-lg font-medium text-gray-700 mb-2">Answer Title (영어)</label>
            <input
              placeholder="Enter Answer Title"
              value={answer_en[index]?.title || ''}
              onChange={(e) =>
                setNewSeniorFAQ({
                  ...newSeniorFAQ,
                  answer_en: answer_en.map((ans, i) =>
                    i === index ? { ...ans, title: e.target.value } : ans
                  ),
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <label className="block text-lg font-medium text-gray-700 mb-2">답변 (한글)</label>
            <textarea
              placeholder="답변을 입력하세요"
              value={answer.answer}
              onChange={(e) =>
                setNewSeniorFAQ({
                  ...newSeniorFAQ,
                  answer_ko: answer_ko.map((ans, i) =>
                    i === index ? { ...ans, answer: e.target.value } : ans
                  ),
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-y mb-4"
              rows={6}
            />
            <Translate
              sourceText={answer.answer}
              setTargetText={(translatedText) => {
                setNewSeniorFAQ({
                  ...newSeniorFAQ,
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
                setNewSeniorFAQ({
                  ...newSeniorFAQ,
                  answer_en: answer_en.map((ans, i) =>
                    i === index ? { ...ans, answer: e.target.value } : ans
                  ),
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-y mb-4"
              rows={6}
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="URL"
                value={answer.url}
                onChange={(e) => {
                  setNewSeniorFAQ({
                    ...newSeniorFAQ,
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
                placeholder="위도"
                value={answer.map.latitude}
                onChange={(e) => {
                  setNewSeniorFAQ({
                    ...newSeniorFAQ,
                    answer_ko: answer_ko.map((ans, i) =>
                      i === index ? { ...ans, map: { ...ans.map, latitude: e.target.value } } : ans
                    ),
                    answer_en: answer_en.map((ans, i) =>
                      i === index ? { ...ans, map: { ...ans.map, latitude: e.target.value } } : ans
                    ),
                  });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="경도"
                value={answer.map.longitude}
                onChange={(e) => {
                  setNewSeniorFAQ({
                    ...newSeniorFAQ,
                    answer_ko: answer_ko.map((ans, i) =>
                      i === index ? { ...ans, map: { ...ans.map, longitude: e.target.value } } : ans
                    ),
                    answer_en: answer_en.map((ans, i) =>
                      i === index ? { ...ans, map: { ...ans.map, longitude: e.target.value } } : ans
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
            setNewSeniorFAQ({ ...newSeniorFAQ, manager: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="관리자 이름을 입력하세요"
        />
      </div>

      <SeniorFAQPreview
        maincategory_ko={maincategory_ko}
        maincategory_en={maincategory_en}
        subcategory_ko={subcategory_ko}
        subcategory_en={subcategory_en}
        detailcategory_ko={detailcategory_ko}
        detailcategory_en={detailcategory_en}
        answer_ko={answer_ko.map(({ title, answer, url, map }) => ({ title, answer, url, email: '', phone: '', map }))}
        answer_en={answer_en.map(({ title, answer, url, map }) => ({ title, answer, url, email: '', phone: '', map }))}
        manager={manager}
      />

      {/* 생성버튼 */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          추가
        </button>
      </div>
    </form>
  );
};

export default SeniorFAQCreateForm;
