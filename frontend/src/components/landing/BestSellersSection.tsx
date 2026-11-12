import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
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
    <section
      id="bestsellers"
      className="py-20 lg:py-24 bg-white dark:bg-[#0d2a1c] text-[#0d2a1c] dark:text-[#f5f5f5] border-b border-black/12 dark:border-white/12"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#0d2a1c] dark:text-white">
              {t('nav.bestsellers')}
            </h2>
            <p className="text-base text-[#5f6b64] dark:text-[#a3a3a3] mt-1.5 max-w-xl">
              {isAr
                ? 'الأطباق الأكثر طلباً في مطعم وكافيه خطاب، محضرة طازجة يومياً.'
                : 'Our most requested plates and espresso pours, prepared fresh daily.'}
            </p>
          </div>

          <a
            href="#menu"
            className="taste-link text-[15px] font-medium text-[#0d2a1c] shrink-0"
          >
            <span>{isAr ? 'عرض القائمة الكاملة' : 'Full menu'}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </a>
        </div>

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
