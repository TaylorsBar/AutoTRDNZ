/**
 * Database models for the trading application
 * Defines the schema for the database tables
 */

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

// Initialize Sequelize with database configuration
const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: false,
  }
);

// User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: config.trading.timezone,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  lastLogin: {
    type: DataTypes.DATE,
  },
});

// Account model
const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  balance: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
    defaultValue: 0,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'NZD',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  type: {
    type: DataTypes.ENUM('demo', 'live'),
    defaultValue: 'demo',
  },
  leverage: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

// Strategy model
const Strategy = sequelize.define('Strategy', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  type: {
    type: DataTypes.ENUM('trend_following', 'mean_reversion', 'breakout', 'news_based', 'custom'),
    allowNull: false,
  },
  timeframe: {
    type: DataTypes.ENUM('1m', '5m', '15m', '30m', '1h', '4h', 'daily', 'weekly'),
    allowNull: false,
  },
  parameters: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  backtestResults: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  performance: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
});

// Trade model
const Trade = sequelize.define('Trade', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  accountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Accounts',
      key: 'id',
    },
  },
  strategyId: {
    type: DataTypes.UUID,
    references: {
      model: 'Strategies',
      key: 'id',
    },
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('buy', 'sell'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'open', 'closed', 'cancelled'),
    defaultValue: 'pending',
  },
  openPrice: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
  },
  closePrice: {
    type: DataTypes.DECIMAL(20, 8),
  },
  size: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
  },
  stopLoss: {
    type: DataTypes.DECIMAL(20, 8),
  },
  takeProfit: {
    type: DataTypes.DECIMAL(20, 8),
  },
  openTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  closeTime: {
    type: DataTypes.DATE,
  },
  profit: {
    type: DataTypes.DECIMAL(20, 8),
    defaultValue: 0,
  },
  exchange: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
});

// Market Data model
const MarketData = sequelize.define('MarketData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeframe: {
    type: DataTypes.ENUM('1m', '5m', '15m', '30m', '1h', '4h', 'daily', 'weekly'),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  open: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
  },
  high: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
  },
  low: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
  },
  close: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
  },
  volume: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Notification model
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('trade', 'system', 'news', 'alert'),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  data: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
});

// AuditLog model for compliance
const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entityId: {
    type: DataTypes.UUID,
  },
  details: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  ipAddress: {
    type: DataTypes.STRING,
  },
  userAgent: {
    type: DataTypes.STRING,
  },
});

// Define relationships
User.hasMany(Account, { foreignKey: 'userId' });
Account.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Strategy, { foreignKey: 'userId' });
Strategy.belongsTo(User, { foreignKey: 'userId' });

Account.hasMany(Trade, { foreignKey: 'accountId' });
Trade.belongsTo(Account, { foreignKey: 'accountId' });

Strategy.hasMany(Trade, { foreignKey: 'strategyId' });
Trade.belongsTo(Strategy, { foreignKey: 'strategyId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// Export models
module.exports = {
  sequelize,
  User,
  Account,
  Strategy,
  Trade,
  MarketData,
  Notification,
  AuditLog,
};
