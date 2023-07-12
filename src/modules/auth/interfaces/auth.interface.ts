import {
  UserCreateArgs,
  UserGetArgs,
  UserUpdateArgs,
} from "@/modules/user/interfaces/user.interface";

export type IAuthRegister = UserCreateArgs;

export interface IAuthLogin {
  email: string;
  password: string;
}

export type IAuthGetProfile = Pick<UserGetArgs, "id">;

export type IAuthUpdateProfile = UserUpdateArgs;

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}
