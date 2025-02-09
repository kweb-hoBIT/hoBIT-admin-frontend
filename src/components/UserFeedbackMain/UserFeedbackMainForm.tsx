import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { selectUserFeedbackFilter } from '../../redux/filterSlice';
import { setUnresolvedFeedbackCurrentPage, setResolvedFeedbackCurrentPage, setUserFeedbackFilterName } from '../../redux/filterSlice';
import { GetAllUserFeedbackResponse } from '../../types/feedback';
import UserFeedbackResolvedUpdate from './UserFeedbackResolvedUpdate';
import SelectUserFeedback from './SelectUserFeedback';
import UserFeedbackDelete from './UserFeedbackDelete';

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

  const itemsPerPage = 4;
  const pagesPerGroup = 10;

  // 필터링된 피드백
  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (filter === 'unresolved') {
      return feedback.resolved === 0;
    }
    return feedback.resolved === 1;
  });

  // 해결되지 않은 피드백의 페이지네이션
  const unresolvedTotalPages = Math.ceil(filteredFeedbacks.filter(feedback => feedback.resolved === 0).length / itemsPerPage);
  const unresolvedPageNumbers = Array.from({ length: Math.min(unresolvedTotalPages, pagesPerGroup) }, (_, index) => index + 1);
  
  // 해결된 피드백의 페이지네이션
  const resolvedTotalPages = Math.ceil(filteredFeedbacks.filter(feedback => feedback.resolved === 1).length / itemsPerPage);
  const resolvedPageNumbers = Array.from({ length: Math.min(resolvedTotalPages, pagesPerGroup) }, (_, index) => index + 1);

  // 페이지 번호 및 아이템을 처리
  const indexOfUnresolvedLastItem = unresolvedCurrentPage * itemsPerPage;
  const indexOfUnresolvedFirstItem = indexOfUnresolvedLastItem - itemsPerPage;
  const unresolvedItems = filteredFeedbacks.filter(feedback => feedback.resolved === 0).slice(indexOfUnresolvedFirstItem, indexOfUnresolvedLastItem);

  const indexOfResolvedLastItem = resolvedCurrentPage * itemsPerPage;
  const indexOfResolvedFirstItem = indexOfResolvedLastItem - itemsPerPage;
  const resolvedItems = filteredFeedbacks.filter(feedback => feedback.resolved === 1).slice(indexOfResolvedFirstItem, indexOfResolvedLastItem);

  const handleNextPage = () => {
    if (filter === 'unresolved' && unresolvedCurrentPage < unresolvedTotalPages) {
      setUnresolvedCurrentPage(prev => prev + 1);
    } else if (filter === 'resolved' && resolvedCurrentPage < resolvedTotalPages) {
      setResolvedCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (filter === 'unresolved' && unresolvedCurrentPage > 1) {
      setUnresolvedCurrentPage(prev => prev - 1);
    } else if (filter === 'resolved' && resolvedCurrentPage > 1) {
      setResolvedCurrentPage(prev => prev - 1);
    }
  };

  const handlePageClick = (page: number) => {
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
        if (unresolvedItems.length === 1 && unresolvedCurrentPage > 1) {
          setUnresolvedCurrentPage(prevPage => prevPage - 1);
        }
      } else if (filter === 'resolved' && resolved === 0) {
        if (resolvedItems.length === 1 && resolvedCurrentPage > 1) {
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
          <h4 className="text-2xl font-bold mb-4 text-gray-800">유저 피드백 리스트</h4>
        <div style={{ minHeight: '320px' }}>
          <div className="grid grid-cols-2 gap-4">
            {(filter === 'unresolved' ? unresolvedItems : resolvedItems).map((feedback) => (
              <div key={feedback.user_feedback_id} className="relative bg-gray-200 p-4 rounded-lg cursor-pointer">
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
                        if (unresolvedItems.length === 1 && unresolvedCurrentPage > 1) {
                          setUnresolvedCurrentPage((prevPage) => prevPage - 1);
                        }
                      } else {
                        if (resolvedItems.length === 1 && resolvedCurrentPage > 1) {
                          setResolvedCurrentPage((prevPage) => prevPage - 1);
                        }
                      }
                      window.location.reload();
                    }}
                  />
                </div>
                <div className="pr-24">
                  <div className="mb-2">
                    <span className="mb-1 text-m text-gray-600">
                      <strong> {feedback.question_ko ? (
                      `피드백 질문: ${feedback.question_ko}`
                      ) : (
                        'FAQ 생성'
                      )}</strong>
                    </span>
                  </div>
                  <div className="flex flex-col">
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
                  onClick={() => handlePageClick(page)}
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
