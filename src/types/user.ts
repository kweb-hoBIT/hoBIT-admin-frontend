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
    token?: string;
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