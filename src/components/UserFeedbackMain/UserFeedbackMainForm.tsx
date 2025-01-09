import React, { useState, useEffect } from 'react';
import { GetAllUserFeedbackResponse } from '../../types/feedback';
import UserFeedbackResolvedUpdate from './UserFeedbackResolvedUpdate';
import UserFeedbackFilter from './UserFeedbackFilter';

interface UserFeedbackMainFormProps {
  userFeedbacks: GetAllUserFeedbackResponse['data']['userFeedbacks'];
}

const UserFeedbackMainForm: React.FC<UserFeedbackMainFormProps> = ({ userFeedbacks }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unresolved'>('all');
  const [feedbacks, setFeedbacks] = useState(userFeedbacks);

  useEffect(() => {
    setFeedbacks(userFeedbacks);
  }, [userFeedbacks]);

  const itemsPerPage = 5;
  const pagesPerGroup = 10;

  // 필터링된 피드백
  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (filter === 'unresolved') {
      return feedback.resolved === 0;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  // 현재 페이지 그룹 (1-10, 11-20 등)
  const currentPageGroup = Math.floor((currentPage - 1) / pagesPerGroup);

  // 페이지 그룹의 첫 페이지와 마지막 페이지 계산
  const startPage = currentPageGroup * pagesPerGroup + 1;
  const endPage = Math.min((currentPageGroup + 1) * pagesPerGroup, totalPages);

  // 현재 페이지 그룹에 해당하는 페이지 목록
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterValue: 'all' | 'unresolved') => {
    setFilter(filterValue);
    setCurrentPage(1);
  };

  const handleResolvedChange = (id: number, resolved: number) => {
    setFeedbacks(prevFeedbacks => 
      prevFeedbacks.map(feedback => 
        feedback.user_feedback_id === id 
          ? { ...feedback, resolved }
          : feedback
      )
    );
  };

  // 한국 시간으로 변환하는 함수
  const formatDateToKST = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  return (
    <div className="p-6 bg-white-50 rounded-lg mt-4">
      <h4 className="text-2xl font-bold mb-6 text-gray-800">유저 피드백 리스트</h4>

      <UserFeedbackFilter filter={filter} onFilterChange={handleFilterChange} />

      {currentItems.map((feedback) => (
        <div key={feedback.user_feedback_id} className="relative bg-gray-200 p-4 mb-3 rounded-lg shadow-sm">
          <div className="mb-2">
            <span className="mb-1 text-m text-gray-600"><strong>피드백 ID: {feedback.user_feedback_id}</strong></span>
          </div>
          <div className="flex flex-col">
            <div className="mb-1 text-sm text-gray-600">
              <strong>피드백 사유:</strong> {feedback.feedback_reason}
            </div>
            <div className="mb-1 text-sm text-gray-600">
              <strong>피드백 상세:</strong> {feedback.feedback_detail}
            </div>
            <div className="mb-1 text-sm text-gray-600">
              <strong>사용 언어:</strong> {feedback.language === 'ko' ? '한국어' : feedback.language === 'en' ? '영어' : '기타'}
            </div>
            <div className="flex items-center space-x-2">
              <div className="mb-1 text-sm text-gray-600 flex items-center">
                <strong>해결 여부: </strong>
                <UserFeedbackResolvedUpdate
                  user_feedback_id={feedback.user_feedback_id}
                  initialResolved={feedback.resolved ? 1 : 0}
                  onResolvedChange={handleResolvedChange}
                />
              </div>
            </div>
            <div className="mb-1 text-sm text-gray-600">
              <strong>생성 시각:</strong> {formatDateToKST(feedback.created_at)}
            </div>
          </div>
        </div>
      ))}

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-4 items-center space-x-4">
        <button
          onClick={handlePrevPage}
          className="px-4 py-2 bg-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-400"
          disabled={currentPage === 1}
        >
          이전
        </button>

        {/* 페이지 번호 */}
        <div className="flex space-x-2">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-2 text-sm font-semibold rounded-md ${
                currentPage === page ? 'bg-crimson text-white' : 'bg-gray-200 text-gray-700'
              }`}
              style={{ width: '40px', textAlign: 'center' }}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-400"
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default UserFeedbackMainForm;
