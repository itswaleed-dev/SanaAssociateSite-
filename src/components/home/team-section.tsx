'use client';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';

const mockTeam = [
  
  {
    _id: 't1',
    name: 'Sana Ullan ',
    position: 'Senior Architect & Interior Designer',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXO8r1Pwp8n3iQCHsyVDasAOQsuCI2j6HJLqimWW1I7w&s',
    bio: 'Specialist in contemporary bespoke interiors, bespoke Italian cabinetry, and atmospheric illumination.',
  },
 
];

export function TeamSection({ dbData }: { dbData: any[] | null }) {
  const team = dbData && dbData.length > 0 ? dbData : mockTeam;

  return (
    <section id="about" className="py-24 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading title="Meet Our Owner" subtitle="Master Architects & Designers" />

        <div className="grid  gap-8">
          {team.map((m: any, i: number) => (
            <motion.div
              key={m._id || m.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-8 rounded-3xl glass-card border border-white/[0.08] hover:border-[#52d6d0]/30 text-center flex flex-col items-center justify-between"
            >
              <div className="relative w-44 h-44 mb-6">
                {/* Glowing ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#52d6d0] to-transparent opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-500" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#52d6d0] transition-all duration-500">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-[#52d6d0] transition-colors">
                  {m.name}
                </h3>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#52d6d0]/10 text-[#52d6d0] mb-4">
                  {m.position}
                </span>
                {m.bio && (
                  <p className="text-white/50 text-xs leading-relaxed font-light">
                    {m.bio}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
