export interface FlutterwaveInitializeArgs {
  amount: number;
  reference?: string;
  redirectUrl: string;
  email: string;
}

export interface FlutterwaveInitializeResponse {
  status: string;
  message: string;
  data: {
    link: string;
  };
}

export interface FlutterwaveWebhookResponse {
  event: string;
  data: FlutterwaveWebhookResponseData;
}

export interface FlutterwaveWebhookResponseData {
  id: number;
  tx_ref: string;
  status: string;
  amount: number;
}

export interface FlutterwaveVerifyPaymentArgs {
  paymentId: number;
}

export interface FlutterwaveVerifyPaymentResponse {
  status: string;
  message: string;
  data: FlutterwaveVerifyPaymentResponseData;
}

export interface FlutterwaveVerifyPaymentResponseData {
  id: number;
  tx_ref: string;
  status: string;
  amount: number;
}
