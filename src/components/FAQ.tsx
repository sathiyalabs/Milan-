import React, { useState } from 'react';
import { FESTIVAL_FAQS } from '../data/events';
import { ChevronDown } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-16 lg:py-24 bg-[#09080D] border-b border-[#241733] scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#EC4899]">
            Information & Assessment Scope
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#FAF7F5] font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#A89CB5] max-w-lg mx-auto">
            Guidance regarding participation rules, demo payment references, and local data boundaries.
          </p>
        </div>

        <div className="space-y-3">
          {FESTIVAL_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#2D1F3D] bg-[#17101E] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-[#1E1428] transition-colors cursor-pointer min-h-[48px]"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="text-sm sm:text-base font-bold text-[#FAF7F5] font-display">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8A7B9B] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#EC4899]' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#C8BFD4] leading-relaxed border-t border-[#241733] pt-3"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
