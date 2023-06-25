import { IUser } from "@/modules/user/interfaces/user.interface";

export enum BiometricType {
  FINGERPRINT = "FINGERPRINT",
}

export interface IBiometrics {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  user: IUser;
  biometricType: BiometricType;
  biometricUrl: string;
}

export interface IBiometricsList {
  userId?: string;
  biometricType?: BiometricType;
  skip?: number;
  take?: number;
}

export interface IBiometricsCreate {
  userId: string;
  biometricType: BiometricType;
  biometricUrl: string;
}

export interface IBiometricsGet {
  id?: string;
  userId?: string;
}

export type IBiometricsUpdate = Partial<Omit<IBiometricsCreate, "userId">>;

export type IBiometricsDelete = IBiometricsGet;
