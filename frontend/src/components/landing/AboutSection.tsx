import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RestaurantSettings } from '../../types';

interface AboutSectionProps {
  settings?: RestaurantSettings | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const restaurantName = isAr
    ? (settings?.name_ar || 'مطعم وكافيه خطاب')
    : (settings?.name || 'Khatab Restaurant & Café');

  return (
    <section
      id="about"
      className="py-20 lg:py-24 bg-[#ebebeb] dark:bg-[#1c3629] text-[#0d2a1c] dark:text-[#f5f5f5] border-b border-black/12 dark:border-white/12"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 space-y-12">
        {/* Head row & Story copy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <h2 className="font-display text-3xl sm:text-4xl text-[#0d2a1c] dark:text-white leading-tight">
              {isAr ? `عن ${restaurantName}` : `About ${restaurantName}`}
            </h2>
          </div>
          <div className="lg:col-span-6 space-y-4">
            <p className="text-base sm:text-lg text-[#0d2a1c] dark:text-[#e5e5e5] leading-relaxed">
              {isAr
                ? (settings?.description_ar || 'في مطعم وكافيه خطاب نجمع بين المطبخ الطازج يومياً والقهوة المختصة المحمصة بعناية، في صالة مصممة للقاءات اليومية والضيافة الدافئة.')
                : (settings?.description || 'At Khatab Restaurant & Café, our kitchen and espresso bar work side by side — pairing dry-aged cuts and wood-fired dough with single-origin coffee poured to order.')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-black/12 dark:border-white/12">
              <div>
                <p className="text-[13px] font-medium text-[#0d2a1c]">
                  {isAr ? 'المطبخ' : 'The Kitchen'}
                </p>
                <p className="text-sm text-[#5f6b64] dark:text-[#a3a3a3] mt-1 leading-relaxed">
                  {isAr
                    ? 'لحوم طازجة يومياً، عجينة مخمرة ٧٢ ساعة، وخضروات موسمية مختارة.'
                    : 'Daily sourced Angus cuts, 72-hour fermented dough, and seasonal produce.'}
                </p>
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#0d2a1c]">
                  {isAr ? 'الكافيه' : 'The Café'}
                </p>
                <p className="text-sm text-[#5f6b64] dark:text-[#a3a3a3] mt-1 leading-relaxed">
                  {isAr
                    ? 'إسبريسو مختص، قهوة مقطرة، وحلويات فرنسية محضرة في المخبز.'
                    : 'Single-origin espresso, pour-over filter coffee, and house-baked patisserie.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dealt Place Composition: Pair (two 4:3 photographs side by side, square corners) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="taste-photo-frame aspect-[4/3] bg-white dark:bg-[#0d2a1c]">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
              alt={isAr ? 'التحضير في مطبخ خطاب' : 'Kitchen preparation at Khatab Restaurant & Café'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="taste-photo-frame aspect-[4/3] bg-white dark:bg-[#0d2a1c]">
            <img
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80"
              alt={isAr ? 'بار القهوة المختصة في خطاب' : 'Specialty espresso bar at Khatab Café'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
