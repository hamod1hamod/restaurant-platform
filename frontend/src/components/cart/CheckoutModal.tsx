import React, { useState } from 'react';
import {
  X, Bike, Store, Utensils, CreditCard, Banknote, CheckCircle,
  AlertCircle, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
      setOrderError(isAr ? 'يرجى إدخال عنوان التوصيل بالتفصيل' : 'Please provide delivery address');
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);

    const payload = {
      order_type: orderType,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_email: customerEmail.trim() || undefined,
      delivery_address: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
      table_number: orderType === 'dine_in' ? tableNumber.trim() : undefined,
      notes: notes.trim() || undefined,
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
    } catch (err: any) {
      setOrderError(err.message || 'Failed to place order');
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
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
      ></motion.div>

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] text-white"
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-black text-xl text-white">
            {createdOrder ? t('checkout.successTitle') : t('checkout.title')}
          </h2>
          <button
            onClick={handleClose}
            className="taste-btn p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {createdOrder ? (
          /* Order Confirmation Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-slate-400">
                {t('checkout.orderNumberIs')}
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-black text-blue-400 bg-slate-950 py-3 px-6 rounded-2xl border border-slate-800 inline-block shadow-sm">
                {createdOrder.order_number}
              </div>
              <p className="text-sm text-slate-300 pt-2 max-w-md mx-auto">
                {t('checkout.trackOrderMessage')}
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left rtl:text-right space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800 font-bold">
                <span>{isAr ? 'العميل:' : 'Customer:'}</span>
                <span className="text-white">{createdOrder.customer_name} ({createdOrder.customer_phone})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>{isAr ? 'نوع الطلب:' : 'Order Type:'}</span>
                <span className="font-bold uppercase text-white">{createdOrder.order_type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>{isAr ? 'طريقة الدفع:' : 'Payment:'}</span>
                <span className="font-bold text-white">{createdOrder.payment_method} ({createdOrder.payment_status})</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-black text-white pt-1">
                <span>{t('cart.total')}:</span>
                <span className="text-blue-400 font-black">{currency} {Number(createdOrder.total || 0).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="taste-btn w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 cursor-pointer"
            >
              {t('checkout.done')}
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-5 overflow-y-auto">
            
            {/* Order Type Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                {t('checkout.orderType')}
              </label>
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`taste-btn flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    orderType === 'delivery'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>{t('checkout.delivery')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`taste-btn flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    orderType === 'pickup'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>{t('checkout.pickup')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('dine_in')}
                  className={`taste-btn flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    orderType === 'dine_in'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
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
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {t('checkout.customerName')} *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {t('checkout.phoneNumber')} *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+1 (555) 019-2831"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {orderType === 'delivery' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {t('checkout.deliveryAddress')} *
                </label>
                <textarea
                  rows={2}
                  required
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="123 Ocean Street, Apt 4B, Building 7"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {orderType === 'dine_in' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {t('checkout.tableNumber')}
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={e => setTableNumber(e.target.value)}
                  placeholder="Table 12"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                {t('checkout.paymentMethod')}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`taste-btn flex items-center gap-2.5 p-3 rounded-2xl border text-left rtl:text-right cursor-pointer transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-400/40 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="block text-xs font-bold text-white">{t('checkout.cash')}</span>
                    <span className="text-[10px] text-slate-400">{isAr ? 'الدفع عند الاستلام' : 'Pay on Delivery'}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`taste-btn flex items-center gap-2.5 p-3 rounded-2xl border text-left rtl:text-right cursor-pointer transition-all ${
                    paymentMethod === 'online'
                      ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-400/40 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="block text-xs font-bold text-white">{t('checkout.online')}</span>
                    <span className="text-[10px] text-slate-400">{isAr ? 'بطاقة ائتمان' : 'Card Payment'}</span>
                  </div>
                </button>
              </div>
            </div>

            {orderError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            {/* Sticky Order Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-bold block">
                  {t('cart.total')}
                </span>
                <span className="text-xl font-black text-blue-400">
                  {currency} {Number(currentTotal || 0).toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="taste-btn flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 cursor-pointer disabled:opacity-50 ring-1 ring-blue-400/40"
              >
                <span>{isSubmitting ? '...' : t('checkout.submitOrder')}</span>
              </button>
            </div>

          </form>
        )}

      </motion.div>
    </div>
  );
};
