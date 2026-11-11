import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Tag, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';

interface CartDrawerProps {
  currency: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ currency }) => {
  const { language, t, isRTL } = useLanguage();
  const isAr = language === 'ar';
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    total,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await api.validateCoupon(couponCode, subtotal);
      if (res.valid) {
        applyCoupon(couponCode.toUpperCase(), res.discount_amount);
        setCouponCode('');
      } else {
        setCouponError(res.message);
      }
    } catch (err: any) {
      setCouponError(err.message || 'Failed to validate coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
      ></motion.div>

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: isRTL ? '-100%' : '100%' }}
        animate={{ x: 0 }}
        exit={{ x: isRTL ? '-100%' : '100%' }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md bg-slate-900 border-l rtl:border-l-0 rtl:border-r border-slate-800 text-white h-full shadow-2xl flex flex-col z-10"
      >
        
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="font-black text-lg text-white">
                {t('cart.title')}
              </h2>
              <span className="text-xs text-slate-400">
                {items.length} {isAr ? 'أصناف مضافة' : 'items in order'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="taste-btn text-xs font-bold text-slate-400 hover:text-rose-400 px-2 py-1 rounded-lg"
              >
                {t('cart.clear')}
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="taste-btn p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 divide-y divide-slate-800/80">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-16 h-16 rounded-full bg-slate-800/60 border border-slate-700/80 flex items-center justify-center text-slate-500">
                <ShoppingBag className="w-8 h-8 text-slate-500" />
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-base text-white">
                  {t('cart.empty')}
                </p>
                <p className="text-xs text-slate-400 max-w-xs">
                  {isAr ? 'تصفح قائمتنا الرقمية واختر ما تشتهيه من الأطباق المحضرة طازجة.' : 'Explore our chef-crafted menu to add your favorite gourmet dishes.'}
                </p>
              </div>
            </div>
          ) : (
            items.map(item => {
              const dishName = isAr ? item.product.name_ar : item.product.name;

              return (
                <div key={item.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    
                    {/* Dish image thumbnail */}
                    {item.product.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={dishName}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-800"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-sm text-white truncate">
                        {dishName}
                      </h4>
                      {item.selectedSize && (
                        <span className="text-xs text-blue-400 font-bold block">
                          {isAr ? (item.selectedSize.name_ar || item.selectedSize.name) : item.selectedSize.name}
                        </span>
                      )}
                      {item.selectedExtras.length > 0 && (
                        <div className="text-[11px] text-slate-400 pt-0.5">
                          {item.selectedExtras.map((e, idx) => (
                            <span key={idx} className="block">
                              + {isAr ? (e.extra_name_ar || e.extra_name) : e.extra_name} ({currency} {Number(e.extra_price || 0).toFixed(2)})
                            </span>
                          ))}
                        </div>
                      )}
                      {item.specialInstructions && (
                        <p className="text-[11px] text-slate-500 italic pt-0.5">
                          "{item.specialInstructions}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="taste-btn text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity & Item Total */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="taste-btn p-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black w-5 text-center text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="taste-btn p-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-black text-sm text-white">
                      {currency} {Number(item.totalPrice || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Calculations */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 bg-slate-950 border-t border-slate-800 space-y-4">
            
            {/* Promo Coupon Box */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-emerald-300">
                      {appliedCoupon} (-{currency} {Number(discountAmount || 0).toFixed(2)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="taste-btn text-xs font-bold text-rose-400 hover:underline"
                  >
                    {isAr ? 'إلغاء' : 'Remove'}
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder={t('cart.promoPlaceholder')}
                      className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="taste-btn px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {couponLoading ? '...' : t('cart.apply')}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{couponError}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
              <div className="flex items-center justify-between text-slate-400">
                <span>{t('cart.subtotal')}</span>
                <span className="font-bold text-white">{currency} {Number(subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>{t('cart.deliveryFee')}</span>
                <span className="font-bold text-white">{currency} {Number(deliveryFee || 0).toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>{t('cart.discount')}</span>
                  <span>-{currency} {Number(discountAmount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>{t('cart.total')}</span>
                <span className="text-blue-400 font-black">{currency} {Number(total || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleProceedCheckout}
              className="taste-btn w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm sm:text-base shadow-xl shadow-blue-600/30 cursor-pointer ring-1 ring-blue-400/40"
            >
              <span>{t('cart.checkout')}</span>
              {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>

          </div>
        )}

      </motion.div>
    </div>
  );
};
