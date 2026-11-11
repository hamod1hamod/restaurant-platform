import React from 'react';
import { Utensils, Sandwich, Pizza, Flame, Coffee, Cake, GlassWater, CupSoda, Grid } from 'lucide-react';
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
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory
}) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="w-full overflow-x-auto pb-3 pt-2 scrollbar-none">
      <div className="flex items-center gap-2.5 min-w-max">
        
        {/* "All" button */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
            selectedCategoryId === null
              ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25 scale-102'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>{t('menu.allCategories')}</span>
        </button>

        {/* Categories list */}
        {categories.map(category => {
          const isSelected = selectedCategoryId === category.id;
          const name = isAr ? category.name_ar : category.name;
          const icon = (category.icon && iconMap[category.icon]) || <Utensils className="w-4 h-4" />;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25 scale-102'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                icon
              )}
              <span>{name}</span>
              {typeof category.product_count === 'number' && category.product_count > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? 'bg-orange-700/60 text-white'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
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
