import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, X } from 'lucide-react';
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
    } catch {
      alert('Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="reviews"
      className="py-20 lg:py-24 bg-[#ebebeb] dark:bg-[#1c3629] text-[#0d2a1c] dark:text-[#f5f5f5] border-b border-black/12 dark:border-white/12"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#0d2a1c] dark:text-white">
              {t('reviews.title')}
            </h2>
            <p className="text-base text-[#5f6b64] dark:text-[#a3a3a3] mt-1.5 max-w-xl">
              {isAr ? 'آراء ضيوف مطعم وكافيه خطاب.' : 'Notes from guests at Khatab Restaurant & Café.'}
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="taste-btn h-11 px-5 inline-flex items-center gap-2 bg-[#0d2a1c] hover:bg-[#1c3629] text-white font-medium text-sm cursor-pointer shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{t('reviews.writeReview')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(rev => (
            <div
              key={rev.id}
              className="taste-card p-6 bg-white dark:bg-[#0d2a1c] border border-black/12 dark:border-white/12 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#0d2a1c]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'fill-[#0d2a1c] text-[#0d2a1c]' : 'text-black/15 dark:text-white/15'}`}
                    />
                  ))}
                </div>

                <p className="text-base text-[#0d2a1c] dark:text-[#e5e5e5] leading-relaxed">
                  “{rev.comment}”
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <div className="w-9 h-9 bg-[#ebebeb] dark:bg-[#1a1a1a] border border-black/12 dark:border-white/12 text-[#0d2a1c] dark:text-white flex items-center justify-center font-medium text-sm">
                  {rev.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-[#0d2a1c] dark:text-white">
                    {rev.customer_name}
                  </h4>
                  <span className="text-xs text-[#5f6b64] dark:text-[#a3a3a3]">
                    {isAr ? 'ضيف معتمد' : 'Verified Guest'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/60"
            />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0d2a1c] border border-black/15 dark:border-white/15 p-6 sm:p-8 z-10 space-y-6 text-[#0d2a1c] dark:text-white"
            >
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <h3 className="font-display text-2xl text-[#0d2a1c] dark:text-white">
                  {t('reviews.writeReview')}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  aria-label="Close"
                  className="taste-btn w-9 h-9 flex items-center justify-center border border-black/15 dark:border-white/15 text-[#5f6b64] hover:text-[#0d2a1c] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {success ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#0d2a1c] mx-auto" />
                  <p className="font-medium text-base">
                    {isAr ? 'شكراً لك! تم إرسال تقييمك بنجاح.' : 'Thank you! Your review has been submitted.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3] mb-1.5">
                      {isAr ? 'اسمك الكريم' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder={isAr ? 'مثال: محمد العمري' : 'e.g. Alex Morgan'}
                      className="w-full h-11 px-4 rounded-[2px] bg-[#ebebeb] dark:bg-[#1c3629] border border-black/15 dark:border-white/15 text-sm focus:outline-none focus:border-[#0d2a1c]"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3] mb-1.5">
                      {isAr ? 'التقييم' : 'Rating'}
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="taste-btn p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${star <= rating ? 'fill-[#0d2a1c] text-[#0d2a1c]' : 'text-black/15 dark:text-white/15'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3] mb-1.5">
                      {isAr ? 'رأيك وتجربتك' : 'Your Experience'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder={isAr ? 'ما الذي نال إعجابك في الأطباق والخدمة؟' : 'What did you enjoy most about the food and service?'}
                      className="w-full p-4 rounded-[2px] bg-[#ebebeb] dark:bg-[#1c3629] border border-black/15 dark:border-white/15 text-sm focus:outline-none focus:border-[#0d2a1c]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="taste-btn w-full h-12 bg-[#0d2a1c] hover:bg-[#1c3629] text-white font-medium text-sm cursor-pointer disabled:opacity-50"
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
