import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { IAuthTokens } from "@/modules/auth/interfaces/auth.interface";
import { User } from "@/modules/user/interfaces/user.interface";
import { BLACKLISTED_TOKENS } from "@/shared/constants";
import {
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_SECRET,
} from "@/shared/constants/env-vars";
import { RedisService } from "@/shared/redis/redis.service";

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async generateToken(payload: Partial<User>): Promise<IAuthTokens> {
    const accessToken = await this.jwtService.signAsync(
      {
        id: payload.id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
      },
      {
        secret: JWT_ACCESS_TOKEN_SECRET,
        expiresIn: JWT_ACCESS_TOKEN_EXPIRY,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { id: payload.id },
      {
        secret: JWT_REFRESH_TOKEN_SECRET,
        expiresIn: JWT_REFRESH_TOKEN_EXPIRY,
      },
    );

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(accessToken: string) {
    return (await this.jwtService.verifyAsync(accessToken, {
      secret: JWT_ACCESS_TOKEN_SECRET,
    })) as User;
  }

  async verifyRefreshToken(refreshToken: string) {
    return (await this.jwtService.verifyAsync(refreshToken, {
      secret: JWT_REFRESH_TOKEN_SECRET,
    })) as User;
  }

  async isBlacklisted(token: string) {
    return (await this.redisService.getList(BLACKLISTED_TOKENS)).includes(
      token,
    );
  }
}
