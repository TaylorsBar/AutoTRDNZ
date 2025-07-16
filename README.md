# NZ Trading App

A comprehensive autonomous trading application optimized for New Zealand users, built with React Native and Expo.

## 📱 Features

### 🏠 Dashboard
- **Real-time Account Overview**: Monitor your balance, active strategies, and open positions
- **Performance Analytics**: Visual charts and metrics to track your trading success
- **Recent Trades**: Quick view of your latest trading activities
- **NZ Timezone Advantage**: Optimized display for New Zealand trading hours

### 📊 Trading Strategies
- **Strategy Management**: Create, configure, and monitor autonomous trading strategies
- **Risk Level Controls**: Low, Medium, and High risk categorization
- **Multi-Asset Support**: Forex, Stocks, Crypto, and Commodities
- **Real-time Performance**: Live tracking of strategy performance and win rates

### 💹 Trade History
- **Comprehensive Trade Log**: Detailed view of all your trades with P&L tracking
- **Advanced Filtering**: Filter by trade status, profitability, and time periods
- **Performance Metrics**: Win rate, total P&L, and trade statistics
- **Export Functionality**: Export trade data for analysis

### 🌐 Markets
- **Multi-Asset Coverage**: Forex, Stocks, Cryptocurrency, and Commodities
- **Real-time Data**: Live market prices with bid/ask spreads
- **Trading Sessions**: NZ timezone-optimized session tracking
- **Market Analysis**: Volume data and price change indicators

### ⚙️ Settings
- **Trading Controls**: Auto-trading, risk management, and emergency stop
- **Security Features**: Biometric authentication and 2FA support
- **Notifications**: Customizable alerts for trades, prices, and market events
- **Display Options**: Dark mode, compact view, and advanced metrics

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TaylorsBar/studious-couscous.git
   cd studious-couscous
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

## 🏗️ Project Structure

```
├── App.js                 # Main application component
├── Navigation.js          # Navigation configuration
├── screens/              # Screen components
│   ├── DashboardScreen.js
│   ├── StrategiesScreen.js
│   ├── TradesScreen.js
│   ├── MarketsScreen.js
│   └── SettingsScreen.js
├── api.js                # API routes (backend)
├── config.js             # Application configuration
├── marketDataService.js  # Market data service
├── logger.js             # Logging utilities
├── components.test.js    # Component tests
├── e2e.test.js          # End-to-end tests
└── *.md                 # Documentation files
```

## 🌏 New Zealand Trading Optimization

This application is specifically designed for New Zealand traders with:

- **Timezone Optimization**: All trading sessions displayed in NZST/NZDT
- **Regulatory Compliance**: Built with NZ trading regulations in mind
- **Market Hours**: Optimized for Asian, London, and US market sessions
- **Currency Support**: NZD pairs prominently featured
- **Local Trading Hours**: Best trading times highlighted for NZ users

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
MARKET_DATA_API_KEY=your_api_key_here
MARKET_DATA_PROVIDER=alpha_vantage
NEWS_API_KEY=your_news_api_key
JWT_SECRET=your_jwt_secret
```

### Trading Configuration
Edit `config.js` to customize:
- Risk management settings
- Supported exchanges
- Trading hours
- Default parameters

## 🧪 Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

## 📋 API Documentation

### Market Data Service
- **Forex**: EUR/USD, GBP/USD, USD/JPY, AUD/USD, NZD/USD
- **Stocks**: AAPL, MSFT, GOOGL, AMZN, TSLA
- **Crypto**: BTC, ETH, BNB, ADA, SOL
- **Commodities**: Gold, Silver, Oil, Natural Gas

### Supported Timeframes
- 1m, 5m, 15m, 30m, 1h, 4h, daily, weekly

## 🛡️ Security Features

- **Biometric Authentication**: Fingerprint and Face ID support
- **Two-Factor Authentication**: SMS and authenticator app support
- **Session Management**: Configurable timeout and auto-logout
- **Data Encryption**: All sensitive data encrypted at rest and in transit

## 🔄 Development Status

### ✅ Completed Features
- [x] Complete UI/UX design
- [x] Navigation system
- [x] Dashboard with real-time data
- [x] Strategy management
- [x] Trade history and filtering
- [x] Market data display
- [x] Comprehensive settings
- [x] NZ timezone optimization

### 🚧 In Progress
- [ ] Backend API integration
- [ ] Real-time data websockets
- [ ] Push notifications
- [ ] User authentication
- [ ] Trading algorithm implementation

### 📋 Planned Features
- [ ] Advanced charting
- [ ] Social trading features
- [ ] Portfolio analysis
- [ ] Tax reporting for NZ users
- [ ] Educational resources

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and inquiries:
- Email: support@nztradingapp.com
- GitHub Issues: [Create an issue](https://github.com/TaylorsBar/studious-couscous/issues)
- Documentation: [Wiki](https://github.com/TaylorsBar/studious-couscous/wiki)

## ⚠️ Disclaimer

This application is for educational and demonstration purposes. Trading involves significant risk and may not be suitable for all investors. Past performance does not guarantee future results. Please consult with a qualified financial advisor before making trading decisions.

---

**Built with ❤️ for New Zealand traders**