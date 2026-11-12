import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const GallerySection: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const photos = [
    {
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      alt: isAr ? 'ستيك ريب آي مشوي على الفحم' : 'Wood-fired prime ribeye at Khatab Restaurant & Café'
    },
    {
      url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      alt: isAr ? 'برجر الأنجوس' : 'Angus brioche burger'
    },
    {
      url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      alt: isAr ? 'بيتزا البوراتا الإيطالية' : 'Stone-baked Neapolitan pizza'
    },
    {
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
      alt: isAr ? 'قهوة مختصة في كافيه خطاب' : 'Specialty espresso pour at Khatab Café'
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-white dark:bg-[#0d2a1c] text-[#0d2a1c] dark:text-[#f5f5f5] border-b border-black/12 dark:border-white/12">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-10">
          <h2 className="font-display text-3xl sm:text-4xl text-[#0d2a1c] dark:text-white">
            {isAr ? 'من المطبخ والبار' : 'Kitchen & espresso bar'}
          </h2>
          <p className="text-base text-[#5f6b64] dark:text-[#a3a3a3]">
            {isAr ? 'لقطات حقيقية من مطعم وكافيه خطاب.' : 'Daily plates, hearth fire, and espresso pours.'}
          </p>
        </div>

        {/* Dealt Offer/Detail Strip: 4 square 1:1 frames, zero captions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((item, idx) => (
            <div
              key={idx}
              className="taste-photo-frame aspect-square bg-[#ebebeb] dark:bg-[#1a1a1a]"
            >
              <img
                src={item.url}
                alt={item.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
