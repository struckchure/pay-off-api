import { Type } from "class-transformer";
import { IsEmail, IsNumber, IsOptional, Min, MinLength } from "class-validator";

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
