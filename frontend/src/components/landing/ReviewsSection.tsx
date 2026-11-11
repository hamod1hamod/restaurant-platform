import React, { useState } from 'react';
import { Star, MessageSquarePlus, User, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
    <section id="reviews" className="py-20 lg:py-28 bg-slate-950 text-white border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-blue-400" />
              <span>{isAr ? 'تقييمات وتجارب حقيقية' : 'Testimonials & Ratings'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {t('reviews.title')}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              {isAr ? 'نفخر برضا زبائننا ونسعى دائماً لتقديم أشهى الأطباق وأرقى الخدمات.' : 'See what our loyal diners are saying about their flavorful journeys.'}
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="taste-btn inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 cursor-pointer ring-1 ring-blue-400/40"
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
              className="taste-card p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                    />
                  ))}
                </div>
                
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-800 text-white flex items-center justify-center font-bold text-sm shadow-xs ring-1 ring-blue-400/40">
                  {rev.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {rev.customer_name}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {isAr ? 'زبون معتمد' : 'Verified Diner'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Submission Modal with AnimatePresence */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl z-10 space-y-6 text-white"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xl text-white">
                  {t('reviews.writeReview')}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="taste-btn p-2 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {success ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <p className="font-extrabold text-white text-base">
                    {isAr ? 'شكراً لك! تم إرسال تقييمك بنجاح.' : 'Thank you! Your review has been submitted.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {isAr ? 'اسمك الكريم' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder={isAr ? 'مثال: محمد العمري' : 'e.g. Alex Morgan'}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {isAr ? 'التقييم' : 'Rating'}
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="taste-btn p-1 text-2xl cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {isAr ? 'رأيك وتجربتك' : 'Your Experience'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder={isAr ? 'ما الذي نال إعجابك في الأطباق والخدمة؟' : 'What did you enjoy most about the food and service?'}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="taste-btn w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? '...' : (isAr ? 'نشر التقييم' : 'Submit Review')}
                  </button>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
