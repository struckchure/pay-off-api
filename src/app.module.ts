import { RedisModule } from "@nestjs-modules/ioredis";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import "dotenv/config";

import { AuthModule } from "@/modules/auth/auth.module";
import { BiometricsModule } from "@/modules/biometrics/biometrics.module";
import { TransactionModule } from "@/modules/transaction/transaction.module";
import { UserModule } from "@/modules/user/user.module";
import {
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USERNAME,
} from "@/shared/constants/env-vars";
import { PrismaModule } from "@/shared/prisma/prisma.module";
import { WalletModule } from "./modules/wallet/wallet.module";

@Module({
  imports: [
    JwtModule.register({ global: true }),
    RedisModule.forRoot({
      config: {
        host: REDIS_HOST,
        password: REDIS_PASSWORD,
        port: REDIS_PORT,
        username: REDIS_USERNAME,
      },
    }),
    AuthModule,
    BiometricsModule,
    PrismaModule,
    TransactionModule,
    UserModule,
    WalletModule,
  ],
})
export class AppModule {}
