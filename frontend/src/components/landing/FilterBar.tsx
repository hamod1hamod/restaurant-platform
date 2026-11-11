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
    <div className="space-y-3.5 my-6">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        
        {/* Search Input with Taste-Skill glass frame */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={t('menu.searchPlaceholder')}
            className="w-full pl-10 pr-9 rtl:pl-9 rtl:pr-10 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-56">
            <ArrowUpDown className="w-4 h-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={e => onSortChange(e.target.value)}
              className="w-full pl-10 pr-8 rtl:pl-8 rtl:pr-10 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-white text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-xs cursor-pointer appearance-none transition-all"
            >
              <option value="order">{t('menu.sortDefault')}</option>
              <option value="price_asc">{t('menu.priceLowHigh')}</option>
              <option value="price_desc">{t('menu.priceHighLow')}</option>
              <option value="popular">{t('menu.mostPopular')}</option>
            </select>
          </div>
        </div>

      </div>

      {/* Dietary Quick Filter Pills with micro-interactions */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        
        {/* Vegetarian Toggle */}
        <button
          onClick={onToggleVegetarian}
          className={`taste-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            isVegetarian
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isAr ? 'نباتي' : 'Vegetarian'}</span>
        </button>

        {/* Spicy Toggle */}
        <button
          onClick={onToggleSpicy}
          className={`taste-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            isSpicy
              ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40 ring-1 ring-rose-400/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>{isAr ? 'حار وسبايسي' : 'Spicy'}</span>
        </button>

        {/* Bestseller Toggle */}
        <button
          onClick={onToggleBestseller}
          className={`taste-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            isBestseller
              ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40 ring-1 ring-amber-400/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAr ? 'الأكثر طلباً' : 'Bestsellers Only'}</span>
        </button>

      </div>
    </div>
  );
};
