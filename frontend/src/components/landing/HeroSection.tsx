import React from 'react';
import { ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { RestaurantSettings } from '../../types';

interface HeroSectionProps {
  settings?: RestaurantSettings | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  const { language, t, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const restaurantName = isAr
    ? (settings?.name_ar || 'مطعم وكافيه خطاب')
    : (settings?.name || 'Khatab Restaurant & Café');

  const title = isAr
    ? (settings?.hero_title_ar || 'مطعم وكافيه خطاب — كل القائمة في صفحة واحدة')
    : (settings?.hero_title || 'Kitchen & café, freshly prepared all day');

  const subtitle = isAr
    ? (settings?.hero_subtitle_ar || `${restaurantName} — برجر واغيو، ستيك معتق، بيتزا على الحطب، وقهوة مختصة. مفتوح يومياً من 9:00 صباحاً حتى منتصف الليل.`)
    : (settings?.hero_subtitle || `${restaurantName} — dry-aged cuts, wood-fired pizza, brioche burgers, and single-origin espresso. Open daily 09:00 AM – 12:00 AM.`);

  const heroImage = settings?.hero_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80';
  const whatsappUrl = `https://wa.me/${settings?.whatsapp?.replace(/[^0-9]/g, '') || '201002345678'}`;

  return (
    <section
      className="bg-[#f7f7f7] dark:bg-[#0d2a1c] text-[#0d2a1c] dark:text-[#f7f7f7] border-b border-[#0d2a1c]/12 dark:border-white/15"
      aria-labelledby="hero-h"
    >
      {/* Full-bleed Place Hero Photograph */}
      <div className="w-full h-[44vh] min-h-[300px] max-h-[500px] overflow-hidden bg-[#ebebeb] dark:bg-[#1c3629]">
        <img
          src={heroImage}
          alt={isAr ? 'طبق رئيسي من مطبخ خطاب' : 'Signature plate from Khatab Restaurant & Café'}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Editorial Place Typography & Primary Action */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-10 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
        >
          <div className="lg:col-span-7 space-y-3">
            <span className="inline-block px-2.5 py-1 bg-[#f6e016] text-[#0d2a1c] text-xs font-semibold uppercase tracking-wider">
              {restaurantName}
            </span>
            <h1
              id="hero-h"
              className="font-display text-[clamp(34px,4.4vw,62px)] leading-[1.04] tracking-[-0.03em] text-[#0d2a1c] dark:text-[#f7f7f7]"
            >
              {title}
            </h1>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <p className="text-base sm:text-lg text-[#5f6b64] dark:text-[#97a39c] leading-relaxed">
              {subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#menu"
                className="taste-btn h-12 px-6 inline-flex items-center gap-2.5 bg-[#0d2a1c] dark:bg-[#f6e016] hover:bg-[#1c3629] dark:hover:bg-[#e5cf12] text-[#f7f7f7] dark:text-[#0d2a1c] font-medium text-base cursor-pointer"
              >
                <span>{t('hero.exploreMenu')}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="taste-btn h-12 px-6 inline-flex items-center gap-2 border border-[#0d2a1c]/20 dark:border-white/25 bg-white dark:bg-[#1c3629] hover:bg-[#ebebeb] dark:hover:bg-[#254535] text-[#0d2a1c] dark:text-[#f7f7f7] font-medium text-base cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('hero.whatsappOrder')}</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
