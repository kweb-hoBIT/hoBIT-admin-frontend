export type LoginRequest = {
  body: {
    email: string;
    password: string;
  }
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
  body: {
    email: string;
    password: string;
    username: string;
    phone_num: string;
    invitationKey: string;
  }
};

export type SignupResponse = {
  status: string;
  message: string;
};

export type NewAccessTokenRequest = {
  body: {
    refreshToken: string;
  }
}

export type NewAccessTokenResponse = {
  status: string;
  message: string;
  data?: {
    accessToken?: string;
  };
}


export type DeleteAccountReqeust = {
  params: {
    user_id: string
  }
  body: {
  }
}

export type DeleteAccountResponse = {
  status : string
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