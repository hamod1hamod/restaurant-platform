import React from 'react';
import { Utensils, Sandwich, Pizza, Flame, Coffee, Cake, GlassWater, CupSoda, Grid, Soup, UtensilsCrossed } from 'lucide-react';
import { Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Sandwich: <Sandwich className="w-4 h-4" />,
  Pizza: <Pizza className="w-4 h-4" />,
  Flame: <Flame className="w-4 h-4" />,
  Utensils: <Utensils className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Cake: <Cake className="w-4 h-4" />,
  GlassWater: <GlassWater className="w-4 h-4" />,
  CupSoda: <CupSoda className="w-4 h-4" />,
  Soup: <Soup className="w-4 h-4" />,
  UtensilsCrossed: <UtensilsCrossed className="w-4 h-4" />
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory
}) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="w-full overflow-x-auto pb-4 pt-1 scrollbar-none">
      <div className="flex items-center gap-2.5 min-w-max">
        
        {/* "All" button */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`taste-btn flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-all ${
            selectedCategoryId === null
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/50'
              : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
          }`}
        >
          <Grid className="w-4 h-4 text-blue-400" />
          <span>{t('menu.allCategories')}</span>
        </button>

        {/* Dynamic Categories list */}
        {categories.map(category => {
          const isSelected = selectedCategoryId === category.id;
          const name = isAr ? category.name_ar : category.name;
          const icon = (category.icon && iconMap[category.icon]) || <Utensils className="w-4 h-4" />;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`taste-btn flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/50'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={name}
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <span className={isSelected ? 'text-white' : 'text-blue-400'}>{icon}</span>
              )}
              <span>{name}</span>

              {category.product_count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isSelected
                      ? 'bg-blue-700/80 text-blue-100'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {category.product_count}
                </span>
              )}
            </button>
          );
        })}

      </div>
    </div>
  );
};
