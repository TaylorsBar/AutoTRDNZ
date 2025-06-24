/**
 * API routes for the trading application
 */

const express = require('express');
const router = express.Router();
const tradingEngine = require('../services/tradingEngine');
const marketDataService = require('../services/marketDataService');
const { Strategy, Trade, Account, User } = require('../models');
const { logger } = require('../utils/logger');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  jwt.verify(token, config.auth.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    req.user = user;
    next();
  });
};

// Market data routes
router.get('/market-data/:symbol', authenticateToken, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = 'daily', limit = 100 } = req.query;
    
    const data = await marketDataService.getHistoricalData(symbol, timeframe, parseInt(limit));
    
    res.json(data);
  } catch (error) {
    logger.error(`Error fetching market data: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

router.post('/market-data/fetch', authenticateToken, async (req, res) => {
  try {
    const { symbol, timeframe = 'daily', limit = 100 } = req.body;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }
    
    const data = await marketDataService.fetchMarketData(symbol, timeframe, parseInt(limit));
    
    res.json(data);
  } catch (error) {
    logger.error(`Error fetching market data: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Strategy routes
router.get('/strategies', authenticateToken, async (req, res) => {
  try {
    const strategies = await Strategy.findAll({
      where: { userId: req.user.id }
    });
    
    res.json(strategies);
  } catch (error) {
    logger.error(`Error fetching strategies: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch strategies' });
  }
});

router.get('/strategies/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const strategy = await Strategy.findOne({
      where: { id, userId: req.user.id }
    });
    
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    
    res.json(strategy);
  } catch (error) {
    logger.error(`Error fetching strategy: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch strategy' });
  }
});

router.post('/strategies', authenticateToken, async (req, res) => {
  try {
    const { name, description, type, timeframe, parameters, isActive } = req.body;
    
    if (!name || !type || !timeframe) {
      return res.status(400).json({ error: 'Name, type, and timeframe are required' });
    }
    
    const strategy = await Strategy.create({
      userId: req.user.id,
      name,
      description,
      type,
      timeframe,
      parameters: JSON.stringify(parameters || {}),
      isActive: isActive || false
    });
    
    res.status(201).json(strategy);
  } catch (error) {
    logger.error(`Error creating strategy: ${error.message}`);
    res.status(500).json({ error: 'Failed to create strategy' });
  }
});

router.put('/strategies/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, timeframe, parameters, isActive } = req.body;
    
    const strategy = await Strategy.findOne({
      where: { id, userId: req.user.id }
    });
    
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    
    // Update strategy
    if (name) strategy.name = name;
    if (description !== undefined) strategy.description = description;
    if (type) strategy.type = type;
    if (timeframe) strategy.timeframe = timeframe;
    if (parameters) strategy.parameters = JSON.stringify(parameters);
    if (isActive !== undefined) strategy.isActive = isActive;
    
    await strategy.save();
    
    // If strategy is activated, add it to trading engine
    if (isActive && !strategy.isActive) {
      await tradingEngine.addStrategy(strategy);
    } else if (!isActive && strategy.isActive) {
      await tradingEngine.removeStrategy(strategy.id);
    }
    
    res.json(strategy);
  } catch (error) {
    logger.error(`Error updating strategy: ${error.message}`);
    res.status(500).json({ error: 'Failed to update strategy' });
  }
});

router.delete('/strategies/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const strategy = await Strategy.findOne({
      where: { id, userId: req.user.id }
    });
    
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    
    // Remove from trading engine if active
    if (strategy.isActive) {
      await tradingEngine.removeStrategy(strategy.id);
    }
    
    await strategy.destroy();
    
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting strategy: ${error.message}`);
    res.status(500).json({ error: 'Failed to delete strategy' });
  }
});

// Trade routes
router.get('/trades', authenticateToken, async (req, res) => {
  try {
    const accounts = await Account.findAll({
      where: { userId: req.user.id }
    });
    
    const accountIds = accounts.map(account => account.id);
    
    const trades = await Trade.findAll({
      where: { accountId: accountIds },
      order: [['openTime', 'DESC']]
    });
    
    res.json(trades);
  } catch (error) {
    logger.error(`Error fetching trades: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

router.get('/trades/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const accounts = await Account.findAll({
      where: { userId: req.user.id }
    });
    
    const accountIds = accounts.map(account => account.id);
    
    const trade = await Trade.findOne({
      where: { id, accountId: accountIds }
    });
    
    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    
    res.json(trade);
  } catch (error) {
    logger.error(`Error fetching trade: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch trade' });
  }
});

// Account routes
router.get('/accounts', authenticateToken, async (req, res) => {
  try {
    const accounts = await Account.findAll({
      where: { userId: req.user.id }
    });
    
    res.json(accounts);
  } catch (error) {
    logger.error(`Error fetching accounts: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

router.post('/accounts', authenticateToken, async (req, res) => {
  try {
    const { balance, currency, type, leverage } = req.body;
    
    if (!balance || !currency || !type) {
      return res.status(400).json({ error: 'Balance, currency, and type are required' });
    }
    
    const account = await Account.create({
      userId: req.user.id,
      balance,
      currency,
      type,
      leverage: leverage || 1,
      isActive: true
    });
    
    res.status(201).json(account);
  } catch (error) {
    logger.error(`Error creating account: ${error.message}`);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Trading engine control routes
router.post('/engine/start', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findByPk(req.user.id);
    
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    await tradingEngine.start();
    
    res.json({ status: 'Trading engine started' });
  } catch (error) {
    logger.error(`Error starting trading engine: ${error.message}`);
    res.status(500).json({ error: 'Failed to start trading engine' });
  }
});

router.post('/engine/stop', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findByPk(req.user.id);
    
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    tradingEngine.stop();
    
    res.json({ status: 'Trading engine stopped' });
  } catch (error) {
    logger.error(`Error stopping trading engine: ${error.message}`);
    res.status(500).json({ error: 'Failed to stop trading engine' });
  }
});

router.get('/engine/status', authenticateToken, async (req, res) => {
  try {
    const status = {
      isRunning: tradingEngine.isRunning,
      activeStrategies: Array.from(tradingEngine.activeStrategies.keys()).length,
      lastRun: Array.from(tradingEngine.activeStrategies.values())
        .map(s => s.lastRun)
        .filter(Boolean)
        .sort((a, b) => b - a)[0] || null
    };
    
    res.json(status);
  } catch (error) {
    logger.error(`Error fetching trading engine status: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch trading engine status' });
  }
});

module.exports = router;
