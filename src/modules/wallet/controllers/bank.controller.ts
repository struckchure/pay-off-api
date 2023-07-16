import { Controller, Get } from "@nestjs/common";

import { BankService } from "@/modules/wallet/services/bank.service";

@Controller("bank")
export class BankController {
  constructor(private bankService: BankService) {}

  @Get()
  async bankList() {
    return await this.bankService.bankList();
  }
}
