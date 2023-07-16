import { Injectable, NotImplementedException } from "@nestjs/common";

import { FlutterwaveClient } from "@/shared/clients/payments/flutterwave";
import {
  PaymentArgs,
  PaymentGateway,
} from "@/shared/clients/payments/interface";
import {
  FlutterwaveInitiateTransferArgs,
  FlutterwaveResolveBankAccountArgs,
  FlutterwaveVerifyPaymentArgs,
} from "@/shared/clients/payments/flutterwave/interface";

@Injectable()
export class PaymentClient {
  constructor(private flutterwaveClient: FlutterwaveClient) {}

  async generatePaymentLink(generatePaymentLinkArgs: PaymentArgs) {
    switch (generatePaymentLinkArgs.paymentGateway) {
      case PaymentGateway.FLUTTERWAVE:
        return this.flutterwaveClient.flutterwaveInitialize(
          generatePaymentLinkArgs.payload,
        );
      default:
        throw new NotImplementedException();
    }
  }

  async verifyPayment(verifyPaymentArgs: PaymentArgs) {
    switch (verifyPaymentArgs.paymentGateway) {
      case PaymentGateway.FLUTTERWAVE:
        return this.flutterwaveClient.flutterwaveVerifyPayment(
          verifyPaymentArgs.payload,
        );
      default:
        throw new NotImplementedException();
    }
  }

  async transfer<T = any>(transferArgs: PaymentArgs<T>) {
    switch (transferArgs.paymentGateway) {
      case PaymentGateway.FLUTTERWAVE:
        return await this.flutterwaveClient.flutterwaveInitiateTransfer(
          transferArgs.payload as FlutterwaveInitiateTransferArgs,
        );
      default:
        throw new NotImplementedException();
    }
  }

  async verifyTransfer<T = any>(verifyTransferArgs: PaymentArgs<T>) {
    switch (verifyTransferArgs.paymentGateway) {
      case PaymentGateway.FLUTTERWAVE:
        return await this.flutterwaveClient.flutterwaveVerifyTransfer(
          verifyTransferArgs.payload as FlutterwaveVerifyPaymentArgs,
        );
      default:
        throw new NotImplementedException();
    }
  }

  async listBanks(listBanksArgs: Pick<PaymentArgs, "paymentGateway">) {
    switch (listBanksArgs.paymentGateway) {
      case PaymentGateway.FLUTTERWAVE:
        return await this.flutterwaveClient.flutterwaveListBanks();
      default:
        throw new NotImplementedException();
    }
  }

  async resolveBankAccount<T = any>(resolveBankAccountArgs: PaymentArgs<T>) {
    switch (resolveBankAccountArgs.paymentGateway) {
      case PaymentGateway.FLUTTERWAVE:
        return await this.flutterwaveClient.flutterwaveResolveBankAccount(
          resolveBankAccountArgs.payload as FlutterwaveResolveBankAccountArgs,
        );
      default:
        throw new NotImplementedException();
    }
  }
}
