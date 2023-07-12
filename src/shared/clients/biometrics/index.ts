import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

import { BIOMETRICS_VERIFICATION_API_URL } from "@/shared/constants/env-vars";

interface FingerprintVerifyArgs {
  target: Express.Multer.File;
  sample: Express.Multer.File;
}

interface FingerprintVerifyResponse {
  matchScore: number;
}

@Injectable()
export class BiometricsClient {
  constructor(private httpService: HttpService) {}

  async fingerprintVerify(fingerprintVerifyArgs: FingerprintVerifyArgs) {
    const payload = new FormData();
    payload.append(
      "target",
      new Blob([fingerprintVerifyArgs.target.buffer]),
      fingerprintVerifyArgs.target.originalname,
    );
    payload.append(
      "sample",
      new Blob([fingerprintVerifyArgs.sample.buffer]),
      fingerprintVerifyArgs.sample.originalname,
    );

    const fingerprintVerifyResponse =
      this.httpService.post<FingerprintVerifyResponse>(
        `${BIOMETRICS_VERIFICATION_API_URL}/fingerprint/`,
        payload,
      );
    return (await firstValueFrom(fingerprintVerifyResponse)).data;
  }
}
