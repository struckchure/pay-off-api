import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";

import { BiometricsDAO } from "@/modules/biometrics/dao/biometrics.dao";
import { BiometricType } from "@/modules/biometrics/interfaces/biometrics.interface";
import { BiometricsService } from "@/modules/biometrics/services/biometrics.service";
import { MediaService } from "@/shared/media/media.service";
import { TokenService } from "@/shared/token/token.service";

@Injectable()
export class BiometricsInterceptor implements NestInterceptor {
  constructor(
    private biometricsDAO: BiometricsDAO,
    private biometricsService: BiometricsService,
    private mediaService: MediaService,
    private tokenService: TokenService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    const sample = request.file as Express.Multer.File;

    if (!sample) {
      throw new BadRequestException("sample must be specified");
    }

    const token = request.headers["authorization"].split(" ")[1];
    const { id: userId } = await this.tokenService.verifyAccessToken(token);

    const biometric = await this.biometricsDAO.biometricsGet({ userId });

    const target = await this.mediaService.downloadToFile(
      biometric.biometricUrl,
    );

    const { status: isBiometricsValid } =
      await this.biometricsService.biometricsVerify({
        biometricType: BiometricType.FINGERPRINT,
        sample,
        target,
      });

    if (!isBiometricsValid) {
      throw new UnauthorizedException("user biometric failed");
    }

    return next.handle();
  }
}
