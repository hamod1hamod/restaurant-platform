import React, { useState } from 'react';
import {
  ShoppingBag, Globe, Sun, Moon, Menu, X, PhoneCall
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { RestaurantSettings } from '../../types';

interface NavbarProps {
  settings?: RestaurantSettings | null;
}

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = language === 'ar';

  const restaurantName = isAr
    ? (settings?.name_ar || 'مطعم وكافيه خطاب')
    : (settings?.name || 'Khatab Restaurant & Café');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f7f7f7] dark:bg-[#0d2a1c] text-[#0d2a1c] dark:text-[#f7f7f7] border-b border-[#0d2a1c]/12 dark:border-white/15 transition-colors">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        <a className="skip-link" href="#top">
          {isAr ? 'تخطي إلى المحتوى' : 'Skip to content'}
        </a>

        {/* Brand / Logo */}
        <a
          href="#top"
          className="flex items-center gap-2.5 text-[#0d2a1c] dark:text-[#f7f7f7] hover:opacity-80 transition-opacity shrink-0"
        >
          {settings?.logo_url ? (
            <img
              src={settings.logo_url}
              alt={restaurantName}
              className="w-8 h-8 object-cover border border-[#0d2a1c]/15 dark:border-white/15"
            />
          ) : (
            <span className="w-3 h-3 bg-[#f6e016] border border-[#0d2a1c] inline-block shrink-0" aria-hidden="true"></span>
          )}
          <span className="font-display text-lg sm:text-xl tracking-tight leading-none">
            {restaurantName}
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-[#0d2a1c] dark:text-[#f7f7f7]" aria-label="Main">
          <a href="#menu" className="taste-link whitespace-nowrap">
            {t('nav.menu')}
          </a>
          <a href="#bestsellers" className="taste-link whitespace-nowrap">
            {t('nav.bestsellers')}
          </a>
          <a href="#craft" className="taste-link whitespace-nowrap">
            {isAr ? 'قصتنا' : 'Story'}
          </a>
          <a href="#offers" className="taste-link whitespace-nowrap">
            {t('nav.offers')}
          </a>
          <a href="#about" className="taste-link whitespace-nowrap">
            {t('nav.about')}
          </a>
          <a href="#contact" className="taste-link whitespace-nowrap">
            {isAr ? 'زيارتنا' : 'Visit'}
          </a>
        </nav>

        {/* Actions Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggleLanguage}
            title={language === 'en' ? 'Switch to العربية' : 'Switch to English'}
            className="taste-btn h-11 px-3 flex items-center gap-1.5 text-[13px] font-medium border border-[#0d2a1c]/15 dark:border-white/20 bg-white dark:bg-[#1c3629] hover:bg-[#ebebeb] dark:hover:bg-[#254535] text-[#0d2a1c] dark:text-[#f7f7f7] cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#5f6b64] dark:text-[#97a39c]" />
            <span>{language === 'en' ? 'العربية' : 'EN'}</span>
          </button>

          <button
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className="taste-btn w-11 h-11 flex items-center justify-center border border-[#0d2a1c]/15 dark:border-white/20 bg-white dark:bg-[#1c3629] hover:bg-[#ebebeb] dark:hover:bg-[#254535] text-[#0d2a1c] dark:text-[#f7f7f7] cursor-pointer"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Primary Action: Order / Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="taste-btn h-11 px-4 sm:px-5 flex items-center gap-2 bg-[#0d2a1c] dark:bg-[#f6e016] hover:bg-[#1c3629] dark:hover:bg-[#e5cf12] text-[#f7f7f7] dark:text-[#0d2a1c] font-medium text-[15px] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t('nav.cart')}</span>
            {totalItemsCount > 0 && (
              <span className="bg-[#f6e016] dark:bg-[#0d2a1c] text-[#0d2a1c] dark:text-[#f6e016] text-xs font-bold px-1.5 py-0.5 tabular-nums leading-none">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Menu"
            className="lg:hidden w-11 h-11 flex items-center justify-center border border-[#0d2a1c]/15 dark:border-white/20 text-[#0d2a1c] dark:text-[#f7f7f7] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-6 py-6 bg-[#f7f7f7] dark:bg-[#0d2a1c] border-b border-[#0d2a1c]/12 dark:border-white/15 space-y-4">
          <div className="flex flex-col divide-y divide-[#0d2a1c]/10 dark:divide-white/10 text-base font-medium">
            <a href="#menu" onClick={() => setMobileMenuOpen(false)} className="py-3">{t('nav.menu')}</a>
            <a href="#bestsellers" onClick={() => setMobileMenuOpen(false)} className="py-3">{t('nav.bestsellers')}</a>
            <a href="#craft" onClick={() => setMobileMenuOpen(false)} className="py-3">{isAr ? 'قصتنا' : 'Story'}</a>
            <a href="#offers" onClick={() => setMobileMenuOpen(false)} className="py-3">{t('nav.offers')}</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-3">{t('nav.about')}</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-3">{isAr ? 'زيارتنا' : 'Visit'}</a>
          </div>

          {settings?.phone && (
            <div className="pt-3 border-t border-[#0d2a1c]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-sm text-[#5f6b64] dark:text-[#97a39c]">
              <span className="flex items-center gap-1.5 tabular-nums">
                <PhoneCall className="w-4 h-4 text-[#0d2a1c] dark:text-[#f6e016]" />
                <span>{settings.phone}</span>
              </span>
              <span>{settings.opening_hours}</span>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
