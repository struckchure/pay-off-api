import { Module } from "@nestjs/common";

import { AuthController } from "@/modules/auth/controllers/auth.controller";
import { AuthService } from "@/modules/auth/services/auth.service";
import { CryptoService } from "@/shared/crypto/crypto.service";
import { RedisService } from "@/shared/redis/redis.service";
import { TokenService } from "@/shared/token/token.service";
import { UserDAO } from "@/modules/user/dao/user.dao";

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserDAO, CryptoService, TokenService, RedisService],
})
export class AuthModule {}
