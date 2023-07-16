import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Length,
  MinLength,
} from "class-validator";

export class AuthRegisterDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsOptional()
  @MinLength(6)
  username: string;

  @IsOptional()
  @Length(11)
  @IsNumberString()
  bvn: string;
}

export class AuthLoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}

export class AuthLogoutDTO {
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}

export class AuthObtainTokensDTO extends AuthLogoutDTO {}
