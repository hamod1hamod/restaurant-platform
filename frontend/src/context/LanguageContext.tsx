import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; ar: string }> = {
  // Navigation & General
  'nav.home': { en: 'Home', ar: 'الرئيسية' },
  'nav.menu': { en: 'Menu', ar: 'قائمة الطعام' },
  'nav.bestsellers': { en: 'Best Sellers', ar: 'الأكثر طلباً' },
  'nav.offers': { en: 'Special Offers', ar: 'العروض الخاصة' },
  'nav.about': { en: 'About Us', ar: 'من نحن' },
  'nav.reviews': { en: 'Reviews', ar: 'آراء العملاء' },
  'nav.contact': { en: 'Contact & Location', ar: 'التواصل والموقع' },
  'nav.adminPortal': { en: 'Admin Portal', ar: 'لوحة التحكم' },
  'nav.cart': { en: 'Cart', ar: 'السلة' },
  
  // Hero
  'hero.exploreMenu': { en: 'Explore Menu', ar: 'استكشف القائمة' },
  'hero.orderNow': { en: 'Order Now', ar: 'اطلب الآن' },
  'hero.whatsappOrder': { en: 'WhatsApp Order', ar: 'طلب عبر واتساب' },
  'hero.openNow': { en: 'Open Now', ar: 'مفتوح الآن' },
  
  // Menu & Filters
  'menu.searchPlaceholder': { en: 'Search dishes, pizzas, burgers, drinks...', ar: 'ابحث عن أطباق، بيتزا، برجر، مشروبات...' },
  'menu.allCategories': { en: 'All Categories', ar: 'جميع الأقسام' },
  'menu.filterVegetarian': { en: 'Vegetarian', ar: 'نباتي' },
  'menu.filterSpicy': { en: 'Spicy', ar: 'حار' },
  'menu.filterBestseller': { en: 'Popular', ar: 'الأكثر شعبية' },
  'menu.filterNew': { en: 'New', ar: 'جديد' },
  'menu.sortBy': { en: 'Sort by', ar: 'ترتيب حسب' },
  'menu.sortDefault': { en: 'Featured', ar: 'المميزة' },
  'menu.sortPriceAsc': { en: 'Price: Low to High', ar: 'السعر: من الأقل للأعلى' },
  'menu.sortPriceDesc': { en: 'Price: High to Low', ar: 'السعر: من الأعلى للأقل' },
  'menu.sortNewest': { en: 'Newest Arrivals', ar: 'أحدث الإضافات' },
  'menu.noProductsFound': { en: 'No dishes match your filter criteria.', ar: 'لا توجد أطباق تطابق خيارات البحث الحالية.' },
  
  // Product Card & Modal
  'product.addToCart': { en: 'Add to Cart', ar: 'إضافة للسلة' },
  'product.customize': { en: 'Customize', ar: 'تخصيص' },
  'product.selectSize': { en: 'Select Size', ar: 'اختر الحجم' },
  'product.extrasOptions': { en: 'Optional Extras & Add-ons', ar: 'إضافات وخيارات اختيارية' },
  'product.specialInstructions': { en: 'Special Instructions (e.g. no onions, sauce on the side)', ar: 'ملاحظات خاصة (مثل: بدون بصل، صوص جانبي)' },
  'product.ingredients': { en: 'Ingredients', ar: 'المكونات' },
  'product.calories': { en: 'Calories', ar: 'السعرات' },
  'product.prepTime': { en: 'Prep Time', ar: 'وقت التحضير' },
  'product.mins': { en: 'mins', ar: 'دقيقة' },
  'product.soldOut': { en: 'Sold Out', ar: 'نفد من المخزون' },

  // Cart & Checkout
  'cart.title': { en: 'Your Order Cart', ar: 'سلة مشترياتك' },
  'cart.empty': { en: 'Your cart is currently empty.', ar: 'سلتك فارغة حالياً.' },
  'cart.startBrowsing': { en: 'Browse Menu Dishes', ar: 'تصفح قائمة الطعام' },
  'cart.subtotal': { en: 'Subtotal', ar: 'المجموع الفرعي' },
  'cart.deliveryFee': { en: 'Delivery Fee', ar: 'رسوم التوصيل' },
  'cart.discount': { en: 'Discount', ar: 'الخصم' },
  'cart.total': { en: 'Total Amount', ar: 'المجموع الإجمالي' },
  'cart.promoPlaceholder': { en: 'Enter coupon code (e.g. WELCOME10)', ar: 'أدخل كود الخصم (مثل: WELCOME10)' },
  'cart.apply': { en: 'Apply', ar: 'تطبيق' },
  'cart.checkoutBtn': { en: 'Proceed to Checkout', ar: 'متابعة إتمام الطلب' },

  // Checkout Modal
  'checkout.title': { en: 'Complete Your Order', ar: 'إتمام بيانات الطلب' },
  'checkout.orderType': { en: 'Order Type', ar: 'نوع الطلب' },
  'checkout.delivery': { en: 'Home Delivery', ar: 'توصيل للمنزل' },
  'checkout.pickup': { en: 'Store Pickup', ar: 'استلام من الفرع' },
  'checkout.dineIn': { en: 'Dine-In Table', ar: 'تناول داخل المطعم' },
  'checkout.fullName': { en: 'Full Name', ar: 'الاسم الكامل' },
  'checkout.phone': { en: 'Phone Number', ar: 'رقم الهاتف' },
  'checkout.email': { en: 'Email (Optional)', ar: 'البريد الإلكتروني (اختياري)' },
  'checkout.deliveryAddress': { en: 'Full Delivery Address', ar: 'عنوان التوصيل بالتفصيل' },
  'checkout.tableNumber': { en: 'Table Number', ar: 'رقم الطاولة' },
  'checkout.notes': { en: 'Order Notes / Delivery Directions', ar: 'ملاحظات الطلب أو إرشادات التوصيل' },
  'checkout.paymentMethod': { en: 'Payment Method', ar: 'طريقة الدفع' },
  'checkout.cashOnDelivery': { en: 'Cash on Delivery', ar: 'الدفع عند الاستلام' },
  'checkout.cash': { en: 'Cash / Pay at Counter', ar: 'نقداً عند الاستلام' },
  'checkout.card': { en: 'Credit/Debit Card (Online)', ar: 'بطاقة ائتمانية (أونلاين)' },
  'checkout.submitOrder': { en: 'Confirm & Place Order', ar: 'تأكيد وإرسال الطلب' },
  'checkout.successTitle': { en: 'Order Placed Successfully!', ar: 'تم استلام طلبك بنجاح!' },
  'checkout.orderNumberIs': { en: 'Your Order Number:', ar: 'رقم طلبك المرجعي:' },
  'checkout.trackOrderMessage': { en: 'Our kitchen has received your order and is preparing it with passion.', ar: 'تم استلام طلبك في المطبخ ويجري تحضيره بكل عناية.' },
  'checkout.done': { en: 'Back to Menu', ar: 'العودة للقائمة' },

  // Reviews & Feedback
  'reviews.title': { en: 'Customer Love & Stories', ar: 'آراء وشهادات زبائننا' },
  'reviews.writeReview': { en: 'Leave a Review', ar: 'اكتب تقييمك' },
  'reviews.name': { en: 'Your Name', ar: 'اسمك الكريم' },
  'reviews.rating': { en: 'Rating (1 - 5 stars)', ar: 'التقييم (١ - ٥ نجوم)' },
  'reviews.comment': { en: 'Your Review Experience', ar: 'تجربتك ورأيك في المأكولات والخدمة' },
  'reviews.submit': { en: 'Submit Review', ar: 'إرسال التقييم' },
  'reviews.submitted': { en: 'Thank you! Your review has been submitted.', ar: 'شكراً جزيلاً! تم نشر تقييمك بنجاح.' },

  // Admin Dashboard
  'admin.dashboard': { en: 'Overview Analytics', ar: 'لوحة الإحصائيات' },
  'admin.categories': { en: 'Categories', ar: 'إدارة الأقسام' },
  'admin.products': { en: 'Food & Drink Menu', ar: 'إدارة قائمة الطعام' },
  'admin.orders': { en: 'Live Orders', ar: 'إدارة الطلبات' },
  'admin.pricing': { en: 'Pricing & Coupons', ar: 'الأسعار والكوبونات' },
  'admin.settings': { en: 'Restaurant & Branding', ar: 'إعدادات المطعم والصفحة' },
  'admin.customers': { en: 'Customer CRM', ar: 'سجل العملاء' },
  'admin.reports': { en: 'Sales Reports', ar: 'التقارير المالية' },
  'admin.logout': { en: 'Sign Out', ar: 'تسجيل الخروج' },
  'admin.viewSite': { en: 'View Public Site', ar: 'زيارة الموقع الرئيسي' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('restaurant_lang') as Language) || 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('restaurant_lang', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, isRTL, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
