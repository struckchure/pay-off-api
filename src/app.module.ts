import { RedisModule } from "@nestjs-modules/ioredis";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import "dotenv/config";

import { AuthModule } from "@/modules/auth/auth.module";
import { PrismaModule } from "@/shared/prisma/prisma.module";
import { UserModule } from "@/modules/user/user.module";

@Module({
  imports: [
    JwtModule.register({ global: true }),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
        port: +process.env.REDIS_PORT,
        username: process.env.REDIS_USERNAME,
      },
    }),
    PrismaModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
