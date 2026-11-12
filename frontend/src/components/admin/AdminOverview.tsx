import React, { useEffect, useState } from 'react';
import {
  DollarSign, ShoppingCart, Clock, UtensilsCrossed,
  TrendingUp, Award, Eye, Database, RefreshCw, Flame, Check, AlertCircle, X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Order } from '../../types';

interface AdminOverviewProps {
  currency: string;
  onViewOrder: (order: Order) => void;
  onNavigateToOrders: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  currency,
  onViewOrder,
  onNavigateToOrders
}) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const [stats, setStats] = useState<any>({
    total_products: 0,
    total_categories: 0,
    total_orders: 0,
    pending_orders: 0,
    completed_orders: 0,
    total_revenue: 0,
    average_order_value: 0
  });

  const [salesChart, setSalesChart] = useState<any[]>([]);
  const [chartPeriod, setChartPeriod] = useState<string>('daily');
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Restore DB Modal State
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  // Firebase Config Modal State
  const [firebaseModalOpen, setFirebaseModalOpen] = useState(false);
  const [firebaseApiKey, setFirebaseApiKey] = useState('');
  const [firebaseProjectId, setFirebaseProjectId] = useState('');
  const [firebaseAppId, setFirebaseAppId] = useState('');
  const [firebaseSaveMsg, setFirebaseSaveMsg] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [overviewData, chartData, topProdData, ordersData] = await Promise.all([
        api.getOverviewAnalytics(),
        api.getSalesChart(chartPeriod),
        api.getTopProducts(),
        api.getOrders({ limit: 6 })
      ]);
      setStats(overviewData);
      setSalesChart(chartData);
      setTopProducts(topProdData);
      setRecentOrders(ordersData);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const storedCfg = api.getFirebaseConfig();
    if (storedCfg) {
      setFirebaseApiKey(storedCfg.apiKey || '');
      setFirebaseProjectId(storedCfg.projectId || '');
      setFirebaseAppId(storedCfg.appId || '');
    }
  }, [chartPeriod]);

  const handleRestoreDatabase = async () => {
    setRestoring(true);
    setRestoreStatus(null);
    try {
      const res = await api.restoreDatabase();
      setRestoreStatus(res.message);
      await fetchDashboardData();
    } catch (err: any) {
      setRestoreStatus(`Error: ${err.message || 'Failed to restore'}`);
    } finally {
      setRestoring(false);
    }
  };

  const handleSaveFirebase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseApiKey || !firebaseProjectId) {
      setFirebaseSaveMsg('API Key and Project ID are required');
      return;
    }
    const success = api.saveFirebaseConfig({
      apiKey: firebaseApiKey.trim(),
      authDomain: `${firebaseProjectId.trim()}.firebaseapp.com`,
      projectId: firebaseProjectId.trim(),
      appId: firebaseAppId.trim() || '1:123456789:web:abcdef'
    });
    if (success) {
      setFirebaseSaveMsg('Firebase configuration saved successfully! Syncing database...');
      setTimeout(() => {
        setFirebaseSaveMsg(null);
        setFirebaseModalOpen(false);
        fetchDashboardData();
      }, 1500);
    } else {
      setFirebaseSaveMsg('Failed to save configuration');
    }
  };

  const maxRevenue = Math.max(...salesChart.map(item => item.revenue), 1);
  const isFirebaseConfigured = !!api.getFirebaseConfig()?.projectId;

  return (
    <div className="space-y-8 animate-fade-in text-slate-900 dark:text-slate-100">
      
      {/* Top Welcome Title & Database Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isAr ? 'لوحة المتابعة والتحليلات' : 'Executive Dashboard & Analytics'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAr ? 'متابعة حية للمبيعات والطلبات وقاعدة البيانات السحابية' : 'Real-time revenue metrics, order pipeline, and cloud database state'}
          </p>
        </div>

        {/* Database & Cloud Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Firebase Status Pill */}
          <button
            onClick={() => setFirebaseModalOpen(true)}
            className={`taste-btn inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isFirebaseConfigured
                ? 'bg-blue-950/60 text-blue-300 border-blue-800'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
            }`}
            title="Configure Google Firebase connection"
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>{isFirebaseConfigured ? (isAr ? 'فايربيس متصل' : 'Firebase: Connected') : (isAr ? 'ربط فايربيس' : 'Connect Firebase')}</span>
          </button>

          {/* Restore Database Button */}
          <button
            onClick={() => {
              setRestoreStatus(null);
              setRestoreModalOpen(true);
            }}
            className="taste-btn inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0d2a1c] hover:bg-[#1c3629] text-white text-xs font-medium cursor-pointer"
          >
            <Database className="w-4 h-4" />
            <span>{isAr ? 'استعادة قاعدة البيانات' : 'Restore Database'}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchDashboardData}
            className="taste-btn p-2 bg-white dark:bg-[#1c3629] border border-black/15 dark:border-white/15 text-[#0d2a1c] dark:text-white hover:border-black/40 cursor-pointer"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Metric Cards (Taste-Skill White / Signal Red) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Revenue */}
        <div className="taste-card p-6 bg-white dark:bg-[#1c3629] border border-black/12 dark:border-white/12 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#5f6b64]">
              {isAr ? 'إجمالي المبيعات' : 'Total Revenue'}
            </span>
            <div className="w-9 h-9 bg-[#ebebeb] dark:bg-[#1f1f1f] text-[#0d2a1c] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-[#0d2a1c] dark:text-white tabular-nums">
              {currency}{Number(stats?.total_revenue || 0).toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-[#5f6b64] tabular-nums">
            {isAr ? 'متوسط قيمة الطلب:' : 'Average Order:'} {currency}{Number(stats?.average_order_value || 0).toFixed(2)}
          </p>
        </div>

        {/* Total Orders */}
        <div className="taste-card p-6 bg-white dark:bg-[#1c3629] border border-black/12 dark:border-white/12 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#5f6b64]">
              {isAr ? 'إجمالي الطلبات' : 'Total Orders'}
            </span>
            <div className="w-9 h-9 bg-[#ebebeb] dark:bg-[#1f1f1f] text-[#0d2a1c] dark:text-white flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-[#0d2a1c] dark:text-white tabular-nums">
              {stats.total_orders}
            </span>
          </div>
          <p className="text-xs text-[#5f6b64] tabular-nums">
            {stats.completed_orders} {isAr ? 'مكتمل بنجاح' : 'completed successfully'}
          </p>
        </div>

        {/* Pending Orders */}
        <div className="taste-card p-6 bg-white dark:bg-[#1c3629] border border-black/12 dark:border-white/12 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#5f6b64]">
              {isAr ? 'طلبات قيد الإعداد' : 'Active Pipeline'}
            </span>
            <div className="w-9 h-9 bg-[#ebebeb] dark:bg-[#1f1f1f] text-[#0d2a1c] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-[#0d2a1c] tabular-nums">
              {stats.pending_orders}
            </span>
          </div>
          <p className="text-xs text-[#5f6b64]">
            {isAr ? 'يتطلب متابعة المطبخ' : 'In prep, ready, or out for delivery'}
          </p>
        </div>

        {/* Total Products */}
        <div className="taste-card p-6 bg-white dark:bg-[#1c3629] border border-black/12 dark:border-white/12 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#5f6b64]">
              {isAr ? 'أصناف القائمة' : 'Active Menu Items'}
            </span>
            <div className="w-9 h-9 bg-[#ebebeb] dark:bg-[#1f1f1f] text-[#0d2a1c] dark:text-white flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-[#0d2a1c] dark:text-white tabular-nums">
              {stats.total_products}
            </span>
          </div>
          <p className="text-xs text-[#5f6b64] tabular-nums">
            {stats.total_categories} {isAr ? 'أقسام طعام نشطة' : 'categories managed'}
          </p>
        </div>

      </div>

      {/* Sales Trend Chart & Top Products Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Chart (2 Cols) */}
        <div className="lg:col-span-2 p-6 sm:p-8 bg-white dark:bg-[#1c3629] border border-black/12 dark:border-white/12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl text-[#0d2a1c] dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#0d2a1c]" />
                <span>{isAr ? 'تحليل المبيعات والإيرادات' : 'Sales & Revenue Trajectory'}</span>
              </h3>
              <span className="text-xs text-[#5f6b64]">
                {isAr ? 'تطور العائدات المالية حسب الفترة الزمنية' : 'Revenue earned across selected period'}
              </span>
            </div>

            {/* Daily / Weekly / Monthly Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#ebebeb] dark:bg-[#0d2a1c] border border-black/12 dark:border-white/12 text-xs font-medium">
              <button
                onClick={() => setChartPeriod('daily')}
                className={`px-3 py-1.5 transition-colors cursor-pointer ${
                  chartPeriod === 'daily'
                    ? 'bg-[#0d2a1c] text-white'
                    : 'text-[#5f6b64] hover:text-[#0d2a1c] dark:hover:text-white'
                }`}
              >
                {isAr ? 'يومي' : 'Daily'}
              </button>
              <button
                onClick={() => setChartPeriod('weekly')}
                className={`px-3 py-1.5 transition-colors cursor-pointer ${
                  chartPeriod === 'weekly'
                    ? 'bg-[#0d2a1c] text-white'
                    : 'text-[#5f6b64] hover:text-[#0d2a1c] dark:hover:text-white'
                }`}
              >
                {isAr ? 'أسبوعي' : 'Weekly'}
              </button>
              <button
                onClick={() => setChartPeriod('monthly')}
                className={`px-3 py-1.5 transition-colors cursor-pointer ${
                  chartPeriod === 'monthly'
                    ? 'bg-[#0d2a1c] text-white'
                    : 'text-[#5f6b64] hover:text-[#0d2a1c] dark:hover:text-white'
                }`}
              >
                {isAr ? 'شهري' : 'Monthly'}
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end gap-3 sm:gap-6 pt-6 border-b border-black/10 dark:border-white/10 pb-2">
            {salesChart.map((bar, idx) => {
              const heightPercent = Math.max(12, Math.round((bar.revenue / maxRevenue) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-medium text-[#5f6b64] opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {currency}{bar.revenue}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[48px] bg-[#0d2a1c] dark:bg-white group-hover:bg-[#0d2a1c] transition-colors duration-200"
                  ></div>
                  <span className="text-[11px] font-medium text-[#5f6b64] truncate max-w-[60px]">
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top-Selling Dishes (1 Col) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-950/70 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-500" />
              <span>{isAr ? 'الأكثر مبيعاً' : 'Top Selling Items'}</span>
            </h3>
            <span className="text-xs text-slate-400">
              {isAr ? 'أعلى الوجبات طلباً في المطبخ' : 'Ranked by volume ordered'}
            </span>
          </div>

          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                {isAr ? 'لا توجد بيانات مبيعات كافية حتى الآن' : 'No sales data yet'}
              </p>
            ) : (
              topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-blue-950/50">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                        {isAr ? p.name_ar : p.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {p.total_sold} {isAr ? 'طلب' : 'sold'}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {currency} {Number(p.total_revenue || 0).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-950/70 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {isAr ? 'أحدث الطلبات الواردة' : 'Recent Inbound Orders'}
            </h3>
            <span className="text-xs text-slate-400">
              {isAr ? 'متابعة الطلبات وتحديث حالتها مباشرة' : 'Review status, order details, and customer info'}
            </span>
          </div>

          <button
            onClick={onNavigateToOrders}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            {isAr ? 'عرض جميع الطلبات' : 'View All Orders'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="border-b border-slate-200 dark:border-blue-950 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="pb-3">{isAr ? 'رقم الطلب' : 'Order ID'}</th>
                <th className="pb-3">{isAr ? 'العميل' : 'Customer'}</th>
                <th className="pb-3">{isAr ? 'النوع' : 'Type'}</th>
                <th className="pb-3">{isAr ? 'المجموع' : 'Total'}</th>
                <th className="pb-3">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="pb-3 text-right rtl:text-left">{isAr ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-blue-950/60">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {order.order_number}
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-slate-900 dark:text-white block">{order.customer_name}</span>
                    <span className="text-[11px] text-slate-400">{order.customer_phone}</span>
                  </td>
                  <td className="py-3.5 uppercase font-semibold text-slate-500">
                    {order.order_type}
                  </td>
                  <td className="py-3.5 font-black text-slate-900 dark:text-white">
                    {currency} {Number(order.total || 0).toFixed(2)}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : order.status === 'new'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                          : order.status === 'preparing'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                          : order.status === 'ready'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400'
                          : order.status === 'out_for_delivery'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-400'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right rtl:text-left">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                      title="View Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restore Database Confirmation Modal */}
      {restoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-blue-950 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-blue-600">
                <Database className="w-6 h-6" />
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {isAr ? 'استعادة قاعدة البيانات' : 'Restore Database'}
                </h3>
              </div>
              <button
                onClick={() => setRestoreModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'هل أنت متأكد من استعادة قاعدة البيانات؟ سيتم إعادة تعيين جميع أصناف القائمة، الأقسام، الكوبونات، والمراجعات إلى الحالة الافتراضية الأصلية ومزامنتها.'
                : 'Are you sure you want to restore the database? This will reset all food dishes, categories, coupons, and restaurant settings back to their pristine baseline menu and synchronize with Firebase.'}
            </p>

            {restoreStatus && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{restoreStatus}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRestoreModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={restoring}
                onClick={handleRestoreDatabase}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
              >
                {restoring ? (isAr ? 'جارٍ الاستعادة...' : 'Restoring...') : (isAr ? 'تأكيد الاستعادة' : 'Confirm Restore')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Firebase Configuration Modal */}
      {firebaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <form onSubmit={handleSaveFirebase} className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-blue-950 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-amber-500">
                <Flame className="w-6 h-6" />
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {isAr ? 'إعدادات قاعدة بيانات فايربيس' : 'Firebase Cloud Database'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFirebaseModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isAr
                ? 'اربط تطبيق المطعم بمشروع Google Firebase الخاص بك لحفظ الأطباق والطلبات في سحابة Firestore مباشرة.'
                : 'Connect your restaurant application to your Google Firebase project to store categories, dishes, and orders live on Firestore.'}
            </p>

            {firebaseSaveMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{firebaseSaveMsg}</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Firebase Project ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. restaurant-platform-demo"
                  value={firebaseProjectId}
                  onChange={e => setFirebaseProjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-blue-950 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Web API Key *
                </label>
                <input
                  type="text"
                  required
                  placeholder="AIzaSy..."
                  value={firebaseApiKey}
                  onChange={e => setFirebaseApiKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-blue-950 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  App ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="1:123456789:web:abcdef"
                  value={firebaseAppId}
                  onChange={e => setFirebaseAppId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-blue-950 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {isFirebaseConfigured && (
                <button
                  type="button"
                  onClick={() => {
                    api.clearFirebaseConfig();
                    setFirebaseApiKey('');
                    setFirebaseProjectId('');
                    setFirebaseAppId('');
                    setFirebaseSaveMsg('Firebase disconnected.');
                    setTimeout(() => setFirebaseSaveMsg(null), 1500);
                  }}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  {isAr ? 'فصل فايربيس' : 'Disconnect'}
                </button>
              )}
              <div className="flex items-center gap-3 ms-auto">
                <button
                  type="button"
                  onClick={() => setFirebaseModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  {isAr ? 'حفظ والاتصال' : 'Save & Connect'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
