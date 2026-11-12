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
    <div className="w-full overflow-x-auto pb-3 pt-1 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {/* "All" button */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`taste-btn h-11 px-4 flex items-center gap-2 text-sm font-medium cursor-pointer border ${
            selectedCategoryId === null
              ? 'bg-[#0d2a1c] dark:bg-[#f6e016] text-[#f7f7f7] dark:text-[#0d2a1c] border-[#0d2a1c] dark:border-[#f6e016]'
              : 'bg-white dark:bg-[#1c3629] text-[#0d2a1c] dark:text-[#f7f7f7] border-[#0d2a1c]/15 dark:border-white/15 hover:border-[#0d2a1c]/40'
          }`}
        >
          <Grid className="w-4 h-4" />
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
              className={`taste-btn h-11 px-4 flex items-center gap-2 text-sm font-medium cursor-pointer border ${
                isSelected
                  ? 'bg-[#0d2a1c] dark:bg-[#f6e016] text-[#f7f7f7] dark:text-[#0d2a1c] border-[#0d2a1c] dark:border-[#f6e016]'
                  : 'bg-white dark:bg-[#1c3629] text-[#0d2a1c] dark:text-[#f7f7f7] border-[#0d2a1c]/15 dark:border-white/15 hover:border-[#0d2a1c]/40'
              }`}
            >
              {category.image_url ? (
                <img src={category.image_url} alt={name} className="w-4 h-4 object-cover" />
              ) : (
                <span>{icon}</span>
              )}
              <span>{name}</span>

              {category.product_count !== undefined && (
                <span
                  className={`text-xs tabular-nums px-1.5 py-0.5 ${
                    isSelected
                      ? 'bg-[#f6e016] dark:bg-[#0d2a1c] text-[#0d2a1c] dark:text-[#f6e016]'
                      : 'text-[#5f6b64] dark:text-[#97a39c]'
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
