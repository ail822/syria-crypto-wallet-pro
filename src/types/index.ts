
export interface User {
  id: string;
  name: string;
  email: string;
  telegramId?: string;
  phoneNumber?: string;
  profileImage?: string;
  balances: {
    usdt: number;
    syp: number;
  };
}

export type Currency = 'usdt' | 'syp';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'conversion';
  amount: number;
  currency: Currency;
  targetCurrency?: Currency;
  targetAmount?: number;
  status: 'pending' | 'completed' | 'rejected';
  timestamp: Date;
  withdrawalMethod?: WithdrawalMethod;
  depositMethodId?: string;
  withdrawalMethodId?: string;
  transactionId?: string;
  recipient?: {
    name?: string;
    phoneNumber?: string;
    province?: string;
    walletId?: string;
  };
  screenshot?: string;
}

export type WithdrawalMethod = 'province' | 'mtn' | 'syriatel' | 'c-wallet';

export interface ExchangeRate {
  usdt_to_syp: number;
  syp_to_usdt: number;
  fee_percentage: number;
  enabled: boolean;
}

export interface AdminSettings {
  exchangeRates: ExchangeRate;
  telegramBotToken: string;
  telegramBotUsername: string;
}

export interface DepositMethod {
  id: string;
  name: string;
  description?: string;
  acceptedCurrency: Currency;
  isActive: boolean;
  requiresImage: boolean;
  requiresTransactionId: boolean;
  createdAt: Date;
}

export interface WithdrawalMethodType {
  id: string;
  name: string;
  description?: string;
  supportedCurrency: Currency;
  isActive: boolean;
  requiresApproval: boolean;
  feePercentage: number;
  createdAt: Date;
}
