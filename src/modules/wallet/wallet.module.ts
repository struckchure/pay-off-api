import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { BiometricsDAO } from "@/modules/biometrics/dao/biometrics.dao";
import { BiometricsService } from "@/modules/biometrics/services/biometrics.service";
import { TransactionDAO } from "@/modules/transaction/dao/transaction.dao";
import { UserDAO } from "@/modules/user/dao/user.dao";
import { BankController } from "@/modules/wallet/controllers/bank.controller";
import { CallbackController } from "@/modules/wallet/controllers/callback.controller";
import { WalletController } from "@/modules/wallet/controllers/wallet.controller";
import { WebhookController } from "@/modules/wallet/controllers/webhook.controller";
import { WalletDAO } from "@/modules/wallet/dao/wallet.dao";
import { BankService } from "@/modules/wallet/services/bank.service";
import { WalletService } from "@/modules/wallet/services/wallet.service";
import { WebhookService } from "@/modules/wallet/services/webhook.service";
import { BiometricsClient } from "@/shared/clients/biometrics";
import { PaymentClient } from "@/shared/clients/payments";
import { FlutterwaveClient } from "@/shared/clients/payments/flutterwave";
import { MediaService } from "@/shared/media/media.service";
import { RedisService } from "@/shared/redis/redis.service";
import { TokenService } from "@/shared/token/token.service";

@Module({
  controllers: [
    BankController,
    CallbackController,
    WalletController,
    WebhookController,
  ],
  providers: [
    BankService,
    BiometricsClient,
    BiometricsDAO,
    BiometricsService,
    FlutterwaveClient,
    MediaService,
    PaymentClient,
    RedisService,
    TokenService,
    TransactionDAO,
    UserDAO,
    WalletDAO,
    WalletService,
    WebhookService,
  ],
  imports: [HttpModule],
})
export class WalletModule {}
