import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { MenuItem, Category, ItemSize } from '../../types';

interface ItemModalProps {
  isOpen: boolean;
  item: MenuItem | null; // null for creating new
  categories: Category[];
  defaultCategoryId?: string;
  currencySymbol?: string;
  onClose: () => void;
  onSave: (itemData: Partial<MenuItem>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  item,
  categories,
  defaultCategoryId,
  currencySymbol = 'ج.م',
  onClose,
  onSave,
  onDelete
}) => {
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [sizes, setSizes] = useState<ItemSize[]>([
    { name: 'حجم عادي', name_en: 'Regular', price: 100 }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setNameEn(item.name_en || '');
      setCategoryId(item.category_id || categories[0]?.id || '');
      setDescription(item.description || '');
      setImageUrl(item.image_url || '');
      setIsAvailable(item.is_available !== undefined ? item.is_available : true);
      setSizes(
        item.sizes && item.sizes.length > 0
          ? item.sizes
          : [{ name: 'حجم عادي', name_en: 'Regular', price: 100 }]
      );
    } else {
      setName('');
      setNameEn('');
      setCategoryId(defaultCategoryId || categories[0]?.id || '');
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
      setIsAvailable(true);
      setSizes([
        { name: 'صغير', name_en: 'Small', price: 120 },
        { name: 'وسط', name_en: 'Medium', price: 175 },
        { name: 'كبير', name_en: 'Large', price: 235 }
      ]);
    }
  }, [item, isOpen, categories, defaultCategoryId]);

  if (!isOpen) return null;

  const handleAddSize = () => {
    setSizes([...sizes, { name: 'حجم جديد', name_en: 'New Size', price: 150 }]);
  };

  const handleRemoveSize = (index: number) => {
    if (sizes.length <= 1) {
      alert('يجب أن يحتوي الصنف على حجم وسعر واحد على الأقل.');
      return;
    }
    setSizes(sizes.filter((_, idx) => idx !== index));
  };

  const handleSizeChange = (index: number, field: keyof ItemSize, value: string | number) => {
    const next = [...sizes];
    next[index] = {
      ...next[index],
      [field]: field === 'price' ? Number(value) : value
    };
    setSizes(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    setLoading(true);
    try {
      await onSave({
        name,
        name_en: nameEn || name,
        category_id: categoryId,
        description,
        image_url: imageUrl,
        is_available: isAvailable,
        sizes
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!item?.id || !onDelete) return;
    if (window.confirm(`هل أنت متأكد من حذف الصنف "${item.name}"؟`)) {
      setLoading(true);
      try {
        await onDelete(item.id);
        onClose();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#13221a] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-white/10 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {item ? 'تعديل صنف القائمة' : 'إضافة صنف جديد'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Category Assignment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              القسم التابع له الصنف *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name AR & EN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                اسم الصنف (بالعربية) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: مشكل مشويات حاتي"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Item Name (English)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Mixed Grill"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Image URL & Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              رابط صورة الصنف (Image URL)
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {imageUrl && (
              <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              وصف المكونات والطبق
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: كباب بتلو، كفتة حاتي مشوية، وشيش طاووق مع خبز بلدي وطحينة"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Dynamic Sizes & Prices List */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <span>خيارات الأحجام والأسعار (Sizes & Prices) *</span>
                <span className="text-[11px] text-cyan-600 font-normal">({sizes.length} أحجام)</span>
              </label>
              <button
                type="button"
                onClick={handleAddSize}
                className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#0b1b2b] font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة حجم</span>
              </button>
            </div>

            <div className="space-y-2">
              {sizes.map((size, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white dark:bg-[#13221a] p-2.5 rounded-xl border border-slate-200 dark:border-white/10">
                  <input
                    type="text"
                    required
                    value={size.name}
                    onChange={(e) => handleSizeChange(idx, 'name', e.target.value)}
                    placeholder="اسم الحجم (مثال: وسط)"
                    className="flex-1 h-9 px-3 rounded-lg border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                  />
                  <div className="flex items-center gap-1 w-28 sm:w-32">
                    <input
                      type="number"
                      required
                      min={0}
                      step="any"
                      value={size.price}
                      onChange={(e) => handleSizeChange(idx, 'price', e.target.value)}
                      placeholder="السعر"
                      className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white tabular-nums text-center"
                    />
                    <span className="text-xs text-slate-400 shrink-0 font-medium">{currencySymbol}</span>
                  </div>
                  {sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(idx)}
                      title="حذف هذا الحجم"
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-white/10">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              حالة التوفر في المطعم
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              <span className="ms-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                {isAvailable ? 'متوفر' : 'غير متوفر'}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/10">
            {item && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف الصنف</span>
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#0b1b2b] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'جاري الحفظ...' : 'حفظ الصنف'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
