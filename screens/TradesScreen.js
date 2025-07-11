import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function TradesScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [trades, setTrades] = useState([
    {
      id: 1,
      symbol: 'EURUSD',
      type: 'Buy',
      entryPrice: 1.0845,
      exitPrice: 1.0871,
      size: 10000,
      pnl: 260.00,
      openTime: '2024-01-15T08:30:00Z',
      closeTime: '2024-01-15T10:45:00Z',
      strategy: 'Asian Session Breakout',
      status: 'Closed',
      duration: '2h 15m'
    },
    {
      id: 2,
      symbol: 'AAPL',
      type: 'Buy',
      entryPrice: 192.50,
      exitPrice: null,
      size: 100,
      pnl: 425.00,
      openTime: '2024-01-15T09:30:00Z',
      closeTime: null,
      strategy: 'US Pre-Market Momentum',
      status: 'Open',
      duration: '1h 30m'
    },
    {
      id: 3,
      symbol: 'GBPUSD',
      type: 'Sell',
      entryPrice: 1.2654,
      exitPrice: 1.2628,
      size: 8000,
      pnl: 208.00,
      openTime: '2024-01-15T07:15:00Z',
      closeTime: '2024-01-15T08:45:00Z',
      strategy: 'London Session Reversal',
      status: 'Closed',
      duration: '1h 30m'
    },
    {
      id: 4,
      symbol: 'USDJPY',
      type: 'Buy',
      entryPrice: 151.25,
      exitPrice: 151.12,
      size: 5000,
      pnl: -65.00,
      openTime: '2024-01-15T06:00:00Z',
      closeTime: '2024-01-15T07:30:00Z',
      strategy: 'Asian Session Breakout',
      status: 'Closed',
      duration: '1h 30m'
    },
    {
      id: 5,
      symbol: 'BTC-USD',
      type: 'Buy',
      entryPrice: 43250.00,
      exitPrice: null,
      size: 0.5,
      pnl: 1750.00,
      openTime: '2024-01-15T05:45:00Z',
      closeTime: null,
      strategy: 'Crypto Arbitrage',
      status: 'Open',
      duration: '5h 45m'
    }
  ]);

  const getFilteredTrades = () => {
    switch (activeTab) {
      case 'open':
        return trades.filter(trade => trade.status === 'Open');
      case 'closed':
        return trades.filter(trade => trade.status === 'Closed');
      case 'profitable':
        return trades.filter(trade => trade.pnl > 0);
      default:
        return trades;
    }
  };

  const getTotalPnL = () => {
    return trades.reduce((sum, trade) => sum + trade.pnl, 0);
  };

  const getWinRate = () => {
    const closedTrades = trades.filter(trade => trade.status === 'Closed');
    const winningTrades = closedTrades.filter(trade => trade.pnl > 0);
    return closedTrades.length > 0 ? (winningTrades.length / closedTrades.length * 100).toFixed(1) : 0;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPnLColor = (pnl) => {
    return pnl >= 0 ? '#10b981' : '#ef4444';
  };

  const getTypeColor = (type) => {
    return type === 'Buy' ? '#10b981' : '#ef4444';
  };

  const renderTradeItem = ({ item }) => (
    <View style={styles.tradeCard}>
      <View style={styles.tradeHeader}>
        <View style={styles.tradeSymbolContainer}>
          <Text style={styles.tradeSymbol}>{item.symbol}</Text>
          <View style={[styles.tradeBadge, { backgroundColor: getTypeColor(item.type) }]}>
            <Text style={styles.tradeBadgeText}>{item.type}</Text>
          </View>
        </View>
        <View style={styles.tradePnLContainer}>
          <Text style={[styles.tradePnL, { color: getPnLColor(item.pnl) }]}>
            {item.pnl >= 0 ? '+' : ''}${item.pnl.toFixed(2)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'Open' ? '#f59e0b' : '#64748b' }]}>
            <Text style={styles.statusBadgeText}>{item.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tradeDetails}>
        <View style={styles.tradeRow}>
          <Text style={styles.tradeLabel}>Entry Price:</Text>
          <Text style={styles.tradeValue}>${item.entryPrice.toFixed(item.symbol.includes('USD') ? 4 : 2)}</Text>
        </View>
        {item.exitPrice && (
          <View style={styles.tradeRow}>
            <Text style={styles.tradeLabel}>Exit Price:</Text>
            <Text style={styles.tradeValue}>${item.exitPrice.toFixed(item.symbol.includes('USD') ? 4 : 2)}</Text>
          </View>
        )}
        <View style={styles.tradeRow}>
          <Text style={styles.tradeLabel}>Size:</Text>
          <Text style={styles.tradeValue}>{item.size}</Text>
        </View>
        <View style={styles.tradeRow}>
          <Text style={styles.tradeLabel}>Strategy:</Text>
          <Text style={styles.tradeValue}>{item.strategy}</Text>
        </View>
        <View style={styles.tradeRow}>
          <Text style={styles.tradeLabel}>Duration:</Text>
          <Text style={styles.tradeValue}>{item.duration}</Text>
        </View>
      </View>

      <View style={styles.tradeTime}>
        <Text style={styles.timeText}>
          {formatDate(item.openTime)} at {formatTime(item.openTime)}
          {item.closeTime && ` - ${formatTime(item.closeTime)}`}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trade History</Text>
        <Text style={styles.headerSubtitle}>Track your trading performance</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total P&L</Text>
              <Text style={[styles.summaryValue, { color: getPnLColor(getTotalPnL()) }]}>
                {getTotalPnL() >= 0 ? '+' : ''}${getTotalPnL().toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Win Rate</Text>
              <Text style={styles.summaryValue}>{getWinRate()}%</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Trades</Text>
              <Text style={styles.summaryValue}>{trades.length}</Text>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
            {[
              { key: 'all', label: 'All Trades' },
              { key: 'open', label: 'Open' },
              { key: 'closed', label: 'Closed' },
              { key: 'profitable', label: 'Profitable' }
            ].map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trades List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trades</Text>
            <TouchableOpacity style={styles.exportButton}>
              <Ionicons name="download-outline" size={16} color="#1e40af" />
              <Text style={styles.exportButtonText}>Export</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={getFilteredTrades()}
            renderItem={renderTradeItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
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
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1e40af',
  },
  exportButtonText: {
    color: '#1e40af',
    fontSize: 14,
    marginLeft: 4,
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
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f1f5f9',
  },
  activeTab: {
    backgroundColor: '#1e40af',
  },
  tabText: {
    fontSize: 14,
    color: '#64748b',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '500',
  },
  tradeCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tradeSymbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tradeSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginRight: 8,
  },
  tradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tradeBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  tradePnLContainer: {
    alignItems: 'flex-end',
  },
  tradePnL: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  tradeDetails: {
    marginBottom: 12,
  },
  tradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tradeLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  tradeValue: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '500',
  },
  tradeTime: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  timeText: {
    fontSize: 12,
    color: '#64748b',
  },
});