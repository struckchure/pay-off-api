export enum UserType {
  CUSTOMER = "CUSTOMER",
  MERCHANT = "MERCHANT",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
  SUPER_USER = "SUPER_USER",
}

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
}

export interface UserGetArgs {
  id?: string;
  email?: string;
}

export interface UserUpdateArgs extends Partial<UserCreateArgs> {
  isActive?: boolean;
}

export type UserDeleteArgs = UserGetArgs;
