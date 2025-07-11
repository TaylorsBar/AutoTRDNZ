import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function MarketsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('forex');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');

  const marketData = {
    forex: [
      { symbol: 'EURUSD', price: 1.0845, change: 0.0012, changePercent: 0.11, volume: '2.5B', bid: 1.0843, ask: 1.0847 },
      { symbol: 'GBPUSD', price: 1.2654, change: 0.0021, changePercent: 0.17, volume: '1.8B', bid: 1.2652, ask: 1.2656 },
      { symbol: 'USDJPY', price: 151.25, change: -0.23, changePercent: -0.15, volume: '1.2B', bid: 151.22, ask: 151.28 },
      { symbol: 'AUDUSD', price: 0.6598, change: 0.0045, changePercent: 0.69, volume: '945M', bid: 0.6596, ask: 0.6600 },
      { symbol: 'NZDUSD', price: 0.6025, change: 0.0013, changePercent: 0.22, volume: '456M', bid: 0.6023, ask: 0.6027 },
      { symbol: 'USDCAD', price: 1.3456, change: -0.0012, changePercent: -0.09, volume: '678M', bid: 1.3454, ask: 1.3458 },
    ],
    stocks: [
      { symbol: 'AAPL', price: 192.75, change: 2.25, changePercent: 1.18, volume: '45.2M', bid: 192.70, ask: 192.80 },
      { symbol: 'MSFT', price: 374.25, change: -1.85, changePercent: -0.49, volume: '28.7M', bid: 374.20, ask: 374.30 },
      { symbol: 'GOOGL', price: 2845.60, change: 15.40, changePercent: 0.54, volume: '1.2M', bid: 2845.50, ask: 2845.70 },
      { symbol: 'AMZN', price: 3247.89, change: -12.56, changePercent: -0.38, volume: '2.8M', bid: 3247.80, ask: 3247.98 },
      { symbol: 'TSLA', price: 248.42, change: 8.73, changePercent: 3.64, volume: '89.5M', bid: 248.35, ask: 248.49 },
      { symbol: 'META', price: 487.23, change: -3.47, changePercent: -0.71, volume: '15.2M', bid: 487.18, ask: 487.28 },
    ],
    crypto: [
      { symbol: 'BTC-USD', price: 43250.00, change: 1250.00, changePercent: 2.98, volume: '28.4B', bid: 43240.00, ask: 43260.00 },
      { symbol: 'ETH-USD', price: 2650.75, change: -45.25, changePercent: -1.68, volume: '15.7B', bid: 2650.50, ask: 2651.00 },
      { symbol: 'BNB-USD', price: 315.48, change: 8.92, changePercent: 2.91, volume: '1.2B', bid: 315.40, ask: 315.56 },
      { symbol: 'ADA-USD', price: 0.4825, change: 0.0123, changePercent: 2.62, volume: '456M', bid: 0.4823, ask: 0.4827 },
      { symbol: 'SOL-USD', price: 98.45, change: -2.87, changePercent: -2.83, volume: '2.1B', bid: 98.40, ask: 98.50 },
      { symbol: 'DOT-USD', price: 7.23, change: 0.18, changePercent: 2.55, volume: '234M', bid: 7.22, ask: 7.24 },
    ],
    commodities: [
      { symbol: 'GOLD', price: 2045.50, change: 12.30, changePercent: 0.61, volume: '145K', bid: 2045.20, ask: 2045.80 },
      { symbol: 'SILVER', price: 24.85, change: -0.15, changePercent: -0.60, volume: '89K', bid: 24.83, ask: 24.87 },
      { symbol: 'CRUDE', price: 78.45, change: 1.25, changePercent: 1.62, volume: '456K', bid: 78.40, ask: 78.50 },
      { symbol: 'NATGAS', price: 2.78, change: -0.08, changePercent: -2.80, volume: '234K', bid: 2.77, ask: 2.79 },
    ]
  };

  const categories = [
    { key: 'forex', label: 'Forex', icon: 'globe-outline' },
    { key: 'stocks', label: 'Stocks', icon: 'trending-up-outline' },
    { key: 'crypto', label: 'Crypto', icon: 'logo-bitcoin' },
    { key: 'commodities', label: 'Commodities', icon: 'diamond-outline' }
  ];

  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'];

  const getChangeColor = (change) => {
    return change >= 0 ? '#10b981' : '#ef4444';
  };

  const formatPrice = (price, symbol) => {
    if (symbol.includes('USD') && !symbol.includes('BTC') && !symbol.includes('ETH')) {
      return price.toFixed(4);
    }
    return price.toFixed(2);
  };

  const formatVolume = (volume) => {
    if (typeof volume === 'string') return volume;
    if (volume >= 1000000000) return `${(volume / 1000000000).toFixed(1)}B`;
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const renderMarketItem = ({ item }) => (
    <TouchableOpacity style={styles.marketItem}>
      <View style={styles.marketInfo}>
        <Text style={styles.marketSymbol}>{item.symbol}</Text>
        <Text style={styles.marketPrice}>
          ${formatPrice(item.price, item.symbol)}
        </Text>
      </View>
      
      <View style={styles.marketChange}>
        <Text style={[styles.changeValue, { color: getChangeColor(item.change) }]}>
          {item.change >= 0 ? '+' : ''}{item.change.toFixed(item.symbol.includes('USD') && !item.symbol.includes('BTC') ? 4 : 2)}
        </Text>
        <Text style={[styles.changePercent, { color: getChangeColor(item.change) }]}>
          ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
        </Text>
      </View>
      
      <View style={styles.marketDetails}>
        <Text style={styles.detailText}>Vol: {formatVolume(item.volume)}</Text>
        <Text style={styles.detailText}>
          Bid: ${formatPrice(item.bid, item.symbol)} | Ask: ${formatPrice(item.ask, item.symbol)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const marketSummary = {
    totalVolume: '$127.5B',
    activeMarkets: 156,
    gainers: 89,
    losers: 67
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Markets</Text>
        <Text style={styles.headerSubtitle}>Real-time market data optimized for NZ traders</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Market Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Volume</Text>
              <Text style={styles.summaryValue}>{marketSummary.totalVolume}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Active Markets</Text>
              <Text style={styles.summaryValue}>{marketSummary.activeMarkets}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Gainers</Text>
              <Text style={[styles.summaryValue, { color: '#10b981' }]}>{marketSummary.gainers}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Losers</Text>
              <Text style={[styles.summaryValue, { color: '#ef4444' }]}>{marketSummary.losers}</Text>
            </View>
          </View>
        </View>

        {/* Category Selector */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.key}
                style={[styles.categoryTab, selectedCategory === category.key && styles.activeCategoryTab]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Ionicons
                  name={category.icon}
                  size={20}
                  color={selectedCategory === category.key ? 'white' : '#64748b'}
                />
                <Text style={[styles.categoryText, selectedCategory === category.key && styles.activeCategoryText]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Timeframe Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeframe</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeframeContainer}>
            {timeframes.map(timeframe => (
              <TouchableOpacity
                key={timeframe}
                style={[styles.timeframeTab, selectedTimeframe === timeframe && styles.activeTimeframeTab]}
                onPress={() => setSelectedTimeframe(timeframe)}
              >
                <Text style={[styles.timeframeText, selectedTimeframe === timeframe && styles.activeTimeframeText]}>
                  {timeframe}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Market Data */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {categories.find(cat => cat.key === selectedCategory)?.label} Markets
            </Text>
            <TouchableOpacity style={styles.refreshButton}>
              <Ionicons name="refresh-outline" size={20} color="#1e40af" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={marketData[selectedCategory]}
            renderItem={renderMarketItem}
            keyExtractor={item => item.symbol}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Trading Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trading Sessions (NZ Time)</Text>
          <View style={styles.sessionContainer}>
            <View style={styles.sessionItem}>
              <View style={[styles.sessionIndicator, { backgroundColor: '#10b981' }]} />
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionName}>Asian Session</Text>
                <Text style={styles.sessionTime}>Active (06:00 - 15:00)</Text>
              </View>
            </View>
            <View style={styles.sessionItem}>
              <View style={[styles.sessionIndicator, { backgroundColor: '#f59e0b' }]} />
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionName}>London Session</Text>
                <Text style={styles.sessionTime}>Opens in 2h (20:00 - 05:00)</Text>
              </View>
            </View>
            <View style={styles.sessionItem}>
              <View style={[styles.sessionIndicator, { backgroundColor: '#64748b' }]} />
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionName}>New York Session</Text>
                <Text style={styles.sessionTime}>Closed (01:00 - 10:00)</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#1e40af',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  refreshButton: {
    padding: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f1f5f9',
  },
  activeCategoryTab: {
    backgroundColor: '#1e40af',
  },
  categoryText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
  },
  activeCategoryText: {
    color: 'white',
    fontWeight: '500',
  },
  timeframeContainer: {
    flexDirection: 'row',
  },
  timeframeTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f1f5f9',
  },
  activeTimeframeTab: {
    backgroundColor: '#1e40af',
  },
  timeframeText: {
    fontSize: 12,
    color: '#64748b',
  },
  activeTimeframeText: {
    color: 'white',
    fontWeight: '500',
  },
  marketItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  marketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  marketSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  marketPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  marketChange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  changePercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  marketDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#64748b',
  },
  sessionContainer: {
    marginTop: 8,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  sessionTime: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});