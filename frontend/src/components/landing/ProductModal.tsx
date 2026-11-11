import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Clock, Flame, Info, ShoppingBag } from 'lucide-react';
import { Product, ProductSize, ProductExtra, CartExtraItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Badge } from '../common/Badge';

interface ProductModalProps {
  product: Product | null;
  currency: string;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  currency,
  onClose
}) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const isAr = language === 'ar';

  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(undefined);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  useEffect(() => {
    if (product) {
      // Find default size or first size
      const defaultSize = product.sizes?.find(s => s.is_default) || product.sizes?.[0];
      setSelectedSize(defaultSize);
      setSelectedExtras({});
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [product]);

  if (!product) return null;

  const name = isAr ? product.name_ar : product.name;
  const description = isAr ? (product.description_ar || product.description) : product.description;
  const ingredients = isAr ? (product.ingredients_ar || product.ingredients) : product.ingredients;

  // Calculate live total price
  const basePrice = selectedSize ? selectedSize.price : (product.discount_price ?? product.base_price);
  
  let extrasTotal = 0;
  if (product.extras) {
    product.extras.forEach(extra => {
      const qty = selectedExtras[extra.name] || 0;
      extrasTotal += extra.price * qty;
    });
  }

  const unitTotal = basePrice + extrasTotal;
  const overallTotal = unitTotal * quantity;

  const handleToggleExtra = (extra: ProductExtra) => {
    setSelectedExtras(prev => {
      const current = prev[extra.name] || 0;
      if (current > 0) {
        const copy = { ...prev };
        delete copy[extra.name];
        return copy;
      } else {
        return { ...prev, [extra.name]: 1 };
      }
    });
  };

  const handleAddToCart = () => {
    const extrasList: CartExtraItem[] = [];
    if (product.extras) {
      product.extras.forEach(extra => {
        const qty = selectedExtras[extra.name] || 0;
        if (qty > 0) {
          extrasList.push({
            extra_name: extra.name,
            extra_name_ar: extra.name_ar,
            extra_price: extra.price,
            quantity: qty
          });
        }
      });
    }

    addToCart(product, selectedSize, extrasList, quantity, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 shadow-md backdrop-blur-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Product Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          <div className="absolute bottom-4 left-6 rtl:left-auto rtl:right-6 flex flex-wrap gap-2">
            {product.is_bestseller && <Badge type="bestseller" size="md" />}
            {product.is_featured && <Badge type="featured" size="md" />}
            {product.is_vegetarian && <Badge type="vegetarian" size="md" />}
            {product.is_spicy && <Badge type="spicy" size="md" />}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Title & Description */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
              {name}
            </h2>
            {description && (
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {description}
              </p>
            )}

            {/* Calories & Prep time */}
            <div className="flex items-center gap-4 pt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {product.prep_time_mins && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{product.prep_time_mins} {t('product.mins')}</span>
                </span>
              )}
              {product.calories && (
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>{product.calories} kcal</span>
                </span>
              )}
            </div>
          </div>

          {/* Ingredients list */}
          {ingredients && (
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                <Info className="w-4 h-4 text-orange-500" />
                <span>{t('product.ingredients')}</span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400">
                {ingredients}
              </p>
            </div>
          )}

          {/* Sizes Options */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                {t('product.selectSize')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {product.sizes.map(size => {
                  const isSelected = selectedSize?.name === size.name;
                  const sizeName = isAr ? size.name_ar : size.name;
                  return (
                    <button
                      key={size.name}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`flex flex-col p-3 rounded-2xl border text-left rtl:text-right transition-all cursor-pointer ${
                        isSelected
                          ? 'border-orange-600 bg-orange-50/60 dark:bg-orange-950/30 ring-2 ring-orange-500'
                          : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          {sizeName}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-orange-600" />}
                      </div>
                      <span className="text-xs font-black text-orange-600 dark:text-orange-400 mt-1">
                        {currency} {size.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional Extras */}
          {product.extras && product.extras.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                {t('product.extrasOptions')}
              </label>
              <div className="space-y-2">
                {product.extras.map(extra => {
                  const isChecked = !!selectedExtras[extra.name];
                  const extraName = isAr ? extra.name_ar : extra.name;
                  return (
                    <div
                      key={extra.name}
                      onClick={() => handleToggleExtra(extra)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors cursor-pointer ${
                        isChecked
                          ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-orange-600 border-orange-600 text-white'
                              : 'border-zinc-300 dark:border-zinc-600'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                          {extraName}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                        +{currency} {extra.price.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300">
              {t('product.specialInstructions')}
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder={isAr ? 'أي طلبات إضافية؟' : 'e.g. Extra napkins, no pickles, sauce on side...'}
              className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

        </div>

        {/* Modal Sticky Footer with Quantity & Add to Cart Button */}
        <div className="p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-2xl shadow-xs">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-1 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-black text-base w-6 text-center text-zinc-900 dark:text-zinc-50">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="p-1 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart with live price */}
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-between px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-600/25 active:scale-98 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>{t('product.addToCart')}</span>
            </span>
            <span className="font-black">
              {currency} {overallTotal.toFixed(2)}
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};
