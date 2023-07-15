import { Injectable, NotImplementedException } from "@nestjs/common";

import { FlutterwaveClient } from "@/shared/clients/payments/flutterwave";
import {
  GeneratePaymentLinkArgs,
  PaymentGateway,
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
}
