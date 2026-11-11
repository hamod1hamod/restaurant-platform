import React from 'react';
import { Sparkles, MessageCircle, ArrowRight, ArrowLeft, Clock, MapPin, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { RestaurantSettings } from '../../types';

interface HeroSectionProps {
  settings?: RestaurantSettings | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  const { language, t, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const title = isAr ? (settings?.hero_title_ar || 'نكهات استثنائية محضرة بكل شغف') : (settings?.hero_title || 'Masterpiece Flavors, Freshly Prepared');
  const subtitle = isAr ? (settings?.hero_subtitle_ar || 'استكشف قائمتنا الرقمية الغنية بالمأكولات الإيطالية والمشويات الفاخرة والعصائر الطازجة مع التوصيل السريع.') : (settings?.hero_subtitle || 'Indulge in our chef-crafted digital menu. Savor wood-fired crusts, certified Angus cuts, and handcrafted drinks delivered right to your table or doorstep.');
  const heroImage = settings?.hero_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80';
  const whatsappUrl = `https://wa.me/${settings?.whatsapp?.replace(/[^0-9]/g, '') || '15557892345'}`;

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[580px] lg:min-h-[640px] flex items-center">
      {/* Background with dark blue gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Restaurant Ambiance & Food"
          className="w-full h-full object-cover object-center opacity-25 transform scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-900/70"></div>
        <div className="absolute inset-0 bg-radial from-blue-600/15 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl space-y-6">
          
          {/* Top Pill in Dark Blue style */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/40 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{isAr ? 'قائمة رقمية تفاعلية وحية ١٠٠٪' : '100% Dynamic Digital Gourmet Menu'}</span>
          </div>

          {/* Headline in pure White */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {title}
          </h1>

          {/* Subtitle in soft crisp slate */}
          <p className="text-lg sm:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          {/* Action Buttons in Dark Blue & White style */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <a
              href="#menu"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-500 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all ring-1 ring-blue-400/30"
            >
              <span>{t('hero.exploreMenu')}</span>
              {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-blue-500/30 text-white font-bold text-base shadow-lg shadow-slate-900/40 hover:scale-105 active:scale-95 transition-all"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span>{t('hero.whatsappOrder')}</span>
            </a>
          </div>

          {/* Feature Badges */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{settings?.opening_hours || 'Mon-Sun: 9:00 AM - 12:00 AM'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>{isAr ? (settings?.address_ar || 'بوليفارد الذواقة') : (settings?.address || 'Downtown Plaza')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>4.9 / 5.0 (500+ {isAr ? 'تقييم زبائن' : 'Reviews'})</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
