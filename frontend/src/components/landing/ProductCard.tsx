import React from 'react';
import { Plus, Sliders, Clock } from 'lucide-react';
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
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: 0.42,
        delay: Math.min(index * 0.04, 0.28),
        ease: [0.22, 1, 0.36, 1]
      }}
      onClick={() => onOpenDetails(product)}
      className="taste-card group relative flex flex-col justify-between bg-white dark:bg-[#1c3629] border border-[#0d2a1c]/12 dark:border-white/15 overflow-hidden cursor-pointer select-none"
    >
      {/* Square-cornered 4:3 photograph frame with 1.03 zoom on hover */}
      <div className="taste-photo-frame relative aspect-[4/3] w-full bg-[#ebebeb] dark:bg-[#0d2a1c]">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {hasDiscount && (
          <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 z-10 px-2.5 py-1 bg-[#f6e016] text-[#0d2a1c] font-semibold text-xs tabular-nums">
            -{Math.round(((product.base_price - (product.discount_price || 0)) / product.base_price) * 100)}%
          </span>
        )}

        {!product.is_available && (
          <div className="absolute inset-0 bg-[#f7f7f7]/85 dark:bg-[#0d2a1c]/85 flex items-center justify-center z-20">
            <span className="px-4 py-1.5 bg-[#0d2a1c] text-[#f7f7f7] font-medium text-xs uppercase tracking-wider">
              {t('product.soldOut')}
            </span>
          </div>
        )}
      </div>

      {/* Product Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#5f6b64] dark:text-[#97a39c]">
            <div className="flex items-center gap-2">
              {product.is_bestseller && (
                <span className="px-2 py-0.5 bg-[#f6e016] text-[#0d2a1c] font-semibold">
                  {isAr ? 'الأكثر طلباً' : 'Bestseller'}
                </span>
              )}
              {product.is_vegetarian && <span>{isAr ? 'نباتي' : 'Veg'}</span>}
              {product.is_spicy && <span>{isAr ? 'حار' : 'Spicy'}</span>}
            </div>
            {product.prep_time_mins && (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Clock className="w-3 h-3" />
                {product.prep_time_mins}m
              </span>
            )}
          </div>

          <h3 className="font-display text-xl text-[#0d2a1c] dark:text-[#f7f7f7] group-hover:underline underline-offset-4 decoration-[#f6e016] decoration-2 line-clamp-1">
            {name}
          </h3>

          <p className="text-sm text-[#5f6b64] dark:text-[#97a39c] line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer: Tabular Price & Add Button */}
        <div className="pt-4 border-t border-[#0d2a1c]/10 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-lg font-semibold text-[#0d2a1c] dark:text-[#f7f7f7]">
              {currency}{Number(displayPrice || 0).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#5f6b64] dark:text-[#97a39c] line-through">
                {currency}{Number(product.base_price || 0).toFixed(2)}
              </span>
            )}
          </div>

          {product.is_available && (
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
          )}
        </div>
      </div>
    </motion.article>
  );
};
