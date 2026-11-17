import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { connectDB, isValidObjectId } from '@/lib/mongodb';
import { Video } from '@/lib/models/video';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: 'Invalid video ID format' }, { status: 400 });
    }

    await connectDB();
    const item = await Video.findById(id).lean();
    if (!item) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: 'Invalid video ID format' }, { status: 400 });
    }

    await connectDB();
    const body = await req.json();

    if (body.type && !['youtube', 'mp4'].includes(body.type)) {
      return NextResponse.json({ success: false, error: 'Video type must be "youtube" or "mp4"' }, { status: 400 });
    }

    const item = await Video.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean();
    if (!item) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Validation error' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: 'Invalid video ID format' }, { status: 400 });
    }

    await connectDB();
    const item = await Video.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { deleted: true, id } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
