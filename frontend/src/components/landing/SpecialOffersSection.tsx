import React from 'react';
import { Tag, Sparkles, Copy, Check, Percent } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';

export const SpecialOffersSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { applyCoupon } = useCart();
  const isAr = language === 'ar';
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const offers = [
    {
      code: 'WELCOME10',
      title: isAr ? 'خصم ١٠٪ للطلب الأول' : '10% Off First Digital Order',
      description: isAr ? 'استخدم الكود عند الدفع للطلبات التي تزيد عن ٢٠$' : 'Apply at checkout on any order over $20',
      discount: '10% OFF',
      color: 'from-orange-600 to-amber-600'
    },
    {
      code: 'GOURMET20',
      title: isAr ? 'خصم ٢٠٪ للولائم العائلية' : '20% Gourmet Feast Discount',
      description: isAr ? 'صالح على طلبات المشويات والبيتزا لأكثر من ٤٠$' : 'Valid on grill platters & artisan pizza orders over $40',
      discount: '20% OFF',
      color: 'from-rose-600 to-orange-600'
    },
    {
      code: 'SAVE5',
      title: isAr ? 'وفر ٥$ على وجبتك المفضلة' : 'Instant $5 Cash Voucher',
      description: isAr ? 'خصم فوري مباشر على أي طلب بقيمة ٢٥$ فأكثر' : 'Instant deduction on any order of $25 or more',
      discount: '$5 OFF',
      color: 'from-emerald-600 to-teal-600'
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="offers" className="py-16 sm:py-20 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>{isAr ? 'عروض ترويجية وكوبونات' : 'Exclusive Promotions'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50">
            {t('nav.offers')}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {isAr
              ? 'انسخ أي كود خصم بضغطة زر وطبقه مباشرة في سلة المشتريات لتستمتع بأفضل الأسعار.'
              : 'Copy any coupon code with one click and redeem it in your cart for delicious savings.'}
          </p>
        </div>

        {/* Promo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map(offer => (
            <div
              key={offer.code}
              className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 p-6 flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-orange-600 text-white font-black text-xs">
                    {offer.discount}
                  </span>
                  <Percent className="w-4 h-4 text-orange-500" />
                </div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100">
                  {offer.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {offer.description}
                </p>
              </div>

              {/* Code Banner */}
              <div className="mt-6 pt-4 border-t border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <span className="font-mono font-black text-base tracking-wider text-orange-600 dark:text-orange-400">
                  {offer.code}
                </span>
                <button
                  onClick={() => handleCopy(offer.code)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 font-bold">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{isAr ? 'نسخ الكود' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
