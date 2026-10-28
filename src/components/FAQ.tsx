import React, { useState } from 'react';
import { FESTIVAL_FAQS } from '../data/events';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-16 lg:py-24 bg-[#09080D] border-b border-[#241733] scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EC4899] flex items-center justify-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Guidelines & Scope</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FAF7F5] font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#A89CB5] max-w-lg mx-auto">
              Guidance regarding participation rules, demo payment references, and local data boundaries.
            </p>
          </div>
        </RevealOnScroll>

        <div className="space-y-3.5">
          {FESTIVAL_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <RevealOnScroll key={idx} delayMs={idx * 60}>
                <div
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-[#EC4899]/60 bg-[#17101E] shadow-[0_0_20px_rgba(236,72,153,0.15)]'
                      : 'border-[#2D1F3D] bg-[#140D1C] hover:border-[#8B5CF6]/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-[#1E1428]/60 transition-colors cursor-pointer min-h-[52px]"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className="text-sm sm:text-base font-bold text-[#FAF7F5] font-display">
                      {faq.question}
                    </span>
                    <div className={`p-1.5 rounded-full transition-all duration-300 ${isOpen ? 'bg-[#EC4899] text-white rotate-180' : 'bg-[#1E1428] text-[#8A7B9B]'}`}>
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${idx}`}
                      className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#C8BFD4] leading-relaxed border-t border-[#241733] pt-3.5 bg-[#120A1A]"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};
