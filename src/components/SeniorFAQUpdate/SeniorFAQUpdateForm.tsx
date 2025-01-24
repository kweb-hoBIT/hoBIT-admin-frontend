import React, { useState } from 'react';
import { UpdateSeniorFAQRequest, GetAllSeniorFAQCategoryResponse } from '../../types/seniorfaq';
import Translate from '../Translate/Translate';

interface SeniorFAQUpdateFormProps {
  updatedSeniorFAQ: UpdateSeniorFAQRequest['body'];
  setupdatedSeniorFAQ: React.Dispatch<React.SetStateAction<UpdateSeniorFAQRequest['body']>>;
  filteredCategory: GetAllSeniorFAQCategoryResponse['data']['categories'];
  findFilterIndex: (key: keyof GetAllSeniorFAQCategoryResponse['data']['categories'], value: string) => void;
  handleAddAnswer: () => void;
  handleUpdate: () => void;
  handleDeleteAnswer: (index: number) => void;
}

const SeniorFAQUpdateForm: React.FC<SeniorFAQUpdateFormProps> = ({
  updatedSeniorFAQ,
  setupdatedSeniorFAQ,
  filteredCategory,
  findFilterIndex,
  handleAddAnswer,
  handleUpdate,
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
  } = updatedSeniorFAQ;

  const [isMainCateogoryKoInputFocused, setIsMainCateogoryKoInputInputFocused] = useState(false);
  const [isMainCateogoryEnInputFocused, setIsMainCateogoryEnInputInputFocused] = useState(false);
  const [isSubCateogoryKoInputFocused, setIsSubCateogoryKoInputInputFocused] = useState(false);
  const [isSubCateogoryEnInputFocused, setIsSubCateogoryEnInputInputFocused] = useState(false);
  const [isDetailCateogoryKoInputFocused, setIsDetailCateogoryKoInputInputFocused] = useState(false);
  const [isDetailCateogoryEnInputFocused, setIsDetailCateogoryEnInputInputFocused] = useState(false);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">선배 FAQ 수정</h2>

      {/* 카테고리 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">카테고리 (한글)</label>
          <div>
            <input
              type="text"
              value={maincategory_ko}
              onChange={(e) =>
                setupdatedSeniorFAQ({ ...updatedSeniorFAQ, maincategory_ko: e.target.value })
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
            {isMainCateogoryKoInputFocused && filteredCategory['maincategory_ko'].length > 0 && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {filteredCategory['maincategory_ko'].map((category) => (
                  <li
                    key={category}
                    onClick={() => {
                      findFilterIndex('maincategory_ko', category);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {category}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Translate sourceText={maincategory_ko} setTargetText={(text) => setupdatedSeniorFAQ({ ...updatedSeniorFAQ, maincategory_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Category (English)</label>
          <div>
            <input
              type="text"
              value={maincategory_en}
              onChange={(e) =>
                setupdatedSeniorFAQ({ ...updatedSeniorFAQ, maincategory_en: e.target.value })
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
            {isMainCateogoryEnInputFocused && filteredCategory['maincategory_en'].length > 0 && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {filteredCategory['maincategory_en'].map((category) => (
                  <li
                    key={category}
                    onClick={() => {
                      findFilterIndex('maincategory_en', category);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {category}
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
                setupdatedSeniorFAQ({ ...updatedSeniorFAQ, subcategory_ko: e.target.value })
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
            {isSubCateogoryKoInputFocused && filteredCategory['subcategory_ko'].length > 0 && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {filteredCategory['subcategory_ko'].map((category) => (
                  <li
                    key={category}
                    onClick={() => {
                      findFilterIndex('subcategory_ko', category);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {category}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Translate sourceText={subcategory_ko} setTargetText={(text) => setupdatedSeniorFAQ({ ...updatedSeniorFAQ, subcategory_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Subcategory (English)</label>
          <div>
            <input
              type="text"
              value={subcategory_en}
              onChange={(e) =>
                setupdatedSeniorFAQ({ ...updatedSeniorFAQ, subcategory_en: e.target.value })
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
            {isSubCateogoryEnInputFocused && filteredCategory['subcategory_en'].length > 0 && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {filteredCategory['subcategory_en'].map((category) => (
                  <li
                    key={category}
                    onClick={() => {
                      findFilterIndex('subcategory_en', category);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {category}
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
                setupdatedSeniorFAQ({ ...updatedSeniorFAQ, detailcategory_ko: e.target.value })
              }
              onFocus={() => setIsDetailCateogoryKoInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsDetailCateogoryKoInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="세부카테고리를 입력하세요"
            />
            {isDetailCateogoryKoInputFocused && filteredCategory['detailcategory_ko'].length > 0 && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {filteredCategory['detailcategory_ko'].map((category) => (
                  <li
                    key={category}
                    onClick={() => {
                      findFilterIndex('detailcategory_ko', category);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {category}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Translate sourceText={detailcategory_ko} setTargetText={(text) => setupdatedSeniorFAQ({ ...updatedSeniorFAQ, detailcategory_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">DetailCategory (English)</label>
          <div>
            <input
              type="text"
              value={detailcategory_en}
              onChange={(e) =>
                setupdatedSeniorFAQ({ ...updatedSeniorFAQ, detailcategory_en: e.target.value })
              }
              onFocus={() => setIsDetailCateogoryEnInputInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsDetailCateogoryEnInputInputFocused(false);
                }, 100);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter detailcategory"
            />
            {isDetailCateogoryEnInputFocused && filteredCategory['detailcategory_en'].length > 0 && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {filteredCategory['detailcategory_en'].map((category) => (
                  <li
                    key={category}
                    onClick={() => {
                      findFilterIndex('detailcategory_en', category);
                    }}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {category}
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
              placeholder='답변 제목을 입력하세요'
              value={answer.title}
              onChange={(e) =>
                setupdatedSeniorFAQ({
                  ...updatedSeniorFAQ,
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
                setupdatedSeniorFAQ({
                  ...updatedSeniorFAQ,
                  answer_en: answer_en.map((ans, i) =>
                    i === index ? { ...ans, title: translatedText } : ans
                  ),
                });
              }}
            />
            <label className="block text-lg font-medium text-gray-700 mb-2">Answer Title (영어)</label>
            <input
              placeholder='Enter Answer Title'
              value={answer_en[index]?.title || ''}
              onChange={(e) =>
                setupdatedSeniorFAQ({
                  ...updatedSeniorFAQ,
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
                setupdatedSeniorFAQ({
                  ...updatedSeniorFAQ,
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
                setupdatedSeniorFAQ({
                  ...updatedSeniorFAQ,
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
                setupdatedSeniorFAQ({
                  ...updatedSeniorFAQ,
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
                  setupdatedSeniorFAQ({
                    ...updatedSeniorFAQ,
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
                  setupdatedSeniorFAQ({
                    ...updatedSeniorFAQ,
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
                  setupdatedSeniorFAQ({
                    ...updatedSeniorFAQ,
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
            setupdatedSeniorFAQ({ ...updatedSeniorFAQ, manager: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="관리자 이름을 입력하세요"
        />
      </div>

      {/* 생성버튼 */}
      <div className="flex justify-center">
        <button
          onClick={handleUpdate}
          className="py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          수정
        </button>
      </div>
    </form>
  );
};

export default SeniorFAQUpdateForm;
