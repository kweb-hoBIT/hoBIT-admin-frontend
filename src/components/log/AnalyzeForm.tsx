import React, { useState } from 'react';
import { FrequencyResponse, FeedbackResponse, LanguageResponse } from '../../types/questionLog';

interface AnalyzeFormProps {
  responseData: FrequencyResponse | FeedbackResponse | LanguageResponse;
  searchSubject: string;
}

const AnalyzeForm: React.FC<AnalyzeFormProps> = ({ responseData, searchSubject }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1;

  const data = responseData?.data?.logData?.groupData || [];

  const startIndex = currentPage * itemsPerPage;
  const currentPageData = data.slice(startIndex, startIndex + itemsPerPage);

  // 페이지 이동 함수
  const goToNextPage = () => {
    if (currentPage < Math.ceil(data.length / itemsPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };


  // Field 이름 한글로 변환
  const fieldTranslations: { [key: string]: string } = {
    rank: '순위',
    faq_id: 'FAQ 번호',
    question_ko: 'FAQ 질문',
    count: '횟수',
    score_average: '평균점수',
    ko_frequency: '한국어 빈도',
    en_frequency: '영어 빈도',
  };

  const renderField = (fieldName: string) => {
    return fieldTranslations[fieldName] || fieldName;
  };

  return (
    <div className="flex justify-center items-center py-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-0 rounded-lg shadow-lg w-full max-w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {searchSubject === 'frequency' && 'FAQ 검색 빈도 분석 결과'}
          {searchSubject === 'feedback' && 'FAQ 피드백 점수 분석 결과'}
          {searchSubject === 'language' && '사용 언어 빈도 분석 결과'}
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between mb-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              이전
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= Math.ceil(data.length / itemsPerPage) - 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              다음
            </button>
          </div>

          {currentPageData.length > 0 ? (
            <div>
              {currentPageData.map((groupData: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-center mb-2">
                    <h3 className="text-lg font-semibold">{`날짜: ${groupData.startDate} ~ ${groupData.endDate}`}</h3>
                  </div>
                  <div className="flex justify-center mt-2">
                    <table className="min-w-full table-fixed border-collapse border border-gray-200 text-left text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {groupData.data?.length > 0 && Object.keys(groupData.data[0]).map((key, idx) => (
                            <th key={idx} className="border border-gray-200 px-6 py-4 font-medium text-gray-600">
                              {renderField(key)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {groupData.data?.map((row: any, rowIndex: number) => (
                          <tr key={rowIndex} className="even:bg-gray-50">
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} className="border border-gray-200 px-6 py-4 text-gray-700">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzeForm;
