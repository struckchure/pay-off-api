export enum PaymentGateway {
  FLUTTERWAVE = "FLUTTERWAVE",
}

export interface GeneratePaymentLinkArgs<T = any> {
  paymentGateway: PaymentGateway;
  payload: T;
}
