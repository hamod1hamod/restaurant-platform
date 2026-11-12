import React from 'react';
import { Search, ArrowUpDown, Leaf, Flame, Award, X } from 'lucide-react';
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
    <div className="space-y-4 my-6">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-[#5f6b64]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={t('menu.searchPlaceholder')}
            className="w-full h-11 pl-10 pr-9 rtl:pl-9 rtl:pr-10 rounded-[2px] bg-white dark:bg-[#1c3629] border border-[#0d2a1c]/15 dark:border-white/15 text-[#0d2a1c] dark:text-[#f7f7f7] placeholder-[#5f6b64] dark:placeholder-[#97a39c] focus:outline-none focus:border-[#0d2a1c] dark:focus:border-[#f6e016] text-sm transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 p-1 text-[#5f6b64] hover:text-[#0d2a1c] dark:hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-56">
            <ArrowUpDown className="w-4 h-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-[#5f6b64] pointer-events-none" />
            <select
              value={sortBy}
              onChange={e => onSortChange(e.target.value)}
              className="w-full h-11 pl-10 pr-8 rtl:pl-8 rtl:pr-10 rounded-[2px] bg-white dark:bg-[#1c3629] border border-[#0d2a1c]/15 dark:border-white/15 text-[#0d2a1c] dark:text-[#f7f7f7] text-sm font-medium focus:outline-none focus:border-[#0d2a1c] dark:focus:border-[#f6e016] cursor-pointer appearance-none transition-colors"
            >
              <option value="order">{t('menu.sortDefault')}</option>
              <option value="price_asc">{t('menu.priceLowHigh')}</option>
              <option value="price_desc">{t('menu.priceHighLow')}</option>
              <option value="popular">{t('menu.mostPopular')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dietary Quick Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onToggleVegetarian}
          className={`taste-btn h-9 px-3.5 flex items-center gap-1.5 text-[13px] font-medium cursor-pointer border ${
            isVegetarian
              ? 'bg-[#0d2a1c] dark:bg-[#f6e016] text-[#f7f7f7] dark:text-[#0d2a1c] border-[#0d2a1c] dark:border-[#f6e016]'
              : 'bg-white dark:bg-[#1c3629] text-[#5f6b64] dark:text-[#97a39c] border-[#0d2a1c]/15 dark:border-white/15 hover:text-[#0d2a1c] dark:hover:text-white'
          }`}
        >
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isAr ? 'نباتي' : 'Vegetarian'}</span>
        </button>

        <button
          onClick={onToggleSpicy}
          className={`taste-btn h-9 px-3.5 flex items-center gap-1.5 text-[13px] font-medium cursor-pointer border ${
            isSpicy
              ? 'bg-[#0d2a1c] dark:bg-[#f6e016] text-[#f7f7f7] dark:text-[#0d2a1c] border-[#0d2a1c] dark:border-[#f6e016]'
              : 'bg-white dark:bg-[#1c3629] text-[#5f6b64] dark:text-[#97a39c] border-[#0d2a1c]/15 dark:border-white/15 hover:text-[#0d2a1c] dark:hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>{isAr ? 'حار وسبايسي' : 'Spicy'}</span>
        </button>

        <button
          onClick={onToggleBestseller}
          className={`taste-btn h-9 px-3.5 flex items-center gap-1.5 text-[13px] font-medium cursor-pointer border ${
            isBestseller
              ? 'bg-[#f6e016] text-[#0d2a1c] border-[#0d2a1c]'
              : 'bg-white dark:bg-[#1c3629] text-[#5f6b64] dark:text-[#97a39c] border-[#0d2a1c]/15 dark:border-white/15 hover:text-[#0d2a1c] dark:hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{isAr ? 'الأكثر طلباً' : 'Bestsellers Only'}</span>
        </button>
      </div>
    </div>
  );
};
