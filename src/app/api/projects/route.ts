import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { connectDB } from '@/lib/mongodb';
import { Project } from '@/lib/models/project';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    const filter: Record<string, any> = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (featured !== null && featured !== undefined && featured !== '') {
      filter.featured = featured === 'true';
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let query = Project.find(filter).sort({ createdAt: -1 });
    if (limit && !isNaN(Number(limit))) {
      query = query.limit(Number(limit));
    }

    const projects = await query.lean();
    return NextResponse.json({ success: true, count: projects.length, data: projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  try {
    await connectDB();
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const project = await Project.create(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create project' }, { status: 400 });
  }
}
