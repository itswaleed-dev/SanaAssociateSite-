import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { connectDB } from '@/lib/mongodb';
import { Project } from '@/lib/models/project';
import { Gallery } from '@/lib/models/gallery';
import { Video } from '@/lib/models/video';
import { Team } from '@/lib/models/team';
import { Testimonial } from '@/lib/models/testimonial';
import { Contact } from '@/lib/models/contact';

export async function GET(req: NextRequest) {
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  try {
    await connectDB();

    const [projects, gallery, videos, team, testimonials, totalContacts, newContacts] = await Promise.all([
      Project.countDocuments(),
      Gallery.countDocuments(),
      Video.countDocuments(),
      Team.countDocuments(),
      Testimonial.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects,
        gallery,
        videos,
        team,
        testimonials,
        contacts: {
          total: totalContacts,
          new: newContacts,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
