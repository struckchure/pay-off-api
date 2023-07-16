import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { TransactionDAO } from "@/modules/transaction/dao/transaction.dao";
import { WalletDAO } from "@/modules/wallet/dao/wallet.dao";
import { WalletService } from "@/modules/wallet/services/wallet.service";
import { PaymentClient } from "@/shared/clients/payments";
import { FlutterwavePaymentWebhookResponse } from "@/shared/clients/payments/flutterwave/interface";
import { PaymentGateway } from "@/shared/clients/payments/interface";
import { TransactionStatus } from "@prisma/client";

@Injectable()
export class WebhookService {
  constructor(
    private transactionDAO: TransactionDAO,
    private walletDAO: WalletDAO,
    private walletService: WalletService,
    private paymentClient: PaymentClient,
  ) {}

  async webhookFlutterwave(
    webhookFlutterwaveArgs: FlutterwavePaymentWebhookResponse,
  ) {
    switch (webhookFlutterwaveArgs.event) {
      case "charge.completed":
        return await this.processChargeCompleted(webhookFlutterwaveArgs);
      case "transfer.completed":
        return await this.processTransferCompleted(webhookFlutterwaveArgs);
    }
  }

  private async processChargeCompleted(
    webhookFlutterwaveArgs: FlutterwavePaymentWebhookResponse,
  ) {
    const transaction = await this.transactionDAO.transactionGet({
      reference: webhookFlutterwaveArgs.data.tx_ref,
    });
    if (!transaction) throw new NotFoundException("transaction not found");

    if (transaction.transactionStatus !== TransactionStatus.PENDING) {
      throw new BadRequestException("transaction already verified");
    }

    if (webhookFlutterwaveArgs?.data?.status === "successful") {
      const { status } = await this.paymentClient.verifyPayment({
        paymentGateway: PaymentGateway.FLUTTERWAVE,
        payload: { paymentId: webhookFlutterwaveArgs.data.id },
      });

      if (!status) throw new BadRequestException(status);

      await this.transactionDAO.transactionUpdate(
        { id: transaction.id },
        { transactionStatus: TransactionStatus.SUCCESSFUL },
      );

      const wallet = await this.walletService.walletGet({
        userId: transaction.userId,
      });
      const newWalletBalance = +transaction.amount + +wallet.balance;

      await this.walletDAO.walletUpdate(
        { userId: transaction.userId },
        { balance: newWalletBalance },
      );

      return {
        message: "flutterwave wehbook verification successful",
      };
    } else {
      await this.transactionDAO.transactionUpdate(
        { id: transaction.id },
        { transactionStatus: TransactionStatus.FAILED },
      );

      throw new BadRequestException("flutterwave webhook verification failed");
    }
  }

  private async processTransferCompleted(
    webhookFlutterwaveArgs: FlutterwavePaymentWebhookResponse,
  ) {
    const transaction = await this.transactionDAO.transactionGet({
      reference: String(webhookFlutterwaveArgs.data.id),
    });
    if (!transaction) throw new NotFoundException("transaction not found");

    if (transaction.transactionStatus !== TransactionStatus.PENDING) {
      throw new BadRequestException("transaction already verified");
    }

    if (webhookFlutterwaveArgs?.data?.status.toLowerCase() === "successful") {
      const { status } = await this.paymentClient.verifyPayment({
        paymentGateway: PaymentGateway.FLUTTERWAVE,
        payload: { paymentId: webhookFlutterwaveArgs.data.id },
      });

      if (!status) throw new BadRequestException(status);

      await this.transactionDAO.transactionUpdate(
        { id: transaction.id },
        { transactionStatus: TransactionStatus.SUCCESSFUL },
      );

      const wallet = await this.walletService.walletGet({
        userId: transaction.userId,
      });
      const newWalletBalance = +wallet.balance - +transaction.amount;

      await this.walletDAO.walletUpdate(
        { userId: transaction.userId },
        { balance: newWalletBalance },
      );

      return {
        message: "flutterwave wehbook verification successful",
      };
    } else {
      await this.transactionDAO.transactionUpdate(
        { id: transaction.id },
        { transactionStatus: TransactionStatus.FAILED },
      );

      throw new BadRequestException("flutterwave webhook verification failed");
    }
  }
}
