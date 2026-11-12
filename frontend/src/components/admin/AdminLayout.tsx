import React, { useState } from 'react';
import {
  LayoutDashboard, FolderTree, UtensilsCrossed, ShoppingCart, Tag,
  Settings, Users, BarChart3, LogOut, ExternalLink, Globe, Menu, X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
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

  const restaurantName = isAr
    ? (settings?.name_ar || 'مطعم وكافيه خطاب')
    : (settings?.name || 'Khatab Restaurant & Café');

  return (
    <div className="min-h-screen bg-[#ebebeb] dark:bg-[#0d2a1c] flex flex-col lg:flex-row text-[#0d2a1c] dark:text-[#f5f5f5]">
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1c3629] border-b border-black/12 dark:border-white/12">
        <div className="flex items-center gap-2.5">
          <span className="mark text-[#0d2a1c]" data-mark="petal" aria-hidden="true"></span>
          <span className="font-display text-lg">
            {restaurantName}
          </span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="taste-btn w-10 h-10 flex items-center justify-center border border-black/15 dark:border-white/15 cursor-pointer"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-40 w-72 bg-white dark:bg-[#1c3629] border-r rtl:border-r-0 rtl:border-l border-black/12 dark:border-white/12 p-6 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen
            ? 'translate-x-0'
            : isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-black/12 dark:border-white/12">
            <span className="mark text-[#0d2a1c] shrink-0" data-mark="petal" aria-hidden="true"></span>
            <div className="min-w-0">
              <h1 className="font-display text-lg text-[#0d2a1c] dark:text-white leading-tight truncate">
                {restaurantName}
              </h1>
              <span className="text-[11px] text-[#0d2a1c] font-medium uppercase tracking-wider block mt-0.5">
                {isAr ? 'بوابة إدارة المطعم' : 'Operations Portal'}
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`taste-btn w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left rtl:text-right cursor-pointer ${
                    isActive
                      ? 'bg-[#0d2a1c] text-white'
                      : 'text-[#5f6b64] dark:text-[#a3a3a3] hover:text-[#0d2a1c] dark:hover:text-white hover:bg-[#ebebeb] dark:hover:bg-[#1f1f1f]'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#5f6b64]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-black/12 dark:border-white/12 space-y-2">
          <button
            onClick={handleExitAdmin}
            className="taste-btn w-full h-10 flex items-center justify-between px-3.5 bg-[#ebebeb] dark:bg-[#0d2a1c] border border-black/12 dark:border-white/12 text-xs font-medium hover:border-black/40 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#0d2a1c]" />
              <span>{isAr ? 'معاينة موقع المطعم' : 'View Public Website'}</span>
            </span>
          </button>

          <button
            onClick={toggleLanguage}
            className="taste-btn w-full h-10 flex items-center justify-between px-3.5 bg-[#ebebeb] dark:bg-[#0d2a1c] border border-black/12 dark:border-white/12 text-xs font-medium hover:border-black/40 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#5f6b64]" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </span>
          </button>

          <div className="pt-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#0d2a1c] dark:bg-white text-white dark:text-[#0d2a1c] flex items-center justify-center font-medium text-xs">
                {admin?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <span className="text-xs font-medium block">{admin?.full_name || 'Admin'}</span>
                <span className="text-[11px] text-[#5f6b64]">{admin?.role || 'Manager'}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="taste-btn p-2 text-[#5f6b64] hover:text-[#0d2a1c] cursor-pointer"
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
