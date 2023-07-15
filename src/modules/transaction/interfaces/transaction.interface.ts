import { TransactionStatus, TransactionType } from "@prisma/client";

export interface TransactionListArgs {
  skip?: number;
  take?: number;

  userId?: string;
  transactionType?: TransactionType;
  transactionStatus?: TransactionStatus;
}

export interface TransactionCreateArgs<T = string> {
  userId: string;
  amount: number;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  reference: string;
  description?: string;
  meta?: Record<string, T>;
}

export interface TransactionGetArgs {
  id?: string;
  reference?: string;
}

export type TransactionUpdateArgs = Partial<TransactionCreateArgs>;

export type TransactionDeleteArgs = TransactionGetArgs;
