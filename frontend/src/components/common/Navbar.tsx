import React, { useState } from 'react';
import {
  UtensilsCrossed, ShoppingBag, Globe, Sun, Moon,
  Menu, X, PhoneCall, Sparkles
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

  const restaurantName = language === 'ar' ? (settings?.name_ar || 'ملاذ الذواقة') : (settings?.name || 'Gourmet Haven');

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/90 text-white border-b border-slate-800/80 shadow-lg shadow-slate-950/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          {settings?.logo_url ? (
            <img
              src={settings.logo_url}
              alt={restaurantName}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-sm"
            />
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md ring-2 ring-blue-400/30">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <a href="#" className="font-black text-xl sm:text-2xl tracking-tight text-white flex items-center gap-1.5 hover:text-blue-400 transition-colors">
              <span>{restaurantName}</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </a>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              {settings?.opening_hours || 'Freshly Crafted Gourmet Meals'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-slate-300">
          <a href="#menu" className="hover:text-white transition-colors">
            {t('nav.menu')}
          </a>
          <a href="#bestsellers" className="hover:text-white transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('nav.bestsellers')}</span>
          </a>
          <a href="#craft" className="hover:text-white transition-colors text-blue-400">
            {isAr ? 'حرفة الطهي' : 'Culinary Craft'}
          </a>
          <a href="#offers" className="hover:text-white transition-colors">
            {t('nav.offers')}
          </a>
          <a href="#about" className="hover:text-white transition-colors">
            {t('nav.about')}
          </a>
          <a href="#reviews" className="hover:text-white transition-colors">
            {t('nav.reviews')}
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            {t('nav.contact')}
          </a>
        </nav>

        {/* Actions Toolbar (Control panel removed from public view) */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            title={language === 'en' ? 'Switch to العربية' : 'Switch to English'}
            className="taste-btn flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white transition-all cursor-pointer shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className="taste-btn p-2.5 rounded-2xl border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-blue-300" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="taste-btn relative flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer ring-1 ring-blue-400/40"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">{t('nav.cart')}</span>
            {totalItemsCount > 0 && (
              <span className="bg-white text-blue-900 text-xs font-black rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-200 hover:bg-blue-900/50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-slate-900 border-b border-blue-950 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-2 text-base font-semibold text-slate-100">
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-blue-900/40"
            >
              {t('nav.menu')}
            </a>
            <a
              href="#bestsellers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-blue-900/40"
            >
              {t('nav.bestsellers')}
            </a>
            <a
              href="#offers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-blue-900/40"
            >
              {t('nav.offers')}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-blue-900/40"
            >
              {t('nav.about')}
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-blue-900/40"
            >
              {t('nav.reviews')}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-blue-900/40"
            >
              {t('nav.contact')}
            </a>
          </div>

          {settings?.phone && (
            <div className="pt-2 border-t border-blue-900/40 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-blue-400" />
                <span>{settings.phone}</span>
              </span>
              <span className="font-bold text-blue-400">
                {settings.opening_hours}
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
