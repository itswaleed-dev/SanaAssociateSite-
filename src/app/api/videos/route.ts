import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { connectDB } from '@/lib/mongodb';
import { Video } from '@/lib/models/video';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const limit = searchParams.get('limit');

    const filter: Record<string, any> = {};
    if (type && ['youtube', 'mp4'].includes(type)) {
      filter.type = type;
    }

    let query = Video.find(filter).sort({ createdAt: -1 });
    if (limit && !isNaN(Number(limit))) {
      query = query.limit(Number(limit));
    }

    const items = await query.lean();
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  try {
    await connectDB();
    const body = await req.json();

    if (!body.url) {
      return NextResponse.json({ success: false, error: 'Video URL is required' }, { status: 400 });
    }

    if (body.type && !['youtube', 'mp4'].includes(body.type)) {
      return NextResponse.json({ success: false, error: 'Video type must be "youtube" or "mp4"' }, { status: 400 });
    }

    const item = await Video.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create video' }, { status: 400 });
  }
}
