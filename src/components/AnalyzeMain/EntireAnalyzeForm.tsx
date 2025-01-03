import React, { useState, useEffect } from 'react';
import EntireAnalyzeGraph from './EntireAnalyzeGraph';
import { EntireFrequencyResponse, EntireFeedbackResponse, EntireLanguageResponse } from '../../types/questionLog';

interface EntireAnalyzeFormProps {
  analyzeData: EntireFrequencyResponse | EntireFeedbackResponse | EntireLanguageResponse;
  searchSubject: string;
  error: string | null;
  limit: string;
}

const EntireAnalyzeForm: React.FC<EntireAnalyzeFormProps> = ({ analyzeData, searchSubject, error, limit }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = searchSubject === 'language' ? parseInt(limit || '1', 10) : 1;

  const data = analyzeData?.data?.logData?.groupData || [];
  const startIndex = currentPage * itemsPerPage;
  const currentPageData = data.slice(startIndex, startIndex + itemsPerPage) || [];

  useEffect(() => { 
    setCurrentPage(0);
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 50);
    return () => clearTimeout(timer);
  }, [analyzeData, searchSubject]);

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

  const renderField = (fieldName: string) => fieldTranslations[fieldName] || fieldName;

  return (
    <div className="flex flex-col space-y-6 min-h-[1000px] p-8">
      {/* 분석 결과 */}
      <div className="min-h-[500px] h-auto overflow-y-auto rounded-lg border border-gray-200 p-4 flex-1 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {searchSubject === 'frequency' && 'FAQ 검색 빈도 분석 결과'}
          {searchSubject === 'feedback' && 'FAQ 피드백 점수 분석 결과'}
          {searchSubject === 'language' && '사용 언어 빈도 분석 결과'}
        </h2>

        {/* Error Message */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {currentPageData.length > 0 ? (
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

            {searchSubject === 'language' ? (
              currentPageData.map((groupData: any, index: number) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4 mb-4"
                >
                  {/* 사용 언어 빈도를 사용하면 페이지별로 하나씩 표시하는거 너무 비효율적이라서 최대 개수 값 사용하기 위해 변경 */}
                  <p><strong>날짜: {groupData.startDate} ~ {groupData.endDate}</strong></p> 
                  <p>한국어 빈도: {groupData.data[0].ko_frequency}</p>
                  <p>영어 빈도: {groupData.data[0].en_frequency}</p>
                </div>
              ))
            ) : (
              currentPageData.map((groupData: any, index: number) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-700">{`날짜: ${groupData.startDate} ~ ${groupData.endDate}`}</h3>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr>
                          {groupData.data?.length > 0 &&
                            Object.keys(groupData.data[0]).map((key, idx) => (
                              <th
                                key={idx}
                                className="px-6 py-4 text-left text-sm font-medium text-gray-600 border-b"
                              >
                                {renderField(key)}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {groupData.data?.map((row: any, rowIndex: number) => (
                          <tr key={rowIndex} className="hover:bg-gray-50">
                            {Object.values(row).map((value, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-6 py-4 text-sm text-gray-700 border-b"
                              >
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            데이터가 없습니다. 검색 필터를 변경한 후 다시 시도해주세요.
          </div>
        )}
      </div>

      {/* 분석 결과 그래프 */}
      <div className="flex-1 min-h-[500px] h-auto overflow-hidden rounded-lg border border-gray-200 pt-5 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
        <EntireAnalyzeGraph currentPageData={currentPageData} searchSubject={searchSubject} />
      </div>
    </div>
  );
};

export default EntireAnalyzeForm;
