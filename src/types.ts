
// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  telegramId?: string;
  isAdmin: boolean;
  profileImage?: string;
  balances: {
    [key: string]: number; // Dynamic currencies
  };
  twoFactorEnabled?: boolean;
}

// Authentication related types
export type AuthStatus = 'authenticated' | 'unauthenticated';

// Currency types
export type Currency = string;

export interface CurrencyItem {
  code: string;
  name: string;
  exchangeRate: number;
  isActive: boolean;
  minDeposit: number;
  minWithdrawal: number;
}

// Transaction related types
export type TransactionType = 'deposit' | 'withdrawal' | 'conversion' | 'game_recharge';
export type TransactionStatus = 'pending' | 'completed' | 'rejected';
export type WithdrawalMethod = 'c-wallet' | 'province' | 'mtn' | 'syriatel';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  timestamp: Date;
  userId?: string;
  
  // For deposit transactions
  screenshot?: string;
  walletId?: string;
  depositMethodId?: string;
  transactionId?: string;
  
  // For withdrawal transactions
  withdrawalMethod?: WithdrawalMethod;
  withdrawalMethodId?: string;
  recipient?: {
    name?: string;
    phoneNumber?: string;
    province?: string;
    walletId?: string;
  };
  
  // For conversion transactions
  targetCurrency?: Currency;
  targetAmount?: number;
  
  // For game recharge transactions
  gameId?: string;
  gameName?: string;
  accountId?: string;
}

// Deposit method types
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

// Withdrawal method types
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

// Exchange rate types
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

// Backup types
export interface BackupData {
  users: User[];
  transactions: Transaction[];
  exchangeRate: ExchangeRate;
  depositMethods: DepositMethod[];
  withdrawalMethods: WithdrawalMethodType[];
  currencies: CurrencyItem[];
  createdAt: string;
}
