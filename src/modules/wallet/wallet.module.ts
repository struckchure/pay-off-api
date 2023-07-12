import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { BiometricsDAO } from "@/modules/biometrics/dao/biometrics.dao";
import { BiometricsService } from "@/modules/biometrics/services/biometrics.service";
import { UserDAO } from "@/modules/user/dao/user.dao";
import { WalletController } from "@/modules/wallet/controllers/wallet.controller";
import { WalletDAO } from "@/modules/wallet/dao/wallet.dao";
import { WalletService } from "@/modules/wallet/services/wallet.service";
import { BiometricsClient } from "@/shared/clients/biometrics";
import { MediaService } from "@/shared/media/media.service";
import { RedisService } from "@/shared/redis/redis.service";
import { TokenService } from "@/shared/token/token.service";

@Module({
  controllers: [WalletController],
  providers: [
    BiometricsClient,
    BiometricsDAO,
    BiometricsService,
    MediaService,
    RedisService,
    TokenService,
    UserDAO,
    WalletDAO,
    WalletService,
  ],
  imports: [HttpModule],
})
export class WalletModule {}
