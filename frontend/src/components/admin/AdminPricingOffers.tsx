import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Percent, DollarSign, Calendar, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Coupon } from '../../types';

interface AdminPricingOffersProps {
  currency: string;
}

export const AdminPricingOffers: React.FC<AdminPricingOffersProps> = ({ currency }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // New coupon form
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [discountVal, setDiscountVal] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(20);
  const [maxDiscount, setMaxDiscount] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await api.getCoupons();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setSaving(true);
    try {
      const payload: Partial<Coupon> = {
        code: code.trim().toUpperCase(),
        discount_percent: discountType === 'percent' ? Number(discountVal) : undefined,
        discount_amount: discountType === 'amount' ? Number(discountVal) : undefined,
        min_order_value: Number(minOrder),
        max_discount: maxDiscount === '' ? undefined : Number(maxDiscount),
        is_active: true
      };

      await api.createCoupon(payload);
      setModalOpen(false);
      setCode('');
      setDiscountVal(10);
      setMinOrder(20);
      setMaxDiscount('');
      fetchCoupons();
    } catch (err: any) {
      alert(err.message || 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الكوبون؟' : 'Delete this coupon?')) return;
    try {
      await api.deleteCoupon(id);
      fetchCoupons();
    } catch (err: any) {
      alert(err.message || 'Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            {isAr ? 'إدارة الأسعار وكوبونات الخصم' : 'Dynamic Pricing & Promo Vouchers'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {isAr ? 'إنشاء وتفعيل عروض ترويجية وكودات خصم فورية' : 'Create percentage or fixed-amount discount coupons and manage order thresholds'}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إنشاء كود خصم جديد' : 'New Promo Coupon'}</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">{isAr ? 'كود الخصم' : 'Coupon Code'}</th>
                <th className="py-3.5 px-6">{isAr ? 'قيمة الخصم' : 'Discount Rate'}</th>
                <th className="py-3.5 px-6">{isAr ? 'الحد الأدنى للطلب' : 'Min Order'}</th>
                <th className="py-3.5 px-6">{isAr ? 'عدد مرات الاستخدام' : 'Times Used'}</th>
                <th className="py-3.5 px-6">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-6 text-right rtl:text-left">{isAr ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {coupons.map(cp => (
                <tr key={cp.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-4 px-6 font-mono font-black text-sm text-orange-600 dark:text-orange-400">
                    {cp.code}
                  </td>
                  <td className="py-4 px-6 font-black text-zinc-900 dark:text-zinc-100">
                    {cp.discount_percent ? `${cp.discount_percent}% OFF` : `${currency} ${cp.discount_amount} OFF`}
                  </td>
                  <td className="py-4 px-6 font-bold text-zinc-600 dark:text-zinc-300">
                    {currency} {cp.min_order_value.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 font-bold text-zinc-500">
                    {cp.usage_count} {isAr ? 'مرات' : 'times'}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                      {isAr ? 'نشط ومفعل' : 'Active'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right rtl:text-left">
                    <button
                      onClick={() => handleDeleteCoupon(cp.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-5">
            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
              {isAr ? 'إنشاء كود خصم جديد' : 'Create New Promo Coupon'}
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  {isAr ? 'كود الكوبون' : 'Coupon Code (e.g. SUMMER25)'} *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="WELCOME10"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDiscountType('percent')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    discountType === 'percent'
                      ? 'border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-950/40'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  % {isAr ? 'نسبة مئوية' : 'Percentage (%)'}
                </button>

                <button
                  type="button"
                  onClick={() => setDiscountType('amount')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    discountType === 'amount'
                      ? 'border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-950/40'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  $ {isAr ? 'مبلغ ثابت' : 'Fixed Amount ($)'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  {isAr ? 'قيمة الخصم' : 'Discount Value'} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={discountVal}
                  onChange={e => setDiscountVal(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  {isAr ? 'الحد الأدنى لقيمة الطلب' : 'Minimum Order Value'} ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={minOrder}
                  onChange={e => setMinOrder(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  {saving ? '...' : (isAr ? 'حفظ الكوبون' : 'Save Coupon')}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-bold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
