import React from 'react';
import { UtensilsCrossed, Heart, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { RestaurantSettings } from '../../types';

interface FooterProps {
  settings?: RestaurantSettings | null;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdminLogin }) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const restaurantName = isAr ? (settings?.name_ar || 'ملاذ الذواقة') : (settings?.name || 'Gourmet Haven');

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-900">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-md">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                {restaurantName}
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
              {isAr ? (settings?.description_ar || 'أشهى المأكولات الإيطالية والبرجر الحرفي والمشويات الطازجة المحضرة بكل عناية وإتقان.') : (settings?.description || 'Award-winning culinary destination crafting artisan burgers, woodfired pizzas, prime grills, and decadent patisserie.')}
            </p>
            <div className="text-xs text-zinc-500">
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
                <a href="#menu" className="hover:text-orange-400 transition-colors">
                  {t('nav.menu')}
                </a>
              </li>
              <li>
                <a href="#bestsellers" className="hover:text-orange-400 transition-colors">
                  {t('nav.bestsellers')}
                </a>
              </li>
              <li>
                <a href="#offers" className="hover:text-orange-400 transition-colors">
                  {t('nav.offers')}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-orange-400 transition-colors">
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-orange-400 transition-colors">
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              {isAr ? 'إدارة النظام' : 'Staff & Administration'}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr
                ? 'لوحة إدارة متكاملة لتحديث قائمة الطعام، الأسعار، صور الأطباق، ومتابعة الطلبات اللحظية.'
                : 'Centralized admin panel for real-time menu management, pricing, images, and live order tracking.'}
            </p>
            <button
              onClick={onOpenAdminLogin}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-bold transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>{t('nav.adminPortal')}</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} {restaurantName}. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-bold text-zinc-400">Gourmet Haven Platform</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
