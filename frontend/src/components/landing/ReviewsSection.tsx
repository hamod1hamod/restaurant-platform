import React, { useState } from 'react';
import { Star, MessageSquarePlus, User, CheckCircle2, X } from 'lucide-react';
import { Review } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

interface ReviewsSectionProps {
  reviews: Review[];
  onReviewSubmitted: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onReviewSubmitted
}) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const [modalOpen, setModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      await api.submitReview({
        customer_name: customerName,
        rating,
        comment
      });
      setSuccess(true);
      onReviewSubmitted();
      setTimeout(() => {
        setSuccess(false);
        setModalOpen(false);
        setCustomerName('');
        setComment('');
        setRating(5);
      }, 1800);
    } catch (err) {
      alert("Error submitting review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-200/60 dark:border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{isAr ? 'تقييمات وتجارب حقيقية' : 'Testimonials & Ratings'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50">
              {t('reviews.title')}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
              {isAr ? 'نفخر برضا زبائننا ونسعى دائماً لتقديم أشهى الأطباق وأرقى الخدمات.' : 'See what our loyal diners are saying about their flavorful journeys.'}
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{t('reviews.writeReview')}</span>
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(rev => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-blue-950/70 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
                    />
                  ))}
                </div>
                
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-blue-950/60">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-800 text-white flex items-center justify-center font-bold text-sm shadow-xs ring-1 ring-blue-400/40">
                  {rev.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {rev.customer_name}
                  </h4>
                  <span className="text-[11px] text-zinc-400">
                    {isAr ? 'زبون معتمد' : 'Verified Diner'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                  {t('reviews.submitted')}
                </h3>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                  {t('reviews.writeReview')}
                </h3>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t('reviews.name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder={isAr ? 'محمد العلي' : 'e.g. Alex Morgan'}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-blue-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('reviews.rating')}
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 ml-2">
                      {rating} / 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('reviews.comment')} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder={isAr ? 'ما رأيك في المذاق وسرعة الخدمة؟' : 'Share your dining experience...'}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-blue-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer ring-1 ring-blue-400/30"
                >
                  {submitting ? '...' : t('reviews.submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
