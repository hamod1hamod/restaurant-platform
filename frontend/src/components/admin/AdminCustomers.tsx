import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, MapPin, DollarSign, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

interface AdminCustomersProps {
  currency: string;
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ currency }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const data = await api.getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c => {
    return c.name.toLowerCase().includes(search.toLowerCase()) ||
           c.phone.includes(search);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            {isAr ? 'سجل وإدارة العملاء' : 'Customer CRM & Loyalty Records'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {isAr ? 'إجمالي المشتريات، عدد الطلبات، وبيانات التواصل' : 'Customer spending history, order counts, and addresses'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث باسم العميل أو رقم الهاتف...' : 'Search by customer name or phone number...'}
            className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">{isAr ? 'العميل' : 'Customer'}</th>
                <th className="py-3.5 px-6">{isAr ? 'الهاتف والبريد' : 'Contact'}</th>
                <th className="py-3.5 px-6">{isAr ? 'العنوان الأخير' : 'Delivery Address'}</th>
                <th className="py-3.5 px-6">{isAr ? 'عدد الطلبات' : 'Total Orders'}</th>
                <th className="py-3.5 px-6">{isAr ? 'إجمالي الإنفاق' : 'Total Spent'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.map((c, i) => (
                <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-4 px-6 font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-xs">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{c.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block">{c.phone}</span>
                    <span className="text-[11px] text-zinc-400">{c.email}</span>
                  </td>
                  <td className="py-4 px-6 text-zinc-600 dark:text-zinc-300 max-w-[200px] truncate">
                    {c.address}
                  </td>
                  <td className="py-4 px-6 font-black text-sm text-zinc-900 dark:text-zinc-100">
                    {c.total_orders}
                  </td>
                  <td className="py-4 px-6 font-black text-sm text-orange-600 dark:text-orange-400">
                    {currency} {c.total_spent.toFixed(2)}
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
