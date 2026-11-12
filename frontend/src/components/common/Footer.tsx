import React from 'react';
import { Lock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { RestaurantSettings } from '../../types';

interface FooterProps {
  settings?: RestaurantSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const restaurantName = isAr
    ? (settings?.name_ar || 'مطعم وكافيه خطاب')
    : (settings?.name || 'Khatab Restaurant & Café');

  return (
    <footer className="bg-[#ebebeb] dark:bg-[#1c3629] text-[#0d2a1c] dark:text-[#f5f5f5] border-t border-black/12 dark:border-white/12 pt-16 pb-12">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Dealt Type Moment: Name set wide across the wrap (close-word) */}
        <div className="pb-12 border-b border-black/12 dark:border-white/12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl text-[#0d2a1c] dark:text-white">
                {isAr ? 'طاولتك بانتظارك كل يوم' : 'Open daily for dining and espresso.'}
              </h2>
              <p className="text-base text-[#5f6b64] dark:text-[#a3a3a3] mt-2 max-w-xl">
                {isAr
                  ? (settings?.description_ar || 'أطباق محضرة يومياً وقهوة مختصة في مطعم وكافيه خطاب.')
                  : (settings?.description || 'Freshly prepared dishes, wood-fired specialties, and single-origin coffee.')}
              </p>
            </div>
            <a
              href="#menu"
              className="taste-btn inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#0d2a1c] hover:bg-[#1c3629] text-white font-medium text-base shrink-0"
            >
              <span>{isAr ? 'اطلب الآن' : 'Explore Menu'}</span>
              <span aria-hidden="true">{isAr ? '←' : '→'}</span>
            </a>
          </div>

          <p className="font-display text-[clamp(36px,6.5vw,92px)] leading-[1.02] tracking-[-0.025em] text-[#0d2a1c] dark:text-white select-none">
            {restaurantName}
          </p>
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-b border-black/12 dark:border-white/12 text-base">
          <div className="space-y-2 lg:col-span-2">
            <p className="text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3]">
              {isAr ? 'ساعات العمل والعنوان' : 'Hours & Location'}
            </p>
            <p className="font-medium text-[#0d2a1c] dark:text-white">
              {isAr ? (settings?.address_ar || 'شارع جراند، وسط المدينة') : (settings?.address || 'Grand Avenue, Downtown District')}
            </p>
            <p className="text-[#5f6b64] dark:text-[#a3a3a3] tabular-nums">
              {settings?.opening_hours || 'Mon - Sun: 09:00 AM - 12:00 Midnight'}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3]">
              {isAr ? 'القائمة' : 'Menu'}
            </p>
            <ul className="space-y-2">
              <li><a href="#menu" className="taste-link">{t('nav.menu')}</a></li>
              <li><a href="#bestsellers" className="taste-link">{t('nav.bestsellers')}</a></li>
              <li><a href="#offers" className="taste-link">{t('nav.offers')}</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3]">
              {isAr ? 'المكان' : 'Place'}
            </p>
            <ul className="space-y-2">
              <li><a href="#craft" className="taste-link">{isAr ? 'قصتنا' : 'Story'}</a></li>
              <li><a href="#about" className="taste-link">{t('nav.about')}</a></li>
              <li><a href="#contact" className="taste-link">{isAr ? 'زيارتنا' : 'Visit'}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Admin Portal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px] text-[#5f6b64] dark:text-[#a3a3a3]">
          <div>
            &copy; {new Date().getFullYear()} {restaurantName}. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>
          <a
            href="#admin"
            className="taste-btn inline-flex items-center gap-1.5 px-3.5 py-2 border border-black/15 dark:border-white/15 bg-white dark:bg-[#1c1c1c] text-[#0d2a1c] dark:text-white hover:border-black/40 dark:hover:border-white/40 text-[13px] font-medium"
            title="Staff Portal & Management"
          >
            <Lock className="w-3.5 h-3.5 text-[#0d2a1c]" />
            <span>{isAr ? 'بوابة الإدارة' : 'Staff Portal'}</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
