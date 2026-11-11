import React from 'react';
import { Award, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ProductCard } from './ProductCard';

interface BestSellersSectionProps {
  products: Product[];
  currency: string;
  onOpenDetails: (product: Product) => void;
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({
  products,
  currency,
  onOpenDetails
}) => {
  const { language, t, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const bestsellers = products.filter(p => p.is_bestseller).slice(0, 4);
  if (bestsellers.length === 0) return null;

  return (
    <section id="bestsellers" className="py-16 sm:py-20 bg-zinc-50 dark:bg-zinc-950/40 border-y border-zinc-200/60 dark:border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>{isAr ? 'الأكثر طلباً وشهرة' : 'Customer Favorites'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50">
              {t('nav.bestsellers')}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
              {isAr
                ? 'الأطباق الأكثر تميزاً وإقبالاً، محضرة يومياً بمكونات طازجة ووصفات شيف حصرية.'
                : 'Our most celebrated creations that keep our guests coming back for more.'}
            </p>
          </div>

          <a
            href="#menu"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
          >
            <span>{isAr ? 'عرض القائمة الكاملة' : 'View Full Menu'}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </a>
        </div>

        {/* Grid of Bestsellers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
