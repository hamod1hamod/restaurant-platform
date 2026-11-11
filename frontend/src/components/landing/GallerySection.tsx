import React from 'react';
import { Camera } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const GallerySection: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const photos = [
    {
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      caption: isAr ? 'ستيك ريب آي مشوي على الفحم' : 'Wood-Fired Prime Ribeye'
    },
    {
      url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      caption: isAr ? 'برجر الأنجوس والكمأة' : 'Angus Truffle Burger'
    },
    {
      url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      caption: isAr ? 'بيتزا البوراتا الإيطالية' : 'Burrata Stonebaked Pizza'
    },
    {
      url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
      caption: isAr ? 'لافا كيك وآيس كريم فانيليا' : 'Chocolate Lava Decadence'
    },
    {
      url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      caption: isAr ? 'موهيتو باشن فروت منعش' : 'Passion Fruit Mocktail'
    },
    {
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      caption: isAr ? 'أجواء المطعم الراقية' : 'Bistro Dining Ambiance'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-zinc-900 border-t border-zinc-200/60 dark:border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>{isAr ? 'معرض الصور' : 'Visual Gallery'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50">
            {isAr ? 'لمحات من مطبخنا وأجوائنا' : 'A Glimpse of Our Culinary World'}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {isAr ? 'صور حقيقية لأشهى أطباقنا وأجواء صالتنا المصممة لراحتكم.' : 'Authentic snapshots from our kitchen, hearth, and dining room.'}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {photos.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-xs"
            >
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-white text-xs font-bold line-clamp-1">
                  {item.caption}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
