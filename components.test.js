// Frontend component tests using React Testing Library
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../src/app/dashboard/page';
import StrategiesPage from '../src/app/dashboard/strategies/page';
import TradesPage from '../src/app/dashboard/trades/page';
import MarketsPage from '../src/app/dashboard/markets/page';

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      account: {
        balance: 24568.80,
        equity: 24750.25,
        activeStrategies: 5,
        openPositions: 4
      },
      recentTrades: [
        {
          id: 'trade1',
          symbol: 'EURUSD',
          type: 'buy',
          profit: 125.50,
          time: '10:45 AM'
        },
        {
          id: 'trade2',
          symbol: 'AAPL',
          type: 'sell',
          profit: -45.20,
          time: '09:30 AM'
        }
      ],
      activeStrategies: [
        {
          id: 'strategy1',
          name: 'US Pre-Market Momentum',
          status: 'active',
          market: 'forex',
          symbols: ['EURUSD', 'GBPUSD'],
          performance: '+5.2% this week',
          lastTrade: '2 hours ago'
        },
        {
          id: 'strategy2',
          name: 'Asian Session Breakout',
          status: 'active',
          market: 'forex',
          symbols: ['USDJPY', 'AUDUSD'],
          performance: '+3.8% this week',
          lastTrade: '45 minutes ago'
        }
      ],
      marketData: {
        EURUSD: { price: 1.0845, change: 0.12 },
        GBPUSD: { price: 1.2654, change: 0.08 },
        USDJPY: { price: 151.25, change: -0.15 },
        NZDUSD: { price: 0.6025, change: 0.22 }
      },
      tradingSessions: {
        current: 'london',
        active: ['asian', 'london'],
        optimalTradingTime: '08:00 - 16:00 NZST'
      }
    }),
  })
);

describe('Dashboard Component Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders dashboard with account overview', async () => {
    render(<Dashboard />);
    
    // Check for account overview section
    expect(screen.getByText('Account Overview')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('$24,568.80')).toBeInTheDocument();
    });
    
    // Check for active strategies count
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Check for open positions
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  test('renders recent trades section', async () => {
    render(<Dashboard />);
    
    // Check for recent trades section
    expect(screen.getByText('Recent Trades')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('EURUSD')).toBeInTheDocument();
      expect(screen.getByText('+$125.50')).toBeInTheDocument();
      expect(screen.getByText('AAPL')).toBeInTheDocument();
      expect(screen.getByText('-$45.20')).toBeInTheDocument();
    });
  });

  test('renders NZ timezone advantage section', async () => {
    render(<Dashboard />);
    
    // Check for NZ timezone advantage section
    expect(screen.getByText('NZ Timezone Advantage')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Current active markets: London Session, Asian Session')).toBeInTheDocument();
      expect(screen.getByText('Optimal trading time: 08:00 - 16:00 NZST')).toBeInTheDocument();
    });
  });
});

describe('Strategies Page Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders strategies list', async () => {
    render(<StrategiesPage />);
    
    // Check for strategies title
    expect(screen.getByText('Strategies')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('US Pre-Market Momentum')).toBeInTheDocument();
      expect(screen.getByText('Asian Session Breakout')).toBeInTheDocument();
    });
  });

  test('filters strategies correctly', async () => {
    render(<StrategiesPage />);
    
    // Find and click the status filter
    const statusFilter = screen.getByLabelText('Status');
    fireEvent.change(statusFilter, { target: { value: 'active' } });
    
    // Wait for filtered data
    await waitFor(() => {
      expect(screen.getByText('US Pre-Market Momentum')).toBeInTheDocument();
      expect(screen.getByText('Asian Session Breakout')).toBeInTheDocument();
      expect(screen.queryByText('London-NZ Overlap Strategy')).not.toBeInTheDocument();
    });
  });

  test('creates new strategy', async () => {
    render(<StrategiesPage />);
    
    // Mock the API response for strategy creation
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          strategy: {
            id: 'new-strategy',
            name: 'New Test Strategy',
            status: 'inactive'
          }
        }),
      })
    );
    
    // Find and click the create button
    const createButton = screen.getByText('Create New Strategy');
    fireEvent.click(createButton);
    
    // Wait for modal to appear and fill form
    await waitFor(() => {
      expect(screen.getByText('Create Strategy')).toBeInTheDocument();
    });
    
    // Fill form fields
    fireEvent.change(screen.getByLabelText('Strategy Name'), { target: { value: 'New Test Strategy' } });
    fireEvent.change(screen.getByLabelText('Strategy Type'), { target: { value: 'trend_following' } });
    fireEvent.change(screen.getByLabelText('Market'), { target: { value: 'forex' } });
    fireEvent.change(screen.getByLabelText('Symbols'), { target: { value: 'EURUSD,GBPUSD' } });
    
    // Submit form
    fireEvent.click(screen.getByText('Create'));
    
    // Verify API was called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/strategies', expect.any(Object));
    });
  });
});

describe('Trades Page Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders trades history', async () => {
    render(<TradesPage />);
    
    // Check for trades title
    expect(screen.getByText('Trade History')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('EURUSD')).toBeInTheDocument();
      expect(screen.getByText('+$125.50')).toBeInTheDocument();
    });
  });

  test('filters trades by date range', async () => {
    render(<TradesPage />);
    
    // Find and click the date range filter
    const dateFilter = screen.getByLabelText('Date Range');
    fireEvent.change(dateFilter, { target: { value: 'this_week' } });
    
    // Wait for filtered data
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/trades?dateRange=this_week', expect.any(Object));
    });
  });

  test('displays trade details', async () => {
    render(<TradesPage />);
    
    // Mock the API response for trade details
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          trade: {
            id: 'trade1',
            symbol: 'EURUSD',
            type: 'buy',
            entryPrice: 1.0845,
            exitPrice: 1.0872,
            profit: 125.50,
            openTime: 'Apr 6, 10:45 AM',
            closeTime: 'Apr 6, 12:30 PM',
            duration: '1h 45m',
            strategy: 'US Pre-Market Momentum'
          }
        }),
      })
    );
    
    // Wait for data to load and click details button
    await waitFor(() => {
      const detailsButton = screen.getAllByText('Details')[0];
      fireEvent.click(detailsButton);
    });
    
    // Verify API was called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/trades/trade1', expect.any(Object));
    });
    
    // Check for trade details modal
    await waitFor(() => {
      expect(screen.getByText('Trade Details')).toBeInTheDocument();
      expect(screen.getByText('Entry Price:')).toBeInTheDocument();
      expect(screen.getByText('1.0845')).toBeInTheDocument();
    });
  });
});

describe('Markets Page Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders market overview', async () => {
    render(<MarketsPage />);
    
    // Check for markets title
    expect(screen.getByText('Markets')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('EURUSD')).toBeInTheDocument();
      expect(screen.getByText('1.0845')).toBeInTheDocument();
      expect(screen.getByText('+0.12%')).toBeInTheDocument();
    });
  });

  test('displays trading sessions in NZ time', async () => {
    render(<MarketsPage />);
    
    // Check for trading sessions section
    expect(screen.getByText('Trading Sessions (NZ Time)')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Current active markets: London Session, Asian Session')).toBeInTheDocument();
      expect(screen.getByText('Optimal trading time: 08:00 - 16:00 NZST')).toBeInTheDocument();
    });
  });

  test('filters markets by type', async () => {
    render(<MarketsPage />);
    
    // Find and click the market type filter
    const marketTypeFilter = screen.getByLabelText('Market Type');
    fireEvent.change(marketTypeFilter, { target: { value: 'forex' } });
    
    // Wait for filtered data
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/market-data/markets?type=forex', expect.any(Object));
    });
  });

  test('initiates trade from market page', async () => {
    render(<MarketsPage />);
    
    // Mock the API response for trade creation
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          success: true
        }),
      })
    );
    
    // Wait for data to load and click trade button
    await waitFor(() => {
      const tradeButton = screen.getAllByText('Trade')[0];
      fireEvent.click(tradeButton);
    });
    
    // Check for trade modal
    await waitFor(() => {
      expect(screen.getByText('New Trade')).toBeInTheDocument();
    });
    
    // Fill trade form
    fireEvent.click(screen.getByLabelText('Buy'));
    fireEvent.change(screen.getByLabelText('Lot Size'), { target: { value: '0.1' } });
    
    // Submit form
    fireEvent.click(screen.getByText('Place Trade'));
    
    // Verify API was called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/trades', expect.any(Object));
    });
  });
});
