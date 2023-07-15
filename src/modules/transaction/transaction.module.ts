import { Module } from "@nestjs/common";

import { TransactionController } from "@/modules/transaction/controllers/transaction.controller";
import { TransactionDAO } from "@/modules/transaction/dao/transaction.dao";
import { TransactionService } from "@/modules/transaction/services/transaction.service";
import { UserDAO } from "@/modules/user/dao/user.dao";
import { MediaService } from "@/shared/media/media.service";

@Module({
  controllers: [TransactionController],
  providers: [MediaService, TransactionDAO, TransactionService, UserDAO],
})
export class TransactionModule {}
