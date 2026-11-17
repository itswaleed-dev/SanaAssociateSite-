'use client';
import { useState, useEffect } from 'react';
import { HomeHero } from '@/components/home/home-hero';
import { FeaturedProjects } from '@/components/home/featured-projects';
import { GallerySection } from '@/components/home/gallery-section';
import { VideoSection } from '@/components/home/video-section';
import { ServicesSection } from '@/components/home/services-section';
import { TeamSection } from '@/components/home/team-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { ContactSection } from '@/components/home/contact-section';

export default function HomePage() {
  const [data, setData] = useState<any>({ projects: null, gallery: null, videos: null, team: null, testimonials: null });

  useEffect(() => {
    async function load() {
      const endpoints = ['projects', 'gallery', 'videos', 'team', 'testimonials'];
      const results: any = {};
      for (const ep of endpoints) {
        try {
          const res = await fetch(`/api/${ep}`);
          const json = await res.json();
          results[ep] = json.success ? json.data : null;
        } catch { results[ep] = null; }
      }
      setData(results);
    }
    load();
  }, []);

  return (
    <>
      <HomeHero />
      <FeaturedProjects dbData={data.projects} />
      <GallerySection dbData={data.gallery} />
      <VideoSection dbData={data.videos} />
      <ServicesSection />
      <TeamSection dbData={data.team} />
      <TestimonialsSection dbData={data.testimonials} />
      <ContactSection />
    </>
  );
}
