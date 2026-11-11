import React from 'react';
import { ChefHat, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { RestaurantSettings } from '../../types';

interface AboutSectionProps {
  settings?: RestaurantSettings | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const restaurantName = isAr ? (settings?.name_ar || 'ملاذ الذواقة') : (settings?.name || 'Gourmet Haven');

  return (
    <section id="about" className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-200/60 dark:border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Images collage */}
          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
                alt="Chef preparing dish"
                className="w-full h-48 sm:h-64 object-cover rounded-3xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
                alt="Artisan steaks on grill"
                className="w-full h-40 sm:h-48 object-cover rounded-3xl shadow-lg"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                alt="Restaurant interior"
                className="w-full h-40 sm:h-48 object-cover rounded-3xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
                alt="Gourmet Burger"
                className="w-full h-48 sm:h-64 object-cover rounded-3xl shadow-lg"
              />
            </div>

            {/* Experience badge in Dark Blue style */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-blue-900/60">
              <ChefHat className="w-6 h-6 text-blue-400" />
              <div className="text-left rtl:text-right">
                <span className="block font-black text-lg text-blue-400">100% Artisan</span>
                <span className="text-xs text-slate-300 font-medium">Fresh Daily Ingredients</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'قصتنا وفلسفتنا' : 'Our Story & Philosophy'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
              {isAr
                ? `حيث تلتقي فنون الطهي العصرية مع كرم الضيافة في ${restaurantName}`
                : `Where Culinary Passion Meets Unrivaled Hospitality at ${restaurantName}`}
            </h2>

            <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {isAr ? (settings?.description_ar || 'نحن نؤمن بأن كل وجبة هي تجربة مميزة. نختار مكوناتنا بعناية فائقة من مزارع محلية ونطهوها بشغف واحتراف لنقدم لك طعماً لا ينسى.') : (settings?.description || 'We believe dining should be an unforgettable experience. From our slow-fermented pizza dough to certified prime cuts seared over natural coals, every dish reflects dedication to the culinary craft.')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {isAr ? 'جودة ونظافة فائقة' : 'Premium Hygiene'}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {isAr ? 'أعلى معايير سلامة الأغذية والتغليف الصحي الآمن.' : 'Strict food safety and sealed tamper-evident packaging.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                <HeartHandshake className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {isAr ? 'توصيل ساخن وسريع' : 'Fast & Hot Delivery'}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {isAr ? 'نصلك أينما كنت مع الحفاظ على حرارة ونكهة الوجبة.' : 'Direct temperature-controlled delivery to your doorstep.'}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
