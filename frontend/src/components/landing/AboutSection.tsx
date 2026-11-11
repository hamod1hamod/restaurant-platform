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
    <section id="about" className="py-20 lg:py-28 bg-slate-950 text-white border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Images collage */}
          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="taste-photo-frame overflow-hidden rounded-3xl border border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
                  alt="Chef preparing dish"
                  className="w-full h-48 sm:h-64 object-cover"
                />
              </div>
              <div className="taste-photo-frame overflow-hidden rounded-3xl border border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
                  alt="Artisan steaks on grill"
                  className="w-full h-40 sm:h-48 object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="taste-photo-frame overflow-hidden rounded-3xl border border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                  alt="Restaurant interior"
                  className="w-full h-40 sm:h-48 object-cover"
                />
              </div>
              <div className="taste-photo-frame overflow-hidden rounded-3xl border border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
                  alt="Gourmet Burger"
                  className="w-full h-48 sm:h-64 object-cover"
                />
              </div>
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700/80">
              <ChefHat className="w-6 h-6 text-blue-400" />
              <div className="text-left rtl:text-right">
                <span className="block font-black text-lg text-white">100% Artisan</span>
                <span className="text-xs text-slate-400 font-medium">Fresh Daily Sourcing</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'قصتنا وفلسفتنا' : 'Our Heritage & Philosophy'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              {isAr ? `أهلاً بكم في ${restaurantName}` : `Welcome to ${restaurantName}`}
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              {isAr
                ? (settings?.description_ar || 'تأسس مطعمنا على شغف تقديم تجربة طعام استثنائية تجمع بين أصالة النكهات وحداثة التقنيات. نحن نؤمن بأن كل وجبة يجب أن تكون احتفالاً بالحواس.')
                : (settings?.description || 'Founded on a passion for culinary excellence, we unite time-honored cooking traditions with contemporary gastronomic techniques to craft moments you cherish.')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="taste-card p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
                <h4 className="font-extrabold text-sm text-white">
                  {isAr ? 'أجود المكونات الطازجة' : 'Finest Farm Sourcing'}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAr
                    ? 'لحوم بقر أنجوس معتمدة وخضروات عضوية يومية.'
                    : 'Certified Angus prime cuts & seasonal organic produce.'}
                </p>
              </div>

              <div className="taste-card p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <HeartHandshake className="w-6 h-6 text-blue-400" />
                <h4 className="font-extrabold text-sm text-white">
                  {isAr ? 'إتقان وضيافة استثنائية' : 'Hospitality & Care'}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAr
                    ? 'فريق شغوف يحرص على رضاك في كل طلب.'
                    : 'Dedicated to delighting your table with genuine warmth.'}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
