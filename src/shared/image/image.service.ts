import { Injectable } from "@nestjs/common";

import { IMatchFeaturesProps } from "@/shared/image/image.interface";

@Injectable()
export class OpenCVService {
  matchFeatures(matchFeaturesArgs: IMatchFeaturesProps) {}
}
