import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { connectDB } from '@/lib/mongodb';
import { Project } from '@/lib/models/project';
import { Gallery } from '@/lib/models/gallery';
import { Video } from '@/lib/models/video';
import { Team } from '@/lib/models/team';
import { Testimonial } from '@/lib/models/testimonial';
import { Contact } from '@/lib/models/contact';

const seedData = {
  projects: [
    {
      title: 'Modern Villa Design',
      category: 'Architecture',
      location: 'Lahore',
      year: 2026,
      description: 'A stunning modern villa with clean lines, open spaces, and floor-to-ceiling glass windows. Designed for luxury living with a seamless indoor-outdoor connection.',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop',
      ],
      featured: true,
    },
    {
      title: 'Luxury Living Room',
      category: 'Interior',
      location: 'Johar Town, Lahore',
      year: 2025,
      description: 'An exquisite luxury living room design with premium furniture, ambient lighting, and a sophisticated color palette.',
      coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1600210491892-03dee9141e6b?w=1200&h=800&fit=crop',
      ],
      featured: true,
    },
    {
      title: 'Contemporary Exterior',
      category: 'Exterior',
      location: 'DHA, Lahore',
      year: 2026,
      description: 'A bold contemporary exterior design featuring geometric forms, natural stone cladding, and landscaped gardens.',
      coverImage: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1200&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1600566753086-00f18f6b0055?w=1200&h=800&fit=crop',
      ],
      featured: true,
    },
    {
      title: 'Modern Kitchen Design',
      category: 'Interior',
      location: 'Gulberg, Lahore',
      year: 2025,
      description: 'A modern kitchen design with premium finishes, smart storage solutions, and an elegant island centerpiece.',
      coverImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&h=800&fit=crop',
      ],
      featured: false,
    },
    {
      title: 'Luxury Villa Exterior',
      category: 'Exterior',
      location: 'Bahria Town, Lahore',
      year: 2026,
      description: 'An elegant luxury villa exterior with classical architectural elements, modern landscaping, and a grand entrance.',
      coverImage: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
      ],
      featured: true,
    },
    {
      title: 'Master Bedroom Suite',
      category: 'Interior',
      location: 'Model Town, Lahore',
      year: 2025,
      description: 'A luxurious master bedroom suite with walk-in closet, spa-like bathroom, and panoramic windows.',
      coverImage: 'https://images.unsplash.com/photo-1600210491892-03dee9141e6b?w=1200&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1600210491892-03dee9141e6b?w=1200&h=800&fit=crop',
      ],
      featured: false,
    },
  ],
  gallery: [
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', title: 'Modern Villa', category: 'Architecture' },
    { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop', title: 'Luxury Living Room', category: 'Interior' },
    { url: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&h=600&fit=crop', title: 'Contemporary Exterior', category: 'Exterior' },
    { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', title: 'Villa Entrance', category: 'Architecture' },
    { url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop', title: 'Modern Kitchen', category: 'Interior' },
    { url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop', title: 'Home Exterior', category: 'Exterior' },
    { url: 'https://images.unsplash.com/photo-1600566753086-00f18f6b0055?w=800&h=600&fit=crop', title: 'Outdoor Space', category: 'Exterior' },
    { url: 'https://images.unsplash.com/photo-1600210491892-03dee9141e6b?w=800&h=600&fit=crop', title: 'Master Bedroom', category: 'Interior' },
  ],
  videos: [
    { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Modern Home Walkthrough', type: 'youtube', thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=450&fit=crop' },
    { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Interior Design Showcase', type: 'youtube', thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=450&fit=crop' },
    { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Exterior Architecture Tour', type: 'youtube', thumbnail: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&h=450&fit=crop' },
  ],
  team: [
    { name: 'Ahmed Khan', position: 'Principal Architect', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', bio: 'With 15+ years of experience designing luxury homes and commercial spaces across Pakistan.' },
    { name: 'Sana Tariq', position: 'Senior Interior Designer', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', bio: 'Award-winning interior designer specializing in modern and contemporary home interiors.' },
    { name: 'Bilal Hassan', position: 'Exterior Design Specialist', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', bio: 'Expert in exterior facade design, landscaping, and outdoor living spaces.' },
  ],
  testimonials: [
    { name: 'Usman & Ayesha', role: 'Homeowners', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', rating: 5, review: 'Sana Associates designed our dream home. The attention to detail and professionalism exceeded our expectations.' },
    { name: 'Kamran Malik', role: 'Property Developer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', rating: 5, review: 'Best architecture firm in Lahore. Their modern designs have set new standards in our housing projects.' },
    { name: 'Fatima & Hassan', role: 'Homeowners', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop', rating: 5, review: 'From concept to completion, the team was incredible. Our interior design is absolutely stunning.' },
  ],
  contacts: [
    { name: 'Zubair Qureshi', email: 'zubair@example.com', phone: '+92 300 1234567', projectType: 'Architectural Design', message: 'Looking for architectural drawings and structural design for 1 Kanal plot in DHA Phase 6.', status: 'new' },
    { name: 'Amina Sheikh', email: 'amina@example.com', phone: '+92 321 9876543', projectType: 'Interior Design', message: 'Interested in a full interior revamp for our 10 Marla residence.', status: 'read' },
  ],
};

async function handleSeed() {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      Project.deleteMany({}),
      Gallery.deleteMany({}),
      Video.deleteMany({}),
      Team.deleteMany({}),
      Testimonial.deleteMany({}),
      Contact.deleteMany({}),
    ]);

    // Seed new data
    await Promise.all([
      Project.insertMany(seedData.projects),
      Gallery.insertMany(seedData.gallery),
      Video.insertMany(seedData.videos),
      Team.insertMany(seedData.team),
      Testimonial.insertMany(seedData.testimonials),
      Contact.insertMany(seedData.contacts),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      counts: {
        projects: seedData.projects.length,
        gallery: seedData.gallery.length,
        videos: seedData.videos.length,
        team: seedData.team.length,
        testimonials: seedData.testimonials.length,
        contacts: seedData.contacts.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Seeding failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  return handleSeed();
}

export async function POST(request: NextRequest) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  return handleSeed();
}
