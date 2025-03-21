import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { selectUserFeedbackFilter, setUnresolvedFeedbackCurrentPage, setResolvedFeedbackCurrentPage, setUserFeedbackFilterName } from '../../../redux/filterSlice';
import { GetAllUserFeedbackResponse } from '../../../types/feedback';
import UserFeedbackResolvedUpdate from './UserFeedbackResolvedUpdate';
import SelectUserFeedback from './SelectUserFeedback';
import UserFeedbackDelete from './UserFeedbackDelete';
import { selectUserFeedbackItemsPerPage, setUserFeedbackItemsPerPage } from '../../../redux/itemSlice';

interface UserFeedbackMainFormProps {
  userFeedbacks: GetAllUserFeedbackResponse['data']['userFeedbacks'];
}

const UserFeedbackMainForm: React.FC<UserFeedbackMainFormProps> = ({ userFeedbacks }) => {
  const dispatch = useDispatch();
  const { storedUnresolvedCurrentPage, storedResolvedCurrentPage, storedFilterName } = useSelector((state: RootState) => selectUserFeedbackFilter(state));

  const [unresolvedCurrentPage, setUnresolvedCurrentPage] = useState<number>(storedUnresolvedCurrentPage ? Number(storedUnresolvedCurrentPage) : 1);
  const [resolvedCurrentPage, setResolvedCurrentPage] = useState<number>(storedResolvedCurrentPage ? Number(storedResolvedCurrentPage) : 1);
  const [filter, setFilter] = useState<'unresolved' | 'resolved'>(
    storedFilterName as 'unresolved' | 'resolved' || 'unresolved'
  );
  const [feedbacks, setFeedbacks] = useState(userFeedbacks);

  useEffect(() => {
    setFeedbacks(userFeedbacks);
  }, [userFeedbacks]);

  useEffect(() => {
    dispatch(setUnresolvedFeedbackCurrentPage(unresolvedCurrentPage));
    dispatch(setResolvedFeedbackCurrentPage(resolvedCurrentPage));
    dispatch(setUserFeedbackFilterName(filter));
  }, [unresolvedCurrentPage, resolvedCurrentPage, filter]);

  // 필터링된 피드백
  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (filter === 'unresolved') {
      return feedback.resolved === 0;
    }
    return feedback.resolved === 1;
  });

  const itemsPerPage = useSelector(selectUserFeedbackItemsPerPage);
  const pagesPerGroup = 10;

  // 해결되지 않은 피드백의 페이지네이션
  const unresolvedTotalPages = Math.ceil(filteredFeedbacks.filter(feedback => feedback.resolved === 0).length / itemsPerPage);
  const unresolvedCurrentPageGroup = Math.floor((unresolvedCurrentPage - 1) / pagesPerGroup);
  const unresolvedStartPage = unresolvedCurrentPageGroup * pagesPerGroup + 1;
  const unresolvedEndPage = Math.min((unresolvedCurrentPageGroup + 1) * pagesPerGroup, unresolvedTotalPages);
  const unresolvedPageNumbers = Array.from({ length: unresolvedEndPage - unresolvedStartPage + 1 }, (_, index) => unresolvedStartPage + index);
  
  // 해결된 피드백의 페이지네이션
  const resolvedTotalPages = Math.ceil(filteredFeedbacks.filter(feedback => feedback.resolved === 1).length / itemsPerPage);
  const resolvedCurrentPageGroup = Math.floor((resolvedCurrentPage - 1) / pagesPerGroup);
  const resolvedStartPage = resolvedCurrentPageGroup * pagesPerGroup + 1;
  const resolvedEndPage = Math.min((resolvedCurrentPageGroup + 1) * pagesPerGroup, resolvedTotalPages);
  const resolvedPageNumbers = Array.from({ length: resolvedEndPage - resolvedStartPage + 1 }, (_, index) => resolvedStartPage + index);


  // 현재 페이지에 보여줄 피드백
  const unresolvedCurrentItems = filteredFeedbacks.filter(feedback => feedback.resolved === 0).slice((unresolvedCurrentPage - 1) * itemsPerPage, unresolvedCurrentPage * itemsPerPage);
  const resolvedCurrentItems = filteredFeedbacks.filter(feedback => feedback.resolved === 1).slice((resolvedCurrentPage - 1) * itemsPerPage, resolvedCurrentPage * itemsPerPage);

  const handleNextPage = () => {
    if (filter === 'unresolved' && unresolvedCurrentPage < unresolvedTotalPages) {
      setUnresolvedCurrentPage(Math.min((unresolvedCurrentPageGroup + 1) * pagesPerGroup + 1, unresolvedTotalPages));
    } else if (filter === 'resolved' && resolvedCurrentPage < resolvedTotalPages) {
      setResolvedCurrentPage(Math.min((unresolvedCurrentPageGroup + 1) * pagesPerGroup + 1, resolvedTotalPages));
    }
  };

  const handlePrevPage = () => {
    if (filter === 'unresolved' && unresolvedCurrentPage > 1) {
      setUnresolvedCurrentPage(Math.max(unresolvedCurrentPageGroup * pagesPerGroup, 1));
    } else if (filter === 'resolved' && resolvedCurrentPage > 1) {
      setResolvedCurrentPage(Math.max(resolvedCurrentPageGroup * pagesPerGroup, 1));
    }
  };


  const handlePageChange = (page: number) => {
    if (filter === 'unresolved') {
      setUnresolvedCurrentPage(page);
    } else {
      setResolvedCurrentPage(page);
    }
  };

  const handleFilterChange = (filterValue: 'unresolved' | 'resolved') => {
    setFilter(filterValue);
  };

  const handleResolvedChange = (id: number, resolved: number) => {
    setFeedbacks(prevFeedbacks => {
      const updatedFeedbacks = prevFeedbacks.map(feedback =>
        feedback.user_feedback_id === id ? { ...feedback, resolved } : feedback
      );
  
      if (filter === 'unresolved' && resolved === 1) {
        if (unresolvedCurrentItems.length === 1 && unresolvedCurrentPage > 1) {
          setUnresolvedCurrentPage(prevPage => prevPage - 1);
        }
      } else if (filter === 'resolved' && resolved === 0) {
        if (resolvedCurrentItems.length === 1 && resolvedCurrentPage > 1) {
          setResolvedCurrentPage(prevPage => prevPage - 1);
        }
      }
  
      return updatedFeedbacks;
    });
  };
  
  // 한국 시간으로 변환하는 함수
  const formatDateToKST = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  return (
    <div>
      <SelectUserFeedback filter={filter} onFilterChange={handleFilterChange} />
      <div className="p-6 bg-white-50 rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-2xl font-bold text-gray-800 flex-grow">유저 피드백 리스트</h4>
              <div className="flex items-center space-x-4">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    dispatch(setUserFeedbackItemsPerPage(Number(e.target.value)))
                    setUnresolvedCurrentPage(1);
                    setResolvedCurrentPage(1);
                  }}
                  className="p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={4}>4개씩 보기</option>
                  <option value={6}>6개씩 보기</option>
                  <option value={8}>8개씩 보기</option>
                  <option value={10}>10개씩 보기</option>
                </select>
              </div>
            </div>
        <div style={{ minHeight: '320px' }}>
          <div className="grid grid-cols-2 gap-4">
            {(filter === 'unresolved' ? unresolvedCurrentItems : resolvedCurrentItems).map((feedback) => (
              <div key={feedback.user_feedback_id} className="relative bg-gray-200 p-4 rounded-lg">
                {/* 수정 버튼 */}
                <UserFeedbackResolvedUpdate
                  user_feedback_id={feedback.user_feedback_id}
                  initialResolved={feedback.resolved ? 1 : 0}
                  onResolvedChange={handleResolvedChange}
                />
              
                {/* 삭제 버튼 */}
                <div
                  className="absolute bottom-5 right-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <UserFeedbackDelete
                    user_feedback_id={String(feedback.user_feedback_id)}
                    onSuccess={() => {
                      if (filter === 'unresolved') {
                        if (unresolvedCurrentItems.length === 1 && unresolvedCurrentPage > 1) {
                          dispatch(setUnresolvedFeedbackCurrentPage(unresolvedCurrentPage - 1));
                        }
                      } else {
                        if (resolvedCurrentItems.length === 1 && resolvedCurrentPage > 1) {
                          dispatch(setResolvedFeedbackCurrentPage(resolvedCurrentPage - 1));
                        }
                      }
                      window.location.reload();
                    }}
                  />
                </div>
                <div className="pr-24">
                  <div className="mb-2">
                      <strong> {feedback.question_ko ? (
                      `피드백 질문: ${feedback.question_ko}`
                      ) : (
                        'FAQ 생성'
                      )}</strong>
                  </div>
                  <div className="flex flex-col">
                    {feedback.question_ko && (
                      <div className="mb-1 text-sm text-gray-600">
                        <strong>유저 질문:</strong> {feedback.user_question ? feedback.user_question : 'X'}
                      </div>
                    )}
                    <div className="mb-1 text-sm text-gray-600">
                      <strong>피드백 사유:</strong> {feedback.feedback_reason ? feedback.feedback_reason : 'X'}
                    </div>
                    <div className="mb-1 text-sm text-gray-600">
                      <strong>피드백 상세:</strong> {feedback.feedback_detail ? feedback.feedback_detail : 'X'}
                    </div>
                    <div className="mb-1 text-sm text-gray-600">
                      <strong>피드백 시각:</strong> {formatDateToKST(feedback.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-4 items-center space-x-4">
            <button
              onClick={handlePrevPage}
              className="px-4 py-2 bg-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-400"
              disabled={(filter === 'unresolved' ? unresolvedCurrentPage : resolvedCurrentPage) === 1}
            >
              이전
            </button>

            {/* 페이지 번호 */}
            <div className="flex space-x-2">
              {(filter === 'unresolved' ? unresolvedPageNumbers : resolvedPageNumbers).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-semibold rounded-md ${
                    (filter === 'unresolved' ? unresolvedCurrentPage : resolvedCurrentPage) === page ? 'bg-crimson text-white' : 'bg-gray-200 text-gray-700'
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
              disabled={(filter === 'unresolved' ? unresolvedCurrentPage : resolvedCurrentPage) === (filter === 'unresolved' ? unresolvedTotalPages : resolvedTotalPages)}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFeedbackMainForm;
