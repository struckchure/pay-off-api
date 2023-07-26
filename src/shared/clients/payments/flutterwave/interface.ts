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

export interface FlutterwavePaymentWebhookResponse {
  event: string;
  data: FlutterwavePaymentWebhookResponseData;
}

export interface FlutterwavePaymentWebhookResponseData {
  id: number;
  tx_ref: string;
  status: string;
  amount: number;
}

export interface FlutterwaveTransferWebhookResponse {
  event: string;
  data: FlutterwaveTransferWebhookResponseData;
}

export interface FlutterwaveTransferWebhookResponseData {
  id: number;
  reference: string;
  status: string;
  amount: number;
  is_approved: number;
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

export interface FlutterwaveInitiateTransferArgs {
  accountBank: string;
  accountNumber: string;
  amount: number;
  narration: string;
  reference: string;
  redirectUrl: string;
}

export interface FlutterwaveInitiateTransferResponse {
  status: string;
  message: string;
  data: FlutterwaveInitiateTransferResponseData;
}

export interface FlutterwaveInitiateTransferResponseData {
  id: number;
  account_number: string;
  bank_code: string;
  full_name: string;
  created_at: string;
  currency: string;
  debit_currency: string;
  amount: number;
  fee: number;
  status: string;
  reference: string;
  meta: any;
  narration: string;
  complete_message: string;
  requires_approval: number;
  is_approved: number;
  bank_name: string;
}

export interface FlutterwaveVerifyTransferResponse {
  status: string;
  message: string;
  data: FlutterwaveVerifyTransferResponseData;
}

export interface FlutterwaveVerifyTransferResponseData {
  id: number;
  account_number: string;
  bank_code: string;
  full_name: string;
  created_at: string;
  currency: string;
  debit_currency: string;
  amount: number;
  fee: number;
  status: string;
  reference: string;
  meta: any;
  narration: string;
  approver: any;
  complete_message: string;
  requires_approval: number;
  is_approved: number;
  bank_name: string;
}

export interface FlutterwaveResolveBankAccountArgs {
  accountNumber: string;
  accountBank: string;
}

export interface FlutterwaveResolveBankAccountResponse {
  status: string;
  message: string;
  data: FlutterwaveResolveBankAccountResponseData;
}

export interface FlutterwaveResolveBankAccountResponseData {
  account_number: string;
  account_name: string;
}

export interface FlutterwaveListBanksResponse {
  status: string;
  message: string;
  data: FlutterwaveListBanksResponseData[];
}

export interface FlutterwaveListBanksResponseData {
  id: number;
  code: string;
  name: string;
}

export interface FlutterwaveCreateVirtualAccountArgs {
  email: string;
  bvn: string;
  reference: string;
  fullName: string;
}

export interface FlutterwaveCreateVirtualAccountResponse {
  status: string;
  message: string;
  data: FlutterwaveCreateVirtualAccountResponseData;
}

interface FlutterwaveCreateVirtualAccountResponseData {
  response_code: string;
  response_message: string;
  flw_ref: string;
  order_ref: string;
  account_number: string;
  frequency: string;
  bank_name: string;
  created_at: string;
  expiry_date: string;
  note: string;
  amount: any;
}
