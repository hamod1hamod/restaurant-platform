import React from 'react';
import { Camera, ArrowLeft, ArrowRight } from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  isActive: boolean;
  onSelect: (category: Category) => void;
  onChangePhoto: (category: Category) => void;
  isRTL?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isActive,
  onSelect,
  onChangePhoto,
  isRTL = true
}) => {
  const itemCount = category.item_count ?? 0;

  return (
    <div
      onClick={() => onSelect(category)}
      className={`group relative flex flex-col p-3.5 sm:p-4 bg-white dark:bg-[#13221a] rounded-3xl border transition-all duration-300 cursor-pointer select-none ${
        isActive
          ? 'border-cyan-500 ring-2 ring-cyan-500/25 shadow-lg shadow-cyan-500/10'
          : 'border-slate-100 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12)] hover:-translate-y-0.5'
      }`}
    >
      {/* 1. Category Image Frame with Overlays */}
      <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
        <img
          src={category.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Subtle Dark Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Overlay: [ 📷 تغيير الصورة ] */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChangePhoto(category);
          }}
          title="تغيير صورة هذا القسم"
          className="absolute top-2.5 start-2.5 z-10 px-2.5 py-1 bg-black/65 hover:bg-black/85 backdrop-blur-md text-white text-[11px] font-medium rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>تغيير الصورة</span>
        </button>

        {/* Bottom Left Overlay: [ 4 صنف ] */}
        <div className="absolute bottom-2.5 start-2.5 z-10 px-2.5 py-1 bg-[#0b1b2b]/90 backdrop-blur-md text-cyan-400 font-bold text-xs rounded-md shadow-sm border border-cyan-500/20 tabular-nums">
          <span>{itemCount} صنف</span>
        </div>

        {/* Bottom Right Overlay: Circular Category Icon/Emoji */}
        <div className="absolute bottom-2.5 end-2.5 z-10 w-9 h-9 rounded-full bg-white/95 dark:bg-[#1a2d24] shadow-md flex items-center justify-center text-lg ring-2 ring-white/60 dark:ring-white/20 transform group-hover:rotate-6 transition-transform">
          <span>{category.icon || '🍽️'}</span>
        </div>
      </div>

      {/* 2. Category Title & Subtitle */}
      <div className="mt-3.5 space-y-1 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {category.name}
          </h3>
          <span className="text-base">{category.icon}</span>
        </div>

        {category.description && (
          <p className="text-xs sm:text-[13px] text-slate-400 dark:text-slate-400 line-clamp-1 leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* 3. Card Bottom Action Bar */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
        {/* Left: عرض الأصناف with Arrow */}
        <div className="flex items-center gap-1.5 text-cyan-500 dark:text-cyan-400 font-bold text-xs sm:text-sm group-hover:text-cyan-600 transition-colors">
          <span>عرض الأصناف</span>
          {isRTL ? (
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          ) : (
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          )}
        </div>

        {/* Right: تعديل الصورة button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChangePhoto(category);
          }}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>تعديل الصورة</span>
        </button>
      </div>
    </div>
  );
};
