import { Injectable, NotFoundException } from "@nestjs/common";

import {
  AuthGetProfileArgs,
  AuthUpdateProfileArgs,
} from "@/modules/auth/interfaces/auth.interface";
import { UserDAO } from "@/modules/user/dao/user.dao";
import { User } from "@/modules/user/interfaces/user.interface";
import { removeObjectValueByKey } from "@/shared/utils";

@Injectable()
export class UserService {
  constructor(private userDAO: UserDAO) {}

  async userGetProfile(userGetProfileArgs: AuthGetProfileArgs): Promise<User> {
    const user = await this.userDAO.userGet({ id: userGetProfileArgs.id });
    if (!user) throw new NotFoundException("user does not exist");

    return removeObjectValueByKey(user, "password") as unknown as User;
  }

  async userUpdateProfile(
    userGetProfileArgs: AuthGetProfileArgs,
    userUpdateProfileArgs: AuthUpdateProfileArgs,
  ): Promise<User> {
    return removeObjectValueByKey(
      await this.userDAO.userUpdate(
        { id: userGetProfileArgs.id },
        userUpdateProfileArgs,
      ),
      "password",
    ) as unknown as User;
  }
}
