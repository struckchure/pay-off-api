import { Injectable } from "@nestjs/common";

import {
  TransactionCreateArgs,
  TransactionDeleteArgs,
  TransactionGetArgs,
  TransactionListArgs,
  TransactionUpdateArgs,
} from "@/modules/transaction/interfaces/transaction.interface";
import { PrismaService } from "@/shared/prisma/prisma.service";
import {
  removeNullOrEmptyValues,
  removeObjectValueByKey,
} from "@/shared/utils";
import { Prisma } from "@prisma/client";

@Injectable()
export class TransactionDAO {
  constructor(private prismaService: PrismaService) {}

  async transactionList(transactionListArgs: TransactionListArgs) {
    return await this.prismaService.transaction.findMany({
      skip: transactionListArgs.skip,
      take: transactionListArgs.take,
      where: removeNullOrEmptyValues<Prisma.TransactionWhereInput>({
        userId: transactionListArgs.userId,
        transactionType: transactionListArgs.transactionType,
        transactionStatus: transactionListArgs.transactionStatus,
      }),
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async transactionCreate(transactionCreateArgs: TransactionCreateArgs) {
    return await this.prismaService.transaction.create({
      data: {
        ...removeObjectValueByKey<Omit<TransactionCreateArgs, "userId">>(
          transactionCreateArgs,
          "userId",
        ),
        user: { connect: { id: transactionCreateArgs.userId } },
      },
    });
  }

  transactionCreateNoAsync(transactionCreateArgs: TransactionCreateArgs) {
    return this.prismaService.transaction.create({
      data: {
        ...removeObjectValueByKey<Omit<TransactionCreateArgs, "userId">>(
          transactionCreateArgs,
          "userId",
        ),
        user: { connect: { id: transactionCreateArgs.userId } },
      },
    });
  }

  async transactionGet(transactionGetArgs: TransactionGetArgs) {
    return await this.prismaService.transaction.findFirst({
      where: transactionGetArgs,
    });
  }

  async transactionUpdate(
    transactionGetArgs: TransactionGetArgs,
    transactionUpdateArgs: TransactionUpdateArgs,
  ) {
    return await this.prismaService.transaction.update({
      where:
        removeNullOrEmptyValues<Prisma.TransactionWhereUniqueInput>(
          transactionGetArgs,
        ),
      data: transactionUpdateArgs,
    });
  }

  async transactionDelete(transactionDeleteArgs: TransactionDeleteArgs) {
    await this.prismaService.transaction.delete({
      where: removeNullOrEmptyValues<Prisma.TransactionWhereUniqueInput>(
        transactionDeleteArgs,
      ),
    });
  }
}
