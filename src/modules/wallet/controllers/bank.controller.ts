import { Controller, Get, UseGuards } from "@nestjs/common";

import { AuthGuard } from "@/modules/auth/guards/auth.guard";
import { BankService } from "@/modules/wallet/services/bank.service";

@Controller("bank")
@UseGuards(AuthGuard)
export class BankController {
  constructor(private bankService: BankService) {}

  @Get()
  async bankList() {
    return await this.bankService.bankList();
  }
}
