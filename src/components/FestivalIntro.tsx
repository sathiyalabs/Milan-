import React from 'react';
import { Music2, Sparkles, Theater, Palette, Feather, Shirt } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const FestivalIntro: React.FC = () => {
  const pillars = [
    {
      title: 'Performing Dance',
      icon: Sparkles,
      desc: 'Classical Bharatanatyam mudras to synchronized western collegiate choreography under professional stage rigs.',
      discipline: 'Dance Society',
      accent: 'text-[#EC4899]',
      bg: 'bg-[#EC4899]/10',
      glow: 'group-hover:border-[#EC4899]/60',
    },
    {
      title: 'Music & Acoustics',
      icon: Music2,
      desc: 'Amplified rock band showdowns, unplugged fusion jam sessions, and classical vocal ragas.',
      discipline: 'Music Society',
      accent: 'text-[#06B6D4]',
      bg: 'bg-[#06B6D4]/10',
      glow: 'group-hover:border-[#06B6D4]/60',
    },
    {
      title: 'Stage & Dramatics',
      icon: Theater,
      desc: 'Acoustic street plays (Nukkad Natak) confronting contemporary community questions in central campus circles.',
      discipline: 'Drama Society',
      accent: 'text-[#F43F5E]',
      bg: 'bg-[#F43F5E]/10',
      glow: 'group-hover:border-[#F43F5E]/60',
    },
    {
      title: 'Campus Runway & Styling',
      icon: Shirt,
      desc: 'Student styling, sustainable textiles, and curated runway presentations under auditorium spotlight arrays.',
      discipline: 'Fashion Society',
      accent: 'text-[#A855F7]',
      bg: 'bg-[#A855F7]/10',
      glow: 'group-hover:border-[#A855F7]/60',
    },
    {
      title: 'Fine Arts & Canvas',
      icon: Palette,
      desc: 'Live thematic mural painting, drawing challenges, and visual installations across the Architecture Quad.',
      discipline: 'Fine Arts Society',
      accent: 'text-[#84CC16]',
      bg: 'bg-[#84CC16]/10',
      glow: 'group-hover:border-[#84CC16]/60',
    },
    {
      title: 'Literary & Rhetoric',
      icon: Feather,
      desc: 'Parliamentary debate tournaments, spoken word poetry slams, and bilingual creative discourse.',
      discipline: 'Literary Society',
      accent: 'text-[#E15B28]',
      bg: 'bg-[#E15B28]/10',
      glow: 'group-hover:border-[#E15B28]/60',
    },
  ];

  return (
    <section id="about" className="py-16 lg:py-24 bg-[#100918] border-b border-[#241733] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Context Narrative */}
          <div className="lg:col-span-5 space-y-5">
            <RevealOnScroll>
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#EC4899]">
                  Festival Disciplines & Scope
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#FAF7F5] leading-tight font-display">
                  Artistic Pillars of Milan
                </h2>
              </div>

              <p className="text-sm sm:text-base text-[#C8BFD4] leading-relaxed mt-4">
                Milan represents the cultural confluence of student societies across SRMIST Kattankulathur. Each edition provides a creative stage where classical Indian arts and contemporary student expression interact.
              </p>

              <p className="text-xs sm:text-sm text-[#A89CB5] leading-relaxed mt-3">
                This frontend prototype models event discovery, guideline exploration, and delegate registration across six key artistic disciplines. All event venues and scheduling details shown represent fictional test data.
              </p>

              <div className="pt-4 mt-4 border-t border-[#241733]">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-[#17101E] border border-[#2D1F3D]">
                    <p className="font-semibold text-[#FAF7F5] uppercase tracking-wider text-[11px]">Primary Venue</p>
                    <p className="text-[#A89CB5] mt-0.5">SRMIST Main Campus, Kattankulathur</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#17101E] border border-[#2D1F3D]">
                    <p className="font-semibold text-[#FAF7F5] uppercase tracking-wider text-[11px]">Festival Stage</p>
                    <p className="text-[#A89CB5] mt-0.5">Evening Stagecraft & Arenas</p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column: Pillars Grid with Scroll Reveal */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <RevealOnScroll key={pillar.title} delayMs={idx * 70}>
                    <div
                      className={`p-5 rounded-xl bg-[#17101E] border border-[#2D1F3D] ${pillar.glow} transition-all duration-200 card-motion group h-full flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-10 h-10 rounded-lg ${pillar.bg} ${pillar.accent} flex items-center justify-center transition-transform group-hover:scale-110`}>
                            <IconComponent className="w-5 h-5" aria-hidden="true" />
                          </div>
                          <span className="text-[11px] font-mono text-[#8A7B9B]">
                            {pillar.discipline}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#FAF7F5] tracking-tight mb-1.5 font-display group-hover:text-white transition-colors">
                          {pillar.title}
                        </h3>
                        <p className="text-xs text-[#A89CB5] leading-relaxed">
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
