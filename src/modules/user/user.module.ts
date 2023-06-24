import { Module } from "@nestjs/common";

import { UserController } from "@/modules/user/controllers/user.controller";
import { UserDAO } from "@/modules/user/dao/user.dao";
import { UserService } from "@/modules/user/services/user.service";

@Module({
  providers: [UserService, UserDAO],
  controllers: [UserController],
  exports: [UserDAO],
})
export class UserModule {}
