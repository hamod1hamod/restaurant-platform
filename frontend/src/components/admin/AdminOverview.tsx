import React, { useEffect, useState } from 'react';
import {
  DollarSign, ShoppingCart, Clock, CheckCircle2, UtensilsCrossed,
  TrendingUp, ArrowUpRight, Award, Calendar, Eye
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
  }, [chartPeriod]);

  const maxRevenue = Math.max(...salesChart.map(item => item.revenue), 1);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            {isAr ? 'لوحة المتابعة والتحليلات' : 'Executive Dashboard & Analytics'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {isAr ? 'متابعة حية للمبيعات والطلبات ونشاط المطبخ' : 'Real-time revenue metrics, order pipeline, and top-selling dishes'}
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          {isAr ? 'تحديث البيانات اللحظية' : 'Refresh Metrics'}
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Revenue */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {isAr ? 'إجمالي المبيعات' : 'Total Revenue'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
              {currency} {stats.total_revenue.toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">
            {isAr ? 'متوسط قيمة الطلب:' : 'Average Order Value:'} {currency} {stats.average_order_value.toFixed(2)}
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {isAr ? 'إجمالي الطلبات' : 'Total Orders'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
              {stats.total_orders}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">
            {stats.completed_orders} {isAr ? 'مكتمل' : 'completed successfully'}
          </p>
        </div>

        {/* Pending Orders */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {isAr ? 'طلبات قيد الإعداد والتوصيل' : 'Active Pipeline'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
              {stats.pending_orders}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">
            {isAr ? 'يتطلب متابعة وتجهيز المطبخ' : 'In prep, ready, or out for delivery'}
          </p>
        </div>

        {/* Total Products */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {isAr ? 'أصناف القائمة' : 'Active Menu Items'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
              {stats.total_products}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">
            {stats.total_categories} {isAr ? 'أقسام طعام نشطة' : 'categories managed'}
          </p>
        </div>

      </div>

      {/* Sales Trend Chart & Top Products Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Chart (2 Cols) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <span>{isAr ? 'تحليل المبيعات والإيرادات' : 'Sales & Revenue Trajectory'}</span>
              </h3>
              <span className="text-xs text-zinc-400">
                {isAr ? 'تطور العائدات المالية حسب الفترة الزمنية' : 'Revenue earned across selected period'}
              </span>
            </div>

            {/* Daily / Weekly / Monthly Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold">
              <button
                onClick={() => setChartPeriod('daily')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  chartPeriod === 'daily'
                    ? 'bg-white dark:bg-zinc-700 text-orange-600 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {isAr ? 'يومي' : 'Daily'}
              </button>
              <button
                onClick={() => setChartPeriod('weekly')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  chartPeriod === 'weekly'
                    ? 'bg-white dark:bg-zinc-700 text-orange-600 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {isAr ? 'أسبوعي' : 'Weekly'}
              </button>
              <button
                onClick={() => setChartPeriod('monthly')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  chartPeriod === 'monthly'
                    ? 'bg-white dark:bg-zinc-700 text-orange-600 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {isAr ? 'شهري' : 'Monthly'}
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end gap-3 sm:gap-6 pt-6 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            {salesChart.map((bar, idx) => {
              const heightPercent = Math.max(12, Math.round((bar.revenue / maxRevenue) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-black text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {currency} {bar.revenue}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-orange-600 to-amber-500 group-hover:from-orange-500 group-hover:to-amber-400 transition-all duration-300 shadow-xs"
                  ></div>
                  <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 truncate max-w-[60px]">
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top-Selling Dishes (1 Col) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
          <div>
            <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>{isAr ? 'الأكثر مبيعاً' : 'Top Selling Items'}</span>
            </h3>
            <span className="text-xs text-zinc-400">
              {isAr ? 'أعلى الوجبات طلباً في المطبخ' : 'Ranked by volume ordered'}
            </span>
          </div>

          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">
                {isAr ? 'لا توجد بيانات مبيعات كافية حتى الآن' : 'No sales data yet'}
              </p>
            ) : (
              topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {isAr ? p.name_ar : p.name}
                      </h4>
                      <span className="text-[10px] text-zinc-400">
                        {p.total_sold} {isAr ? 'طلب' : 'sold'}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                    {currency} {p.total_revenue.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-50">
              {isAr ? 'أحدث الطلبات الواردة' : 'Recent Inbound Orders'}
            </h3>
            <span className="text-xs text-zinc-400">
              {isAr ? 'متابعة الطلبات وتحديث حالتها مباشرة' : 'Review status, order details, and customer info'}
            </span>
          </div>

          <button
            onClick={onNavigateToOrders}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
          >
            {isAr ? 'عرض جميع الطلبات' : 'View All Orders'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="pb-3">{isAr ? 'رقم الطلب' : 'Order ID'}</th>
                <th className="pb-3">{isAr ? 'العميل' : 'Customer'}</th>
                <th className="pb-3">{isAr ? 'النوع' : 'Type'}</th>
                <th className="pb-3">{isAr ? 'المجموع' : 'Total'}</th>
                <th className="pb-3">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="pb-3 text-right rtl:text-left">{isAr ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-orange-600 dark:text-orange-400">
                    {order.order_number}
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{order.customer_name}</span>
                    <span className="text-[11px] text-zinc-400">{order.customer_phone}</span>
                  </td>
                  <td className="py-3.5 uppercase font-semibold text-zinc-500">
                    {order.order_type}
                  </td>
                  <td className="py-3.5 font-black text-zinc-900 dark:text-zinc-100">
                    {currency} {order.total.toFixed(2)}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : order.status === 'new'
                          ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-400'
                          : order.status === 'preparing'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                          : order.status === 'ready'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400'
                          : order.status === 'out_for_delivery'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                          : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right rtl:text-left">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-600 hover:text-white transition-colors"
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

    </div>
  );
};
