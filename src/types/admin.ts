export interface GetAllAdminsRequest {
  endpoint: 'admins';
  method: 'get';
}

export interface GetAllAdminsResponse {
  statusCode: number;
  data: {
    admins: string[];
    count: number;
  };
}

export interface BulkUpdateAdminRequest {
  body: {
    old_admin: string;
    new_admin: string;
    user_id: number;
  };
}

export interface BulkUpdateAdminResponse {
  statusCode: number;
  data: {
    message: string;
    updated_faqs: number;
  };
}

export interface BulkDeleteAdminRequest {
  body: {
    admin: string;
    user_id: number;
  };
}

export interface BulkDeleteAdminResponse {
  statusCode: number;
  data: {
    message: string;
    updated_faqs: number;
  };
}
