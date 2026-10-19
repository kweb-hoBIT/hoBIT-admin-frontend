// 관리자 홈 대시보드 (관리자 백엔드 routes/api/dashboard)
export type GetDashboardRequest = {};
export type GetDashboardResponse = {
  statusCode: number;
  message: string;
  data: {
    totals: {
      today: number;
      week: number;
      prev_week: number;
      month: number;
      month_en: number;
      unresolved_feedbacks: number;
      week_feedbacks: number;
    };
    daily: { date: string; ko: number; en: number }[];
    top_faqs: { faq_id: number; question_ko: string; count: number }[];
    top_questions: { question: string; count: number }[];
    recent_feedbacks: {
      user_feedback_id: number;
      question_ko: string | null;
      user_question: string;
      feedback_reason: string | null;
      feedback_detail: string | null;
      language: string;
      created_at: string;
    }[];
  };
};
