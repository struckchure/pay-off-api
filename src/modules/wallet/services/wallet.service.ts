import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { UserDAO } from "@/modules/user/dao/user.dao";
import { WalletDAO } from "@/modules/wallet/dao/wallet.dao";
import {
  WalletGetArgs,
  WalletListArgs,
  WalletTransferArgs,
} from "@/modules/wallet/interfaces/wallet.interface";
import { AtomicHelper } from "@/shared/prisma/prisma.utils";

@Injectable()
export class WalletService {
  constructor(
    private atomicHelper: AtomicHelper,
    private userDAO: UserDAO,
    private walletDAO: WalletDAO,
  ) {}

  async walletList(walletListArgs: WalletListArgs) {
    return await this.walletDAO.walletList(walletListArgs);
  }

  async walletGet(walletGetArgs: WalletGetArgs) {
    const user = await this.userDAO.userGet({
      email: walletGetArgs.email,
    });
    if (!user) {
      throw new NotFoundException(
        `user (${walletGetArgs.email}) does not exist`,
      );
    }

    const wallet = await this.walletDAO.walletGet(walletGetArgs);
    if (!wallet) {
      return await this.walletDAO.walletCreate({ userId: user.id });
    }

    return wallet;
  }

  async walletTransfer(walletTransferArgs: WalletTransferArgs) {
    const isOwnAccount = walletTransferArgs.from === walletTransferArgs.to;
    if (isOwnAccount) {
      throw new BadRequestException("you cannot transfer to your own account");
    }

    const senderWallet = await this.walletGet({
      email: walletTransferArgs.from,
    });
    const recieverWallet = await this.walletGet({
      email: walletTransferArgs.to,
    });

    const isSenderBalanceSufficient =
      +senderWallet.balance >= walletTransferArgs.amount;
    if (!isSenderBalanceSufficient) {
      throw new BadRequestException("insufficient funds");
    }

    const newSenderBalance = +senderWallet.balance - walletTransferArgs.amount;
    const newRecieverBalance =
      +recieverWallet.balance + walletTransferArgs.amount;

    const debit = this.walletDAO.walletUpdateNoAsync(
      { userId: senderWallet.userId },
      { balance: newSenderBalance },
    );
    const credit = this.walletDAO.walletUpdateNoAsync(
      { userId: recieverWallet.userId },
      { balance: newRecieverBalance },
    );

    await this.atomicHelper.atomic([debit, credit]);

    return {
      message: `you just sent NGN ${walletTransferArgs.amount} to ${walletTransferArgs.to}`,
    };
  }
}
