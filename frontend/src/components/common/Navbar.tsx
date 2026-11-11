import React, { useState } from 'react';
import {
  UtensilsCrossed, ShoppingBag, Globe, Sun, Moon,
  ShieldCheck, Menu, X, PhoneCall, Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { RestaurantSettings } from '../../types';

interface NavbarProps {
  settings?: RestaurantSettings | null;
  onOpenAdminLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, onOpenAdminLogin }) => {
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { isAuthenticated, setIsAdminView, isAdminView } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const restaurantName = language === 'ar' ? (settings?.name_ar || 'ملاذ الذواقة') : (settings?.name || 'Gourmet Haven');

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          {settings?.logo_url ? (
            <img
              src={settings.logo_url}
              alt={restaurantName}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-500 shadow-sm"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
          )}
          <div>
            <a href="#" className="font-extrabold text-xl sm:text-2xl tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
              <span>{restaurantName}</span>
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            </a>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium hidden sm:block">
              {settings?.opening_hours || 'Freshly Crafted Gourmet Meals'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          <a href="#menu" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            {t('nav.menu')}
          </a>
          <a href="#bestsellers" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('nav.bestsellers')}</span>
          </a>
          <a href="#offers" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            {t('nav.offers')}
          </a>
          <a href="#about" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            {t('nav.about')}
          </a>
          <a href="#reviews" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            {t('nav.reviews')}
          </a>
          <a href="#contact" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            {t('nav.contact')}
          </a>
        </nav>

        {/* Actions Toolbar */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            title={language === 'en' ? 'Switch to العربية' : 'Switch to English'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-orange-500" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className="p-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t('nav.cart')}</span>
            {totalItemsCount > 0 && (
              <span className="bg-white text-orange-600 text-xs font-black rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Admin Portal Button */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                setIsAdminView(!isAdminView);
              } else {
                onOpenAdminLogin();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer"
            title="Restaurant Management System"
          >
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span className="hidden md:inline">
              {isAuthenticated ? (isAdminView ? t('admin.viewSite') : t('nav.adminPortal')) : t('nav.adminPortal')}
            </span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-2 text-base font-semibold text-zinc-800 dark:text-zinc-100">
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {t('nav.menu')}
            </a>
            <a
              href="#bestsellers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {t('nav.bestsellers')}
            </a>
            <a
              href="#offers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {t('nav.offers')}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {t('nav.about')}
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {t('nav.reviews')}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {t('nav.contact')}
            </a>
          </div>

          {settings?.phone && (
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-orange-500" />
                <span>{settings.phone}</span>
              </span>
              <span className="font-bold text-orange-600 dark:text-orange-400">
                {settings.opening_hours}
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
