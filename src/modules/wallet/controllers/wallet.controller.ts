import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseBoolPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { AuthGuard } from "@/modules/auth/guards/auth.guard";
import { BiometricsInterceptor } from "@/modules/biometrics/interceptors/biometrics.interceptor";
import {
  WalletFundDTO,
  WalletTransferDTO,
  WalletWithdrawalDTO,
} from "@/modules/wallet/dto/wallet.dto";
import { WalletService } from "@/modules/wallet/services/wallet.service";

@Controller("wallet")
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  async walletGet(@Req() request: Request) {
    return await this.walletService.walletGet({ userId: request.user.id });
  }

  @Post("transfer")
  @UseInterceptors(FileInterceptor("sample"), BiometricsInterceptor)
  async walletTransfer(
    @Req() request: Request,
    @Body() walletTransferDTO: WalletTransferDTO,
  ) {
    return await this.walletService.walletTransfer({
      ...walletTransferDTO,
      from: request.user.email,
    });
  }

  @Post("fund")
  async walletFund(
    @Body() walletFundDTO: WalletFundDTO,
    @Req() request: Request,
  ) {
    return await this.walletService.walletFund({
      ...walletFundDTO,
      email: request.user.email,
      redirectUrl:
        walletFundDTO.redirectUrl ||
        `${request.protocol}://${request.get("Host")}/callback/flutterwave/`,
    });
  }

  @Post("withdrawal")
  async walletWithdrawal(
    @Body() walletWithdrawalDTO: WalletWithdrawalDTO,
    @Req() request: Request,
    @Query("resolveAccount", new DefaultValuePipe(false), ParseBoolPipe)
    resolveAccount: boolean,
  ) {
    if (resolveAccount) {
      return await this.walletService.walletWithdrawalResolveAccount({
        accountNumber: walletWithdrawalDTO.accountNumber,
        accountBank: walletWithdrawalDTO.accountBank,
      });
    }

    return await this.walletService.walletWithdrawal({
      ...walletWithdrawalDTO,
      userId: request.user.id,
    });
  }
}
