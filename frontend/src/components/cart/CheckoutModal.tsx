import React, { useState } from 'react';
import {
  X, Bike, Store, Utensils, CreditCard, Banknote, CheckCircle, AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { Order } from '../../types';

interface CheckoutModalProps {
  currency: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ currency }) => {
  const { language, t } = useLanguage();
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
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [tableNumber, setTableNumber] = useState('');
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
      setOrderError(isAr ? 'يرجى إدخال عنوان التوصيل بالتفصيل' : 'Please provide delivery address');
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);

    const payload = {
      order_type: orderType,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      delivery_address: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
      table_number: orderType === 'dine_in' ? tableNumber.trim() : undefined,
      payment_method: paymentMethod,
      coupon_code: appliedCoupon || undefined,
      items: items.map(item => ({
        product_id: item.product.id,
        size_id: item.selectedSize?.id,
        quantity: item.quantity,
        special_instructions: item.specialInstructions || undefined,
        extras: item.selectedExtras.map(e => ({ extra_name: e.extra_name, price: e.extra_price }))
      }))
    };

    try {
      const order = await api.createOrder(payload);
      setCreatedOrder(order);
      clearCart();
    } catch (err: unknown) {
      setOrderError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCreatedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/60"
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-xl bg-white dark:bg-[#0d2a1c] border border-black/15 dark:border-white/15 overflow-hidden z-10 flex flex-col max-h-[90vh] text-[#0d2a1c] dark:text-white"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-black/12 dark:border-white/12 flex items-center justify-between">
          <h2 className="font-display text-2xl text-[#0d2a1c] dark:text-white">
            {createdOrder ? t('checkout.successTitle') : t('checkout.title')}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="taste-btn w-10 h-10 flex items-center justify-center border border-black/15 dark:border-white/15 text-[#0d2a1c] dark:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {createdOrder ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-14 h-14 bg-[#ebebeb] dark:bg-[#1c3629] border border-black/12 dark:border-white/12 text-[#0d2a1c] flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-medium text-[#5f6b64]">
                {t('checkout.orderNumberIs')}
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-[#0d2a1c] bg-[#ebebeb] dark:bg-[#1c3629] py-3 px-6 border border-black/12 dark:border-white/12 inline-block tabular-nums">
                {createdOrder.order_number}
              </div>
              <p className="text-sm text-[#5f6b64] dark:text-[#a3a3a3] pt-2 max-w-md mx-auto">
                {t('checkout.trackOrderMessage')}
              </p>
            </div>

            <div className="p-5 bg-[#ebebeb] dark:bg-[#1c3629] border border-black/12 dark:border-white/12 text-left rtl:text-right space-y-2 text-sm tabular-nums">
              <div className="flex justify-between py-1.5 border-b border-black/10 dark:border-white/10">
                <span className="text-[#5f6b64]">{isAr ? 'العميل:' : 'Customer'}</span>
                <span className="font-medium">{createdOrder.customer_name} ({createdOrder.customer_phone})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-black/10 dark:border-white/10">
                <span className="text-[#5f6b64]">{isAr ? 'نوع الطلب:' : 'Order Type'}</span>
                <span className="font-medium uppercase">{createdOrder.order_type}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-black/10 dark:border-white/10">
                <span className="text-[#5f6b64]">{isAr ? 'طريقة الدفع:' : 'Payment'}</span>
                <span className="font-medium">{createdOrder.payment_method} ({createdOrder.payment_status})</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-medium">
                <span>{t('cart.total')}</span>
                <span className="text-[#0d2a1c]">{currency}{Number(createdOrder.total || 0).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="taste-btn w-full h-12 bg-[#0d2a1c] hover:bg-[#1c3629] text-white font-medium text-sm cursor-pointer"
            >
              {t('checkout.done')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-5 overflow-y-auto">
            {/* Order Type Tabs */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3]">
                {t('checkout.orderType')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`taste-btn h-11 flex items-center justify-center gap-2 border text-xs font-medium cursor-pointer ${
                    orderType === 'delivery'
                      ? 'bg-[#0d2a1c] dark:bg-white text-white dark:text-[#0d2a1c] border-[#0d2a1c] dark:border-white'
                      : 'bg-[#ebebeb] dark:bg-[#1c3629] border-black/12 dark:border-white/12 text-[#5f6b64]'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>{t('checkout.delivery')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`taste-btn h-11 flex items-center justify-center gap-2 border text-xs font-medium cursor-pointer ${
                    orderType === 'pickup'
                      ? 'bg-[#0d2a1c] dark:bg-white text-white dark:text-[#0d2a1c] border-[#0d2a1c] dark:border-white'
                      : 'bg-[#ebebeb] dark:bg-[#1c3629] border-black/12 dark:border-white/12 text-[#5f6b64]'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>{t('checkout.pickup')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('dine_in')}
                  className={`taste-btn h-11 flex items-center justify-center gap-2 border text-xs font-medium cursor-pointer ${
                    orderType === 'dine_in'
                      ? 'bg-[#0d2a1c] dark:bg-white text-white dark:text-[#0d2a1c] border-[#0d2a1c] dark:border-white'
                      : 'bg-[#ebebeb] dark:bg-[#1c3629] border-black/12 dark:border-white/12 text-[#5f6b64]'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>{t('checkout.dineIn')}</span>
                </button>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3] mb-1">
                  {t('checkout.customerName')} *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-11 px-3.5 rounded-[2px] bg-[#ebebeb] dark:bg-[#1c3629] border border-black/15 dark:border-white/15 text-sm focus:outline-none focus:border-[#0d2a1c]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3] mb-1">
                  {t('checkout.phoneNumber')} *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+1 (555) 019-2831"
                  className="w-full h-11 px-3.5 rounded-[2px] bg-[#ebebeb] dark:bg-[#1c3629] border border-black/15 dark:border-white/15 text-sm focus:outline-none focus:border-[#0d2a1c]"
                />
              </div>
            </div>

            {orderType === 'delivery' && (
              <div>
                <label className="block text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3] mb-1">
                  {t('checkout.deliveryAddress')} *
                </label>
                <textarea
                  rows={2}
                  required
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="Street, District, Building"
                  className="w-full p-3.5 rounded-[2px] bg-[#ebebeb] dark:bg-[#1c3629] border border-black/15 dark:border-white/15 text-sm focus:outline-none focus:border-[#0d2a1c]"
                />
              </div>
            )}

            {orderType === 'dine_in' && (
              <div>
                <label className="block text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3] mb-1">
                  {t('checkout.tableNumber')}
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={e => setTableNumber(e.target.value)}
                  placeholder="Table 12"
                  className="w-full h-11 px-3.5 rounded-[2px] bg-[#ebebeb] dark:bg-[#1c3629] border border-black/15 dark:border-white/15 text-sm focus:outline-none focus:border-[#0d2a1c]"
                />
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3]">
                {t('checkout.paymentMethod')}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`taste-btn flex items-center gap-2.5 p-3.5 border text-left rtl:text-right cursor-pointer ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'bg-[#ebebeb] dark:bg-[#1a1a1a] border-[#0d2a1c]'
                      : 'bg-white dark:bg-[#0d2a1c] border-black/12 dark:border-white/12'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#0d2a1c]" />
                  <div>
                    <span className="block text-xs font-medium">{t('checkout.cash')}</span>
                    <span className="text-[11px] text-[#5f6b64]">{isAr ? 'الدفع عند الاستلام' : 'Pay on Delivery'}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`taste-btn flex items-center gap-2.5 p-3.5 border text-left rtl:text-right cursor-pointer ${
                    paymentMethod === 'online'
                      ? 'bg-[#ebebeb] dark:bg-[#1a1a1a] border-[#0d2a1c]'
                      : 'bg-white dark:bg-[#0d2a1c] border-black/12 dark:border-white/12'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#0d2a1c]" />
                  <div>
                    <span className="block text-xs font-medium">{t('checkout.online')}</span>
                    <span className="text-[11px] text-[#5f6b64]">{isAr ? 'بطاقة ائتمان' : 'Card Payment'}</span>
                  </div>
                </button>
              </div>
            </div>

            {orderError && (
              <div className="p-3 bg-[#ebebeb] border border-[#0d2a1c] text-[#0d2a1c] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            {/* Order Action */}
            <div className="pt-4 border-t border-black/12 dark:border-white/12 flex items-center justify-between gap-4">
              <div className="tabular-nums">
                <span className="text-xs text-[#5f6b64] block">
                  {t('cart.total')}
                </span>
                <span className="text-xl font-medium text-[#0d2a1c] dark:text-white">
                  {currency}{Number(currentTotal || 0).toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="taste-btn h-12 px-7 bg-[#0d2a1c] hover:bg-[#1c3629] text-white font-medium text-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? '...' : t('checkout.submitOrder')}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
