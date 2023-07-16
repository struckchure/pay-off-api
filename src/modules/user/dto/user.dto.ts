import {
  IsOptional,
  IsEmail,
  MinLength,
  Length,
  IsNumberString,
} from "class-validator";

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

  @IsOptional()
  @MinLength(6)
  username: string;

  @IsOptional()
  @Length(11)
  @IsNumberString()
  bvn: string;
}
