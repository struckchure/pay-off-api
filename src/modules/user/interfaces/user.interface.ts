import { UserType } from "@prisma/client";

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: UserType;
}

export interface UserListArgs {
  search?: string;
  skip?: number;
  take?: number;

  isActive?: boolean;
  userType?: UserType;
}

export interface UserCreateArgs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType?: UserType;
  username: string;
  bvn?: string;
}

export interface UserGetArgs {
  id?: string;
  email?: string;
}

export interface UserUpdateArgs extends Partial<UserCreateArgs> {
  isActive?: boolean;
}

export type UserDeleteArgs = UserGetArgs;
