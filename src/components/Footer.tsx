import React from 'react';
import { Info } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#07050A] text-[#FAF7F5] pt-14 pb-12 border-t border-[#1C1329]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#1F142B]">
          {/* Brand & Identity */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/milan-emblem.png"
                alt="Milan Festival Emblem"
                className="w-7 h-7 object-contain"
                width={28}
                height={28}
              />
              <span className="font-display tracking-wider text-2xl font-black text-[#FAF7F5]">
                MILAN <span className="text-[#EC4899]">’26</span>
              </span>
            </div>
            <p className="text-xs text-[#A89CB5] leading-relaxed max-w-sm">
              Cultural festival student concept for SRM Institute of Science & Technology, Kattankulathur.
            </p>
            <div className="pt-2 text-[11px] text-[#8A7B9B]">
              <p>Campus Venue: SRMIST Kattankulathur, Chengalpattu Dist., Tamil Nadu</p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#EC4899]">
              Explore
            </p>
            <ul className="space-y-2 text-xs text-[#C8BFD4]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  Festival Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  Artistic Pillars
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-white transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  Competitions Directory (8 Events)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('schedule')}
                  className="hover:text-white transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  3-Day Schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('registration')}
                  className="hover:text-white transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  Demo Delegate Registration
                </button>
              </li>
            </ul>
          </div>

          {/* Unobtrusive Student Concept & Sample Data Notice */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#EC4899]">
              Notice
            </p>
            <div className="p-4 rounded-xl bg-[#140D1C] border border-[#2D1F3D] text-xs text-[#A89CB5] space-y-2">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Info className="w-3.5 h-3.5 text-[#EC4899] shrink-0" aria-hidden="true" />
                <span>Student Concept & Demonstration</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Student concept showcase with fictional sample data. Not an official Milan website. No personal information or payments are collected.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A7B9B] gap-4">
          <p>
            Student Concept Submission · SRMIST Kattankulathur
          </p>
          <div className="flex items-center gap-2">
            <span>Built with React 19, TypeScript, Vite & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
