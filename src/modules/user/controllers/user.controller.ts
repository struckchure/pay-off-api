import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";

import { UserUpdateProfileDTO } from "@/modules/user/dto/user.dto";
import { AuthGuard } from "@/modules/auth/guards/auth.guard";
import { UserService } from "@/modules/user/services/user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("profile")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async userGetProfile(@Req() request: Request) {
    return await this.userService.userGetProfile({ id: request.user.id });
  }

  @Patch("profile")
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AuthGuard)
  async userUpdateProfile(
    @Req() request: Request,
    @Body() userUpdateProfileDTO: UserUpdateProfileDTO,
  ) {
    return await this.userService.userUpdateProfile(
      { id: request.user.id },
      userUpdateProfileDTO,
    );
  }
}
