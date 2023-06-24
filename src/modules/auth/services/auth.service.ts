import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { BLACKLISTED_TOKENS } from "@/shared/constants";
import { CryptoService } from "@/shared/crypto/crypto.service";
import { RedisService } from "@/shared/redis/redis.service";
import { TokenService } from "@/shared/token/token.service";
import { removeObjectValueByKey } from "@/shared/utils";
import { UserDAO } from "@/modules/user/dao/user.dao";
import {
  IAuthLogin,
  IAuthRegister,
  IAuthTokens,
} from "@/modules/auth/interfaces/auth.interface";
import { IUser } from "@/modules/user/interfaces/user.interface";

@Injectable()
export class AuthService {
  constructor(
    private userDAO: UserDAO,
    private crypoService: CryptoService,
    private tokenService: TokenService,
    private redisService: RedisService,
  ) {}

  async authRegister(
    authRegisterArgs: IAuthRegister,
  ): Promise<Omit<IUser, "password"> & { tokens: IAuthTokens }> {
    const userExists = !!(await this.userDAO.userGet({
      email: authRegisterArgs.email,
    }));
    if (userExists)
      throw new BadRequestException("User with this email already exists");

    authRegisterArgs.password = this.crypoService.hash(
      authRegisterArgs.password,
    );

    const user = removeObjectValueByKey(
      await this.userDAO.userCreate(authRegisterArgs),
      "password",
    ) as unknown as IUser;

    return {
      ...user,
      tokens: await this.tokenService.generateToken(user),
    };
  }

  async authLogin(
    authLoginArgs: IAuthLogin,
  ): Promise<Omit<IUser, "password"> & { tokens: IAuthTokens }> {
    const user = await this.userDAO.userGet({
      email: authLoginArgs.email,
    });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isPasswordCorrect = this.crypoService.compare(
      authLoginArgs.password,
      user.password,
    );
    if (!isPasswordCorrect)
      throw new UnauthorizedException("Invalid credentials");

    return {
      ...(removeObjectValueByKey(user, "password") as unknown as IUser),
      tokens: await this.tokenService.generateToken(user as IUser),
    };
  }

  async authLogout(refreshToken: string): Promise<void> {
    await this.redisService.push(BLACKLISTED_TOKENS, refreshToken);
  }

  async authObtainTokens(refreshToken: string): Promise<IAuthTokens> {
    if (await this.tokenService.isBlacklisted(refreshToken)) {
      throw new UnauthorizedException("Refresh token is not valid");
    }
    const { id: userId } = await this.tokenService.verifyRefreshToken(
      refreshToken,
    );

    const user = (await this.userDAO.userGet({ id: userId })) as IUser;

    await this.redisService.push(BLACKLISTED_TOKENS, refreshToken);

    return await this.tokenService.generateToken(user);
  }
}
