import React from 'react';
import { Flame, Leaf, Sparkles, Award, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface BadgeProps {
  type: 'vegetarian' | 'spicy' | 'featured' | 'bestseller' | 'new';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ type, size = 'sm' }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  switch (type) {
    case 'vegetarian':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 ${sizeClasses}`}>
          <Leaf className="w-3 h-3" />
          <span>{isAr ? 'نباتي' : 'Veg'}</span>
        </span>
      );
    case 'spicy':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800 ${sizeClasses}`}>
          <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>{isAr ? 'حار' : 'Spicy'}</span>
        </span>
      );
    case 'bestseller':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-blue-50 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800 ${sizeClasses}`}>
          <Award className="w-3 h-3 text-blue-500" />
          <span>{isAr ? 'الأكثر طلباً' : 'Best Seller'}</span>
        </span>
      );
    case 'featured':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-indigo-50 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 ${sizeClasses}`}>
          <Star className="w-3 h-3 text-indigo-500 fill-indigo-500" />
          <span>{isAr ? 'مميز' : 'Chef Pick'}</span>
        </span>
      );
    case 'new':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800 ${sizeClasses}`}>
          <Sparkles className="w-3 h-3 text-sky-500" />
          <span>{isAr ? 'جديد' : 'New'}</span>
        </span>
      );
    default:
      return null;
  }
};
