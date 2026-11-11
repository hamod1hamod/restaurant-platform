import React from 'react';
import { UtensilsCrossed, Heart, Lock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { RestaurantSettings } from '../../types';

interface FooterProps {
  settings?: RestaurantSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const restaurantName = isAr ? (settings?.name_ar || 'ملاذ الذواقة') : (settings?.name || 'Gourmet Haven');

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-blue-950 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-blue-950/80">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md ring-2 ring-blue-500/30">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                {restaurantName}
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              {isAr ? (settings?.description_ar || 'أشهى المأكولات الإيطالية والبرجر الحرفي والمشويات الطازجة المحضرة بكل عناية وإتقان.') : (settings?.description || 'Award-winning culinary destination crafting artisan burgers, woodfired pizzas, prime grills, and decadent patisserie.')}
            </p>
            <div className="text-xs text-blue-300 font-medium">
              {settings?.opening_hours || 'Mon - Sun: 09:00 AM - 12:00 Midnight'}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              {isAr ? 'روابط سريعة' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#menu" className="hover:text-blue-400 transition-colors">
                  {t('nav.menu')}
                </a>
              </li>
              <li>
                <a href="#bestsellers" className="hover:text-blue-400 transition-colors">
                  {t('nav.bestsellers')}
                </a>
              </li>
              <li>
                <a href="#offers" className="hover:text-blue-400 transition-colors">
                  {t('nav.offers')}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-blue-400 transition-colors">
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-400 transition-colors">
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with discreet subtle admin trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {restaurantName}. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span>{isAr ? 'صنع بكل' : 'Crafted with'}</span>
              <Heart className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            </span>
            <a
              href="#admin"
              className="text-slate-700 hover:text-slate-400 transition-colors p-1"
              title="Staff Portal (Restricted)"
            >
              <Lock className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
