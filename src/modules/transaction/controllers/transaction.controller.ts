import { Controller, Get, Param, ParseUUIDPipe, Query } from "@nestjs/common";

import { TransactionListDTO } from "@/modules/transaction/dto/transaction.dto";
import { TransactionService } from "@/modules/transaction/services/transaction.service";

@Controller("transaction")
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async transactionList(@Query() transactionListDTO: TransactionListDTO) {
    return await this.transactionService.transactionList(transactionListDTO);
  }

  @Get(":transactionId")
  async transactionGet(@Param(ParseUUIDPipe) transactionId: string) {
    return await this.transactionService.transactionGet({ id: transactionId });
  }
}
