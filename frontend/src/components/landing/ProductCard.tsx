import React, { useState } from 'react';
import { Plus, Sliders, Sparkles } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);

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

  const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
  const dishImage = product.image_url || fallbackImage;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.03, 0.25),
        ease: [0.22, 1, 0.36, 1]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenDetails(product)}
      className="group relative flex items-start justify-between gap-4 sm:gap-6 p-4 sm:p-5 bg-white dark:bg-[#0d2a1c] hover:bg-[#fafaf7] dark:hover:bg-[#133825] transition-colors cursor-pointer select-none"
    >
      {/* Left/Content: Dish Info (Title, Badges, Description, Quick Add) */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg sm:text-xl font-medium text-[#0d2a1c] dark:text-[#f7f7f7] group-hover:underline underline-offset-4 decoration-[#f6e016] decoration-2 transition-colors">
            {name}
          </h3>

          {product.is_bestseller && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f6e016] text-[#0d2a1c] text-[11px] font-semibold tracking-wide">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{isAr ? 'الأكثر طلباً' : 'Bestseller'}</span>
            </span>
          )}

          {product.is_vegetarian && (
            <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 border border-emerald-200/70 dark:border-emerald-800/60">
              {isAr ? 'نباتي' : 'Veg'}
            </span>
          )}

          {product.is_spicy && (
            <span className="text-[11px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 border border-amber-200/70 dark:border-amber-800/60">
              {isAr ? 'حار' : 'Spicy'}
            </span>
          )}
        </div>

        {description && (
          <p className="text-sm text-[#5f6b64] dark:text-[#97a39c] line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Quick Add / Customize Action Button */}
        <div className="pt-1.5">
          {product.is_available ? (
            <button
              onClick={handleQuickAdd}
              className="taste-btn h-9 px-3.5 inline-flex items-center gap-1.5 bg-[#0d2a1c] dark:bg-[#f6e016] hover:bg-[#1c3629] dark:hover:bg-[#e5cf12] text-[#f7f7f7] dark:text-[#0d2a1c] font-medium text-xs sm:text-sm cursor-pointer transition-transform active:scale-95 shadow-sm"
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
            <span className="inline-block px-3 py-1 bg-[#ebebeb] dark:bg-[#1c3629] text-[#5f6b64] text-xs font-medium">
              {t('product.soldOut')}
            </span>
          )}
        </div>
      </div>

      {/* Right: PRICE DISPLAY AT TOP, ANIMATED DISH IMAGE BELOW IT */}
      <div className="flex flex-col items-end shrink-0 gap-2">
        {/* 1. Price prominently above */}
        <div className="flex items-baseline gap-1.5 tabular-nums">
          <span className="text-base sm:text-lg font-bold text-[#0d2a1c] dark:text-[#f7f7f7] tracking-tight">
            {currency}{Number(displayPrice || 0).toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-[#5f6b64] dark:text-[#97a39c] line-through">
              {currency}{Number(product.base_price || 0).toFixed(2)}
            </span>
          )}
        </div>

        {/* 2. Image of the dish BELOW the price, with smooth taste-skill animations */}
        <div className="relative overflow-hidden w-24 h-20 sm:w-32 sm:h-24 bg-[#ebebeb] dark:bg-[#1c3629] border border-[#0d2a1c]/15 dark:border-white/15 shadow-sm">
          {/* Animated dish image */}
          <motion.img
            src={dishImage}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.08 : [1, 1.03, 1],
              y: isHovered ? -1 : [0, -1.5, 0],
            }}
            transition={{
              scale: isHovered
                ? { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                : { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: (index % 4) * 0.5 },
              y: isHovered
                ? { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                : { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: (index % 4) * 0.5 }
            }}
          />

          {/* Micro-interaction highlight sheen on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d2a1c]/25 via-transparent to-white/15 ring-1 ring-inset ring-[#f6e016]/40"
          />

          {/* Border hairline */}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10" />
        </div>
      </div>
    </motion.article>
  );
};
