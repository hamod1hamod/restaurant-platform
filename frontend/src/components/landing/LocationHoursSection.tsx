import React from 'react';
import { ExternalLink, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { RestaurantSettings } from '../../types';

interface LocationHoursSectionProps {
  settings?: RestaurantSettings | null;
}

export const LocationHoursSection: React.FC<LocationHoursSectionProps> = ({ settings }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const address = isAr
    ? (settings?.address_ar || 'شارع ٢٦ يوليو، الزمالك، القاهرة، مصر')
    : (settings?.address || '26th of July St, Zamalek, Cairo, Egypt');
  const whatsappUrl = `https://wa.me/${settings?.whatsapp?.replace(/[^0-9]/g, '') || '201002345678'}`;

  return (
    <section
      id="contact"
      data-place="visit"
      className="py-20 lg:py-28 bg-white dark:bg-[#0d2a1c] text-[#0d2a1c] dark:text-[#f5f5f5] border-t border-black/12 dark:border-white/12"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Visit Panel on --p-surface (#ebebeb) */}
          <div className="lg:col-span-6 bg-[#ebebeb] dark:bg-[#1c3629] p-8 sm:p-12 flex flex-col justify-between space-y-8 border border-black/10 dark:border-white/10">
            <div className="space-y-6">
              <div className="flex items-baseline justify-between gap-4 border-b border-black/12 dark:border-white/12 pb-4">
                <h2 className="font-display text-3xl sm:text-4xl text-[#0d2a1c] dark:text-white">
                  {isAr ? 'زيارتنا' : 'Visit'}
                </h2>
                <span className="text-[13px] font-medium text-[#0d2a1c]">
                  {isAr ? 'مفتوح للطلبات اليوم' : 'Open for dining & orders'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <p className="text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3]">
                    {isAr ? 'العنوان' : 'Address'}
                  </p>
                  <p className="text-lg leading-snug text-[#0d2a1c] dark:text-white">
                    {address}
                  </p>
                  <a
                    href={settings?.google_maps_url || 'https://maps.google.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="taste-link text-[15px] font-medium text-[#0d2a1c] pt-1"
                  >
                    <span>{isAr ? 'عرض الاتجاهات' : 'Get directions'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-2">
                  <p className="text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3]">
                    {isAr ? 'ساعات العمل' : 'Opening hours'}
                  </p>
                  <p className="text-base text-[#0d2a1c] dark:text-white tabular-nums">
                    {settings?.opening_hours || 'Mon – Sun: 09:00 AM – 12:00 AM'}
                  </p>
                  <p className="text-sm text-[#5f6b64] dark:text-[#a3a3a3]">
                    {isAr ? 'استلام داخلي وتوصيل' : 'Dine-in, pickup & delivery'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-black/12 dark:border-white/12 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3]">
                  {isAr ? 'الهاتف' : 'Telephone'}
                </p>
                <a
                  href={`tel:${settings?.phone || '+201002345678'}`}
                  className="text-base font-medium text-[#0d2a1c] dark:text-white tabular-nums hover:text-[#0d2a1c] transition-colors"
                >
                  {settings?.phone || '+20 100 234 5678'}
                </a>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="taste-btn h-11 px-5 inline-flex items-center gap-2 border border-black/20 dark:border-white/20 bg-white dark:bg-[#1c1c1c] hover:bg-[#0d2a1c] hover:text-white dark:hover:bg-white dark:hover:text-[#0d2a1c] text-[15px] font-medium"
              >
                <MessageCircle className="w-4 h-4 text-[#0d2a1c]" />
                <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
              </a>
            </div>
          </div>

          {/* Right 4:3 Photograph */}
          <div className="lg:col-span-6 taste-photo-frame bg-[#ebebeb] dark:bg-[#1c3629] min-h-[320px] aspect-[4/3]">
            <img
              src={settings?.cover_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'}
              alt={isAr ? 'صالة مطعم وكافيه خطاب' : 'Khatab Restaurant & Café dining room'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
