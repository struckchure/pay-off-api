import {
  IUserCreate,
  IUserGet,
  IUserUpdate,
} from "@/modules/user/interfaces/user.interface";

export type IAuthRegister = IUserCreate;

export interface IAuthLogin {
  email: string;
  password: string;
}

export type IAuthGetProfile = Pick<IUserGet, "id">;

export type IAuthUpdateProfile = IUserUpdate;

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}
