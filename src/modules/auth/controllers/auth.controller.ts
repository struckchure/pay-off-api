import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import {
  AuthLoginDTO,
  AuthLogoutDTO,
  AuthObtainTokensDTO,
  AuthRegisterDTO,
} from "@/modules/auth/dto/auth.dto";
import { AuthService } from "@/modules/auth/services/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async authRegister(@Body() authRegisterDTO: AuthRegisterDTO) {
    return await this.authService.authRegister(authRegisterDTO);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async authLogin(@Body() authLoginDTO: AuthLoginDTO) {
    return await this.authService.authLogin(authLoginDTO);
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() authLogoutDTO: AuthLogoutDTO) {
    await this.authService.authLogout(authLogoutDTO.refreshToken);
  }

  @Post("obtain-tokens")
  @HttpCode(HttpStatus.CREATED)
  async authObtainTokens(@Body() authObtainTokensDTO: AuthObtainTokensDTO) {
    return await this.authService.authObtainTokens(
      authObtainTokensDTO.refreshToken,
    );
  }
}
