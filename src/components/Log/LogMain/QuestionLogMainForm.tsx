import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { selectQuestionLogFilter, setQuestionLogCurrentPage } from '../../../redux/filterSlice';
import { GetAllQuestionLogResponse } from '../../../types/questionLog';
import { selectQuestionLogItemsPerPage, setQuestionLogItemsPerPage } from '../../../redux/itemSlice';
import BulkDeleteQuestionLogModal from './BulkDeleteQuestionLogModal';
import Select from '../../ui/Select';

interface QuestionLogMainFormProps {
  questionLogs: GetAllQuestionLogResponse['data']['questionLogs'];
}

const QuestionLogMainForm: React.FC<QuestionLogMainFormProps> = ({ questionLogs }) => {
  const dispatch = useDispatch();
  const { storedCurrentPage } = useSelector((state: RootState) => selectQuestionLogFilter(state));
  const [currentPage, setCurrentPage] = useState<number>(storedCurrentPage ? Number(storedCurrentPage) : 1);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

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
    <div className="p-6">
      <div className="p-6">
        <div className="flex justify-center items-center mb-6">
            <h4 className="text-xl font-bold text-ink flex-grow">유저 로그 리스트</h4>
            <div className="flex items-center space-x-4">
              <Select
                value={itemsPerPage}
                onChange={(e) => {
                  dispatch(setQuestionLogItemsPerPage(Number(e.target.value)))
                  setCurrentPage(1);
                }}
                className="p-2 rounded-xl border-2 border-line focus:outline-none focus:ring-2 focus:ring-accent-ink/40"
              >
                <option value={4}>4개씩 보기</option>
                <option value={6}>6개씩 보기</option>
                <option value={8}>8개씩 보기</option>
                <option value={10}>10개씩 보기</option>
              </Select>
              <button
                onClick={() => setShowBulkDeleteModal(true)}
                className="px-4 py-2 bg-danger text-white rounded-xl hover:bg-danger/90 font-semibold"
              >
                전체 삭제
              </button>
            </div>
          </div>
        <div style={{ minHeight: '395px' }}>
          <div className="grid grid-cols-2 gap-4">
            {currentItems.map((log) => (
              <div className="relative bg-card-2 p-4 rounded-xl" key={log.question_log_id}>
                <div className="mb-2">
                  <strong>유저 질문: {log.user_question}</strong>
                </div>
                <div className="flex flex-col">
                  <div className="mb-1 text-sm text-ink-2">
                    <strong>매칭된 질문:</strong> {log.faq_question ? log.faq_question : '매칭된 질문이 삭제됨'}
                  </div>
                  <div className="mb-1 text-sm text-ink-2">
                    <strong>피드백 점수:</strong> {log.feedback_score ? log.feedback_score : '피드백 점수 없음'}
                  </div>
                  <div className="mb-1 text-sm text-ink-2">
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
            className="px-4 py-2 bg-card-2 rounded-xl text-sm font-semibold text-ink hover:bg-card-3"
            disabled={currentPage === 1}
          >이전</button>
          <div className="flex space-x-2">
            {pageNumbers.map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-semibold rounded-xl ${
                  currentPage === page ? 'bg-accent text-white' : 'bg-card-2 text-ink'
                }`}
                style={{ width: '40px', textAlign: 'center' }}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 bg-card-2 rounded-xl text-sm font-semibold text-ink hover:bg-card-3"
            disabled={currentPage === totalPages}
          >다음</button>
        </div>
      </div>
      
      {/* 전체 삭제 모달 */}
      {showBulkDeleteModal && (
        <BulkDeleteQuestionLogModal
          onClose={() => setShowBulkDeleteModal(false)}
          onSuccess={() => {
            setShowBulkDeleteModal(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default QuestionLogMainForm;
