import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { BLACKLISTED_TOKENS } from "@/shared/constants";
import { RedisService } from "@/shared/redis/redis.service";
import { IAuthTokens } from "@/modules/auth/interfaces/auth.interface";
import { IUser } from "@/modules/user/interfaces/user.interface";

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async generateToken(payload: Partial<IUser>): Promise<IAuthTokens> {
    const accessToken = await this.jwtService.signAsync(
      {
        id: payload.id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
      },
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { id: payload.id },
      {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
      },
    );

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(accessToken: string) {
    return (await this.jwtService.verifyAsync(accessToken, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    })) as IUser;
  }

  async verifyRefreshToken(refreshToken: string) {
    return (await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    })) as IUser;
  }

  async isBlacklisted(token: string) {
    return (await this.redisService.getList(BLACKLISTED_TOKENS)).includes(
      token,
    );
  }
}
