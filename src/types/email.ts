export interface BulkUpdateEmailRequest {
  body: {
    old_email: string;
    new_email: string;
    user_id: number;
  };
}

export interface BulkUpdateEmailResponse {
  statusCode: number;
  data: {
    message: string;
    updated_faqs: number;
    updated_senior_faqs: number;
  };
}

export interface GetAllEmailsRequest {}

export interface GetAllEmailsResponse {
  statusCode: number;
  data: {
    emails: string[];
  };
}

export interface BulkDeleteEmailRequest {
  body: {
    email: string;
    user_id: number;
  };
}

export interface BulkDeleteEmailResponse {
  statusCode: number;
  data: {
    message: string;
    updated_faqs: number;
    updated_senior_faqs: number;
  };
}
