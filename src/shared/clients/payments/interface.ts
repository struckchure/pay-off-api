export enum PaymentGateway {
  FLUTTERWAVE = "FLUTTERWAVE",
}

export interface PaymentArgs<T = any> {
  paymentGateway: PaymentGateway;
  payload: T;
}
