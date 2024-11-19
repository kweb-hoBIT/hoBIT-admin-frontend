export type LoginRequest = {
  type: 'auth';
  email: string;
  password: string;
};

export type LoginResponse = {
  type: 'auth';
  status: string;
  message: string;          
  data?: {
    accessToken?: string;
    refreshToken?: string;
    username?: string;
  };
};

export type SignupRequest = {
  type: 'users';
  email: string;
  password: string;
  username: string;
  phone_num: string;
  invitationKey: string;
};

export type SignupResponse = {
  type: 'users';
  status: string;
  message: string;
};

export type NewAccessTokenRequest = {
  type: 'auth/refresh';
  refreshToken: string;
}

export type NewAccessTokenResponse = {
  type: 'auth/refresh';
  status: string;
  message: string;
  data?: {
    accessToken?: string;
  };
}


export type User = {
  id: number;
  email: string;
  password: string;
  username: string;
  phone_num: string;
  created_at?: Date;
  updated_at?: Date;
};

export default User;