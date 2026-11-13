import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Image as ImageIcon } from 'lucide-react';
import { Category } from '../../types';

interface CategoryModalProps {
  isOpen: boolean;
  category: Category | null; // null for creating new
  onClose: () => void;
  onSave: (catData: Partial<Category>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const PRESET_ICONS = ['🥩', '🍔', '🍕', '🍗', '🍟', '🥤', '🍰', '🥗', '☕', '🍲', '🥪', '🍣'];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  category,
  onClose,
  onSave,
  onDelete
}) => {
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [icon, setIcon] = useState('🍽️');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setNameEn(category.name_en || '');
      setIcon(category.icon || '🍽️');
      setImageUrl(category.image_url || '');
      setDescription(category.description || '');
    } else {
      setName('');
      setNameEn('');
      setIcon('🥩');
      setImageUrl('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80');
      setDescription('');
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSave({
        name,
        name_en: nameEn || name,
        icon,
        image_url: imageUrl,
        description
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!category?.id || !onDelete) return;
    if (window.confirm(`هل أنت متأكد من حذف قسم "${category.name}" وجميع الأصناف التابعة له؟`)) {
      setLoading(true);
      try {
        await onDelete(category.id);
        onClose();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#13221a] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-white/10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {category ? 'تعديل قسم القائمة' : 'إضافة قسم جديد للقائمة'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Name AR */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              اسم القسم (بالعربية) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: مشويات ولحوم"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Name EN */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Category Name (English)
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Grilled Meats & BBQ"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              أيقونة القسم (Emoji)
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border cursor-pointer transition-transform ${
                    icon === emoji
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 scale-110 shadow-sm'
                      : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Image URL with Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              رابط صورة القسم (Image URL)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            {imageUrl && (
              <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              وصف مختصر للقسم
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: مشويات لحوم، كباب وكفتة حاتي وشيش طاووق على الفحم"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/10">
            {category && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف القسم</span>
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
                <span>{loading ? 'جاري الحفظ...' : 'حفظ القسم'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
