import { User } from "@/modules/user/interfaces/user.interface";

export enum BiometricType {
  FINGERPRINT = "FINGERPRINT",
}

export interface Biometrics {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  biometricType: BiometricType;
  biometricUrl: string;
}

export interface BiometricsListArgs {
  userId?: string;
  biometricType?: BiometricType;
  skip?: number;
  take?: number;
}

export interface BiometricsCreateArgs {
  userId: string;
  biometricType: BiometricType;
  biometricUrl: string;
}

export interface BiometricsGetArgs {
  id?: string;
  userId?: string;
}

export type BiometricsUpdateArgs = Partial<
  Omit<BiometricsCreateArgs, "userId">
>;

export type BiometricsDeleteArgs = BiometricsGetArgs;

export interface IBiometricsVerify {
  biometricType: BiometricType;
  target: Express.Multer.File;
  sample: Express.Multer.File;
}
