import { SetMetadata } from "@nestjs/common";

import { UserType } from "@prisma/client";

export const USER_TYPE_KEY = "userType";
export const AllowedUserTypes = (...userTypes: UserType[]) =>
  SetMetadata(USER_TYPE_KEY, userTypes);
