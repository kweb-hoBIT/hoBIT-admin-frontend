import React from 'react';
import { UpdateSeniorFAQRequest } from '../../types/seniorfaq';
import Translate from '../Translate/Translate';

interface SeniorFAQUpdateFormProps {
  updatedFAQ: UpdateSeniorFAQRequest['body'];
  setupdatedFAQ: React.Dispatch<React.SetStateAction<UpdateSeniorFAQRequest['body']>>;
  handleAddAnswer: () => void;
  handleUpdate: () => void;
  handleDeleteAnswer: (index: number) => void;
}

const SeniorFAQUpdateForm: React.FC<SeniorFAQUpdateFormProps> = ({
  updatedFAQ,
  setupdatedFAQ,
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
  } = updatedFAQ;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">선배 FAQ 수정정</h2>

      {/* 카테고리 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">카테고리 (한글)</label>
          <input
            type="text"
            value={maincategory_ko}
            onChange={(e) =>
              setupdatedFAQ({ ...updatedFAQ, maincategory_ko: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="카테고리를 입력하세요"
          />
          <Translate sourceText={maincategory_ko} setTargetText={(text) => setupdatedFAQ({ ...updatedFAQ, maincategory_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Category (English)</label>
          <input
            type="text"
            value={maincategory_en}
            onChange={(e) =>
              setupdatedFAQ({ ...updatedFAQ, maincategory_en: e.target.value })
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
              setupdatedFAQ({ ...updatedFAQ, subcategory_ko: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="서브카테고리를 입력하세요"
          />
          <Translate sourceText={subcategory_ko} setTargetText={(text) => setupdatedFAQ({ ...updatedFAQ, subcategory_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">Subcategory (English)</label>
          <input
            type="text"
            value={subcategory_en}
            onChange={(e) =>
              setupdatedFAQ({ ...updatedFAQ, subcategory_en: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter subcategory"
          />
        </div>
      </div>

      {/* 세부 카테고리 필드 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">세부카테고리</h3>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">세부카테고리 (한글)</label>
          <input
            type="text"
            value={detailcategory_ko}
            onChange={(e) =>
              setupdatedFAQ({ ...updatedFAQ, detailcategory_ko: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="세부 카테고리를 입력하세요"
          />
          <Translate sourceText={detailcategory_ko} setTargetText={(text) => setupdatedFAQ({ ...updatedFAQ, detailcategory_en: text })} />
          <label className="block text-lg font-medium text-gray-700 mt-4 mb-2">DetailCategory (English)</label>
          <input
            type="text"
            value={detailcategory_en}
            onChange={(e) =>
              setupdatedFAQ({ ...updatedFAQ, detailcategory_en: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter detail category"
          />
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
                setupdatedFAQ({
                  ...updatedFAQ,
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
                setupdatedFAQ({
                  ...updatedFAQ,
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
                setupdatedFAQ({
                  ...updatedFAQ,
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
                setupdatedFAQ({
                  ...updatedFAQ,
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
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-y mb-4"
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
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="이미지 링크"
                value={answer.image}
                onChange={(e) => {
                  setupdatedFAQ({
                    ...updatedFAQ,
                    answer_ko: answer_ko.map((ans, i) =>
                      i === index ? { ...ans, image: e.target.value } : ans
                    ),
                    answer_en: answer_en.map((ans, i) =>
                      i === index ? { ...ans, image: e.target.value } : ans
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
                  setupdatedFAQ({
                    ...updatedFAQ,
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
                  setupdatedFAQ({
                    ...updatedFAQ,
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
            setupdatedFAQ({ ...updatedFAQ, manager: e.target.value })
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
