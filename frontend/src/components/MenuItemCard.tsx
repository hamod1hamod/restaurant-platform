import React, { useState } from 'react';
import { Plus, Check, Edit2, Trash2 } from 'lucide-react';
import { MenuItem, ItemSize } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  currencySymbol?: string;
  onAddToCart?: (item: MenuItem, selectedSize: ItemSize) => void;
  isAdmin?: boolean;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  currencySymbol = 'ج.م',
  onAddToCart,
  isAdmin = false,
  onEdit,
  onDelete
}) => {
  // Default to first size or a regular size
  const sizes = item.sizes && item.sizes.length > 0
    ? item.sizes
    : [{ name: 'حجم عادي', price: 100 }];

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const selectedSize = sizes[selectedSizeIndex] || sizes[0];

  const handleAdd = () => {
    if (!item.is_available) return;
    if (onAddToCart) {
      onAddToCart(item, selectedSize);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1200);
    }
  };

  return (
    <div className="group relative flex flex-col p-3.5 sm:p-4 bg-white dark:bg-[#13221a] rounded-3xl border border-slate-100 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 select-none">
      {/* 1. Item Image Box */}
      <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Selected Size Price Badge on Image */}
        <div className="absolute bottom-2.5 start-2.5 z-10 px-3 py-1 bg-[#0b1b2b]/90 backdrop-blur-md text-cyan-400 font-bold text-sm rounded-lg shadow-sm border border-cyan-500/20 tabular-nums">
          <span>{selectedSize.price} {currencySymbol}</span>
        </div>

        {/* Availability Badge */}
        {!item.is_available && (
          <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1.5 bg-red-600/90 text-white font-bold text-xs rounded-lg shadow-md">
              غير متوفر حالياً
            </span>
          </div>
        )}

        {/* Admin Quick Action Pills */}
        {isAdmin && (
          <div className="absolute top-2.5 end-2.5 z-10 flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(item);
              }}
              title="تعديل الصنف"
              className="p-1.5 bg-black/70 hover:bg-black text-white rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(item);
              }}
              title="حذف الصنف"
              className="p-1.5 bg-red-900/80 hover:bg-red-800 text-white rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-200" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Item Name & Description */}
      <div className="mt-3.5 space-y-1.5 flex-1">
        <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
          {item.name}
        </h4>

        {item.description && (
          <p className="text-xs sm:text-[13px] text-slate-400 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* 3. Dynamic Sizes & Prices List */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-white/10 space-y-2">
        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400">
          اختر الحجم والسعر:
        </div>

        {/* Size Selection Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {sizes.map((s, idx) => {
            const isSelected = idx === selectedSizeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedSizeIndex(idx)}
                className={`px-2 py-1.5 rounded-xl text-xs font-medium transition-all text-center flex flex-col items-center justify-center cursor-pointer border ${
                  isSelected
                    ? 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-500 text-cyan-700 dark:text-cyan-300 font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span className="truncate w-full text-[11px]">{s.name}</span>
                <span className="tabular-nums font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                  {s.price} {currencySymbol}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Action Button: Add to Cart */}
      <div className="mt-3.5 pt-1">
        <button
          type="button"
          disabled={!item.is_available}
          onClick={handleAdd}
          className={`w-full h-10 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
            addedAnimation
              ? 'bg-emerald-600 text-white'
              : !item.is_available
              ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed'
              : 'bg-[#0d2a1c] hover:bg-[#1a4430] text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-[#0b1b2b] active:scale-98'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>تمت الإضافة للطلب!</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>إضافة للطلب ({selectedSize.price} {currencySymbol})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
