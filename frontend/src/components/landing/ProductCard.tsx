import React from 'react';
import { Plus, Sliders } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  currency: string;
  onOpenDetails: (product: Product) => void;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onOpenDetails,
  index = 0
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
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.03, 0.2),
        ease: [0.22, 1, 0.36, 1]
      }}
      onClick={() => onOpenDetails(product)}
      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white dark:bg-[#0d2a1c] hover:bg-[#f7f7f7] dark:hover:bg-[#1c3629] transition-colors cursor-pointer select-none"
    >
      {/* Left: Square Thumbnail + Dish Info */}
      <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
        <div className="taste-photo-frame w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#ebebeb] dark:bg-[#1c3629] border border-[#0d2a1c]/10 dark:border-white/10">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg sm:text-xl text-[#0d2a1c] dark:text-[#f7f7f7] group-hover:underline underline-offset-4 decoration-[#f6e016] decoration-2">
              {name}
            </h3>
            {product.is_bestseller && (
              <span className="px-2 py-0.5 bg-[#f6e016] text-[#0d2a1c] text-[11px] font-semibold">
                {isAr ? 'الأكثر طلباً' : 'Bestseller'}
              </span>
            )}
            {product.is_vegetarian && (
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                {isAr ? 'نباتي' : 'Veg'}
              </span>
            )}
            {product.is_spicy && (
              <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                {isAr ? 'حار' : 'Spicy'}
              </span>
            )}
          </div>

          <p className="text-sm text-[#5f6b64] dark:text-[#97a39c] line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Right: Price + Simple Action Button */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#0d2a1c]/10 dark:border-white/10 shrink-0">
        <div className="flex items-baseline gap-2 tabular-nums">
          <span className="text-base sm:text-lg font-semibold text-[#0d2a1c] dark:text-[#f7f7f7]">
            {currency}{Number(displayPrice || 0).toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-[#5f6b64] dark:text-[#97a39c] line-through">
              {currency}{Number(product.base_price || 0).toFixed(2)}
            </span>
          )}
        </div>

        {product.is_available ? (
          <button
            onClick={handleQuickAdd}
            className="taste-btn h-10 px-4 flex items-center gap-1.5 bg-[#0d2a1c] dark:bg-[#f6e016] hover:bg-[#1c3629] dark:hover:bg-[#e5cf12] text-[#f7f7f7] dark:text-[#0d2a1c] font-medium text-sm cursor-pointer"
          >
            {hasOptions ? (
              <>
                <Sliders className="w-3.5 h-3.5" />
                <span>{isAr ? 'تخصيص' : 'Customize'}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة' : 'Add'}</span>
              </>
            )}
          </button>
        ) : (
          <span className="px-3 py-1.5 bg-[#ebebeb] dark:bg-[#1c3629] text-[#5f6b64] text-xs font-medium">
            {t('product.soldOut')}
          </span>
        )}
      </div>
    </motion.article>
  );
};
