import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AllowedUserTypes } from "@/modules/auth/decorators/user-type.decorator";
import { AuthGuard } from "@/modules/auth/guards/auth.guard";
import { UserTypeGuard } from "@/modules/auth/guards/user-type.guard";
import { TransactionListDTO } from "@/modules/transaction/dto/transaction.dto";
import { TransactionService } from "@/modules/transaction/services/transaction.service";
import { UserType } from "@prisma/client";

@Controller("transaction")
@UseGuards(AuthGuard, UserTypeGuard)
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  @AllowedUserTypes(UserType.ADMIN, UserType.CUSTOMER, UserType.MERCHANT)
  async transactionList(
    @Query() transactionListDTO: TransactionListDTO,
    @Req() request: Request,
  ) {
    switch (request.user.userType) {
      case UserType.ADMIN:
        transactionListDTO.userId = transactionListDTO.userId || null;
        break;
      case UserType.CUSTOMER:
      case UserType.MERCHANT:
        transactionListDTO.userId = request.user.id;
        break;
    }

    return await this.transactionService.transactionList(transactionListDTO);
  }

  @Get(":transactionId")
  @AllowedUserTypes(UserType.ADMIN, UserType.CUSTOMER, UserType.MERCHANT)
  async transactionGet(
    @Param("transactionId", ParseUUIDPipe) transactionId: string,
    @Req() request: Request,
  ) {
    // TODO: refactor object owner permission here
    const transaction = await this.transactionService.transactionGet({
      id: transactionId,
    });

    let canViewObject = false;
    switch (request.user.userType) {
      case UserType.CUSTOMER:
        if (transaction.userId === request.user.id) {
          canViewObject = true;
          break;
        }
      case UserType.ADMIN:
        canViewObject = true;
        break;
    }

    if (!canViewObject) {
      throw new ForbiddenException(
        "you are not authorized to access this resource",
      );
    }

    return transaction;
  }
}
