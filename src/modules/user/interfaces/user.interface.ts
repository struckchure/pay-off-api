export enum UserType {
  CUSTOMER = "CUSTOMER",
  MERCHANT = "MERCHANT",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
  SUPER_USER = "SUPER_USER",
}

export interface IUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: UserType;
}

export interface IUserList {
  search?: string;
  skip?: number;
  take?: number;
  isActive?: boolean;
  userType?: UserType;
}

export interface IUserCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType?: UserType;
}

export interface IUserGet {
  id?: string;
  email?: string;
}

export interface IUserUpdate extends Partial<IUserCreate> {
  isActive?: boolean;
}

export type IUserDelete = IUserGet;
