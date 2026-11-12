import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const SpecialOffersSection: React.FC = () => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const offers = [
    {
      code: 'WELCOME10',
      title: isAr ? 'خصم ١٠٪ للطلب الأول' : '10% off your first online order',
      description: isAr ? 'استخدم الكود عند الدفع للطلبات التي تزيد عن ٢٠$' : 'Apply at checkout on any order over $20.',
      discount: '10% OFF'
    },
    {
      code: 'KHATAB20',
      title: isAr ? 'خصم ٢٠٪ للولائم العائلية' : '20% off family & grill platters',
      description: isAr ? 'صالح على طلبات المشويات والبيتزا لأكثر من ٥٠$' : 'Valid on grill platters and wood-fired pizzas over $50.',
      discount: '20% OFF'
    },
    {
      code: 'SAVE5',
      title: isAr ? 'وفر ٥$ على وجبتك المفضلة' : '$5 off orders over $25',
      description: isAr ? 'خصم فوري مباشر على أي طلب بقيمة ٢٥$ فأكثر' : 'Instant deduction on dine-in, pickup, or delivery over $25.',
      discount: '$5 OFF'
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section
      id="offers"
      className="py-20 lg:py-24 bg-white dark:bg-[#0d2a1c] text-[#0d2a1c] dark:text-[#f5f5f5] border-b border-black/12 dark:border-white/12"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-10">
          <h2 className="font-display text-3xl sm:text-4xl text-[#0d2a1c] dark:text-white">
            {t('nav.offers')}
          </h2>
          <p className="text-base text-[#5f6b64] dark:text-[#a3a3a3]">
            {isAr
              ? 'انسخ كود الخصم وطبقه في سلة المشتريات.'
              : 'Copy a voucher code to apply directly in your cart.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map(offer => (
            <div
              key={offer.code}
              className="taste-card p-7 bg-[#ebebeb] dark:bg-[#1c3629] border border-black/12 dark:border-white/12 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-1 bg-[#0d2a1c] text-white font-medium text-xs tabular-nums">
                  {offer.discount}
                </span>

                <h3 className="font-display text-2xl text-[#0d2a1c] dark:text-white">
                  {offer.title}
                </h3>

                <p className="text-sm text-[#5f6b64] dark:text-[#a3a3a3] leading-relaxed">
                  {offer.description}
                </p>
              </div>

              <div className="pt-4 border-t border-black/12 dark:border-white/12 flex items-center justify-between gap-3">
                <code className="px-3 py-2 bg-white dark:bg-[#0d2a1c] border border-black/15 dark:border-white/15 font-mono font-semibold text-sm text-[#0d2a1c] dark:text-white tracking-wider">
                  {offer.code}
                </code>

                <button
                  onClick={() => handleCopy(offer.code)}
                  className={`taste-btn h-10 px-4 flex items-center gap-1.5 text-sm font-medium cursor-pointer ${
                    copiedCode === offer.code
                      ? 'bg-[#0d2a1c] text-white'
                      : 'bg-[#0d2a1c] hover:bg-[#1c3629] text-white'
                  }`}
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تم النسخ' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isAr ? 'نسخ الكود' : 'Copy code'}</span>
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
