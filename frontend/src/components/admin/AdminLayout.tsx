import React, { useState } from 'react';
import {
  LayoutDashboard, FolderTree, UtensilsCrossed, ShoppingCart, Tag,
  Settings, Users, BarChart3, LogOut, ExternalLink, Globe, Sun, Moon,
  Menu, X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { RestaurantSettings } from '../../types';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  settings?: RestaurantSettings | null;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  settings,
  children
}) => {
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { admin, logout, setIsAdminView } = useAuth();
  const isAr = language === 'ar';
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: t('admin.dashboard'), icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'categories', label: t('admin.categories'), icon: <FolderTree className="w-5 h-5" /> },
    { id: 'products', label: t('admin.products'), icon: <UtensilsCrossed className="w-5 h-5" /> },
    { id: 'orders', label: t('admin.orders'), icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'pricing', label: t('admin.pricing'), icon: <Tag className="w-5 h-5" /> },
    { id: 'settings', label: t('admin.settings'), icon: <Settings className="w-5 h-5" /> },
    { id: 'customers', label: t('admin.customers'), icon: <Users className="w-5 h-5" /> },
    { id: 'reports', label: t('admin.reports'), icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col lg:flex-row text-zinc-900 dark:text-zinc-100">
      
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base">
            {isAr ? 'لوحة التحكم' : 'Admin Hub'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdminView(false)}
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-bold"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 z-40 w-64 bg-white dark:bg-zinc-900 border-r rtl:border-r-0 rtl:border-l border-zinc-200 dark:border-zinc-800 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen
            ? 'translate-x-0'
            : isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-orange-500/20">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-base text-zinc-900 dark:text-zinc-50 leading-tight">
                  {isAr ? (settings?.name_ar || 'ملاذ الذواقة') : (settings?.name || 'Gourmet Haven')}
                </h1>
                <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
                  {isAr ? 'نظام إدارة المطعم' : 'Admin Management'}
                </span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5 pt-2">
            {menuItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          
          {/* Quick Toolbar (Language, Theme, View Site) */}
          <div className="flex items-center justify-between px-2 text-xs text-zinc-500 dark:text-zinc-400">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 hover:text-orange-600 font-bold cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'العربية' : 'EN'}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="hover:text-orange-600 cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsAdminView(false)}
              className="flex items-center gap-1 hover:text-orange-600 font-bold cursor-pointer"
              title="Return to Customer Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isAr ? 'الموقع' : 'Site'}</span>
            </button>
          </div>

          {/* Admin User Info & Logout */}
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between">
            <div className="overflow-hidden pr-2 rtl:pr-0 rtl:pl-2">
              <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100 block truncate">
                {admin?.full_name || admin?.username || 'Administrator'}
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold block uppercase">
                {admin?.role || 'Superadmin'}
              </span>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>

    </div>
  );
};
