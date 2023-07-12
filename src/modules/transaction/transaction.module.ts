import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { TransactionController } from "@/modules/transaction/controllers/transaction.controller";
import { TransactionDAO } from "@/modules/transaction/dao/transaction.dao";
import { TransactionService } from "@/modules/transaction/services/transaction.service";
import { MediaService } from "@/shared/media/media.service";

@Module({
  controllers: [TransactionController],
  providers: [MediaService, TransactionDAO, TransactionService],
  imports: [HttpModule],
})
export class TransactionModule {}
