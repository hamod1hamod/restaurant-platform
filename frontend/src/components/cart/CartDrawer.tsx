import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Tag, Check, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-900 border-l rtl:border-l-0 rtl:border-r border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h2 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-50">
                {t('cart.title')}
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1"
                >
                  {isAr ? 'تفريغ' : 'Clear'}
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200">
                  {t('cart.empty')}
                </h3>
                <p className="text-xs text-zinc-400">
                  {isAr ? 'أضف وجباتك المفضلة من القائمة لتراها هنا.' : 'Add your desired dishes from the menu to get started.'}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-600 text-white font-bold text-xs"
                >
                  {t('cart.startBrowsing')}
                </button>
              </div>
            ) : (
              items.map(item => {
                const prodName = isAr ? item.product.name_ar : item.product.name;
                const sizeName = item.selectedSize ? (isAr ? item.selectedSize.name_ar : item.selectedSize.name) : null;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                          {prodName}
                        </h4>
                        {sizeName && (
                          <span className="inline-block text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-md">
                            {sizeName}
                          </span>
                        )}
                        {item.selectedExtras.length > 0 && (
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 pt-0.5">
                            {item.selectedExtras.map((e, idx) => (
                              <span key={idx} className="block">
                                + {isAr ? (e.extra_name_ar || e.extra_name) : e.extra_name} ({currency} {e.extra_price.toFixed(2)})
                              </span>
                            ))}
                          </div>
                        )}
                        {item.specialInstructions && (
                          <p className="text-[11px] text-zinc-400 italic pt-1">
                            "{item.specialInstructions}"
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200/50 dark:border-zinc-700/50">
                      <div className="flex items-center gap-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-xl px-2 py-1 shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-zinc-500 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black w-5 text-center text-zinc-900 dark:text-zinc-50">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-zinc-500 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-black text-sm text-zinc-900 dark:text-zinc-50">
                        {currency} {item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Calculations */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
              
              {/* Promo Coupon Box */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">
                        {appliedCoupon} (-{currency} {discountAmount.toFixed(2)})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-500 hover:underline"
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
                        className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-700 hover:bg-orange-600 text-white font-bold text-xs transition-colors disabled:opacity-50"
                      >
                        {couponLoading ? '...' : t('cart.apply')}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{couponError}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs border-t border-zinc-200 dark:border-zinc-800 pt-3">
                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-bold">{currency} {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>{t('cart.deliveryFee')}</span>
                  <span className="font-bold">{currency} {deliveryFee.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>{t('cart.discount')}</span>
                    <span>-{currency} {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base font-black text-zinc-900 dark:text-zinc-50 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span>{t('cart.total')}</span>
                  <span className="text-orange-600 dark:text-orange-400">{currency} {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm sm:text-base shadow-lg shadow-orange-600/25 active:scale-98 transition-all cursor-pointer"
              >
                <span>{t('cart.checkoutBtn')}</span>
                {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
