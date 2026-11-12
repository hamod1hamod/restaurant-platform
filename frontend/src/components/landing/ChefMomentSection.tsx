import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

interface Chapter {
  id: string;
  number: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  notes: string[];
  notesAr: string[];
  image: string;
}

const chapters: Chapter[] = [
  {
    id: 'wagyu',
    number: '01',
    title: '45-Day Dry-Aged Cuts & Cast-Iron Sear',
    titleAr: 'لحوم معتقة ٤٥ يوماً وشواء متقن',
    subtitle: 'Pure Black Angus and Wagyu marbling finished with smoked sea salt.',
    subtitleAr: 'لحم بلاك أنجوس وواغيو مع ملح البحر المدخن.',
    notes: [
      'Seared over hardwood embers for deep crust and tender center',
      'Paired with house truffle reduction and roasted garlic jus'
    ],
    notesAr: [
      'مشوية على الجمر لقشرة مقرمشة وقلب طري',
      'تقدم مع صلصة الترافل المنزلية والثوم المشوي'
    ],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'pizza',
    number: '02',
    title: '72-Hour Fermented Wood-Fired Dough',
    titleAr: 'عجينة مخمرة ٧٢ ساعة في فرن الحطب',
    subtitle: 'Stone-baked at 480°C with San Marzano tomatoes and fresh burrata.',
    subtitleAr: 'مخبوزة على الحجر مع طماطم سان مارزانو وجبنة البوراتا.',
    notes: [
      'Organic Caputo 00 flour rested for three days',
      'Blistered airy cornicione with wild basil and cold-pressed olive oil'
    ],
    notesAr: [
      'دقيق كابوتو العضوي بتخمير بطيء لمدة ثلاثة أيام',
      'أطراف هشة مع الريحان الطازج وزيت الزيتون البكر'
    ],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'coffee',
    number: '03',
    title: 'Single-Origin Espresso & House Roasts',
    titleAr: 'إسبريسو مختص وتحميص طازج يومياً',
    subtitle: 'Dialed in every morning for balanced sweetness, crema, and clarity.',
    subtitleAr: 'معايرة دقيقة كل صباح لتوازن النكهة والقوام.',
    notes: [
      'Washed Ethiopian and Colombian lots roasted in small batches',
      'Served alongside warm cardamom buns and dark Valrhona tarts'
    ],
    notesAr: [
      'محاصيل إثيوبية وكولومبية محمصة على دفعات صغيرة',
      'تقدم مع مخبوزات الهيل الدافئة وحلويات الشوكولاتة'
    ],
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80'
  }
];

export const ChefMomentSection: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';
  const [activeIndex, setActiveIndex] = useState(0);
  const current = chapters[activeIndex];

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % chapters.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + chapters.length) % chapters.length);

  return (
    <div className="py-20 lg:py-24 bg-[#ebebeb] dark:bg-[#1c3629] text-[#0d2a1c] dark:text-[#f5f5f5] border-b border-black/12 dark:border-white/12">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-10">
          <h2 className="font-display text-3xl sm:text-4xl text-[#0d2a1c] dark:text-white">
            {isAr ? 'فصول من مطبخ خطاب' : 'From the kitchen & café'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous chapter"
              className="taste-btn w-11 h-11 flex items-center justify-center border border-black/15 dark:border-white/15 bg-white dark:bg-[#0d2a1c] hover:border-black/40 cursor-pointer"
            >
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <span className="text-sm font-medium tabular-nums px-2 text-[#5f6b64] dark:text-[#a3a3a3]">
              {current.number} / 0{chapters.length}
            </span>
            <button
              onClick={handleNext}
              aria-label="Next chapter"
              className="taste-btn w-11 h-11 flex items-center justify-center border border-black/15 dark:border-white/15 bg-white dark:bg-[#0d2a1c] hover:border-black/40 cursor-pointer"
            >
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Photo-Chapters Layout: Large square-cornered photograph + clean ground panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white dark:bg-[#0d2a1c] border border-black/12 dark:border-white/12">
          <div className="lg:col-span-7 taste-photo-frame aspect-[4/3] bg-[#e5e5e5] dark:bg-[#1a1a1a]">
            <AnimatePresence mode="wait">
              <motion.img
                key={current.id}
                src={current.image}
                alt={isAr ? current.titleAr : current.title}
                initial={{ opacity: 0.4, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.4 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>

          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[13px] font-medium text-[#0d2a1c] tabular-nums">
                {isAr ? `الفصل ${current.number}` : `Chapter ${current.number}`}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-[#0d2a1c] dark:text-white leading-snug">
                {isAr ? current.titleAr : current.title}
              </h3>
              <p className="text-base text-[#5f6b64] dark:text-[#a3a3a3] leading-relaxed">
                {isAr ? current.subtitleAr : current.subtitle}
              </p>

              <ul className="space-y-2.5 pt-3 border-t border-black/10 dark:border-white/10 text-sm text-[#0d2a1c] dark:text-[#e5e5e5]">
                {(isAr ? current.notesAr : current.notes).map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 bg-[#0d2a1c] mt-2 shrink-0"></span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-black/10 dark:border-white/10">
              <a
                href="#menu"
                className="taste-link text-[15px] font-medium text-[#0d2a1c] dark:text-white"
              >
                <span>{isAr ? 'استكشف القائمة' : 'Explore the menu'}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4 text-[#0d2a1c]" /> : <ArrowRight className="w-4 h-4 text-[#0d2a1c]" />}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
