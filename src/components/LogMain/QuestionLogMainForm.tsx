import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { selectQuestionLogFilter, setQuestionLogCurrentPage } from '../../redux/filterSlice';
import { GetAllQuestionLogResponse } from '../../types/questionLog';
import { selectQuestionLogItemsPerPage, setQuestionLogItemsPerPage } from '../../redux/itemSlice';

interface QuestionLogMainFormProps {
  questionLogs: GetAllQuestionLogResponse['data']['questionLogs'];
}

const QuestionLogMainForm: React.FC<QuestionLogMainFormProps> = ({ questionLogs }) => {
  const dispatch = useDispatch();
  const { storedCurrentPage } = useSelector((state: RootState) => selectQuestionLogFilter(state));
  const [currentPage, setCurrentPage] = useState<number>(storedCurrentPage ? Number(storedCurrentPage) : 1);

  useEffect(() => {
    dispatch(setQuestionLogCurrentPage(currentPage));
  }, [currentPage, dispatch]);

  const itemsPerPage = useSelector(selectQuestionLogItemsPerPage);
  const pagesPerGroup = 10;
  const totalPages = Math.ceil(questionLogs.length / itemsPerPage);
  const currentPageGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentPageGroup * pagesPerGroup + 1;
  const endPage = Math.min((currentPageGroup + 1) * pagesPerGroup, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  const currentItems = questionLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(Math.min((currentPageGroup + 1) * pagesPerGroup + 1, totalPages));
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(Math.max(currentPageGroup * pagesPerGroup, 1));
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const formatDateToKST = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  return (
    <div className="p-6 bg-white-50 rounded-lg">
      <div className="p-6">
        <div className="flex justify-center items-center mb-6">
            <h4 className="text-2xl font-bold text-gray-800 flex-grow">유저 로그 리스트</h4>
            <div className="flex items-center space-x-4">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  dispatch(setQuestionLogItemsPerPage(Number(e.target.value)))
                  setCurrentPage(1);
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
        <div style={{ minHeight: '395px' }}>
          <div className="grid grid-cols-2 gap-4">
            {currentItems.map((log) => (
              <div className="relative bg-gray-200 p-4 rounded-lg" key={log.question_log_id}>
                <div className="mb-2">
                  <strong>유저 질문: {log.user_question}</strong>
                </div>
                <div className="flex flex-col">
                  <div className="mb-1 text-sm text-gray-600">
                    <strong>매칭된 질문:</strong> {log.faq_question}
                  </div>
                  <div className="mb-1 text-sm text-gray-600">
                    <strong>피드백 점수:</strong> {log.feedback_score ? log.feedback_score : '피드백 점수 없음'}
                  </div>
                  <div className="mb-1 text-sm text-gray-600">
                    <strong>질문 시각:</strong> {formatDateToKST(log.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-4 items-center space-x-4">
          <button
            onClick={handlePrevPage}
            className="px-4 py-2 bg-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-400"
            disabled={currentPage === 1}
          >이전</button>
          <div className="flex space-x-2">
            {pageNumbers.map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
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
          >다음</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionLogMainForm;
