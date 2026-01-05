import { NextRequest, NextResponse } from 'next/server';

// In-memory wallet store (replace with database in production)
// Key: userId, Value: wallet data
const wallets: Map<string, {
  balance: number;
  currency: string;
  pending_bets: number;
  total_won: number;
  total_lost: number;
}> = new Map();

/**
 * GET /api/betting/wallet - Get user wallet
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get wallet or create default
    let wallet = wallets.get(userId);
    if (!wallet) {
      wallet = {
        balance: 0, // Start with 0, user must deposit
        currency: 'USD',
        pending_bets: 0,
        total_won: 0,
        total_lost: 0,
      };
      wallets.set(userId, wallet);
    }

    return NextResponse.json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/betting/wallet - Update wallet (deposit, withdraw, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, amount, transactionId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!action || !['deposit', 'withdraw', 'deduct', 'add_winnings'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

    if (amount === undefined || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    // Get or create wallet
    let wallet = wallets.get(userId);
    if (!wallet) {
      wallet = {
        balance: 0,
        currency: 'USD',
        pending_bets: 0,
        total_won: 0,
        total_lost: 0,
      };
      wallets.set(userId, wallet);
    }

    // Perform action
    switch (action) {
      case 'deposit':
        wallet.balance += amount;
        break;
      case 'withdraw':
        if (wallet.balance < amount) {
          return NextResponse.json(
            { success: false, error: 'Insufficient balance' },
            { status: 400 }
          );
        }
        wallet.balance -= amount;
        break;
      case 'deduct':
        if (wallet.balance < amount) {
          return NextResponse.json(
            { success: false, error: 'Insufficient balance' },
            { status: 400 }
          );
        }
        wallet.balance -= amount;
        wallet.pending_bets += amount;
        break;
      case 'add_winnings':
        wallet.balance += amount;
        wallet.total_won += amount;
        wallet.pending_bets -= amount; // Release pending bet amount
        break;
    }

    wallets.set(userId, wallet);

    return NextResponse.json({
      success: true,
      wallet,
      message: `Wallet ${action} successful`,
      transactionId,
    });
  } catch (error) {
    console.error('Error updating wallet:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update wallet' },
      { status: 500 }
    );
  }
}
