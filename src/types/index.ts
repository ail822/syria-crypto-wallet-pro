
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

export type Currency = 'usdt' | 'syp' | string;

export type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'conversion' | 'game_recharge';
  amount: number;
  currency: Currency;
  targetCurrency?: Currency;
  targetAmount?: number;
  status: 'pending' | 'completed' | 'rejected';
  timestamp: Date;
  withdrawalMethod?: WithdrawalMethod;
  withdrawalMethodId?: string;
  depositMethodId?: string;
  screenshot?: string;
  transactionId?: string;
  recipient?: {
    name?: string;
    phoneNumber?: string;
    province?: string;
    walletId?: string;
  };
  userId?: string;
  gameId?: string;
  gameName?: string;
  accountId?: string;
};

export type WithdrawalMethod = 'province' | 'mtn' | 'syriatel' | 'c-wallet';

export interface ExchangeRate {
  usdt_to_syp: number;
  syp_to_usdt: number;
  fee_percentage: number;
  enabled: boolean;
  min_deposit_usdt: number; 
  min_deposit_syp: number;
  min_withdrawal_usdt: number;
  min_withdrawal_syp: number;
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

export interface Game {
  id: string;
  name: string;
  accountIdLabel: string;
  price: number;
  currency: Currency;
  isActive: boolean;
  imageUrl?: string;
  createdAt: Date;
}
