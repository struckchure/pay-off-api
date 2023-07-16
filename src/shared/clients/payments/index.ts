import { Injectable, NotImplementedException } from "@nestjs/common";

import { FlutterwaveClient } from "@/shared/clients/payments/flutterwave";
import {
  PaymentArgs,
  PaymentGateway,
} from "@/shared/clients/payments/interface";
import {
  FlutterwaveInitiateTransferArgs,
  FlutterwaveVerifyPaymentArgs,
} from "./flutterwave/interface";

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
        return this.flutterwaveClient.fluttewaverVerifyPayment(
          verifyPaymentArgs.payload,
        );
      default:
        throw new NotImplementedException();
    }
  }

  async transfer<T = any>(transferArgs: PaymentArgs<T>) {
    switch (transferArgs.paymentGateway) {
      case PaymentGateway.FLUTTERWAVE:
        return await this.flutterwaveClient.fluttewaverInitiateTransfer(
          transferArgs.payload as FlutterwaveInitiateTransferArgs,
        );
      default:
        throw new NotImplementedException();
    }
  }

  async verifyTransfer<T = any>(verifyTransferArgs: PaymentArgs<T>) {
    switch (verifyTransferArgs.paymentGateway) {
      case PaymentGateway.FLUTTERWAVE:
        return await this.flutterwaveClient.fluttewaverVerifyTransfer(
          verifyTransferArgs.payload as FlutterwaveVerifyPaymentArgs,
        );
    }
  }
}
