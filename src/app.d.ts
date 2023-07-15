import { UserType } from "@prisma/client";
import { Request as ExpressRequest } from "express";

declare global {
  interface Request extends ExpressRequest {
    user?: {
      id: string;
      email: string;
      userType: UserType;
    };
  }

  type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
    T,
    Exclude<keyof T, Keys>
  > &
    {
      [K in Keys]-?: Required<Pick<T, K>> &
        Partial<Record<Exclude<Keys, K>, undefined>>;
    }[Keys];

  type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
}
