import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
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
    } catch (err: unknown) {
      setCouponError(err instanceof Error ? err.message : 'Failed to validate coupon');
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/60"
      />

      <motion.div
        initial={{ x: isRTL ? '-100%' : '100%' }}
        animate={{ x: 0 }}
        exit={{ x: isRTL ? '-100%' : '100%' }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md bg-white dark:bg-[#0d2a1c] border-l rtl:border-l-0 rtl:border-r border-black/15 dark:border-white/15 text-[#0d2a1c] dark:text-white h-full flex flex-col z-10"
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-black/12 dark:border-white/12 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-[#0d2a1c] dark:text-white">
              {t('cart.title')}
            </h2>
            <span className="text-xs text-[#5f6b64] dark:text-[#a3a3a3] tabular-nums">
              {items.length} {isAr ? 'أصناف مضافة' : 'items in order'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="taste-btn text-xs font-medium text-[#5f6b64] hover:text-[#0d2a1c] px-2.5 py-1.5 cursor-pointer"
              >
                {t('cart.clear')}
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart"
              className="taste-btn w-10 h-10 flex items-center justify-center border border-black/15 dark:border-white/15 text-[#0d2a1c] dark:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 divide-y divide-black/10 dark:divide-white/10">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-14 h-14 bg-[#ebebeb] dark:bg-[#1c3629] border border-black/12 dark:border-white/12 flex items-center justify-center text-[#5f6b64]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-display text-xl text-[#0d2a1c] dark:text-white">
                  {t('cart.empty')}
                </p>
                <p className="text-sm text-[#5f6b64] dark:text-[#a3a3a3] max-w-xs">
                  {isAr
                    ? 'تصفح قائمة مطعم وكافيه خطاب واختر أطباقك المفضلة.'
                    : 'Explore the Khatab Restaurant & Café menu to add your favorites.'}
                </p>
              </div>
            </div>
          ) : (
            items.map(item => {
              const dishName = isAr ? item.product.name_ar : item.product.name;

              return (
                <div key={item.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    {item.product.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={dishName}
                        className="w-14 h-14 object-cover shrink-0 border border-black/12 dark:border-white/12"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-[#0d2a1c] dark:text-white truncate">
                        {dishName}
                      </h4>
                      {item.selectedSize && (
                        <span className="text-xs text-[#0d2a1c] font-medium block">
                          {isAr ? (item.selectedSize.name_ar || item.selectedSize.name) : item.selectedSize.name}
                        </span>
                      )}
                      {(item.selectedExtras?.length ?? 0) > 0 && (
                        <div className="text-xs text-[#5f6b64] dark:text-[#a3a3a3] pt-0.5">
                          {item.selectedExtras?.map((e, idx) => (
                            <span key={idx} className="block tabular-nums">
                              + {isAr ? (e.extra_name_ar || e.extra_name) : e.extra_name} ({currency}{Number(e.extra_price || 0).toFixed(2)})
                            </span>
                          ))}
                        </div>
                      )}
                      {item.specialInstructions && (
                        <p className="text-xs text-[#5f6b64] italic pt-0.5">
                          “{item.specialInstructions}”
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                      className="taste-btn text-[#5f6b64] hover:text-[#0d2a1c] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 bg-[#ebebeb] dark:bg-[#1c3629] border border-black/12 dark:border-white/12 px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="taste-btn p-1 text-[#0d2a1c] dark:text-white cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-medium w-5 text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="taste-btn p-1 text-[#0d2a1c] dark:text-white cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-medium text-sm tabular-nums">
                      {currency}{Number(item.totalPrice || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Calculations */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 bg-[#ebebeb] dark:bg-[#1c3629] border-t border-black/12 dark:border-white/12 space-y-4">
            {/* Promo Coupon Box */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-white dark:bg-[#0d2a1c] border border-black/15 dark:border-white/15 text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0d2a1c]" />
                    <span className="font-medium tabular-nums">
                      {appliedCoupon} (-{currency}{Number(discountAmount || 0).toFixed(2)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="taste-btn text-xs font-medium text-[#0d2a1c] hover:underline cursor-pointer"
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
                      className="flex-1 h-10 px-3.5 rounded-[2px] bg-white dark:bg-[#0d2a1c] border border-black/15 dark:border-white/15 text-xs uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-none focus:border-[#0d2a1c]"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="taste-btn h-10 px-4 bg-[#0d2a1c] dark:bg-white text-white dark:text-[#0d2a1c] font-medium text-xs disabled:opacity-50 cursor-pointer"
                    >
                      {couponLoading ? '...' : t('cart.apply')}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-[#0d2a1c] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{couponError}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm border-t border-black/10 dark:border-white/10 pt-3 tabular-nums">
              <div className="flex items-center justify-between text-[#5f6b64] dark:text-[#a3a3a3]">
                <span>{t('cart.subtotal')}</span>
                <span className="font-medium text-[#0d2a1c] dark:text-white">{currency}{Number(subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[#5f6b64] dark:text-[#a3a3a3]">
                <span>{t('cart.deliveryFee')}</span>
                <span className="font-medium text-[#0d2a1c] dark:text-white">{currency}{Number(deliveryFee || 0).toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-[#0d2a1c] font-medium">
                  <span>{t('cart.discount')}</span>
                  <span>-{currency}{Number(discountAmount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-medium text-[#0d2a1c] dark:text-white pt-2 border-t border-black/10 dark:border-white/10">
                <span>{t('cart.total')}</span>
                <span className="text-lg font-medium">{currency}{Number(total || 0).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedCheckout}
              className="taste-btn w-full h-12 flex items-center justify-between px-6 bg-[#0d2a1c] hover:bg-[#1c3629] text-white font-medium text-sm sm:text-base cursor-pointer"
            >
              <span>{t('cart.checkout')}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
