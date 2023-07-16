import { Type } from "class-transformer";
import {
  IsEmail,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";

export class WalletTransferDTO {
  @IsEmail()
  to: string;

  @IsNumber()
  @Min(100)
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @MinLength(10)
  description: string;
}

export class WalletFundDTO {
  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  redirectUrl: string;
}

export class WalletWithdrawalDTO {
  @IsNumber()
  @Min(100)
  amount: number;

  @IsString()
  accountBank: string;

  @IsNumberString()
  accountNumber: string;
}
