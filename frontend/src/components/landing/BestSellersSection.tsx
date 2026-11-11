import React from 'react';
import { Award, ArrowRight, ArrowLeft } from 'lucide-react';
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
    <section id="bestsellers" className="py-20 bg-slate-950 text-white border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>{isAr ? 'الأكثر طلباً وشهرة' : 'Customer Favorites'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {t('nav.bestsellers')}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              {isAr
                ? 'الأطباق الأكثر تميزاً وإقبالاً، محضرة يومياً بمكونات طازجة ووصفات شيف حصرية.'
                : 'Our most celebrated creations that keep our guests coming back for more.'}
            </p>
          </div>

          <a
            href="#menu"
            className="taste-btn inline-flex items-center gap-1.5 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
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
