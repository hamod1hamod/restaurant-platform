import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Clock, CheckCircle, XCircle, Eye, Printer,
  Bike, Store, Utensils, AlertCircle, Phone, MapPin, Calendar, FileText, X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Order } from '../../types';

interface AdminOrdersProps {
  currency: string;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ currency }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // Selected Order for Printable Receipt
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        order_type: orderTypeFilter !== 'all' ? orderTypeFilter : undefined,
        search: search || undefined
      });
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, orderTypeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const statusOptions = [
    { value: 'all', label: isAr ? 'جميع الحالات' : 'All Statuses' },
    { value: 'new', label: isAr ? 'جديد' : 'New' },
    { value: 'confirmed', label: isAr ? 'مؤكد' : 'Confirmed' },
    { value: 'preparing', label: isAr ? 'قيد التحضير' : 'Preparing' },
    { value: 'ready', label: isAr ? 'جاهز للاستلام/التوصيل' : 'Ready' },
    { value: 'out_for_delivery', label: isAr ? 'خرج للتوصيل' : 'Out for Delivery' },
    { value: 'completed', label: isAr ? 'مكتمل' : 'Completed' },
    { value: 'cancelled', label: isAr ? 'ملغي' : 'Cancelled' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            {isAr ? 'إدارة ومتابعة الطلبات اللحظية' : 'Live Order Flow & Invoicing'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {isAr ? 'تأكيد، تجهيز، تغيير الحالة، وطباعة فواتير الزبائن' : 'Accept, prepare, transition statuses, and print official invoices'}
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold self-start sm:self-auto hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer"
        >
          {isAr ? 'تحديث الطلبات' : 'Refresh Orders'}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث برقم الطلب، اسم العميل، الهاتف...' : 'Search by order #, customer name, phone...'}
            className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </form>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={orderTypeFilter}
          onChange={e => setOrderTypeFilter(e.target.value)}
          className="w-full sm:w-40 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200"
        >
          <option value="all">{isAr ? 'جميع الأنواع' : 'All Types'}</option>
          <option value="delivery">{isAr ? 'توصيل' : 'Delivery'}</option>
          <option value="pickup">{isAr ? 'استلام' : 'Pickup'}</option>
          <option value="dine_in">{isAr ? 'محلي (طاولة)' : 'Dine-In'}</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">{isAr ? 'رقم الطلب والتاريخ' : 'Order Ref'}</th>
                <th className="py-3.5 px-6">{isAr ? 'العميل' : 'Customer Info'}</th>
                <th className="py-3.5 px-6">{isAr ? 'النوع والموقع' : 'Fulfillment'}</th>
                <th className="py-3.5 px-6">{isAr ? 'الأصناف' : 'Items'}</th>
                <th className="py-3.5 px-6">{isAr ? 'المجموع' : 'Total'}</th>
                <th className="py-3.5 px-6">{isAr ? 'تغيير الحالة' : 'Status Action'}</th>
                <th className="py-3.5 px-6 text-right rtl:text-left">{isAr ? 'عرض' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    {isAr ? 'لا توجد طلبات مطابقة للبحث' : 'No orders found matching filters'}
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    
                    <td className="py-4 px-6">
                      <span className="font-mono font-black text-sm text-orange-600 dark:text-orange-400 block">
                        {order.order_number}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 block">
                        {order.customer_name}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {order.customer_phone}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-bold text-xs uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                        {order.order_type === 'delivery' && <Bike className="w-3.5 h-3.5 text-orange-500" />}
                        {order.order_type === 'pickup' && <Store className="w-3.5 h-3.5 text-blue-500" />}
                        {order.order_type === 'dine_in' && <Utensils className="w-3.5 h-3.5 text-emerald-500" />}
                        <span>{order.order_type}</span>
                      </span>
                      <span className="block text-[11px] text-zinc-400 truncate max-w-[150px]">
                        {order.delivery_address || order.table_number || 'N/A'}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {order.items?.length || 0} {isAr ? 'أطباق' : 'dishes'}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-black text-sm text-zinc-900 dark:text-zinc-100 block">
                        {currency} {Number(order.total || 0).toFixed(2)}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                        {order.payment_method}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={e => handleUpdateStatus(order.id, e.target.value)}
                        className={`text-xs font-black px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                          order.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : order.status === 'new'
                            ? 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-400'
                            : order.status === 'preparing'
                            ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400'
                            : order.status === 'ready'
                            ? 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-400'
                            : order.status === 'out_for_delivery'
                            ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-400'
                            : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right rtl:text-left space-x-1.5 rtl:space-x-reverse">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-orange-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setReceiptOrder(order)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-orange-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Print Invoice / Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-zinc-400">
                  {isAr ? 'تفاصيل الطلب' : 'Order Details'}
                </span>
                <h3 className="text-xl font-black text-orange-600 dark:text-orange-400 font-mono">
                  {selectedOrder.order_number}
                </h3>
              </div>

              <button
                onClick={() => {
                  setReceiptOrder(selectedOrder);
                  setSelectedOrder(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold hover:bg-zinc-200"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isAr ? 'فاتورة' : 'Invoice'}</span>
              </button>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-zinc-400 font-bold block">{isAr ? 'العميل:' : 'Customer:'}</span>
                <span className="font-extrabold text-sm block">{selectedOrder.customer_name}</span>
                <span className="text-zinc-500 block">{selectedOrder.customer_phone}</span>
                {selectedOrder.customer_email && <span className="text-zinc-400">{selectedOrder.customer_email}</span>}
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-zinc-400 font-bold block">{isAr ? 'بيانات التوصيل:' : 'Delivery Info:'}</span>
                <span className="font-bold text-xs uppercase block text-orange-600">{selectedOrder.order_type}</span>
                <span className="text-zinc-600 dark:text-zinc-300 block">{selectedOrder.delivery_address || selectedOrder.table_number || 'Store Pickup'}</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {isAr ? 'الأطباق المطلوبة' : 'Ordered Dishes'}
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 text-xs">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {item.quantity}x {isAr ? (item.product_name_ar || item.product_name) : item.product_name}
                      </span>
                      {item.size_name && <span className="text-orange-600 font-semibold ml-2">({item.size_name})</span>}
                      {item.extras && item.extras.length > 0 && (
                        <div className="text-[11px] text-zinc-400">
                          {item.extras.map((ex, i) => (
                            <span key={i} className="block">+ {ex.extra_name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="font-black text-sm">
                      {currency} {Number(item.total_price || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal:</span>
                <span>{currency} {Number(selectedOrder.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Delivery Fee:</span>
                <span>{currency} {Number(selectedOrder.delivery_fee || 0).toFixed(2)}</span>
              </div>
              {Number(selectedOrder.discount_amount || 0) > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount:</span>
                  <span>-{currency} {Number(selectedOrder.discount_amount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <span>Total:</span>
                <span className="text-orange-600">{currency} {Number(selectedOrder.total || 0).toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white text-zinc-900 p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setReceiptOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Print Header */}
            <div className="text-center space-y-1 pb-4 border-b border-zinc-200">
              <h2 className="font-display text-2xl tracking-tight text-[#0d2a1c]">
                Khatab Restaurant & Café
              </h2>
              <p className="text-xs text-[#5f6b64]">Official Tax Receipt / Order Invoice</p>
              <div className="text-sm font-mono font-bold text-[#0d2a1c] pt-1">
                {receiptOrder.order_number}
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 text-xs text-zinc-600 gap-2">
              <div>
                <strong>Customer:</strong> {receiptOrder.customer_name}<br />
                <strong>Phone:</strong> {receiptOrder.customer_phone}
              </div>
              <div className="text-right">
                <strong>Date:</strong> {new Date(receiptOrder.created_at).toLocaleDateString()}<br />
                <strong>Type:</strong> <span className="uppercase">{receiptOrder.order_type}</span>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-xs text-left">
              <thead className="border-b border-zinc-300">
                <tr>
                  <th className="py-2">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {receiptOrder.items?.map((itm, i) => (
                  <tr key={i}>
                    <td className="py-2">
                      <span className="font-bold">{itm.product_name}</span>
                      {itm.size_name && <span className="text-zinc-500 text-[11px] block">{itm.size_name}</span>}
                    </td>
                    <td className="py-2 text-center">{itm.quantity}</td>
                    <td className="py-2 text-right font-bold">{currency} {Number(itm.total_price || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="pt-2 border-t border-zinc-300 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{currency} {Number(receiptOrder.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>{currency} {Number(receiptOrder.delivery_fee || 0).toFixed(2)}</span>
              </div>
              {Number(receiptOrder.discount_amount || 0) > 0 && (
                <div className="flex justify-between font-bold text-emerald-700">
                  <span>Discount:</span>
                  <span>-{currency} {Number(receiptOrder.discount_amount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black pt-2 border-t border-zinc-300">
                <span>Total Amount:</span>
                <span>{currency} {Number(receiptOrder.total || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Print action button */}
            <div className="pt-4 flex gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setReceiptOrder(null)}
                className="px-5 py-3 rounded-xl bg-zinc-100 text-zinc-700 font-bold text-sm"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
