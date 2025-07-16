import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function StrategiesScreen() {
  const [strategies, setStrategies] = useState([
    {
      id: 1,
      name: 'US Pre-Market Momentum',
      description: 'Capitalizes on pre-market volatility in US stocks',
      type: 'Momentum',
      timeframe: '5min',
      isActive: true,
      performance: '+12.5%',
      trades: 23,
      winRate: '68%',
      symbols: ['AAPL', 'MSFT', 'GOOGL'],
      riskLevel: 'Medium'
    },
    {
      id: 2,
      name: 'Asian Session Breakout',
      description: 'Trades forex breakouts during Asian trading hours',
      type: 'Breakout',
      timeframe: '15min',
      isActive: true,
      performance: '+8.3%',
      trades: 18,
      winRate: '72%',
      symbols: ['USDJPY', 'AUDUSD', 'NZDUSD'],
      riskLevel: 'Low'
    },
    {
      id: 3,
      name: 'London Session Reversal',
      description: 'Identifies reversal patterns in major forex pairs',
      type: 'Reversal',
      timeframe: '30min',
      isActive: false,
      performance: '+5.7%',
      trades: 15,
      winRate: '60%',
      symbols: ['EURUSD', 'GBPUSD'],
      riskLevel: 'High'
    },
    {
      id: 4,
      name: 'Crypto Arbitrage',
      description: 'Exploits price differences across crypto exchanges',
      type: 'Arbitrage',
      timeframe: '1min',
      isActive: true,
      performance: '+15.2%',
      trades: 45,
      winRate: '85%',
      symbols: ['BTC', 'ETH', 'ADA'],
      riskLevel: 'Medium'
    }
  ]);

  const toggleStrategy = (id) => {
    setStrategies(prevStrategies =>
      prevStrategies.map(strategy =>
        strategy.id === id ? { ...strategy, isActive: !strategy.isActive } : strategy
      )
    );
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getPerformanceColor = (performance) => {
    return performance.startsWith('+') ? '#10b981' : '#ef4444';
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trading Strategies</Text>
        <Text style={styles.headerSubtitle}>Manage your autonomous trading strategies</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Strategy Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Strategy Overview</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Active Strategies</Text>
              <Text style={styles.summaryValue}>{strategies.filter(s => s.isActive).length}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Trades</Text>
              <Text style={styles.summaryValue}>{strategies.reduce((sum, s) => sum + s.trades, 0)}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Avg Win Rate</Text>
              <Text style={styles.summaryValue}>
                {Math.round(strategies.reduce((sum, s) => sum + parseInt(s.winRate), 0) / strategies.length)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Strategy List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Strategies</Text>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.addButtonText}>Add New</Text>
            </TouchableOpacity>
          </View>

          {strategies.map(strategy => (
            <View key={strategy.id} style={styles.strategyCard}>
              <View style={styles.strategyHeader}>
                <View style={styles.strategyTitleContainer}>
                  <Text style={styles.strategyName}>{strategy.name}</Text>
                  <View style={[styles.riskBadge, { backgroundColor: getRiskColor(strategy.riskLevel) + '20' }]}>
                    <Text style={[styles.riskBadgeText, { color: getRiskColor(strategy.riskLevel) }]}>
                      {strategy.riskLevel}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={strategy.isActive}
                  onValueChange={() => toggleStrategy(strategy.id)}
                  trackColor={{ false: '#f1f5f9', true: '#10b981' }}
                  thumbColor={strategy.isActive ? '#ffffff' : '#f4f3f4'}
                />
              </View>

              <Text style={styles.strategyDescription}>{strategy.description}</Text>

              <View style={styles.strategyDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type:</Text>
                  <Text style={styles.detailValue}>{strategy.type}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Timeframe:</Text>
                  <Text style={styles.detailValue}>{strategy.timeframe}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Symbols:</Text>
                  <Text style={styles.detailValue}>{strategy.symbols.join(', ')}</Text>
                </View>
              </View>

              <View style={styles.strategyStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Performance</Text>
                  <Text style={[styles.statValue, { color: getPerformanceColor(strategy.performance) }]}>
                    {strategy.performance}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Trades</Text>
                  <Text style={styles.statValue}>{strategy.trades}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Win Rate</Text>
                  <Text style={styles.statValue}>{strategy.winRate}</Text>
                </View>
              </View>

              <View style={styles.strategyActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="analytics-outline" size={16} color="#1e40af" />
                  <Text style={styles.actionButtonText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="settings-outline" size={16} color="#1e40af" />
                  <Text style={styles.actionButtonText}>Configure</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  strategyCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  strategyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  strategyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  strategyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginRight: 8,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  riskBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  strategyDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  strategyDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '500',
  },
  strategyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  strategyActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#1e40af',
    marginLeft: 4,
  },
});