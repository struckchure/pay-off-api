import { Injectable, NotFoundException } from "@nestjs/common";

import {
  IAuthGetProfile,
  IAuthUpdateProfile,
} from "@/modules/auth/interfaces/auth.interface";
import { UserDAO } from "@/modules/user/dao/user.dao";
import { IUser } from "@/modules/user/interfaces/user.interface";
import { removeObjectValueByKey } from "@/shared/utils";

@Injectable()
export class UserService {
  constructor(private userDAO: UserDAO) {}

  async userGetProfile(userGetProfileArgs: IAuthGetProfile): Promise<IUser> {
    const user = await this.userDAO.userGet({ id: userGetProfileArgs.id });
    if (!user) throw new NotFoundException("user does not exist");

    return removeObjectValueByKey(user, "password") as unknown as IUser;
  }

  async userUpdateProfile(
    userGetProfileArgs: IAuthGetProfile,
    userUpdateProfileArgs: IAuthUpdateProfile,
  ): Promise<IUser> {
    return removeObjectValueByKey(
      await this.userDAO.userUpdate(
        { id: userGetProfileArgs.id },
        userUpdateProfileArgs,
      ),
      "password",
    ) as unknown as IUser;
  }
}
