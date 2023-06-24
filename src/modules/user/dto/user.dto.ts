import { IsOptional, IsEmail, MinLength } from "class-validator";

export class UserUpdateProfileDTO {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @MinLength(8)
  @IsOptional()
  password: string;
}
