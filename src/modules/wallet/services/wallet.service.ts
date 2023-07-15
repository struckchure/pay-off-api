import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as crypto from "crypto";

import { TransactionDAO } from "@/modules/transaction/dao/transaction.dao";
import { UserDAO } from "@/modules/user/dao/user.dao";
import { WalletDAO } from "@/modules/wallet/dao/wallet.dao";
import {
  WalletFundArgs,
  WalletGetArgs,
  WalletListArgs,
  WalletTransferArgs,
} from "@/modules/wallet/interfaces/wallet.interface";
import { AtomicHelper } from "@/shared/prisma/prisma.utils";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { PaymentClient } from "@/shared/clients/payments";
import { PaymentGateway } from "@/shared/clients/payments/interface";

@Injectable()
export class WalletService {
  constructor(
    private atomicHelper: AtomicHelper,
    private transactionDAO: TransactionDAO,
    private userDAO: UserDAO,
    private walletDAO: WalletDAO,
    private paymentClient: PaymentClient,
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

    const newSenderBalance = +senderWallet.balance - +walletTransferArgs.amount;
    const newRecieverBalance =
      +recieverWallet.balance + +walletTransferArgs.amount;

    const debitTransaction = this.transactionDAO.transactionCreateNoAsync({
      userId: senderWallet.userId,
      amount: walletTransferArgs.amount,
      transactionType: TransactionType.DEBIT,
      transactionStatus: TransactionStatus.SUCCESSFULL,
      reference: crypto.randomBytes(4).toString("hex"),
    });
    const debit = this.walletDAO.walletUpdateNoAsync(
      { userId: senderWallet.userId },
      { balance: newSenderBalance },
    );
    const creditTransaction = this.transactionDAO.transactionCreateNoAsync({
      userId: recieverWallet.userId,
      amount: walletTransferArgs.amount,
      transactionType: TransactionType.CREDIT,
      transactionStatus: TransactionStatus.SUCCESSFULL,
      reference: crypto.randomBytes(4).toString("hex"),
    });
    const credit = this.walletDAO.walletUpdateNoAsync(
      { userId: recieverWallet.userId },
      { balance: newRecieverBalance },
    );

    await this.atomicHelper.atomic([
      debitTransaction,
      debit,
      creditTransaction,
      credit,
    ]);

    return {
      message: `you just sent NGN ${walletTransferArgs.amount} to ${walletTransferArgs.to}`,
    };
  }

  async walletFund(walletFundArgs: WalletFundArgs) {
    const { reference, link } = await this.paymentClient.generatePaymentLink({
      paymentGateway: PaymentGateway.FLUTTERWAVE,
      payload: walletFundArgs,
    });

    const { id: userId } = await this.userDAO.userGet({
      email: walletFundArgs.email,
    });

    await this.transactionDAO.transactionCreate({
      userId,
      amount: walletFundArgs.amount,
      transactionType: TransactionType.CREDIT,
      transactionStatus: TransactionStatus.PENDING,
      reference,
      description: `Wallet Fund / NGN ${walletFundArgs.amount}`,
      meta: {
        paymentGateway: PaymentGateway.FLUTTERWAVE,
      },
    });

    return { link };
  }
}
