export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status: string;
  message: string;          
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user_id?: string;
    username?: string;
  };
};

export type SignupRequest = {
  email: string;
  password: string;
  username: string;
  phone_num: string;
  invitationKey: string;
};

export type SignupResponse = {
  status: string;
  message: string;
};

export type NewAccessTokenRequest = {
  refreshToken: string;
}

export type NewAccessTokenResponse = {
  status: string;
  message: string;
  data?: {
    accessToken?: string;
  };
}


export type DeleteAccountReqeust = {
  user_id: string
}

export type DeleteAccountResponse = {
  message: string
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