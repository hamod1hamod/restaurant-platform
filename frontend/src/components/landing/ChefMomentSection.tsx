import React, { useState } from 'react';
import { Sparkles, Utensils, Flame, Award, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

interface TastingCraft {
  id: string;
  category: string;
  categoryAr: string;
  dishName: string;
  dishNameAr: string;
  tagline: string;
  taglineAr: string;
  craftNotes: string[];
  craftNotesAr: string[];
  image: string;
  flavorProfile: string[];
  pairing: string;
  pairingAr: string;
}

const crafts: TastingCraft[] = [
  {
    id: 'wagyu',
    category: 'Prime Grills',
    categoryAr: 'مشويات فاخرة',
    dishName: 'Truffle Wagyu Supreme & Prime Ribeye',
    dishNameAr: 'واغيو ترافل برجر وريب آي معتق',
    tagline: '45-Day Dry Aging & Cast-Iron Sear',
    taglineAr: 'تعتيق جاف لمدة ٤٥ يوماً وشواء على الحطب',
    craftNotes: [
      'Pure Black Angus & A5 Wagyu marbling',
      'Infused with French black truffle reduction',
      'Artisan smoked Maldon sea salt finish'
    ],
    craftNotesAr: [
      'لحم واغيو معتق بنسبة دهون رخامية استثنائية',
      'صلصة ترافل أسود فرنسي محضرة طازجة',
      'ملح مالدون المدخن لإبراز النكهة الأصلية'
    ],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    flavorProfile: ['Rich Umami', 'Smoked Oak', 'Savory Truffle'],
    pairing: 'Fresh Blackberry Mojito or Cold Brew',
    pairingAr: 'موهيتو التوت البري المنعش أو قهوة مثلجة'
  },
  {
    id: 'pizza',
    category: 'Wood-Fired Pizza',
    categoryAr: 'بيتزا إيطالية على الحطب',
    dishName: 'Artisan Neapolitan Margherita & Burrata',
    dishNameAr: 'مارغريتا نابولية وجبنة البوراتا الطازجة',
    tagline: '72-Hour Fermented Dough Baked at 480°C',
    taglineAr: 'تخمير بطيء لمدة ٧٢ ساعة وخبز في فرن الحطب',
    craftNotes: [
      'Italian Caputo 00 organic flour',
      'Crushed San Marzano D.O.P. tomatoes',
      'Creamy fresh buffalo burrata & wild basil'
    ],
    craftNotesAr: [
      'دقيق كابوتو الإيطالي العضوي الفاخر',
      'طماطم سان مارزانو الإيطالية المحمية',
      'جبنة بوراتا طازجة مع أوراق الريحان البري'
    ],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    flavorProfile: ['Charred Crust', 'Sweet Acidic Tomato', 'Milky Cream'],
    pairing: 'Sparkling Lemon & Mint Cooler',
    pairingAr: 'ليموناضة غازية بالنعناع الطبيعي'
  },
  {
    id: 'pasta',
    category: 'Bronze-Die Pasta',
    categoryAr: 'باستا إيطالية طازجة',
    dishName: 'Tuscan Truffle Fettuccine & Wild Mushrooms',
    dishNameAr: 'فيتوتشيني الترافل والفطر البري',
    tagline: 'Extruded Daily Through Bronze Dies for Sauce Cling',
    taglineAr: 'تشكيل الباستا طازجة يومياً للحصول على قوام مثالي',
    craftNotes: [
      'Organic durum wheat semolina & farm eggs',
      'Slow-reduced wild porcini mushroom broth',
      '24-Month aged Parmigiano-Reggiano dusting'
    ],
    craftNotesAr: [
      'سميد القمح الصلب العضوي مع صفار بيض المزارع',
      'مرق فطر البورسيني البري المركز',
      'جبنة بارميجيانو ريجانو معتقة ٢٤ شهراً'
    ],
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281728?auto=format&fit=crop&w=1200&q=80',
    flavorProfile: ['Silky Texture', 'Earthy Forest Porcini', 'Sharp Parmesan'],
    pairing: 'Chilled Citrus Hibiscus Splash',
    pairingAr: 'كركديه بارد بالحمضيات المنعشة'
  },
  {
    id: 'dessert',
    category: 'Haute Pâtisserie',
    categoryAr: 'حلويات فرنسية فاخرة',
    dishName: 'Dark Valrhona Chocolate Lava Sphere',
    dishNameAr: 'لافا كيك الشوكولاتة الفرنسية الداكنة',
    tagline: '70% Pure Single-Origin Cocoa & Madagascar Vanilla',
    taglineAr: 'كاكاو فرنسي فاخر ٧٠٪ مع فانيليا مدغشقر',
    craftNotes: [
      'Molten warm center with hazelnut praline',
      'House-spun Tahitian vanilla bean gelato',
      'Gold leaf & salted caramel drizzle'
    ],
    craftNotesAr: [
      'قلب الشوكولاتة الدافئ الذائب مع البرالينيه',
      'جيلاتو الفانيليا المحضر يدوياً بأعواد الفانيليا',
      'كراميل مملح ولمسات من رقائق الذهب'
    ],
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80',
    flavorProfile: ['Bittersweet Cocoa', 'Velvety Molten', 'Cool Bourbon Vanilla'],
    pairing: 'Specialty Double Espresso',
    pairingAr: 'إسبريسو مزدوج من حبوب بن مختصة'
  }
];

export const ChefMomentSection: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';
  const [activeCraftId, setActiveCraftId] = useState<string>('wagyu');

  const currentCraft = crafts.find(c => c.id === activeCraftId) || crafts[0];

  return (
    <section className="py-20 lg:py-28 bg-slate-950 text-white border-y border-slate-800/80 relative overflow-hidden">
      
      {/* Subtle Ambiance Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{isAr ? 'حرفة الطهي وفلسفة المذاق' : 'Culinary Craft & Flavor Philosophy'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {isAr ? 'تجربة حواس متكاملة تبدأ من المكونات' : 'A Multisensory Experience in Every Bite'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            {isAr
              ? 'نختار أجود المكونات العضوية ونطهوها بأدق التقنيات العالمية لنقدم لك أطباقاً لا تُنسى.'
              : 'Every dish on our menu is an expression of culinary discipline, artisan technique, and obsessive sourcing.'}
          </p>
        </div>

        {/* Craft Selector Tabs (Taste-Skill interactive layer) */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10 pb-2 border-b border-slate-800/80">
          {crafts.map(c => {
            const isSelected = c.id === activeCraftId;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCraftId(c.id)}
                className={`taste-btn px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/50'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {isAr ? c.categoryAr : c.category}
              </button>
            );
          })}
        </div>

        {/* Showcase Grid with Animated Crossfade */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-slate-900/60 rounded-3xl border border-slate-800/80 p-6 sm:p-10 backdrop-blur-md">
          
          {/* Left Column: Craft Details */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-400">
                {isAr ? currentCraft.taglineAr : currentCraft.tagline}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {isAr ? currentCraft.dishNameAr : currentCraft.dishName}
              </h3>
            </div>

            {/* Craftsmanship Bullet Points */}
            <div className="space-y-3 pt-2">
              {(isAr ? currentCraft.craftNotesAr : currentCraft.craftNotes).map((note, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Utensils className="w-3.5 h-3.5" />
                  </div>
                  <span>{note}</span>
                </div>
              ))}
            </div>

            {/* Flavor Profile Pills */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                {isAr ? 'ملامح النكهة العطرية:' : 'Tasting Notes & Profile:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {currentCraft.flavorProfile.map((prof, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200"
                  >
                    {prof}
                  </span>
                ))}
              </div>
            </div>

            {/* Sommelier / Chef Pairing Suggestion */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isAr ? 'اقتراح الشيف للشرب والطلب:' : "Chef's Recommended Pairing:"}
                </span>
                <span className="text-sm font-black text-blue-300">
                  {isAr ? currentCraft.pairingAr : currentCraft.pairing}
                </span>
              </div>
              
              <a
                href="#menu"
                className="taste-btn flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 cursor-pointer"
              >
                <span>{isAr ? 'طلب الآن' : 'Order Now'}</span>
                {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </a>
            </div>

          </div>

          {/* Right Column: Hero Craft Photography */}
          <div className="lg:col-span-6 relative">
            <div className="taste-photo-frame relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentCraft.id}
                  src={currentCraft.image}
                  alt={isAr ? currentCraft.dishNameAr : currentCraft.dishName}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Artisan Seal Badge */}
              <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 px-3 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-white text-xs font-black backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                <Award className="w-3.5 h-3.5 text-blue-400" />
                <span>{isAr ? 'وصفة شيف معتمدة' : 'Master Chef Recipe'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
