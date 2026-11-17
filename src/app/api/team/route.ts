import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { connectDB } from '@/lib/mongodb';
import { Team } from '@/lib/models/team';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit');

    let query = Team.find().sort({ createdAt: 1 });
    if (limit && !isNaN(Number(limit))) {
      query = query.limit(Number(limit));
    }

    const items = await query.lean();
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  try {
    await connectDB();
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    const item = await Team.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create team member' }, { status: 400 });
  }
}
