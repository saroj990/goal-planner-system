export interface RequestUser {
  id: string;
  email: string;
}

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface AuthTokensResponse {
  accessToken: string;
  user: AuthUserResponse;
}
