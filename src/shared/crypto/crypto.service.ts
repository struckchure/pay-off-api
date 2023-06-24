import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class CryptoService {
  hash(value: string) {
    return bcrypt.hashSync(value, bcrypt.genSaltSync(10));
  }

  async compare(value: string, hashed: string) {
    return bcrypt.compare(value, hashed);
  }
}
