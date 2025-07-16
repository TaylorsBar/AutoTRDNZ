import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: {
      pushEnabled: true,
      tradeAlerts: true,
      marketAlerts: false,
      priceAlerts: true,
      strategyAlerts: true,
    },
    trading: {
      autoTrading: true,
      riskManagement: true,
      emergencyStop: false,
      paperTradingMode: false,
    },
    display: {
      darkMode: false,
      compactView: false,
      showAdvancedMetrics: true,
    },
    account: {
      twoFactorAuth: false,
      biometricAuth: true,
      sessionTimeout: 30,
    }
  });

  const [userInfo] = useState({
    name: 'John Trader',
    email: 'john@example.com',
    accountType: 'Premium',
    memberSince: '2023-01-15',
    totalBalance: '$24,568.80',
    verificationStatus: 'Verified'
  });

  const updateSetting = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => console.log("Logout") }
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "This will reset all settings to default values. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => console.log("Reset settings") }
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, value, onToggle, type = 'switch', onPress }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={type === 'navigation' ? onPress : undefined}
      disabled={type === 'switch'}
    >
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={20} color="#1e40af" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.settingControl}>
        {type === 'switch' ? (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#f1f5f9', true: '#10b981' }}
            thumbColor={value ? '#ffffff' : '#f4f3f4'}
          />
        ) : type === 'navigation' ? (
          <Ionicons name="chevron-forward" size={20} color="#64748b" />
        ) : (
          <Text style={styles.settingValue}>{value}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title, subtitle }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Configure your trading experience</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.section}>
          <SectionHeader title="Profile" subtitle="Account information and status" />
          
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.profileAvatar}>
                <Ionicons name="person" size={32} color="#1e40af" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userInfo.name}</Text>
                <Text style={styles.profileEmail}>{userInfo.email}</Text>
                <View style={styles.profileBadge}>
                  <Text style={styles.profileBadgeText}>{userInfo.accountType}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.profileStats}>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatLabel}>Member Since</Text>
                <Text style={styles.profileStatValue}>{userInfo.memberSince}</Text>
              </View>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatLabel}>Total Balance</Text>
                <Text style={styles.profileStatValue}>{userInfo.totalBalance}</Text>
              </View>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatLabel}>Status</Text>
                <Text style={[styles.profileStatValue, { color: '#10b981' }]}>{userInfo.verificationStatus}</Text>
              </View>
            </View>
          </View>

          <SettingItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update personal information"
            type="navigation"
            onPress={() => console.log('Edit profile')}
          />
          
          <SettingItem
            icon="card-outline"
            title="Payment Methods"
            subtitle="Manage funding sources"
            type="navigation"
            onPress={() => console.log('Payment methods')}
          />
        </View>

        {/* Trading Settings */}
        <View style={styles.section}>
          <SectionHeader title="Trading" subtitle="Configure your trading preferences" />
          
          <SettingItem
            icon="trending-up-outline"
            title="Auto Trading"
            subtitle="Enable autonomous trading strategies"
            value={settings.trading.autoTrading}
            onToggle={(value) => updateSetting('trading', 'autoTrading', value)}
          />
          
          <SettingItem
            icon="shield-checkmark-outline"
            title="Risk Management"
            subtitle="Automatic risk controls"
            value={settings.trading.riskManagement}
            onToggle={(value) => updateSetting('trading', 'riskManagement', value)}
          />
          
          <SettingItem
            icon="stop-circle-outline"
            title="Emergency Stop"
            subtitle="Halt all trading activities"
            value={settings.trading.emergencyStop}
            onToggle={(value) => updateSetting('trading', 'emergencyStop', value)}
          />
          
          <SettingItem
            icon="document-text-outline"
            title="Paper Trading Mode"
            subtitle="Trade with virtual money"
            value={settings.trading.paperTradingMode}
            onToggle={(value) => updateSetting('trading', 'paperTradingMode', value)}
          />
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <SectionHeader title="Notifications" subtitle="Customize your alerts" />
          
          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Enable mobile notifications"
            value={settings.notifications.pushEnabled}
            onToggle={(value) => updateSetting('notifications', 'pushEnabled', value)}
          />
          
          <SettingItem
            icon="flash-outline"
            title="Trade Alerts"
            subtitle="Notifications for completed trades"
            value={settings.notifications.tradeAlerts}
            onToggle={(value) => updateSetting('notifications', 'tradeAlerts', value)}
          />
          
          <SettingItem
            icon="bar-chart-outline"
            title="Market Alerts"
            subtitle="Important market movements"
            value={settings.notifications.marketAlerts}
            onToggle={(value) => updateSetting('notifications', 'marketAlerts', value)}
          />
          
          <SettingItem
            icon="pricetag-outline"
            title="Price Alerts"
            subtitle="Target price notifications"
            value={settings.notifications.priceAlerts}
            onToggle={(value) => updateSetting('notifications', 'priceAlerts', value)}
          />
        </View>

        {/* Security */}
        <View style={styles.section}>
          <SectionHeader title="Security" subtitle="Protect your account" />
          
          <SettingItem
            icon="finger-print-outline"
            title="Biometric Authentication"
            subtitle="Use fingerprint or face ID"
            value={settings.account.biometricAuth}
            onToggle={(value) => updateSetting('account', 'biometricAuth', value)}
          />
          
          <SettingItem
            icon="shield-outline"
            title="Two-Factor Authentication"
            subtitle="Add extra security layer"
            value={settings.account.twoFactorAuth}
            onToggle={(value) => updateSetting('account', 'twoFactorAuth', value)}
          />
          
          <SettingItem
            icon="time-outline"
            title="Session Timeout"
            subtitle="Auto-logout after inactivity"
            value={`${settings.account.sessionTimeout} minutes`}
            type="value"
          />
        </View>

        {/* Display */}
        <View style={styles.section}>
          <SectionHeader title="Display" subtitle="Customize app appearance" />
          
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Use dark theme"
            value={settings.display.darkMode}
            onToggle={(value) => updateSetting('display', 'darkMode', value)}
          />
          
          <SettingItem
            icon="resize-outline"
            title="Compact View"
            subtitle="Show more data in less space"
            value={settings.display.compactView}
            onToggle={(value) => updateSetting('display', 'compactView', value)}
          />
          
          <SettingItem
            icon="analytics-outline"
            title="Advanced Metrics"
            subtitle="Show detailed trading statistics"
            value={settings.display.showAdvancedMetrics}
            onToggle={(value) => updateSetting('display', 'showAdvancedMetrics', value)}
          />
        </View>

        {/* Support & Legal */}
        <View style={styles.section}>
          <SectionHeader title="Support & Legal" />
          
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            subtitle="FAQs and tutorials"
            type="navigation"
            onPress={() => console.log('Help center')}
          />
          
          <SettingItem
            icon="chatbubble-outline"
            title="Contact Support"
            subtitle="Get help from our team"
            type="navigation"
            onPress={() => console.log('Contact support')}
          />
          
          <SettingItem
            icon="document-outline"
            title="Terms of Service"
            subtitle="Legal terms and conditions"
            type="navigation"
            onPress={() => console.log('Terms of service')}
          />
          
          <SettingItem
            icon="lock-closed-outline"
            title="Privacy Policy"
            subtitle="How we handle your data"
            type="navigation"
            onPress={() => console.log('Privacy policy')}
          />
        </View>

        {/* App Info & Actions */}
        <View style={styles.section}>
          <SectionHeader title="App Info" />
          
          <SettingItem
            icon="information-circle-outline"
            title="App Version"
            subtitle="Check for updates"
            value="v1.0.0"
            type="value"
          />
          
          <TouchableOpacity style={styles.actionButton} onPress={handleResetSettings}>
            <Ionicons name="refresh-outline" size={20} color="#f59e0b" />
            <Text style={[styles.actionButtonText, { color: '#f59e0b' }]}>Reset Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Logout</Text>
          </TouchableOpacity>
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  profileCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  profileBadge: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  profileBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  profileStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  settingControl: {
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: '#64748b',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});