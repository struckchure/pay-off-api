import { Injectable, NotFoundException } from "@nestjs/common";

import { TransactionDAO } from "@/modules/transaction/dao/transaction.dao";
import {
  TransactionGetArgs,
  TransactionListArgs,
} from "@/modules/transaction/interfaces/transaction.interface";

@Injectable()
export class TransactionService {
  constructor(private transactionDAO: TransactionDAO) {}

  async transactionList(transactionListArgs: TransactionListArgs) {
    return await this.transactionDAO.transactionList(transactionListArgs);
  }

  async transactionGet(transactionGetArgs: TransactionGetArgs) {
    const transaction = await this.transactionDAO.transactionGet(
      transactionGetArgs,
    );
    if (!transaction) throw new NotFoundException("transaction not found");

    return transaction;
  }
}
