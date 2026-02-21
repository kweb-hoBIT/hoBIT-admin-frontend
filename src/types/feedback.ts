export type GetAllUserFeedbackRequest = {}

export type GetAllUserFeedbackResponse = {
  statusCode: number;
  message: string;
  data: {
    userFeedbacks: {
      user_feedback_id: number;
      question_ko: string;
      user_question: string;
      feedback_reason: string;
      feedback_detail: string;
      resolved: number;
      created_at: string;
    }[];
  };
}

export type UpdateUserFeedbackRequest = {
  params: {
    user_feedback_id: string;
  }
}

export type UpdateUserFeedbackResponse = {
  statusCode: number;
  message: string;
}

export type DeleteUserFeedbackRequest = {
  params: {
    user_feedback_id: string;
  }
}

export type DeleteUserFeedbackResponse = {
  statusCode: number;
  message: string;
}

export interface CountFeedbacksRequest {
  endpoint: 'feedbacks/count';
  method: 'get';
  query?: {
    before_date?: string;
    include_resolved?: string;
    include_unresolved?: string;
  };
}

export interface CountFeedbacksResponse {
  statusCode: number;
  data: {
    count: number;
  };
}

export interface BulkDeleteFeedbacksRequest {
  body: {
    before_date?: string;
    include_resolved: boolean;
    include_unresolved: boolean;
    user_id: number;
  };
}

export interface BulkDeleteFeedbacksResponse {
  statusCode: number;
  data: {
    message: string;
    deleted_count: number;
  };
}