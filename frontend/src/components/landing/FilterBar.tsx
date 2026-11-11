import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Leaf, Flame, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isVegetarian: boolean;
  onToggleVegetarian: () => void;
  isSpicy: boolean;
  onToggleSpicy: () => void;
  isBestseller: boolean;
  onToggleBestseller: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  isVegetarian,
  onToggleVegetarian,
  isSpicy,
  onToggleSpicy,
  isBestseller,
  onToggleBestseller,
  sortBy,
  onSortChange
}) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="space-y-3.5 my-6">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        
        {/* Search input in Dark Blue & White style */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-5 h-5 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-blue-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={t('menu.searchPlaceholder')}
            className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-xs text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Selector in Dark Blue & White style */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-56">
            <ArrowUpDown className="w-4 h-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
            <select
              value={sortBy}
              onChange={e => onSortChange(e.target.value)}
              className="w-full appearance-none pl-10 pr-8 rtl:pl-8 rtl:pr-10 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-950 text-slate-800 dark:text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs cursor-pointer"
            >
              <option value="order">{t('menu.sortDefault')}</option>
              <option value="popular">{isAr ? 'الأكثر شعبية والطلبات' : 'Most Popular'}</option>
              <option value="price_asc">{t('menu.sortPriceAsc')}</option>
              <option value="price_desc">{t('menu.sortPriceDesc')}</option>
              <option value="newest">{t('menu.sortNewest')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dietary & Badge Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
          <span>{isAr ? 'تصفية حسب:' : 'Quick Filters:'}</span>
        </span>

        {/* Veg filter */}
        <button
          onClick={onToggleVegetarian}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
            isVegetarian
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-950 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>{t('menu.filterVegetarian')}</span>
        </button>

        {/* Spicy filter */}
        <button
          onClick={onToggleSpicy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
            isSpicy
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-950 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>{t('menu.filterSpicy')}</span>
        </button>

        {/* Bestseller filter */}
        <button
          onClick={onToggleBestseller}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
            isBestseller
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-950 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{t('menu.filterBestseller')}</span>
        </button>
      </div>
    </div>
  );
};
