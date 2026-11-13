import React, { useState, useEffect } from 'react';
import { X, Camera, Check, Sparkles } from 'lucide-react';
import { Category } from '../types';

interface PhotoChangeModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSavePhoto: (categoryId: string, newImageUrl: string) => Promise<void>;
}

const PRESET_PHOTOS = [
  {
    title: 'مشويات ولحوم فاخرة',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'كباب وكفتة حاتي على الفحم',
    url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'برجر بقري وسندوتشات',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'برجر دبل تشيز شهي',
    url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'بيتزا إيطالية ببيروني وموتزاريلا',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'بيتزا فور تشيز بالفرن',
    url: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'وجبات رئيسية ودجاج شواية',
    url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'طاجن لحمة موزة شرقي',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'مقبلات وبطاطس مبهّرة مقلية',
    url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'مشروبات وعصائر طبيعية منعشة',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'حلويات شرقية وأم علي ملوكي',
    url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
  }
];

export const PhotoChangeModal: React.FC<PhotoChangeModalProps> = ({
  isOpen,
  category,
  onClose,
  onSavePhoto
}) => {
  const [selectedUrl, setSelectedUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setSelectedUrl(category.image_url || '');
      setCustomUrl(category.image_url || '');
    }
  }, [category, isOpen]);

  if (!isOpen || !category) return null;

  const handleSelectPreset = (url: string) => {
    setSelectedUrl(url);
    setCustomUrl(url);
  };

  const handleSave = async () => {
    if (!category.id || !customUrl.trim()) return;
    setSaving(true);
    try {
      await onSavePhoto(category.id, customUrl.trim());
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#13221a] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-white/10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                تغيير صورة قسم: {category.name} {category.icon}
              </h3>
              <p className="text-xs text-slate-400">
                اختر صورة من النماذج المقترحة أو الصق رابط صورة خارجية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview */}
        <div className="mt-5 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            معاينة الصورة الحالية:
          </label>
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 shadow-inner">
            <img
              src={customUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 start-3 px-3 py-1 bg-black/75 backdrop-blur-md text-white text-xs font-medium rounded-lg flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{category.name}</span>
            </div>
          </div>
        </div>

        {/* Custom Image URL Input */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            رابط صورة مخصصة (Image URL):
          </label>
          <input
            type="url"
            value={customUrl}
            onChange={(e) => {
              setCustomUrl(e.target.value);
              setSelectedUrl(e.target.value);
            }}
            placeholder="https://..."
            className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Quick Presets Grid */}
        <div className="mt-5 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            صور مقترحة عالية الجودة:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
            {PRESET_PHOTOS.map((preset, idx) => {
              const isSelected = selectedUrl === preset.url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`group/preset relative aspect-[4/3] rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-500 ring-2 ring-cyan-500/30 scale-95 shadow-md'
                      : 'border-transparent hover:border-slate-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                    <span className="text-[10px] text-white font-medium truncate w-full">
                      {preset.title}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 end-1.5 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-200"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !customUrl.trim()}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#0b1b2b] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{saving ? 'جاري الحفظ...' : 'تطبيق الصورة الجديدة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
