import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Clock, Flame, Info, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      ></motion.div>

      {/* Modal Dialog Card (Taste-Skill) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        
        {/* Header Photo */}
        <div className="relative aspect-16/9 w-full bg-slate-950 shrink-0 overflow-hidden">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
            alt={name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="taste-btn absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2.5 rounded-full bg-slate-950/80 text-white hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700 z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badges */}
          <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 flex flex-wrap gap-2 z-10">
            {product.is_bestseller && <Badge type="bestseller" />}
            {product.is_featured && <Badge type="featured" />}
            {product.is_new && <Badge type="new" />}
            {product.is_vegetarian && <Badge type="vegetarian" />}
            {product.is_spicy && <Badge type="spicy" />}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-white">
          
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {name}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Ingredients Note */}
          {ingredients && (
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white block mb-0.5">{t('product.ingredients')}:</span>
                {ingredients}
              </div>
            </div>
          )}

          {/* Sizes Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {t('product.selectSize')}
                </label>
                <span className="text-[11px] text-blue-400 font-bold">{isAr ? 'مطلوب' : 'Required'}</span>
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
                      className={`taste-btn flex flex-col items-start p-3.5 rounded-2xl border text-left rtl:text-right cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 shadow-sm ring-1 ring-blue-400/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-extrabold text-white">
                          {sizeName}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                      <span className="text-xs font-black text-blue-300 mt-1">
                        {currency} {Number(size.price || 0).toFixed(2)}
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
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
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
                      className={`taste-btn flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 shadow-sm ring-1 ring-blue-400/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-xs font-bold text-white">
                          {extraName}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-blue-300">
                        +{currency} {Number(extra.price || 0).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
              {t('product.specialInstructions')}
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder={isAr ? 'أي طلبات إضافية؟ (مثال: بدون بصل، صلصة إضافية...)' : 'e.g. Extra napkins, no onions, dressing on side...'}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

        </div>

        {/* Modal Sticky Footer with Quantity & Add to Cart */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-2xl">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="taste-btn p-1.5 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-black text-base w-6 text-center text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="taste-btn p-1.5 rounded-lg text-slate-300 hover:text-white cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="taste-btn flex-1 flex items-center justify-between px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm sm:text-base shadow-xl shadow-blue-600/30 ring-1 ring-blue-400/40 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-white" />
              <span>{t('product.addToCart')}</span>
            </span>
            <span className="font-black text-white">
              {currency} {Number(overallTotal || 0).toFixed(2)}
            </span>
          </button>

        </div>
      </motion.div>
    </div>
  );
};
