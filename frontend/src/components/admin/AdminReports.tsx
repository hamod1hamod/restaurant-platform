import React, { useState, useEffect } from 'react';
import { Download, Printer, BarChart3, TrendingUp, DollarSign, Calendar, FileSpreadsheet } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Order } from '../../types';

interface AdminReportsProps {
  currency: string;
}

export const AdminReports: React.FC<AdminReportsProps> = ({ currency }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>({});
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [ordersData, overviewData, topProdData] = await Promise.all([
          api.getOrders(),
          api.getOverviewAnalytics(),
          api.getTopProducts(10)
        ]);
        setOrders(ordersData);
        setStats(overviewData);
        setTopProducts(topProdData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReportData();
  }, []);

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ["OrderNumber,CustomerName,Phone,OrderType,Status,Subtotal,DeliveryFee,Discount,Total,CreatedAt"];
    const rows = orders.map(o =>
      `"${o.order_number}","${o.customer_name}","${o.customer_phone}","${o.order_type}","${o.status}",${o.subtotal},${o.delivery_fee},${o.discount_amount},${o.total},"${o.created_at}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Restaurant_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            {isAr ? 'التقارير المالية وتصدير البيانات' : 'Financial Reports & Data Export'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {isAr ? 'تصدير تقارير المبيعات إلى Excel / CSV وطباعة ملخص الأداء' : 'Download spreadsheet sales audits and print operational financial summaries'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isAr ? 'تصدير إلى Excel / CSV' : 'Export to CSV'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-800 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isAr ? 'طباعة التقرير' : 'Print Report'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
          <span className="text-xs uppercase font-bold text-zinc-400">{isAr ? 'إجمالي المبيعات' : 'Gross Sales'}</span>
          <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
            {currency} {Number(stats.total_revenue || 0).toFixed(2)}
          </div>
          <p className="text-[11px] text-zinc-400">{stats.total_orders || 0} {isAr ? 'طلب مسجل' : 'processed orders'}</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
          <span className="text-xs uppercase font-bold text-zinc-400">{isAr ? 'الطلبات المكتملة' : 'Completed Deliveries'}</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.completed_orders || 0}
          </div>
          <p className="text-[11px] text-zinc-400">{isAr ? 'نسبة نجاح عالية' : 'Fulfillment rate'}</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
          <span className="text-xs uppercase font-bold text-zinc-400">{isAr ? 'متوسط قيمة الطلب' : 'Average Basket Value'}</span>
          <div className="text-3xl font-black text-orange-600 dark:text-orange-400">
            {currency} {Number(stats.average_order_value || 0).toFixed(2)}
          </div>
          <p className="text-[11px] text-zinc-400">{isAr ? 'لكل عميل' : 'per checkout'}</p>
        </div>
      </div>

      {/* Top Products Performance Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
        <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-50">
          {isAr ? 'تقرير أداء الوجبات والمشروبات الأكثر ربحية' : 'Menu Sales & Item Contribution Report'}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="pb-3">{isAr ? 'اسم الصنف' : 'Dish Name'}</th>
                <th className="pb-3">{isAr ? 'الكمية المباعة' : 'Units Sold'}</th>
                <th className="pb-3 text-right rtl:text-left">{isAr ? 'إجمالي الدخل المحقق' : 'Gross Contribution'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {topProducts.map((p, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="py-3 font-bold text-zinc-900 dark:text-zinc-100">
                    {isAr ? p.name_ar : p.name}
                  </td>
                  <td className="py-3 font-mono font-bold text-zinc-600 dark:text-zinc-300">
                    {p.total_sold}
                  </td>
                  <td className="py-3 text-right rtl:text-left font-black text-orange-600 dark:text-orange-400">
                    {currency} {Number(p.total_revenue || 0).toFixed(2)}
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
