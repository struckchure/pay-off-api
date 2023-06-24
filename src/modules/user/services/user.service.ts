import { removeObjectValueByKey } from "@/shared/utils";
import { Injectable, NotFoundException } from "@nestjs/common";

import { UserDAO } from "../dao/user.dao";
import {
  IAuthGetProfile,
  IAuthUpdateProfile,
} from "../../auth/interfaces/auth.interface";
import { IUser } from "../interfaces/user.interface";

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
