import { Injectable } from "@nestjs/common";

import { PaymentClient } from "@/shared/clients/payments";
import { PaymentGateway } from "@/shared/clients/payments/interface";

@Injectable()
export class BankService {
  constructor(private paymentClient: PaymentClient) {}

  async bankList() {
    return await this.paymentClient.listBanks({
      paymentGateway: PaymentGateway.FLUTTERWAVE,
    });
  }
}
