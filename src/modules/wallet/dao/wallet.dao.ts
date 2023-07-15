import { Injectable } from "@nestjs/common";

import {
  WalletCreateArgs,
  WalletDeleteArgs,
  WalletGetArgs,
  WalletListArgs,
  WalletUpdateArgs,
} from "@/modules/wallet/interfaces/wallet.interface";
import { PrismaService } from "@/shared/prisma/prisma.service";
import {
  removeNullOrEmptyValues,
  removeObjectValueByKey,
} from "@/shared/utils";
import { Prisma } from "@prisma/client";

@Injectable()
export class WalletDAO {
  constructor(private prismaService: PrismaService) {}

  async walletList(walletListArgs: WalletListArgs) {
    return await this.prismaService.wallet.findMany({
      skip: walletListArgs.skip,
      take: walletListArgs.take,
      where: removeNullOrEmptyValues<Prisma.WalletWhereInput>({
        isActive: walletListArgs.isActive,
      }),
    });
  }

  async walletCreate(walletCreateArgs: WalletCreateArgs) {
    return await this.prismaService.wallet.create({
      data: { userId: walletCreateArgs.userId },
    });
  }

  async walletGet(walletGetArgs: WalletGetArgs) {
    return await this.prismaService.wallet.findFirst({
      where: removeNullOrEmptyValues({
        ...removeObjectValueByKey(walletGetArgs, "email"),
        user: walletGetArgs.email && { email: walletGetArgs.email },
      }),
    });
  }

  async walletUpdate(
    walletGetArgs: WalletGetArgs,
    walletUpdateArgs: WalletUpdateArgs,
  ) {
    return await this.prismaService.wallet.update({
      where: removeNullOrEmptyValues(walletGetArgs),
      data: walletUpdateArgs,
    });
  }

  walletUpdateNoAsync(
    walletGetArgs: WalletGetArgs,
    walletUpdateArgs: WalletUpdateArgs,
  ) {
    // TODO: raise error if wallet does not exist
    return this.prismaService.wallet.update({
      where: removeNullOrEmptyValues(walletGetArgs),
      data: walletUpdateArgs,
    });
  }

  async walletDeleteArgs(walletDeleteArgs: WalletDeleteArgs) {
    await this.prismaService.wallet.delete({ where: walletDeleteArgs });
  }
}
