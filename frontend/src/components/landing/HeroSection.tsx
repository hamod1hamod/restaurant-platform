import React from 'react';
import { Sparkles, MessageCircle, ArrowRight, ArrowLeft, Clock, MapPin, Star, Flame, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { RestaurantSettings } from '../../types';

interface HeroSectionProps {
  settings?: RestaurantSettings | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  const { language, t, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const title = isAr
    ? (settings?.hero_title_ar || 'نكهات استثنائية محضرة بأعلى معايير الإتقان')
    : (settings?.hero_title || 'Masterpiece Flavors, Freshly Prepared');
  const subtitle = isAr
    ? (settings?.hero_subtitle_ar || 'استمتع بقائمة طعامنا الرقمية المصممة بعناية: برجر فاخر، ستيك معتق، بيتزا على الحطب، وحلويات مميزة، تصلك طازجة إلى طاولتك أو باب منزلك.')
    : (settings?.hero_subtitle || 'Explore our chef-crafted digital menu: Prime Wagyu burgers, dry-aged steaks, artisan wood-fired pizzas, and specialty drinks prepared fresh to your order.');
  const heroImage = settings?.hero_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80';
  const whatsappUrl = `https://wa.me/${settings?.whatsapp?.replace(/[^0-9]/g, '') || '15557892345'}`;

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[640px] lg:min-h-[720px] flex items-center border-b border-slate-800/80">
      {/* Background with Dark Navy Atmospheric Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Staggered Hero Copy (Taste-Skill entrance) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-semibold shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{isAr ? 'المطبخ جاهز ويستقبل الطلبات الآن' : 'Kitchen Open & Preparing Orders'}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">{isAr ? 'توصيل سريع' : 'Fast Delivery'}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              {subtitle}
            </p>

            {/* Taste-Skill Button Pair */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#menu"
                className="taste-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 ring-1 ring-blue-400/40 cursor-pointer"
              >
                <span>{t('hero.exploreMenu')}</span>
                {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="taste-btn inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-base shadow-lg shadow-slate-950/40 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>{t('hero.whatsappOrder')}</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>{settings?.opening_hours || 'Mon-Sun: 10:00 AM - 11:30 PM'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>{isAr ? (settings?.address_ar || 'بوليفارد الذواقة') : (settings?.address || '450 Grand Avenue')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.9 / 5.0 (500+ {isAr ? 'تقييم زبائن' : 'Reviews'})</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual with Real Food Photography & Micro-Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600/30 to-indigo-600/20 blur-xl opacity-70"></div>

              {/* Main Photo Card */}
              <div className="relative rounded-3xl bg-slate-900 border border-slate-700/80 overflow-hidden shadow-2xl">
                <div className="taste-photo-frame aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={heroImage}
                    alt="Chef's Signature Prime Wagyu Burger"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Card Caption / Meta Pill */}
                <div className="p-5 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-900/95 border-t border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{isAr ? 'الطبق الأكثر تميزاً اليوم' : "Chef's Signature Today"}</span>
                    </div>
                    <h3 className="font-black text-white text-base">
                      {isAr ? 'واغيو ترافل برجر الملكي' : 'Truffle Wagyu Supreme'}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">{isAr ? 'السعر' : 'Price'}</span>
                    <span className="text-lg font-black text-white">$18.99</span>
                  </div>
                </div>
              </div>

              {/* Floating Quality Tag */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 p-3.5 rounded-2xl bg-slate-900/95 border border-blue-500/30 shadow-xl backdrop-blur-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <span className="text-xs font-black text-white block">
                    {isAr ? 'مكونات عضوية ١٠٠٪' : '100% Prime Organic'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isAr ? 'طازجة ومحضرة يومياً' : 'Handcrafted fresh daily'}
                  </span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
