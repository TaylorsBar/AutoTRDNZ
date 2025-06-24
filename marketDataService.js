/**
 * Market Data Service
 * Service for fetching, processing, and storing market data
 */

const config = require('../config/config');
const { MarketData } = require('../models');
const { logger } = require('../utils/logger');
const axios = require('axios');

class MarketDataService {
  constructor() {
    this.apiConfig = config.apis.marketData;
    this.supportedTimeframes = ['1m', '5m', '15m', '30m', '1h', '4h', 'daily', 'weekly'];
    this.dataProviders = {
      alpha_vantage: this.fetchFromAlphaVantage.bind(this),
      yahoo_finance: this.fetchFromYahooFinance.bind(this),
      custom: this.fetchFromCustomSource.bind(this)
    };
  }

  /**
   * Fetch market data for a symbol
   * @param {string} symbol - Trading symbol
   * @param {string} timeframe - Timeframe for data
   * @param {number} limit - Maximum number of data points to fetch
   * @returns {Promise<Array>} - Array of market data
   */
  async fetchMarketData(symbol, timeframe = 'daily', limit = 100) {
    try {
      logger.info(`Fetching market data for ${symbol} (${timeframe})`);
      
      // Validate timeframe
      if (!this.supportedTimeframes.includes(timeframe)) {
        throw new Error(`Unsupported timeframe: ${timeframe}`);
      }
      
      // Get data provider function
      const provider = this.apiConfig.provider;
      const fetchFunction = this.dataProviders[provider];
      
      if (!fetchFunction) {
        throw new Error(`Unsupported data provider: ${provider}`);
      }
      
      // Fetch data from provider
      const data = await fetchFunction(symbol, timeframe, limit);
      
      // Store data in database
      await this.storeMarketData(symbol, timeframe, data);
      
      return data;
    } catch (error) {
      logger.error(`Error fetching market data for ${symbol}:`, error);
      throw error;
    }
  }
  
  /**
   * Store market data in database
   * @param {string} symbol - Trading symbol
   * @param {string} timeframe - Timeframe for data
   * @param {Array} data - Market data to store
   */
  async storeMarketData(symbol, timeframe, data) {
    try {
      logger.info(`Storing ${data.length} data points for ${symbol} (${timeframe})`);
      
      // Create bulk insert array
      const bulkData = data.map(item => ({
        symbol,
        timeframe,
        timestamp: item.timestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
        source: this.apiConfig.provider
      }));
      
      // Bulk insert data
      await MarketData.bulkCreate(bulkData, {
        updateOnDuplicate: ['open', 'high', 'low', 'close', 'volume', 'source']
      });
      
      logger.info(`Successfully stored market data for ${symbol}`);
    } catch (error) {
      logger.error(`Error storing market data for ${symbol}:`, error);
      throw error;
    }
  }
  
  /**
   * Get historical market data from database
   * @param {string} symbol - Trading symbol
   * @param {string} timeframe - Timeframe for data
   * @param {number} limit - Maximum number of data points to fetch
   * @returns {Promise<Array>} - Array of market data
   */
  async getHistoricalData(symbol, timeframe = 'daily', limit = 100) {
    try {
      logger.info(`Getting historical data for ${symbol} (${timeframe})`);
      
      const data = await MarketData.findAll({
        where: { symbol, timeframe },
        order: [['timestamp', 'DESC']],
        limit
      });
      
      return data;
    } catch (error) {
      logger.error(`Error getting historical data for ${symbol}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetch data from Alpha Vantage API
   * @param {string} symbol - Trading symbol
   * @param {string} timeframe - Timeframe for data
   * @param {number} limit - Maximum number of data points to fetch
   * @returns {Promise<Array>} - Array of market data
   */
  async fetchFromAlphaVantage(symbol, timeframe, limit) {
    try {
      // Map timeframe to Alpha Vantage interval
      const intervalMap = {
        '1m': '1min',
        '5m': '5min',
        '15m': '15min',
        '30m': '30min',
        '1h': '60min',
        'daily': 'daily',
        'weekly': 'weekly'
      };
      
      const interval = intervalMap[timeframe] || 'daily';
      
      // Determine function to use
      let function_name;
      if (interval === 'daily' || interval === 'weekly') {
        function_name = 'TIME_SERIES_' + interval.toUpperCase();
      } else {
        function_name = 'TIME_SERIES_INTRADAY';
      }
      
      // Build API URL
      const url = `${this.apiConfig.endpoint}`;
      
      // Make API request
      const response = await axios.get(url, {
        params: {
          function: function_name,
          symbol,
          interval: interval !== 'daily' && interval !== 'weekly' ? interval : undefined,
          apikey: this.apiConfig.apiKey,
          outputsize: 'full'
        }
      });
      
      // Process response
      const result = [];
      
      // Extract time series data
      let timeSeriesKey;
      if (interval === 'daily') {
        timeSeriesKey = 'Time Series (Daily)';
      } else if (interval === 'weekly') {
        timeSeriesKey = 'Weekly Time Series';
      } else {
        timeSeriesKey = `Time Series (${interval})`;
      }
      
      const timeSeries = response.data[timeSeriesKey];
      
      // Convert to array format
      for (const [date, values] of Object.entries(timeSeries)) {
        result.push({
          timestamp: new Date(date),
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseFloat(values['5. volume'])
        });
      }
      
      // Sort by timestamp (newest first) and limit
      result.sort((a, b) => b.timestamp - a.timestamp);
      return result.slice(0, limit);
    } catch (error) {
      logger.error(`Error fetching data from Alpha Vantage for ${symbol}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetch data from Yahoo Finance API
   * @param {string} symbol - Trading symbol
   * @param {string} timeframe - Timeframe for data
   * @param {number} limit - Maximum number of data points to fetch
   * @returns {Promise<Array>} - Array of market data
   */
  async fetchFromYahooFinance(symbol, timeframe, limit) {
    try {
      // Map timeframe to Yahoo Finance interval
      const intervalMap = {
        '1m': '1m',
        '5m': '5m',
        '15m': '15m',
        '30m': '30m',
        '1h': '1h',
        'daily': '1d',
        'weekly': '1wk'
      };
      
      const interval = intervalMap[timeframe] || '1d';
      
      // Calculate range based on timeframe and limit
      let range = '1mo';
      if (timeframe === 'daily' || timeframe === 'weekly') {
        range = limit <= 30 ? '1mo' : limit <= 90 ? '3mo' : limit <= 180 ? '6mo' : '1y';
      } else {
        range = limit <= 60 ? '1d' : limit <= 300 ? '5d' : '1mo';
      }
      
      // Build API URL (Note: This is a simplified example, actual Yahoo Finance API might differ)
      const url = `${this.apiConfig.endpoint}`;
      
      // Make API request
      const response = await axios.get(url, {
        params: {
          symbol,
          interval,
          range,
          includePrePost: true
        }
      });
      
      // Process response
      const result = [];
      const data = response.data.chart.result[0];
      
      const timestamps = data.timestamp;
      const quotes = data.indicators.quote[0];
      
      for (let i = 0; i < timestamps.length; i++) {
        result.push({
          timestamp: new Date(timestamps[i] * 1000),
          open: quotes.open[i],
          high: quotes.high[i],
          low: quotes.low[i],
          close: quotes.close[i],
          volume: quotes.volume[i]
        });
      }
      
      // Sort by timestamp (newest first) and limit
      result.sort((a, b) => b.timestamp - a.timestamp);
      return result.slice(0, limit);
    } catch (error) {
      logger.error(`Error fetching data from Yahoo Finance for ${symbol}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetch data from custom source
   * @param {string} symbol - Trading symbol
   * @param {string} timeframe - Timeframe for data
   * @param {number} limit - Maximum number of data points to fetch
   * @returns {Promise<Array>} - Array of market data
   */
  async fetchFromCustomSource(symbol, timeframe, limit) {
    try {
      // This is a placeholder for custom data source implementation
      // In a real application, this would connect to a specific API or data source
      
      logger.warn('Using mock data for custom source');
      
      // Generate mock data
      const result = [];
      const now = new Date();
      let price = 100 + Math.random() * 50;
      
      for (let i = 0; i < limit; i++) {
        const change = (Math.random() - 0.5) * 2;
        price += change;
        
        const high = price + Math.random() * 2;
        const low = price - Math.random() * 2;
        const open = low + Math.random() * (high - low);
        const close = low + Math.random() * (high - low);
        
        const timestamp = new Date(now);
        
        // Adjust timestamp based on timeframe
        if (timeframe === '1m') {
          timestamp.setMinutes(now.getMinutes() - i);
        } else if (timeframe === '5m') {
          timestamp.setMinutes(now.getMinutes() - i * 5);
        } else if (timeframe === '15m') {
          timestamp.setMinutes(now.getMinutes() - i * 15);
        } else if (timeframe === '30m') {
          timestamp.setMinutes(now.getMinutes() - i * 30);
        } else if (timeframe === '1h') {
          timestamp.setHours(now.getHours() - i);
        } else if (timeframe === '4h') {
          timestamp.setHours(now.getHours() - i * 4);
        } else if (timeframe === 'daily') {
          timestamp.setDate(now.getDate() - i);
        } else if (timeframe === 'weekly') {
          timestamp.setDate(now.getDate() - i * 7);
        }
        
        result.push({
          timestamp,
          open,
          high,
          low,
          close,
          volume: Math.floor(Math.random() * 10000)
        });
      }
      
      return result;
    } catch (error) {
      logger.error(`Error fetching data from custom source for ${symbol}:`, error);
      throw error;
    }
  }
  
  /**
   * Initialize market data service
   */
  async initialize() {
    try {
      logger.info('Initializing market data service');
      
      // Fetch initial data for common symbols
      const commonSymbols = [
        'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'NZDUSD', // Forex
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', // US Stocks
        'BTC-USD', 'ETH-USD' // Crypto
      ];
      
      for (const symbol of commonSymbols) {
        await this.fetchMarketData(symbol, 'daily', 100);
      }
      
      logger.info('Market data service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize market data service', error);
      throw error;
    }
  }
}

module.exports = new MarketDataService();
