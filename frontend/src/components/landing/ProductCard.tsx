import React from 'react';
import { Plus, Sliders, Clock, Flame } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Badge } from '../common/Badge';

interface ProductCardProps {
  product: Product;
  currency: string;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onOpenDetails
}) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const isAr = language === 'ar';

  const name = isAr ? product.name_ar : product.name;
  const description = isAr ? (product.description_ar || product.description) : product.description;
  const hasOptions = (product.sizes && product.sizes.length > 1) || (product.extras && product.extras.length > 0);

  const displayPrice = product.discount_price ?? product.base_price;
  const hasDiscount = product.discount_price !== undefined && product.discount_price !== null && product.discount_price < product.base_price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.is_available) return;
    
    if (hasOptions) {
      onOpenDetails(product);
    } else {
      addToCart(product, product.sizes?.[0], [], 1);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-blue-950/70 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {/* Badges in top-left */}
        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col gap-1.5 z-10">
          {product.is_bestseller && <Badge type="bestseller" />}
          {product.is_featured && <Badge type="featured" />}
          {product.is_new && <Badge type="new" />}
          {product.is_vegetarian && <Badge type="vegetarian" />}
          {product.is_spicy && <Badge type="spicy" />}
        </div>

        {/* Discount Tag */}
        {hasDiscount && (
          <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 z-10 px-2.5 py-1 rounded-full bg-blue-600 text-white font-black text-xs shadow-md">
            {Math.round(((product.base_price - (product.discount_price || 0)) / product.base_price) * 100)}% {isAr ? 'خصم' : 'OFF'}
          </div>
        )}

        {/* Sold out overlay */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="px-4 py-1.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 font-extrabold text-xs tracking-wider uppercase shadow-lg">
              {t('product.soldOut')}
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-5 justify-between">
        <div className="space-y-2">
          
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {name}
            </h3>
          </div>

          {description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Quick info pills */}
          <div className="flex items-center gap-3 pt-1 text-[11px] font-medium text-slate-400 dark:text-slate-400">
            {product.prep_time_mins && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>{product.prep_time_mins} {t('product.mins')}</span>
              </span>
            )}
            {product.calories && (
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-blue-500" />
                <span>{product.calories} kcal</span>
              </span>
            )}
            {product.sizes && product.sizes.length > 1 && (
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {product.sizes.length} {isAr ? 'أحجام' : 'sizes'}
              </span>
            )}
          </div>
        </div>

        {/* Footer: Price & Add Button in Dark Blue & White style */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-blue-950/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              {product.sizes && product.sizes.length > 1 ? (isAr ? 'يبدأ من' : 'From') : (isAr ? 'السعر' : 'Price')}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-black text-xl text-slate-900 dark:text-white">
                {currency} {displayPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  {currency} {product.base_price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            disabled={!product.is_available}
            onClick={handleQuickAdd}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer ${
              !product.is_available
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : hasOptions
                ? 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-blue-600 dark:hover:bg-blue-600'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            {hasOptions ? (
              <>
                <Sliders className="w-3.5 h-3.5" />
                <span>{t('product.customize')}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{t('product.addToCart')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
