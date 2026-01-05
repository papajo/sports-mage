import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// In-memory user store (replace with database in production)
// This should match the users array in register route
const users: Array<{
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  subscriptionTier: 'free' | 'premium' | 'pro';
}> = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // In production, create session token and return it
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        subscriptionTier: user.subscriptionTier,
      },
      message: 'Login successful',
      // In production, include session token
      // token: createSessionToken(user.id),
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}

