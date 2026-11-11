import React from 'react';
import { MapPin, Clock, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { RestaurantSettings } from '../../types';

interface LocationHoursSectionProps {
  settings?: RestaurantSettings | null;
}

export const LocationHoursSection: React.FC<LocationHoursSectionProps> = ({ settings }) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const address = isAr ? (settings?.address_ar || 'بوليفارد الذواقة، الحي المالي') : (settings?.address || '450 Grand Avenue, Financial District');
  const whatsappUrl = `https://wa.me/${settings?.whatsapp?.replace(/[^0-9]/g, '') || '15557892345'}`;

  return (
    <section id="contact" className="py-20 lg:py-28 bg-slate-950 text-white border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Information Column */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{isAr ? 'الموقع وساعات العمل' : 'Visit & Connect'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                {t('nav.contact')}
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                {isAr
                  ? 'يسعدنا استقبالكم في صالتنا الفاخرة أو توصيل أشهى المأكولات مباشرة إلى باب بيتكم.'
                  : 'Join us at our cozy dining lounge or order directly to your doorstep with guaranteed warmth.'}
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Address */}
              <div className="taste-card flex items-start gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {isAr ? 'العنوان والموقع' : 'Location & Address'}
                  </h4>
                  <p className="text-sm text-slate-300 mt-0.5">
                    {address}
                  </p>
                  <a
                    href={settings?.google_maps_url || 'https://maps.google.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 mt-2"
                  >
                    <span>{isAr ? 'فتح على خرائط جوجل' : 'Open in Google Maps'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="taste-card flex items-start gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {isAr ? 'أوقات العمل واستقبال الطلبات' : 'Kitchen & Delivery Hours'}
                  </h4>
                  <p className="text-sm text-slate-300 mt-0.5">
                    {settings?.opening_hours || 'Monday - Sunday: 10:00 AM - 11:30 PM'}
                  </p>
                  <span className="inline-block mt-2 text-xs font-bold text-emerald-400">
                    {isAr ? '· متاح للتوصيل والاستلام الداخلي الآن' : '· Available for delivery & dine-in now'}
                  </span>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="taste-card flex items-start gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {isAr ? 'الهاتف وخدمة الزبائن' : 'Phone & Customer Service'}
                  </h4>
                  <p className="text-sm text-slate-300 mt-0.5">
                    {settings?.phone || '+1 (555) 234-5678'}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs font-bold">
                    <a
                      href={`tel:${settings?.phone || '+15552345678'}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {isAr ? 'اتصل الآن' : 'Call Now'}
                    </a>
                    <span className="text-slate-600">|</span>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{isAr ? 'محادثة واتساب مباشرة' : 'Chat on WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Map Embed Frame */}
          <div className="rounded-3xl overflow-hidden border border-slate-800 h-[380px] sm:h-[440px] shadow-2xl relative bg-slate-900">
            <iframe
              title="Restaurant Location Map"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
            ></iframe>
          </div>

        </div>

      </div>
    </section>
  );
};
