import {
  UserCreateArgs,
  UserGetArgs,
  UserUpdateArgs,
} from "@/modules/user/interfaces/user.interface";

export type AuthRegisterArgs = UserCreateArgs;

export interface AuthLoginArgs {
  email: string;
  password: string;
}

export type AuthGetProfileArgs = Pick<UserGetArgs, "id">;

export type AuthUpdateProfileArgs = UserUpdateArgs;

export interface AuthTokensArgs {
  accessToken: string;
  refreshToken: string;
}
