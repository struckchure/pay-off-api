import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { WebhookService } from "@/modules/wallet/services/webhook.service";
import { FlutterwavePaymentWebhookResponse } from "@/shared/clients/payments/flutterwave/interface";

@Controller("webhook")
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post("flutterwave")
  @HttpCode(HttpStatus.OK)
  async wehbookFlutterwave(
    @Body() wehbookFlutterwaveDTO: FlutterwavePaymentWebhookResponse,
  ) {
    return await this.webhookService.webhookFlutterwave(wehbookFlutterwaveDTO);
  }
}
