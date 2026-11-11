import React from 'react';
import { Plus, Sliders, Clock, Flame, Sparkles, Leaf, Info } from 'lucide-react';
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
      className="taste-card group relative flex flex-col justify-between rounded-3xl bg-slate-900/90 border border-slate-800/80 overflow-hidden shadow-sm cursor-pointer select-none"
    >
      {/* Top Image Container with Taste-Skill zoom frame */}
      <div className="taste-photo-frame relative aspect-4/3 w-full overflow-hidden bg-slate-800">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient shadow for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity"></div>

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
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="px-4 py-1.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 font-extrabold text-xs tracking-wider uppercase shadow-lg">
              {t('product.soldOut')}
            </span>
          </div>
        )}

        {/* Quick View hint on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <span className="px-3 py-1.5 rounded-full bg-slate-900/90 text-white border border-slate-700 text-xs font-bold backdrop-blur-md shadow-lg">
            {isAr ? 'عرض التفاصيل والإضافات' : 'View Details & Extras'}
          </span>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-1">
              {name}
            </h3>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Ingredients & Prep metadata */}
        {product.ingredients && (
          <div className="text-[11px] text-slate-400 line-clamp-1 flex items-center gap-1.5 pt-1">
            <span className="font-semibold text-slate-400">{isAr ? 'المكونات:' : 'Ingredients:'}</span>
            <span>{isAr ? (product.ingredients_ar || product.ingredients) : product.ingredients}</span>
          </div>
        )}

        {/* Footer: Price & Add Button */}
        <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              {product.sizes && product.sizes.length > 1 ? (isAr ? 'يبدأ من' : 'From') : (isAr ? 'السعر' : 'Price')}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-black text-xl text-white">
                {currency} {Number(displayPrice || 0).toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  {currency} {Number(product.base_price || 0).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {product.is_available && (
            <button
              onClick={handleQuickAdd}
              className="taste-btn flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-900/30 ring-1 ring-blue-400/30 cursor-pointer"
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
    </div>
  );
};
