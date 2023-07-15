import { Injectable, NotImplementedException } from "@nestjs/common";

import { FlutterwaveClient } from "@/shared/clients/payments/flutterwave";
import {
  GeneratePaymentLinkArgs,
  PaymentGateway,
  VerifyPaymentArgs,
} from "@/shared/clients/payments/interface";

@Injectable()
export class PaymentClient {
  constructor(private flutterwaveClient: FlutterwaveClient) {}

  async generatePaymentLink(generatePaymentLinkArgs: GeneratePaymentLinkArgs) {
    switch (generatePaymentLinkArgs.paymentGateway) {
      case PaymentGateway.FLUTTERWAVE:
        return this.flutterwaveClient.flutterwaveInitialize(
          generatePaymentLinkArgs.payload,
        );
      default:
        throw new NotImplementedException();
    }
  }

  async verifyPayment(verifyPaymentArgs: VerifyPaymentArgs) {
    switch (verifyPaymentArgs.paymentGateway) {
      case PaymentGateway.FLUTTERWAVE:
        return this.flutterwaveClient.fluttewaverVerifyPayment(
          verifyPaymentArgs.payload,
        );
      default:
        throw new NotImplementedException();
    }
  }
}
