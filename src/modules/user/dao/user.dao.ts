import { Injectable } from "@nestjs/common";

import {
  UserCreateArgs,
  UserDeleteArgs,
  UserGetArgs,
  UserListArgs,
  UserUpdateArgs,
} from "@/modules/user/interfaces/user.interface";
import { PrismaService } from "@/shared/prisma/prisma.service";
import { removeNullOrEmptyValues } from "@/shared/utils";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserDAO {
  constructor(private prismaService: PrismaService) {}

  async userList(userListArgs: UserListArgs) {
    const extraArgs = removeNullOrEmptyValues<Prisma.UserWhereInput>({
      isActive: userListArgs.isActive,
      userType: userListArgs.userType,
    });

    return await this.prismaService.user.findMany({
      skip: userListArgs.skip,
      take: userListArgs.take,
      where: {
        OR: userListArgs.search && [
          {
            firstName: {
              contains: userListArgs.search,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: userListArgs.search,
              mode: "insensitive",
            },
          },
          { email: { contains: userListArgs.search, mode: "insensitive" } },
        ],
        ...extraArgs,
      },
    });
  }

  async userCreate(userCreateArgs: UserCreateArgs) {
    return await this.prismaService.user.create({ data: userCreateArgs });
  }

  async userGet(userGetArgs: RequireAtLeastOne<UserGetArgs>) {
    return await this.prismaService.user.findFirst({ where: userGetArgs });
  }

  async userUpdate(
    userGetArgs: RequireAtLeastOne<UserGetArgs>,
    userUpdateArgs: UserUpdateArgs,
  ) {
    return await this.prismaService.user.update({
      where: {
        ...(userGetArgs.id ? { id: userGetArgs.id } : {}),
        ...(userGetArgs.email ? { email: userGetArgs.email } : {}),
      },
      data: userUpdateArgs,
    });
  }

  async userDelete(userDeleteArgs: RequireAtLeastOne<UserDeleteArgs>) {
    await this.prismaService.user.delete({
      where: {
        ...(userDeleteArgs.id ? { id: userDeleteArgs.id } : {}),
        ...(userDeleteArgs.email ? { email: userDeleteArgs.email } : {}),
      },
    });
  }
}
