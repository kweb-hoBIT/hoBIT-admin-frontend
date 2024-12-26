import React, { useState } from 'react';
import { FrequencyResponse, FeedbackResponse, LanguageResponse } from '../../types/questionLog';

interface AnalyzeFormProps {
  analyzeData: FrequencyResponse | FeedbackResponse | LanguageResponse;
  searchSubject: string;
  error: string | null;
}

const AnalyzeForm: React.FC<AnalyzeFormProps> = ({ analyzeData, searchSubject, error }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1;
  
  const data = analyzeData?.data?.logData?.groupData || [];

  const startIndex = currentPage * itemsPerPage;
  const currentPageData = data.slice(startIndex, startIndex + itemsPerPage);

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

  // 필드 이름 한글로 변환
  const fieldTranslations: { [key: string]: string } = {
    rank: '순위',
    faq_id: 'FAQ 번호',
    question_ko: 'FAQ 질문',
    count: '횟수',
    score_average: '평균점수',
    score_like_count: '좋아요 개수',
    score_dislike_count: '싫어요 개수',
    ko_frequency: '한국어 빈도',
    en_frequency: '영어 빈도',
  };

  const renderField = (fieldName: string) => {
    return fieldTranslations[fieldName] || fieldName;
  };

  return (
    <div className="p-1 rounded-3xl max-w-2xl mx-auto space-y-8">
      <div className="p-1 rounded-lg w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {searchSubject === 'frequency' && 'FAQ 검색 빈도 분석 결과'}
          {searchSubject === 'feedback' && 'FAQ 피드백 점수 분석 결과'}
          {searchSubject === 'language' && '사용 언어 빈도 분석 결과'}
        </h2>

        {/* Error Message */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="space-y-6">
          <div className="flex justify-between mb-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all duration-300 ease-in-out disabled:opacity-50"
            >
              이전
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= Math.ceil(data.length / itemsPerPage) - 1}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all duration-300 ease-in-out disabled:opacity-50"
            >
              다음
            </button>
          </div>

          {currentPageData.length > 0 ? (
            <div className="overflow-x-auto">
              {currentPageData.map((groupData: any, index: number) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-700">{`날짜: ${groupData.startDate} ~ ${groupData.endDate}`}</h3>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr>
                          {groupData.data?.length > 0 && Object.keys(groupData.data[0]).map((key, idx) => (
                            <th key={idx} className="px-6 py-4 text-left text-sm font-medium text-gray-600 border-b">
                              {renderField(key)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {groupData.data?.map((row: any, rowIndex: number) => (
                          <tr key={rowIndex} className="hover:bg-gray-50">
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} className="px-6 py-4 text-sm text-gray-700 border-b">
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
