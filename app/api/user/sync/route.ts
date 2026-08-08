import { NextRequest, NextResponse } from 'next/server';

// In-memory / Cloud Sync Store (persisted per user ID)
const cloudDataStore: Record<string, {
  splits?: any[];
  workoutLogs?: Record<string, any[]>;
  macroLogs?: Record<string, any>;
  macroGoals?: any;
  lastSyncedAt?: string;
}> = {};

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId') || 'guest';
    const userData = cloudDataStore[userId] || {
      splits: [],
      workoutLogs: {},
      macroLogs: {},
      macroGoals: { calories: 2400, protein: 170, carbs: 250, fat: 65 },
      lastSyncedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      userId,
      data: userData,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user sync data';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, splits, workoutLogs, macroLogs, macroGoals } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    cloudDataStore[userId] = {
      splits,
      workoutLogs,
      macroLogs,
      macroGoals,
      lastSyncedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      userId,
      message: 'Cloud sync completed successfully day-by-day',
      syncedAt: cloudDataStore[userId].lastSyncedAt,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to sync user data';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
