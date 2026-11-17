import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { connectDB } from '@/lib/mongodb';
import { Contact } from '@/lib/models/contact';

export async function GET(req: NextRequest) {
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    const filter: Record<string, any> = {};
    if (status && ['new', 'read', 'replied'].includes(status)) {
      filter.status = status;
    }

    let query = Contact.find(filter).sort({ createdAt: -1 });
    if (limit && !isNaN(Number(limit))) {
      query = query.limit(Number(limit));
    }

    const items = await query.lean();
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    if (!body.email && !body.phone) {
      return NextResponse.json({ success: false, error: 'Either email or phone is required' }, { status: 400 });
    }

    const item = await Contact.create({
      name: body.name.trim(),
      email: (body.email || '').trim(),
      phone: (body.phone || '').trim(),
      projectType: (body.projectType || '').trim(),
      message: (body.message || '').trim(),
      status: 'new',
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to submit contact message' }, { status: 400 });
  }
}
