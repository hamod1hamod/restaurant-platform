import React, { useState } from 'react';
import {
  LayoutDashboard, FolderTree, UtensilsCrossed, ShoppingCart, Tag,
  Settings, Users, BarChart3, LogOut, ExternalLink, Globe, Sun, Moon,
  Menu, X, Sparkles, Database
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
    { id: 'overview', label: t('admin.dashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'categories', label: t('admin.categories'), icon: <FolderTree className="w-4 h-4" /> },
    { id: 'products', label: t('admin.products'), icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'orders', label: t('admin.orders'), icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'pricing', label: t('admin.pricing'), icon: <Tag className="w-4 h-4" /> },
    { id: 'settings', label: t('admin.settings'), icon: <Settings className="w-4 h-4" /> },
    { id: 'customers', label: t('admin.customers'), icon: <Users className="w-4 h-4" /> },
    { id: 'reports', label: t('admin.reports'), icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileSidebarOpen(false);
  };

  const handleExitAdmin = () => {
    window.location.hash = '';
    setIsAdminView(false);
  };

  const handleLogout = () => {
    logout();
    window.location.hash = '';
    setIsAdminView(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row text-slate-100 font-sans">
      
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <span className="font-black text-base">
            {isAr ? 'لوحة تحكم الإدارة' : 'Admin Hub'}
          </span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="taste-btn p-2 rounded-xl bg-slate-800 text-slate-300"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Sidebar (Taste-Skill Dark Slate & Navy) */}
      <aside
        className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-40 w-72 bg-slate-900 border-r rtl:border-r-0 rtl:border-l border-slate-800 p-6 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen
            ? 'translate-x-0'
            : isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-base text-white tracking-tight">
                {isAr ? (settings?.name_ar || 'ملاذ الذواقة') : (settings?.name || 'Gourmet Haven')}
              </h1>
              <span className="text-[11px] text-blue-400 font-bold uppercase tracking-wider block">
                {isAr ? 'بوابة إدارة المطعم' : 'Restaurant Operations'}
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            {menuItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`taste-btn w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-left rtl:text-right cursor-pointer transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          
          {/* View Website */}
          <button
            onClick={handleExitAdmin}
            className="taste-btn w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-850 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-blue-400" />
              <span>{isAr ? 'معاينة موقع المطعم' : 'View Public Website'}</span>
            </span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="taste-btn w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </span>
          </button>

          {/* Admin User Info & Logout */}
          <div className="pt-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-black text-xs">
                {admin?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{admin?.full_name || 'Admin'}</span>
                <span className="text-[10px] text-slate-400">{admin?.role || 'Manager'}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="taste-btn p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>

    </div>
  );
};
