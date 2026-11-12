import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Info, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, ProductSize, ProductExtra, CartExtraItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';

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
        const updated = { ...prev };
        delete updated[extra.name];
        return updated;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60"
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#0d2a1c] border border-black/15 dark:border-white/15 overflow-hidden z-10 flex flex-col max-h-[90vh] text-[#0d2a1c] dark:text-white"
      >
        {/* Header Photo */}
        <div className="relative aspect-[16/9] w-full bg-[#ebebeb] dark:bg-[#1a1a1a] shrink-0 overflow-hidden">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
            alt={name}
            className="w-full h-full object-cover"
          />

          <button
            onClick={onClose}
            aria-label="Close"
            className="taste-btn absolute top-4 right-4 rtl:right-auto rtl:left-4 w-10 h-10 flex items-center justify-center bg-white dark:bg-[#0d2a1c] text-[#0d2a1c] dark:text-white border border-black/20 dark:border-white/20 cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#0d2a1c]">
              {product.is_bestseller && <span>{isAr ? 'الأكثر طلباً' : 'Bestseller'}</span>}
              {product.is_vegetarian && <span className="text-emerald-700 dark:text-emerald-400">{isAr ? 'نباتي' : 'Vegetarian'}</span>}
              {product.is_spicy && <span>{isAr ? 'حار' : 'Spicy'}</span>}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-[#0d2a1c] dark:text-white">
              {name}
            </h2>
            <p className="text-sm sm:text-base text-[#5f6b64] dark:text-[#a3a3a3] leading-relaxed">
              {description}
            </p>
          </div>

          {ingredients && (
            <div className="p-4 bg-[#ebebeb] dark:bg-[#1c3629] border border-black/10 dark:border-white/10 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#0d2a1c] mt-0.5 shrink-0" />
              <div className="text-xs sm:text-sm text-[#5f6b64] dark:text-[#a3a3a3] leading-relaxed">
                <span className="font-medium text-[#0d2a1c] dark:text-white block mb-0.5">{t('product.ingredients')}</span>
                {ingredients}
              </div>
            </div>
          )}

          {/* Sizes Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-[#0d2a1c] dark:text-white">
                  {t('product.selectSize')}
                </label>
                <span className="text-xs text-[#0d2a1c] font-medium">{isAr ? 'مطلوب' : 'Required'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {product.sizes.map(size => {
                  const isSelected = selectedSize?.id === size.id;
                  const sizeName = isAr ? (size.name_ar || size.name) : size.name;

                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`taste-btn flex flex-col items-start p-3.5 border text-left rtl:text-right cursor-pointer ${
                        isSelected
                          ? 'bg-[#0d2a1c] dark:bg-white text-white dark:text-[#0d2a1c] border-[#0d2a1c] dark:border-white'
                          : 'bg-[#ebebeb] dark:bg-[#1c3629] border-black/12 dark:border-white/12 hover:border-black/40'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium">{sizeName}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#0d2a1c]" />}
                      </div>
                      <span className={`text-xs font-medium mt-1 tabular-nums ${isSelected ? 'text-white/80 dark:text-black/70' : 'text-[#5f6b64]'}`}>
                        {currency}{Number(size.price || 0).toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extras Selection */}
          {product.extras && product.extras.length > 0 && (
            <div className="space-y-3">
              <label className="block text-[13px] font-medium text-[#0d2a1c] dark:text-white">
                {t('product.chooseExtras')}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.extras.map(extra => {
                  const isSelected = (selectedExtras[extra.name] || 0) > 0;
                  const extraName = isAr ? (extra.name_ar || extra.name) : extra.name;

                  return (
                    <div
                      key={extra.id}
                      onClick={() => handleToggleExtra(extra)}
                      className={`taste-btn flex items-center justify-between p-3.5 border cursor-pointer ${
                        isSelected
                          ? 'bg-[#ebebeb] dark:bg-[#1a1a1a] border-[#0d2a1c]'
                          : 'bg-white dark:bg-[#0d2a1c] border-black/12 dark:border-white/12 hover:border-black/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 border flex items-center justify-center ${
                            isSelected ? 'bg-[#0d2a1c] border-[#0d2a1c] text-white' : 'border-black/30 dark:border-white/30'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm font-medium">{extraName}</span>
                      </div>
                      <span className="text-xs font-medium text-[#5f6b64] tabular-nums">
                        +{currency}{Number(extra.price || 0).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-[#0d2a1c] dark:text-white">
              {t('product.specialInstructions')}
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder={isAr ? 'أي طلبات إضافية؟ (مثال: بدون بصل، صلصة إضافية...)' : 'e.g. Extra napkins, no onions, dressing on side...'}
              className="w-full p-3.5 rounded-[2px] bg-[#ebebeb] dark:bg-[#1c3629] border border-black/15 dark:border-white/15 text-sm placeholder-[#5f6b64] focus:outline-none focus:border-[#0d2a1c]"
            />
          </div>
        </div>

        {/* Modal Sticky Footer */}
        <div className="p-4 sm:p-6 bg-[#ebebeb] dark:bg-[#1c3629] border-t border-black/12 dark:border-white/12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-[#0d2a1c] border border-black/15 dark:border-white/15 px-2 h-12">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="taste-btn p-2 text-[#0d2a1c] dark:text-white disabled:opacity-30 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-medium text-base w-6 text-center tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="taste-btn p-2 text-[#0d2a1c] dark:text-white cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="taste-btn flex-1 h-12 flex items-center justify-between px-6 bg-[#0d2a1c] hover:bg-[#1c3629] text-white font-medium text-sm sm:text-base cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>{t('product.addToCart')}</span>
            </span>
            <span className="font-medium tabular-nums">
              {currency}{Number(overallTotal || 0).toFixed(2)}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
