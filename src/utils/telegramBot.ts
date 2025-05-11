
import { User, Transaction } from '@/types';

interface TelegramConfig {
  enabled: boolean;
  adminId: string;
  token: string;
  lastSyncTime: number;
}

const TELEGRAM_CONFIG_KEY = 'telegram_bot_config';
const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

// Load telegram configuration
export const loadTelegramConfig = (): TelegramConfig => {
  const defaultConfig: TelegramConfig = {
    enabled: false,
    adminId: '',
    token: '',
    lastSyncTime: 0
  };
  
  try {
    const savedConfig = localStorage.getItem(TELEGRAM_CONFIG_KEY);
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (error) {
    console.error('Error loading Telegram config:', error);
  }
  
  return defaultConfig;
};

// Save telegram configuration
export const saveTelegramConfig = (config: TelegramConfig): void => {
  localStorage.setItem(TELEGRAM_CONFIG_KEY, JSON.stringify(config));
};

// Enable telegram bot
export const enableTelegramBot = (adminId: string, token: string): boolean => {
  try {
    const config = loadTelegramConfig();
    
    // Only admins with ID 904718229 can enable the bot
    if (adminId !== '904718229') {
      return false;
    }
    
    const updatedConfig: TelegramConfig = {
      enabled: true,
      adminId,
      token,
      lastSyncTime: Date.now()
    };
    
    saveTelegramConfig(updatedConfig);
    return true;
  } catch (error) {
    console.error('Error enabling Telegram bot:', error);
    return false;
  }
};

// Disable telegram bot
export const disableTelegramBot = (adminId: string): boolean => {
  try {
    const config = loadTelegramConfig();
    
    // Only the registered admin can disable the bot
    if (adminId !== config.adminId && adminId !== '904718229') {
      return false;
    }
    
    const updatedConfig: TelegramConfig = {
      ...config,
      enabled: false
    };
    
    saveTelegramConfig(updatedConfig);
    return true;
  } catch (error) {
    console.error('Error disabling Telegram bot:', error);
    return false;
  }
};

// Send message to telegram admin
export const sendTelegramMessage = async (text: string): Promise<boolean> => {
  try {
    const config = loadTelegramConfig();
    
    if (!config.enabled || !config.token || !config.adminId) {
      return false;
    }
    
    const url = `${TELEGRAM_API_URL}${config.token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.adminId,
        text: text,
        parse_mode: 'HTML'
      })
    });
    
    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
};

// Send transaction backup to telegram
export const sendTransactionBackup = async (
  transaction: Transaction, 
  user?: User | null
): Promise<boolean> => {
  try {
    const config = loadTelegramConfig();
    
    if (!config.enabled) {
      return false;
    }
    
    // Create backup message
    let message = '🔒 <b>النسخة الاحتياطية للمعاملة</b>\n\n';
    message += `🆔 معرف المعاملة: <code>${transaction.id}</code>\n`;
    message += `🔵 النوع: ${getTransactionTypeText(transaction.type)}\n`;
    message += `💰 المبلغ: ${transaction.amount} ${transaction.currency.toUpperCase()}\n`;
    message += `⏱ التاريخ: ${new Date(transaction.timestamp).toLocaleString('ar-SA')}\n`;
    message += `🔴 الحالة: ${getTransactionStatusText(transaction.status)}\n`;
    
    if (user) {
      message += '\n👤 <b>بيانات المستخدم</b>\n';
      message += `🆔 المعرف: <code>${user.id}</code>\n`;
      message += `👨‍💼 الاسم: ${user.name}\n`;
      message += `📧 البريد الإلكتروني: ${user.email}\n`;
      
      if (user.phoneNumber) {
        message += `📱 رقم الهاتف: ${user.phoneNumber}\n`;
      }
      
      if (user.telegramId) {
        message += `🔵 معرف تلغرام: @${user.telegramId}\n`;
      }
    }
    
    return await sendTelegramMessage(message);
  } catch (error) {
    console.error('Error sending transaction backup:', error);
    return false;
  }
};

// Get transaction status text in Arabic
const getTransactionStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'معلقة';
    case 'completed':
      return 'مكتملة';
    case 'rejected':
      return 'مرفوضة';
    default:
      return status;
  }
};

// Get transaction type text in Arabic
const getTransactionTypeText = (type: string): string => {
  switch (type) {
    case 'deposit':
      return 'إيداع';
    case 'withdrawal':
      return 'سحب';
    case 'conversion':
      return 'تحويل';
    default:
      return type;
  }
};
