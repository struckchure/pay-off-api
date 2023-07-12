import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";

import { BiometricType } from "@/modules/biometrics/interfaces/biometrics.interface";
import { BiometricsService } from "@/modules/biometrics/services/biometrics.service";

@Injectable()
export class BiometricsInterceptor implements NestInterceptor {
  constructor(private biometricsService: BiometricsService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    const files = req.files as unknown as {
      sample: Express.Multer.File[];
      target: Express.Multer.File[];
    };

    const sample = files.sample[0];
    const target = files.target[0];

    const { status } = await this.biometricsService.biometricsVerify({
      biometricType: BiometricType.FINGERPRINT,
      sample,
      target,
    });

    if (!status) throw new UnauthorizedException("User biometric failed");

    return next.handle();
  }
}
