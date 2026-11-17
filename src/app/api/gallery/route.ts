import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { connectDB } from '@/lib/mongodb';
import { Gallery } from '@/lib/models/gallery';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    const filter: Record<string, any> = {};
    if (category && category !== 'all') {
      filter.category = category;
    }

    let query = Gallery.find(filter).sort({ createdAt: -1 });
    if (limit && !isNaN(Number(limit))) {
      query = query.limit(Number(limit));
    }

    const items = await query.lean();
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  try {
    await connectDB();
    const body = await req.json();

    if (!body.url) {
      return NextResponse.json({ success: false, error: 'Image URL is required' }, { status: 400 });
    }

    const item = await Gallery.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create gallery item' }, { status: 400 });
  }
}
