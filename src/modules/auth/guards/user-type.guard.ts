import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { USER_TYPE_KEY } from "@/modules/auth/decorators/user-type.decorator";
import { UserType } from "@prisma/client";

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredUserTypes = this.reflector.getAllAndOverride<UserType[]>(
      USER_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredUserTypes) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest() as Request;

    const isAllowed = requiredUserTypes.includes(user.userType);
    if (!isAllowed) {
      throw new ForbiddenException(
        "you are not authorized to access this resource",
      );
    }

    return true;
  }
}
