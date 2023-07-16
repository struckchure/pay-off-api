export interface WalletListArgs {
  skip?: number;
  take?: number;

  isActive?: boolean;
}

export interface WalletCreateArgs {
  userId: string;
}

export interface WalletGetArgs {
  userId?: string;
  email?: string;
}

export interface WalletUpdateArgs {
  balance?: number;
  isActive?: boolean;
}

export type WalletDeleteArgs = Partial<WalletGetArgs>;

export interface WalletTransferArgs {
  from: string;
  to: string;
  amount: number;
  description?: string;
}

export interface WalletFundArgs {
  amount: number;
  email: string;
  redirectUrl: string;
}

export interface WalletWithdrawalArgs {
  userId: string;
  accountBank: string;
  accountNumber: string;
  amount: number;
}

export interface WalletWithdrawalResolveAccountArgs {
  accountBank: string;
  accountNumber: string;
}
