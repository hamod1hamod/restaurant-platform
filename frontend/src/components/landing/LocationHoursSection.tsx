import React from 'react';
import { MapPin, Clock, Phone, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { RestaurantSettings } from '../../types';

interface LocationHoursSectionProps {
  settings?: RestaurantSettings | null;
}

export const LocationHoursSection: React.FC<LocationHoursSectionProps> = ({ settings }) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const address = isAr ? (settings?.address_ar || 'بوليفارد الذواقة، وسط المدينة') : (settings?.address || '450 Culinary Boulevard, Downtown Plaza');
  const whatsappUrl = `https://wa.me/${settings?.whatsapp?.replace(/[^0-9]/g, '') || '15557892345'}`;

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white dark:bg-zinc-900 border-t border-zinc-200/60 dark:border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Information Column */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{isAr ? 'الموقع وساعات العمل' : 'Visit & Connect'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {t('nav.contact')}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {isAr
                  ? 'يسعدنا استقبالكم في صالتنا الفاخرة أو توصيل أشهى المأكولات مباشرة إلى باب بيتكم.'
                  : 'Join us at our cozy dining lounge or order directly to your doorstep with guaranteed warmth.'}
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Address */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-blue-950/60">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isAr ? 'العنوان والموقع' : 'Location & Address'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                    {address}
                  </p>
                  <a
                    href={settings?.google_maps_url || 'https://maps.google.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mt-2"
                  >
                    <span>{isAr ? 'فتح على خرائط جوجل' : 'Open in Google Maps'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {isAr ? 'أوقات العمل واستقبال الطلبات' : 'Opening & Kitchen Hours'}
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-0.5 font-medium">
                    {settings?.opening_hours || 'Mon - Sun: 09:00 AM - 12:00 Midnight'}
                  </p>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-xs font-bold mt-2">
                    {isAr ? 'متاح للتوصيل والاستلام الداخلي الآن' : 'Available for Dine-in & Delivery'}
                  </span>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {isAr ? 'الهاتف وخدمة الزبائن' : 'Telephone & Customer Care'}
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-0.5">
                    {settings?.phone || '+1 (555) 789-2345'}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <a
                      href={`tel:${settings?.phone || '+15557892345'}`}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {isAr ? 'اتصل الآن' : 'Call Directly'}
                    </a>
                    <span className="text-zinc-300">|</span>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{isAr ? 'محادثة واتساب مباشرة' : 'Direct WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl bg-zinc-100 dark:bg-zinc-800">
            <iframe
              title="Restaurant Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src="https://maps.google.com/maps?q=Downtown%20Plaza&t=&z=15&ie=UTF8&iwloc=&output=embed"
            ></iframe>
          </div>

        </div>

      </div>
    </section>
  );
};
