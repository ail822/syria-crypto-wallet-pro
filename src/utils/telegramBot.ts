
import { User, Transaction, BackupData } from '@/types';

interface TelegramConfig {
  enabled: boolean;
  adminId: string;
  token: string;
  lastSyncTime: number;
  autoBackup: boolean;
  lastBackupTime: number;
}

// Queue for telegram messages
interface QueueItem {
  id: string;
  text: string;
  timestamp: number;
  retries: number;
  sent: boolean;
}

const TELEGRAM_CONFIG_KEY = 'telegram_bot_config';
const TELEGRAM_QUEUE_KEY = 'telegram_message_queue';
const TELEGRAM_API_URL = 'https://api.telegram.org/bot';
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

// In-memory queue for faster access
let messageQueue: QueueItem[] = [];
let isProcessingQueue = false;

// Initialize the queue from localStorage
const initializeQueue = () => {
  try {
    const queueData = localStorage.getItem(TELEGRAM_QUEUE_KEY);
    if (queueData) {
      messageQueue = JSON.parse(queueData);
    }
    
    // Start processing queue
    processQueue();
  } catch (error) {
    console.error('Error initializing message queue:', error);
  }
};

// Save queue to localStorage
const saveQueue = () => {
  localStorage.setItem(TELEGRAM_QUEUE_KEY, JSON.stringify(messageQueue));
};

// Process queue items
const processQueue = async () => {
  if (isProcessingQueue || messageQueue.length === 0) {
    return;
  }
  
  isProcessingQueue = true;
  
  try {
    const config = loadTelegramConfig();
    
    // If bot is disabled, don't process queue
    if (!config.enabled) {
      isProcessingQueue = false;
      return;
    }
    
    const item = messageQueue[0];
    
    // Skip already sent items
    if (item.sent) {
      messageQueue.shift();
      saveQueue();
      isProcessingQueue = false;
      processQueue();
      return;
    }
    
    // Try to send the message
    const url = `${TELEGRAM_API_URL}${config.token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.adminId,
        text: item.text,
        parse_mode: 'Markdown'
      })
    });
    
    const data = await response.json();
    
    if (data.ok) {
      // Message sent successfully
      messageQueue.shift();
      saveQueue();
    } else {
      // Message failed, increment retry counter
      if (item.retries < MAX_RETRIES) {
        item.retries += 1;
        saveQueue();
        
        // Wait before next retry
        setTimeout(() => {
          isProcessingQueue = false;
          processQueue();
        }, RETRY_DELAY);
        return;
      } else {
        // Max retries reached, remove from queue
        messageQueue.shift();
        saveQueue();
        console.error('Failed to send message after max retries:', item.text);
      }
    }
  } catch (error) {
    console.error('Error processing queue:', error);
    // On error, wait before trying again
    setTimeout(() => {
      isProcessingQueue = false;
      processQueue();
    }, RETRY_DELAY);
    return;
  }
  
  isProcessingQueue = false;
  
  // Process next item if any
  if (messageQueue.length > 0) {
    processQueue();
  }
};

// Add message to queue
const queueMessage = (text: string): string => {
  const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
  
  const item: QueueItem = {
    id,
    text,
    timestamp: Date.now(),
    retries: 0,
    sent: false
  };
  
  messageQueue.push(item);
  saveQueue();
  
  // Start processing queue if not already running
  if (!isProcessingQueue) {
    processQueue();
  }
  
  return id;
};

// Load telegram configuration
export const loadTelegramConfig = (): TelegramConfig => {
  const defaultConfig: TelegramConfig = {
    enabled: false,
    adminId: '',
    token: '',
    lastSyncTime: 0,
    autoBackup: false,
    lastBackupTime: 0
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
      ...config,
      enabled: true,
      adminId,
      token,
      lastSyncTime: Date.now()
    };
    
    saveTelegramConfig(updatedConfig);
    
    // Initialize queue if not already done
    initializeQueue();
    
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
      enabled: false,
      autoBackup: false
    };
    
    saveTelegramConfig(updatedConfig);
    return true;
  } catch (error) {
    console.error('Error disabling Telegram bot:', error);
    return false;
  }
};

// Toggle automatic backups
export const toggleAutoBackup = (enable: boolean): boolean => {
  try {
    const config = loadTelegramConfig();
    
    if (!config.enabled) {
      return false;
    }
    
    const updatedConfig = {
      ...config,
      autoBackup: enable,
      lastBackupTime: enable ? Date.now() : config.lastBackupTime
    };
    
    saveTelegramConfig(updatedConfig);
    return true;
  } catch (error) {
    console.error('Error toggling auto backup:', error);
    return false;
  }
};

// Send message to telegram admin
export const sendTelegramMessage = async (text: string): Promise<boolean> => {
  try {
    const config = loadTelegramConfig();
    
    if (!config.enabled || !config.token || !config.adminId) {
      console.log('Telegram bot is not enabled or missing configuration');
      return false;
    }
    
    // Add message to queue
    queueMessage(text);
    
    return true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
};

// Create full system backup
export const createSystemBackup = async (): Promise<boolean> => {
  try {
    const config = loadTelegramConfig();
    
    if (!config.enabled) {
      console.log('Telegram backups are not enabled');
      return false;
    }
    
    // Collect all data for backup
    const backup: BackupData = {
      users: [],
      transactions: [],
      exchangeRate: {
        usdt_to_syp: 0,
        syp_to_usdt: 0,
        fee_percentage: 0,
        enabled: true,
        min_deposit_usdt: 0,
        min_deposit_syp: 0,
        min_withdrawal_usdt: 0,
        min_withdrawal_syp: 0
      },
      depositMethods: [],
      withdrawalMethods: [],
      currencies: [],
      createdAt: new Date().toISOString()
    };
    
    // Get registered users
    const registeredUsersStr = localStorage.getItem('registeredUsers');
    if (registeredUsersStr) {
      const registeredUsers = JSON.parse(registeredUsersStr);
      if (Array.isArray(registeredUsers)) {
        // Remove passwords from backup for security
        backup.users = registeredUsers.map(user => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
      }
    }
    
    // Get transactions
    const transactionsStr = localStorage.getItem('transactions_data');
    if (transactionsStr) {
      backup.transactions = JSON.parse(transactionsStr);
    }
    
    // Get exchange rates
    const exchangeRateStr = localStorage.getItem('exchange_rate');
    if (exchangeRateStr) {
      backup.exchangeRate = JSON.parse(exchangeRateStr);
    }
    
    // Get deposit methods
    const depositMethodsStr = localStorage.getItem('deposit_methods');
    if (depositMethodsStr) {
      backup.depositMethods = JSON.parse(depositMethodsStr);
    }
    
    // Get withdrawal methods
    const withdrawalMethodsStr = localStorage.getItem('withdrawal_methods');
    if (withdrawalMethodsStr) {
      backup.withdrawalMethods = JSON.parse(withdrawalMethodsStr);
    }
    
    // Get currencies
    const currenciesStr = localStorage.getItem('supportedCurrencies');
    if (currenciesStr) {
      backup.currencies = JSON.parse(currenciesStr);
    }
    
    // Send backup summary to Telegram
    const message = `📦 *نسخة احتياطية كاملة للنظام*\n\n` +
      `👥 المستخدمون: ${backup.users.length}\n` +
      `🧾 المعاملات: ${backup.transactions.length}\n` +
      `💱 العملات: ${backup.currencies.length}\n` +
      `💰 طرق الإيداع: ${backup.depositMethods.length}\n` +
      `💸 طرق السحب: ${backup.withdrawalMethods.length}\n\n` +
      `⏱️ تاريخ النسخ الاحتياطي: ${new Date().toLocaleString('ar-SA')}`;
    
    // Send backup summary
    await sendTelegramMessage(message);
    
    // Update last backup time
    const updatedConfig = {
      ...config,
      lastBackupTime: Date.now()
    };
    saveTelegramConfig(updatedConfig);
    
    return true;
  } catch (error) {
    console.error('Error creating system backup:', error);
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
      console.log('Telegram backups are not enabled');
      return false;
    }
    
    // Create backup message
    let message = '🔒 *النسخة الاحتياطية للمعاملة*\n\n';
    message += `🆔 معرف المعاملة: \`${transaction.id}\`\n`;
    message += `🔵 النوع: ${getTransactionTypeText(transaction.type)}\n`;
    message += `💰 المبلغ: ${transaction.amount} ${transaction.currency.toUpperCase()}\n`;
    message += `⏱ التاريخ: ${new Date(transaction.timestamp).toLocaleString('ar-SA')}\n`;
    message += `🔴 الحالة: ${getTransactionStatusText(transaction.status)}\n`;
    
    if (transaction.type === 'conversion' && transaction.targetCurrency && transaction.targetAmount) {
      message += `💱 التحويل: ${transaction.amount} ${transaction.currency.toUpperCase()} ➜ ${transaction.targetAmount} ${transaction.targetCurrency.toUpperCase()}\n`;
    }
    
    if (transaction.type === 'withdrawal' && transaction.recipient) {
      message += '\n📤 *بيانات المستلم*\n';
      
      if (transaction.recipient.name) {
        message += `👤 الاسم: ${transaction.recipient.name}\n`;
      }
      
      if (transaction.recipient.phoneNumber) {
        message += `📱 الهاتف: ${transaction.recipient.phoneNumber}\n`;
      }
      
      if (transaction.recipient.province) {
        message += `🏙 المحافظة: ${transaction.recipient.province}\n`;
      }
      
      if (transaction.recipient.walletId) {
        message += `💼 معرف المحفظة: ${transaction.recipient.walletId}\n`;
      }
    }
    
    if (user) {
      message += '\n👤 *بيانات المستخدم*\n';
      message += `🆔 المعرف: \`${user.id}\`\n`;
      message += `👨‍💼 الاسم: ${user.name}\n`;
      message += `📧 البريد الإلكتروني: ${user.email}\n`;
      
      if (user.phoneNumber) {
        message += `📱 رقم الهاتف: ${user.phoneNumber}\n`;
      }
      
      if (user.telegramId) {
        message += `🔵 معرف تلغرام: @${user.telegramId}\n`;
      }
      
      // Add balances information
      message += '\n💰 *الأرصدة الحالية*\n';
      for (const [currency, balance] of Object.entries(user.balances)) {
        message += `${getCurrencyEmoji(currency)} ${currency.toUpperCase()}: ${balance}\n`;
      }
    }
    
    // Add timestamp for the backup itself
    message += `\n⏰ توقيت النسخ الاحتياطي: ${new Date().toLocaleString('ar-SA')}`;
    
    // Send the backup via queue system
    return await sendTelegramMessage(message);
  } catch (error) {
    console.error('Error sending transaction backup:', error);
    return false;
  }
};

// Get currency emoji
const getCurrencyEmoji = (currency: string): string => {
  switch (currency.toLowerCase()) {
    case 'usdt':
      return '💵';
    case 'syp':
      return '💴';
    case 'usd':
      return '💵';
    case 'eur':
      return '💶';
    case 'btc':
      return '₿';
    case 'eth':
      return '⧫';
    default:
      return '💰';
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

// Initialize queue when module loads
initializeQueue();
