import React, { useState } from 'react';
import {
  X, Bike, Store, Utensils, CreditCard, Banknote, CheckCircle,
  AlertCircle, ShieldCheck, Printer, ArrowRight, ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { Order } from '../../types';

interface CheckoutModalProps {
  currency: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ currency }) => {
  const { language, t, isRTL } = useLanguage();
  const isAr = language === 'ar';
  const {
    items,
    subtotal,
    deliveryFee,
    discountAmount,
    appliedCoupon,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen
  } = useCart();

  const [orderType, setOrderType] = useState<'delivery' | 'pickup' | 'dine_in'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash_on_delivery');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const activeDeliveryFee = orderType === 'delivery' ? deliveryFee : 0;
  const currentTotal = Math.max(0, subtotal + activeDeliveryFee - discountAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setOrderError(isAr ? 'يرجى إدخال الاسم ورقم الهاتف' : 'Please provide name and phone number');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setOrderError(isAr ? 'يرجى إدخال عنوان التوصيل' : 'Please provide delivery address');
      return;
    }

    if (orderType === 'dine_in' && !tableNumber.trim()) {
      setOrderError(isAr ? 'يرجى إدخال رقم الطاولة' : 'Please provide table number');
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);

    try {
      const orderData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || undefined,
        delivery_address: orderType === 'delivery' ? deliveryAddress : (orderType === 'dine_in' ? `Table #${tableNumber}` : 'Store Pickup'),
        order_type: orderType,
        table_number: orderType === 'dine_in' ? tableNumber : undefined,
        notes: notes || undefined,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon || undefined,
        items: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_name_ar: item.product.name_ar,
          size_name: item.selectedSize?.name,
          unit_price: item.unitPrice,
          quantity: item.quantity,
          total_price: item.totalPrice,
          special_instructions: item.specialInstructions,
          extras: item.selectedExtras.map(e => ({
            extra_name: e.extra_name,
            extra_price: e.extra_price,
            quantity: e.quantity
          }))
        }))
      };

      const res = await api.createOrder(orderData);
      setCreatedOrder(res);
      clearCart();
    } catch (err: any) {
      setOrderError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCreatedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="font-extrabold text-xl text-zinc-900 dark:text-zinc-50">
            {createdOrder ? t('checkout.successTitle') : t('checkout.title')}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {createdOrder ? (
          /* Order Confirmation Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-slate-400">
                {t('checkout.orderNumberIs')}
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 py-3 px-6 rounded-2xl border border-blue-200 dark:border-blue-900 inline-block shadow-sm">
                {createdOrder.order_number}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 pt-2 max-w-md mx-auto">
                {t('checkout.trackOrderMessage')}
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-blue-950/60 text-left rtl:text-right space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50 font-bold">
                <span>{isAr ? 'العميل:' : 'Customer:'}</span>
                <span>{createdOrder.customer_name} ({createdOrder.customer_phone})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                <span>{isAr ? 'نوع الطلب:' : 'Order Type:'}</span>
                <span className="font-bold uppercase">{createdOrder.order_type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                <span>{isAr ? 'طريقة الدفع:' : 'Payment:'}</span>
                <span className="font-bold">{createdOrder.payment_method} ({createdOrder.payment_status})</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-black text-slate-900 dark:text-white pt-1">
                <span>{t('cart.total')}:</span>
                <span className="text-blue-600 dark:text-blue-400">{currency} {createdOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              {t('checkout.done')}
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Order Type Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                {t('checkout.orderType')}
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    orderType === 'delivery'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>{t('checkout.delivery')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    orderType === 'pickup'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>{t('checkout.pickup')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('dine_in')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    orderType === 'dine_in'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>{t('checkout.dineIn')}</span>
                </button>
              </div>
            </div>

            {/* Customer Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  {t('checkout.fullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder={isAr ? 'أحمد منصور' : 'John Doe'}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  {t('checkout.phone')} *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder={isAr ? '0501234567' : '+1 555-0199'}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {t('checkout.email')}
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Address or Table Number depending on order type */}
            {orderType === 'delivery' && (
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  {t('checkout.deliveryAddress')} *
                </label>
                <textarea
                  rows={2}
                  required
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder={isAr ? 'الشارع، رقم المبنى، الشقة، علامة مميزة' : 'Street name, building #, floor / apt, landmarks'}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}

            {orderType === 'dine_in' && (
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  {t('checkout.tableNumber')} *
                </label>
                <input
                  type="text"
                  required
                  value={tableNumber}
                  onChange={e => setTableNumber(e.target.value)}
                  placeholder={isAr ? 'مثال: طاولة ٧' : 'e.g. Table 7'}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}

            {/* Order notes */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {t('checkout.notes')}
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={isAr ? 'اتصل عند الوصول، اترك الطلب عند الباب...' : 'Ring doorbell, leave at door...'}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                {t('checkout.paymentMethod')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left rtl:text-right transition-all cursor-pointer ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                      {t('checkout.cashOnDelivery')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isAr ? 'الدفع نقداً عند استلام الوجبة' : 'Pay with cash upon receipt'}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left rtl:text-right transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                      {t('checkout.card')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isAr ? 'فيزا، ماستركارد، مدى' : 'Visa, MasterCard, Amex'}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {orderError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            {/* Total Summary & Submit */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-bold block">
                  {t('cart.total')}
                </span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                  {currency} {currentTotal.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-500 hover:to-indigo-700 text-white font-black text-sm shadow-lg shadow-blue-900/30 active:scale-98 transition-all cursor-pointer disabled:opacity-50 ring-1 ring-blue-400/30"
              >
                <span>{isSubmitting ? '...' : t('checkout.submitOrder')}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
