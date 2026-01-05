import { NextResponse } from 'next/server';
import { validateEmail, validatePassword } from '../../../../lib/auth';
import bcrypt from 'bcryptjs';

// In-memory user store (replace with database in production)
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
    const { email, username, password } = body;

    // Validation
    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, error: 'Email, username, and password are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    if (users.find(u => u.username === username)) {
      return NextResponse.json(
        { success: false, error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      username,
      passwordHash,
      createdAt: new Date(),
      subscriptionTier: 'free' as const,
    };

    users.push(newUser);

    // In production, save to database and create session
    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        subscriptionTier: newUser.subscriptionTier,
      },
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}

