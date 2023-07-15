import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User } from "@/modules/user/interfaces/user.interface";
import { UserDAO } from "@/modules/user/dao/user.dao";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private userDAO: UserDAO) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Auth token is required");
    }

    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      })) as User;

      const user = await this.userDAO.userGet({ id: payload.id });
      if (!user) throw new UnauthorizedException("Invalid auth token");

      request.user = {
        id: user.id,
        email: user.email,
        userType: user.userType,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers["authorization"]?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
