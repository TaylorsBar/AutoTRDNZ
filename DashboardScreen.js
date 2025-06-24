import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NZ Trading</Text>
        <Text style={styles.headerSubtitle}>Autonomous Trading Platform</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Dashboard Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Overview</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Balance</Text>
              <Text style={styles.statValue}>$24,568.80</Text>
              <Text style={styles.statChange}>+2.5%</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Active Strategies</Text>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statChange}>3 Running</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Open Positions</Text>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statChange}>$12,350.00</Text>
            </View>
          </View>
        </View>
        
        {/* Performance Chart Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>Performance Chart</Text>
          </View>
        </View>
        
        {/* Recent Trades */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trades</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tradeItem}>
            <View style={styles.tradeItemLeft}>
              <Text style={styles.tradeSymbol}>EURUSD</Text>
              <Text style={styles.tradeType}>Buy</Text>
            </View>
            <View style={styles.tradeItemRight}>
              <Text style={styles.tradeProfit}>+$125.50</Text>
              <Text style={styles.tradeTime}>10:45 AM</Text>
            </View>
          </View>
          
          <View style={styles.tradeItem}>
            <View style={styles.tradeItemLeft}>
              <Text style={styles.tradeSymbol}>AAPL</Text>
              <Text style={[styles.tradeType, styles.tradeSell]}>Sell</Text>
            </View>
            <View style={styles.tradeItemRight}>
              <Text style={[styles.tradeProfit, styles.tradeLoss]}>-$45.20</Text>
              <Text style={styles.tradeTime}>09:30 AM</Text>
            </View>
          </View>
          
          <View style={styles.tradeItem}>
            <View style={styles.tradeItemLeft}>
              <Text style={styles.tradeSymbol}>GBPUSD</Text>
              <Text style={styles.tradeType}>Buy</Text>
            </View>
            <View style={styles.tradeItemRight}>
              <Text style={styles.tradeProfit}>+$78.30</Text>
              <Text style={styles.tradeTime}>08:15 AM</Text>
            </View>
          </View>
        </View>
        
        {/* Active Strategies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Strategies</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.strategyItem}>
            <View style={styles.strategyHeader}>
              <Text style={styles.strategyName}>US Pre-Market Momentum</Text>
              <View style={styles.strategyBadge}>
                <Text style={styles.strategyBadgeText}>Active</Text>
              </View>
            </View>
            <Text style={styles.strategyDetails}>Forex - EURUSD, GBPUSD</Text>
            <View style={styles.strategyStats}>
              <Text style={styles.strategyProfit}>+5.2% this week</Text>
              <Text style={styles.strategyLastTrade}>Last trade: 2 hours ago</Text>
            </View>
          </View>
          
          <View style={styles.strategyItem}>
            <View style={styles.strategyHeader}>
              <Text style={styles.strategyName}>Asian Session Breakout</Text>
              <View style={styles.strategyBadge}>
                <Text style={styles.strategyBadgeText}>Active</Text>
              </View>
            </View>
            <Text style={styles.strategyDetails}>Forex - USDJPY, AUDUSD</Text>
            <View style={styles.strategyStats}>
              <Text style={styles.strategyProfit}>+3.8% this week</Text>
              <Text style={styles.strategyLastTrade}>Last trade: 45 minutes ago</Text>
            </View>
          </View>
        </View>
        
        {/* Market Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Market Overview</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.marketsScroll}>
            <View style={styles.marketCard}>
              <View style={styles.marketCardHeader}>
                <Text style={styles.marketSymbol}>EURUSD</Text>
                <Text style={styles.marketChange}>+0.12%</Text>
              </View>
              <Text style={styles.marketPrice}>1.0845</Text>
              <View style={styles.marketChartPlaceholder}></View>
            </View>
            
            <View style={styles.marketCard}>
              <View style={styles.marketCardHeader}>
                <Text style={styles.marketSymbol}>GBPUSD</Text>
                <Text style={styles.marketChange}>+0.08%</Text>
              </View>
              <Text style={styles.marketPrice}>1.2654</Text>
              <View style={styles.marketChartPlaceholder}></View>
            </View>
            
            <View style={styles.marketCard}>
              <View style={styles.marketCardHeader}>
                <Text style={styles.marketSymbol}>USDJPY</Text>
                <Text style={[styles.marketChange, styles.marketChangeNegative]}>-0.15%</Text>
              </View>
              <Text style={styles.marketPrice}>151.25</Text>
              <View style={styles.marketChartPlaceholder}></View>
            </View>
            
            <View style={styles.marketCard}>
              <View style={styles.marketCardHeader}>
                <Text style={styles.marketSymbol}>NZDUSD</Text>
                <Text style={styles.marketChange}>+0.22%</Text>
              </View>
              <Text style={styles.marketPrice}>0.6025</Text>
              <View style={styles.marketChartPlaceholder}></View>
            </View>
          </ScrollView>
        </View>
        
        {/* NZ Timezone Advantage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NZ Timezone Advantage</Text>
          <View style={styles.timezoneContainer}>
            <View style={styles.timezoneHeader}>
              <Text style={styles.timezoneLabel}>00:00</Text>
              <Text style={styles.timezoneLabel}>06:00</Text>
              <Text style={styles.timezoneLabel}>12:00</Text>
              <Text style={styles.timezoneLabel}>18:00</Text>
              <Text style={styles.timezoneLabel}>24:00</Text>
            </View>
            <View style={styles.timezoneBar}>
              <View style={[styles.timezoneSession, styles.asianSession]}></View>
              <View style={[styles.timezoneSession, styles.londonSession]}></View>
              <View style={[styles.timezoneSession, styles.nySession]}></View>
              <View style={styles.currentTimeIndicator}></View>
            </View>
            <Text style={styles.timezoneText}>
              Current active markets: London Session, Asian Session
            </Text>
            <Text style={styles.timezoneText}>
              Optimal trading time: 08:00 - 16:00 NZST
            </Text>
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  seeAllLink: {
    color: '#1e40af',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statChange: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 4,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  tradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tradeItemLeft: {
    flexDirection: 'column',
  },
  tradeItemRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  tradeSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  tradeType: {
    fontSize: 14,
    color: '#10b981',
    marginTop: 2,
  },
  tradeSell: {
    color: '#ef4444',
  },
  tradeProfit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  tradeLoss: {
    color: '#ef4444',
  },
  tradeTime: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  strategyItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  strategyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  strategyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  strategyBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  strategyBadgeText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  strategyDetails: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  strategyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  strategyProfit: {
    fontSize: 12,
    color: '#10b981',
  },
  strategyLastTrade: {
    fontSize: 12,
    color: '#64748b',
  },
  marketsScroll: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  marketCard: {
    width: 140,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  marketCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  marketSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  marketChange: {
    fontSize: 12,
    color: '#10b981',
  },
  marketChangeNegative: {
    color: '#ef4444',
  },
  marketPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  marketChartPlaceholder: {
    height: 60,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  timezoneContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
  },
  timezoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timezoneLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  timezoneBar: {
    height: 24,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 8,
    position: 'relative',
  },
  timezoneSession: {
    position: 'absolute',
    height: '100%',
    borderRadius: 4,
  },
  asianSession: {
    backgroundColor: '#bfdbfe',
    left: 0,
    width: '25%',
  },
  londonSession: {
    backgroundColor: '#bbf7d0',
    left: '33%',
    width: '25%',
  },
  nySession: {
    backgroundColor: '#ddd6fe',
    left: '58%',
    width: '25%',
  },
  currentTimeIndicator: {
    position: 'absolute',
    top: 0,
    left: '45%',
    width: 2,
    height: '100%',
    backgroundColor: '#ef4444',
  },
  timezoneText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});
