import React from 'react';
import { Tag, Copy, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const SpecialOffersSection: React.FC = () => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const offers = [
    {
      code: 'WELCOME10',
      title: isAr ? 'خصم ١٠٪ للطلب الأول' : '10% Off First Digital Order',
      description: isAr ? 'استخدم الكود عند الدفع للطلبات التي تزيد عن ٢٠$' : 'Apply at checkout on any order over $20',
      discount: '10% OFF'
    },
    {
      code: 'GOURMET20',
      title: isAr ? 'خصم ٢٠٪ للولائم العائلية' : '20% Gourmet Feast Discount',
      description: isAr ? 'صالح على طلبات المشويات والبيتزا لأكثر من ٥٠$' : 'Valid on grill platters & artisan pizza orders over $50',
      discount: '20% OFF'
    },
    {
      code: 'SAVE5',
      title: isAr ? 'وفر ٥$ على وجبتك المفضلة' : 'Instant $5 Cash Voucher',
      description: isAr ? 'خصم فوري مباشر على أي طلب بقيمة ٢٥$ فأكثر' : 'Instant deduction on any order of $25 or more',
      discount: '$5 OFF'
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="offers" className="py-20 bg-slate-950 text-white border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>{isAr ? 'عروض ترويجية وكوبونات' : 'Exclusive Promotions'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {t('nav.offers')}
          </h2>
          <p className="text-sm text-slate-400">
            {isAr
              ? 'انسخ أي كود خصم بضغطة زر وطبقه مباشرة في سلة المشتريات لتستمتع بأفضل الأسعار.'
              : 'Copy any coupon code with one click and redeem it in your cart for delicious savings.'}
          </p>
        </div>

        {/* Promo Cards with Taste-Skill 2px lift & tactile copy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map(offer => (
            <div
              key={offer.code}
              className="taste-card relative p-7 rounded-3xl bg-slate-900/90 border border-slate-800/80 flex flex-col justify-between space-y-6 shadow-sm overflow-hidden"
            >
              {/* Decorative Subtle Accent Light */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="space-y-3 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600/20 text-blue-400 font-black text-xs uppercase tracking-wider border border-blue-500/20">
                  <Sparkles className="w-3 h-3" />
                  <span>{offer.discount}</span>
                </div>
                
                <h3 className="font-extrabold text-xl text-white">
                  {offer.title}
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                  {offer.description}
                </p>
              </div>

              {/* Coupon Box */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 relative z-10">
                <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono font-black text-sm text-blue-300 tracking-wider">
                  {offer.code}
                </div>

                <button
                  onClick={() => handleCopy(offer.code)}
                  className={`taste-btn flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    copiedCode === offer.code
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 ring-1 ring-blue-400/30'
                  }`}
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isAr ? 'نسخ الكود' : 'Copy Code'}</span>
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
