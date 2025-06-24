/**
 * Configuration file for the trading application
 * Contains environment-specific settings and constants
 */

const config = {
  // Environment settings
  env: process.env.NODE_ENV || 'development',
  
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
  },
  
  // Database configuration
  database: {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'trading_app',
    url: process.env.DATABASE_URL,
  },
  
  // Authentication settings
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    saltRounds: 10,
  },
  
  // Trading settings
  trading: {
    // Default timezone settings for New Zealand
    timezone: 'Pacific/Auckland',
    
    // Trading hours for different markets (in NZ time)
    tradingHours: {
      forex: {
        asianSession: { start: '10:00', end: '18:00' },
        londonSession: { start: '20:00', end: '04:00' },
        newYorkSession: { start: '01:00', end: '08:00' },
      },
      us: {
        preMarket: { start: '01:30', end: '03:30' },
        regular: { start: '03:30', end: '10:00' },
        afterHours: { start: '10:00', end: '14:00' },
      },
    },
    
    // Default risk management settings
    riskManagement: {
      maxPositionSize: 0.05, // 5% of account balance
      maxDrawdown: 0.20, // 20% maximum drawdown
      stopLossDefault: 0.02, // 2% default stop loss
      takeProfitDefault: 0.03, // 3% default take profit
    },
    
    // Supported exchanges
    exchanges: [
      'binance',
      'kraken',
      'oanda',
      'interactive_brokers',
    ],
    
    // Supported asset classes
    assetClasses: [
      'forex',
      'stocks',
      'crypto',
      'commodities',
    ],
  },
  
  // External API keys and endpoints
  apis: {
    marketData: {
      provider: process.env.MARKET_DATA_PROVIDER || 'alpha_vantage',
      apiKey: process.env.MARKET_DATA_API_KEY,
      endpoint: process.env.MARKET_DATA_ENDPOINT,
    },
    news: {
      provider: process.env.NEWS_PROVIDER || 'newsapi',
      apiKey: process.env.NEWS_API_KEY,
      endpoint: process.env.NEWS_ENDPOINT,
    },
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'app.log',
  },
  
  // Compliance settings
  compliance: {
    auditTrailEnabled: true,
    clientMoneySegregation: true,
    riskDisclosureRequired: true,
  },
};

module.exports = config;
