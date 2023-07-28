import { IsEnum, IsNumber, IsOptional, IsUUID } from "class-validator";

import { TransactionStatus, TransactionType } from "@prisma/client";

export class TransactionListDTO {
  @IsNumber()
  @IsOptional()
  skip: number;

  @IsNumber()
  @IsOptional()
  take: number;

  @IsUUID()
  @IsOptional()
  userId: string;

  @IsEnum(TransactionType)
  @IsOptional()
  transactionType: TransactionType;

  @IsEnum(TransactionStatus)
  @IsOptional()
  transactionStatus: TransactionStatus;
}
