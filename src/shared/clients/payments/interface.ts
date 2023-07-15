import { type } from "os";

export enum PaymentGateway {
  FLUTTERWAVE = "FLUTTERWAVE",
}

export interface GeneratePaymentLinkArgs<T = any> {
  paymentGateway: PaymentGateway;
  payload: T;
}

export type VerifyPaymentArgs<T = any> = GeneratePaymentLinkArgs<T>;
