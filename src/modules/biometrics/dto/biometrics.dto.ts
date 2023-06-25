import { IsEnum, IsOptional } from "class-validator";
import { BiometricType } from "../interfaces/biometrics.interface";

export class BiometricsCreateDTO {
  @IsEnum(BiometricType)
  biometricType: BiometricType;
}

export class BiometricsUpdateDTO {
  @IsEnum(BiometricType)
  @IsOptional()
  biometricType: BiometricType;
}
