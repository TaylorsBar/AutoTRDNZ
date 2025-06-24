// End-to-end tests for the trading application
const { chromium } = require('playwright');
const assert = require('assert');

describe('End-to-End Tests', () => {
  let browser;
  let page;
  let authToken;

  before(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    
    // Login and get auth token
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForSelector('h1:has-text("Dashboard")');
    
    // Get auth token from localStorage
    authToken = await page.evaluate(() => localStorage.getItem('authToken'));
  });

  after(async () => {
    await browser.close();
  });

  describe('User Authentication Flow', () => {
    it('should register a new user', async () => {
      await page.goto('http://localhost:3000/auth/register');
      
      // Fill registration form
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'newuser@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.fill('input[name="confirmPassword"]', 'password123');
      await page.selectOption('select[name="timezone"]', 'Pacific/Auckland');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Verify redirect to dashboard
      await page.waitForSelector('h1:has-text("Dashboard")');
      
      // Verify user is logged in
      const userName = await page.textContent('.user-profile-name');
      assert.strictEqual(userName, 'Test User');
    });
    
    it('should login an existing user', async () => {
      await page.goto('http://localhost:3000/auth/login');
      
      // Fill login form
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'testpassword');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Verify redirect to dashboard
      await page.waitForSelector('h1:has-text("Dashboard")');
      
      // Verify user is logged in
      const userName = await page.textContent('.user-profile-name');
      assert.strictEqual(userName, 'Test User');
    });
    
    it('should logout user', async () => {
      // Click on user menu
      await page.click('.user-menu-button');
      
      // Click logout
      await page.click('button:has-text("Logout")');
      
      // Verify redirect to login page
      await page.waitForSelector('h1:has-text("Login")');
    });
  });

  describe('Dashboard Functionality', () => {
    beforeEach(async () => {
      // Ensure user is logged in
      if (!await page.isVisible('h1:has-text("Dashboard")')) {
        await page.goto('http://localhost:3000/auth/login');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="password"]', 'testpassword');
        await page.click('button[type="submit"]');
        await page.waitForSelector('h1:has-text("Dashboard")');
      }
    });
    
    it('should display account overview', async () => {
      await page.goto('http://localhost:3000/dashboard');
      
      // Verify account overview section
      await page.waitForSelector('h2:has-text("Account Overview")');
      
      // Check for account balance
      const balanceText = await page.textContent('.account-balance');
      assert.ok(balanceText.includes('$'));
      
      // Check for active strategies
      const strategiesText = await page.textContent('.active-strategies');
      assert.ok(strategiesText.includes('Active Strategies'));
    });
    
    it('should display NZ timezone advantage information', async () => {
      await page.goto('http://localhost:3000/dashboard');
      
      // Verify NZ timezone section
      await page.waitForSelector('h2:has-text("NZ Timezone Advantage")');
      
      // Check for trading sessions visualization
      await page.waitForSelector('.timezone-visualization');
      
      // Check for optimal trading time
      const optimalTimeText = await page.textContent('.optimal-trading-time');
      assert.ok(optimalTimeText.includes('NZST'));
    });
  });

  describe('Strategy Management', () => {
    let testStrategyId;
    
    beforeEach(async () => {
      // Ensure user is logged in
      if (!await page.isVisible('h1:has-text("Dashboard")')) {
        await page.goto('http://localhost:3000/auth/login');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="password"]', 'testpassword');
        await page.click('button[type="submit"]');
        await page.waitForSelector('h1:has-text("Dashboard")');
      }
    });
    
    it('should create a new strategy', async () => {
      await page.goto('http://localhost:3000/dashboard/strategies');
      
      // Click create strategy button
      await page.click('button:has-text("Create New Strategy")');
      
      // Wait for modal to appear
      await page.waitForSelector('h2:has-text("Create Strategy")');
      
      // Fill strategy form
      await page.fill('input[name="name"]', 'E2E Test Strategy');
      await page.selectOption('select[name="type"]', 'trend_following');
      await page.selectOption('select[name="market"]', 'forex');
      await page.fill('input[name="symbols"]', 'EURUSD,GBPUSD');
      await page.selectOption('select[name="timeframe"]', '1h');
      
      // Fill strategy parameters
      await page.fill('input[name="parameters.movingAveragePeriod"]', '20');
      await page.fill('input[name="parameters.rsiPeriod"]', '14');
      
      // Submit form
      await page.click('button:has-text("Create")');
      
      // Verify strategy was created
      await page.waitForSelector('.strategy-card:has-text("E2E Test Strategy")');
      
      // Get strategy ID for later tests
      testStrategyId = await page.getAttribute('.strategy-card:has-text("E2E Test Strategy")', 'data-strategy-id');
    });
    
    it('should activate a strategy', async () => {
      await page.goto('http://localhost:3000/dashboard/strategies');
      
      // Find the test strategy
      await page.waitForSelector(`.strategy-card[data-strategy-id="${testStrategyId}"]`);
      
      // Click activate button
      await page.click(`.strategy-card[data-strategy-id="${testStrategyId}"] button:has-text("Activate")`);
      
      // Verify strategy status changed
      await page.waitForSelector(`.strategy-card[data-strategy-id="${testStrategyId}"] .strategy-status:has-text("Active")`);
    });
    
    it('should edit a strategy', async () => {
      await page.goto('http://localhost:3000/dashboard/strategies');
      
      // Find the test strategy
      await page.waitForSelector(`.strategy-card[data-strategy-id="${testStrategyId}"]`);
      
      // Click edit button
      await page.click(`.strategy-card[data-strategy-id="${testStrategyId}"] button:has-text("Edit")`);
      
      // Wait for modal to appear
      await page.waitForSelector('h2:has-text("Edit Strategy")');
      
      // Update strategy name
      await page.fill('input[name="name"]', 'Updated E2E Test Strategy');
      
      // Submit form
      await page.click('button:has-text("Save")');
      
      // Verify strategy was updated
      await page.waitForSelector('.strategy-card:has-text("Updated E2E Test Strategy")');
    });
  });

  describe('Trading Functionality', () => {
    let testTradeId;
    
    beforeEach(async () => {
      // Ensure user is logged in
      if (!await page.isVisible('h1:has-text("Dashboard")')) {
        await page.goto('http://localhost:3000/auth/login');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="password"]', 'testpassword');
        await page.click('button[type="submit"]');
        await page.waitForSelector('h1:has-text("Dashboard")');
      }
    });
    
    it('should place a manual trade', async () => {
      await page.goto('http://localhost:3000/dashboard/markets');
      
      // Find EURUSD market
      await page.waitForSelector('.market-card:has-text("EURUSD")');
      
      // Click trade button
      await page.click('.market-card:has-text("EURUSD") button:has-text("Trade")');
      
      // Wait for trade modal to appear
      await page.waitForSelector('h2:has-text("New Trade")');
      
      // Fill trade form
      await page.click('input[name="type"][value="buy"]');
      await page.fill('input[name="lotSize"]', '0.1');
      await page.fill('input[name="stopLoss"]', '1.0800');
      await page.fill('input[name="takeProfit"]', '1.0900');
      
      // Submit form
      await page.click('button:has-text("Place Trade")');
      
      // Verify trade was placed
      await page.waitForSelector('.notification-success:has-text("Trade placed successfully")');
      
      // Go to trades page
      await page.goto('http://localhost:3000/dashboard/trades');
      
      // Verify trade appears in list
      await page.waitForSelector('.trade-row:has-text("EURUSD")');
      
      // Get trade ID for later tests
      testTradeId = await page.getAttribute('.trade-row:has-text("EURUSD")', 'data-trade-id');
    });
    
    it('should close a manual trade', async () => {
      await page.goto('http://localhost:3000/dashboard/trades');
      
      // Find the test trade
      await page.waitForSelector(`.trade-row[data-trade-id="${testTradeId}"]`);
      
      // Click close button
      await page.click(`.trade-row[data-trade-id="${testTradeId}"] button:has-text("Close")`);
      
      // Wait for confirmation modal
      await page.waitForSelector('h2:has-text("Close Trade")');
      
      // Confirm close
      await page.click('button:has-text("Confirm")');
      
      // Verify trade was closed
      await page.waitForSelector(`.trade-row[data-trade-id="${testTradeId}"] .trade-status:has-text("Closed")`);
    });
  });

  describe('NZ Timezone Specific Features', () => {
    beforeEach(async () => {
      // Ensure user is logged in
      if (!await page.isVisible('h1:has-text("Dashboard")')) {
        await page.goto('http://localhost:3000/auth/login');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="password"]', 'testpassword');
        await page.click('button[type="submit"]');
        await page.waitForSelector('h1:has-text("Dashboard")');
      }
    });
    
    it('should display market hours in NZ timezone', async () => {
      await page.goto('http://localhost:3000/dashboard/markets');
      
      // Check for trading sessions section
      await page.waitForSelector('h2:has-text("Trading Sessions (NZ Time)")');
      
      // Verify NZ timezone information is displayed
      const sessionText = await page.textContent('.trading-sessions-info');
      assert.ok(sessionText.includes('NZST'));
    });
    
    it('should configure NZ timezone settings', async () => {
      await page.goto('http://localhost:3000/dashboard/settings');
      
      // Check for NZ timezone settings section
      await page.waitForSelector('h2:has-text("NZ Timezone Settings")');
      
      // Toggle auto-adjust setting
      await page.click('label:has-text("Auto-adjust for NZ Trading Hours")');
      
      // Save settings
      await page.click('button:has-text("Save Settings")');
      
      // Verify settings were saved
      await page.waitForSelector('.notification-success:has-text("Settings updated successfully")');
    });
    
    it('should filter strategies by NZ-optimal sessions', async () => {
      await page.goto('http://localhost:3000/dashboard/strategies');
      
      // Click on session filter
      await page.click('button:has-text("Filter by Session")');
      
      // Select NZ-optimal option
      await page.click('li:has-text("NZ Optimal")');
      
      // Verify filtered results
      await page.waitForSelector('.strategy-card:has-text("Asian Session Breakout")');
    });
  });
});
