import React from 'react';
import { Sparkles, MessageCircle, ArrowRight, ArrowLeft, Clock, MapPin, Award, Star } from 'lucide-react';
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
    <section className="relative overflow-hidden bg-zinc-950 text-white min-h-[580px] lg:min-h-[640px] flex items-center">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Restaurant Ambiance & Food"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-radial from-orange-600/10 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl space-y-6">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>{isAr ? 'قائمة رقمية تفاعلية وحية ١٠٠٪' : '100% Dynamic Digital Gourmet Menu'}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <a
              href="#menu"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-base shadow-lg shadow-orange-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span>{t('hero.exploreMenu')}</span>
              {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t('hero.whatsappOrder')}</span>
            </a>
          </div>

          {/* Feature Badges */}
          <div className="pt-8 border-t border-zinc-800/80 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>{settings?.opening_hours || 'Mon-Sun: 9:00 AM - 12:00 AM'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>{isAr ? (settings?.address_ar || 'بوليفارد الذواقة') : (settings?.address || 'Downtown Plaza')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>4.9 / 5.0 (500+ {isAr ? 'تقييم زبائن' : 'Reviews'})</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
