import React, { useState, useEffect } from 'react';
import {
  LanguageProvider, useLanguage
} from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { Category, Product, RestaurantSettings, Review } from './types';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Landing Components
import { HeroSection } from './components/landing/HeroSection';
import { CategoryBar } from './components/landing/CategoryBar';
import { FilterBar } from './components/landing/FilterBar';
import { ProductCard } from './components/landing/ProductCard';
import { ProductModal } from './components/landing/ProductModal';
import { BestSellersSection } from './components/landing/BestSellersSection';
import { ChefMomentSection } from './components/landing/ChefMomentSection';
import { SpecialOffersSection } from './components/landing/SpecialOffersSection';
import { AboutSection } from './components/landing/AboutSection';
import { GallerySection } from './components/landing/GallerySection';
import { ReviewsSection } from './components/landing/ReviewsSection';
import { LocationHoursSection } from './components/landing/LocationHoursSection';

// Cart & Checkout Components
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminPricingOffers } from './components/admin/AdminPricingOffers';
import { AdminRestaurantSettings } from './components/admin/AdminRestaurantSettings';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminReports } from './components/admin/AdminReports';

const RestaurantApp: React.FC = () => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const { isAdminView, setIsAdminView, isAuthenticated } = useAuth();
  const { setDeliveryFee } = useCart();

  // Core Data
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Landing Page Filters
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [sortBy, setSortBy] = useState('order');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  // Admin Dashboard Active Tab
  const [adminTab, setAdminTab] = useState<string>('overview');

  // Route listener: Check if user visited #admin, #/admin, ?admin=true, or /admin
  useEffect(() => {
    const handleCheckAdminRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      const path = window.location.pathname.toLowerCase();

      const isAdminRoute = hash.includes('admin') || search.has('admin') || path.endsWith('/admin') || path.includes('/admin');

      if (isAdminRoute) {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };

    handleCheckAdminRoute();
    window.addEventListener('hashchange', handleCheckAdminRoute);
    window.addEventListener('popstate', handleCheckAdminRoute);

    return () => {
      window.removeEventListener('hashchange', handleCheckAdminRoute);
      window.removeEventListener('popstate', handleCheckAdminRoute);
    };
  }, [setIsAdminView]);

  const fetchAppData = async () => {
    try {
      const [settingsData, catsData, prodsData, reviewsData] = await Promise.all([
        api.getSettings(),
        api.getCategories(false), // only active for customer view
        api.getProducts(),
        api.getReviews()
      ]);
      setSettings(settingsData);
      setCategories(catsData);
      setProducts(prodsData);
      setReviews(reviewsData);
      if (settingsData.delivery_fee !== undefined) {
        setDeliveryFee(settingsData.delivery_fee);
      }
    } catch (err) {
      console.error("Error loading application data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  const currency = settings?.currency || 'EGP ';

  // Active section configuration from settings
  let activeSections: Record<string, boolean> = {
    hero: true,
    categories: true,
    menu: true,
    bestsellers: true,
    offers: true,
    gallery: true,
    reviews: true,
    about: true,
    contact: true
  };
  if (settings?.active_sections_json) {
    try {
      activeSections = { ...activeSections, ...JSON.parse(settings.active_sections_json) };
    } catch {}
  }

  // Filtered menu products
  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategoryId !== null && product.category_id !== selectedCategoryId) {
      return false;
    }
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inEnName = product.name.toLowerCase().includes(q);
      const inArName = product.name_ar.toLowerCase().includes(q);
      const inDesc = product.description?.toLowerCase().includes(q);
      const inArDesc = product.description_ar?.toLowerCase().includes(q);
      if (!inEnName && !inArName && !inDesc && !inArDesc) {
        return false;
      }
    }
    // Dietary & tags
    if (isVegetarian && !product.is_vegetarian) return false;
    if (isSpicy && !product.is_spicy) return false;
    if (isBestseller && !product.is_bestseller) return false;

    return true;
  }).sort((a, b) => {
    const priceA = a.discount_price ?? a.base_price;
    const priceB = b.discount_price ?? b.base_price;
    if (sortBy === 'price_asc') return priceA - priceB;
    if (sortBy === 'price_desc') return priceB - priceA;
    if (sortBy === 'popular') return (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0);
    return a.display_order - b.display_order;
  });

  // If in Admin Dashboard view
  if (isAdminView) {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-[#ebebeb] dark:bg-[#0d2a1c] flex items-center justify-center p-4">
          <AdminLogin
            isOpen={true}
            onSuccess={() => {
              setIsAdminView(true);
            }}
            onClose={() => {
              window.location.hash = '';
              setIsAdminView(false);
            }}
          />
        </div>
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        settings={settings}
      >
        {adminTab === 'overview' && (
          <AdminOverview
            currency={currency}
            onViewOrder={() => setAdminTab('orders')}
            onNavigateToOrders={() => setAdminTab('orders')}
          />
        )}
        {adminTab === 'categories' && <AdminCategories />}
        {adminTab === 'products' && <AdminProducts currency={currency} />}
        {adminTab === 'orders' && <AdminOrders currency={currency} />}
        {adminTab === 'pricing' && <AdminPricingOffers currency={currency} />}
        {adminTab === 'settings' && (
          <AdminRestaurantSettings
            onSettingsUpdated={() => {
              fetchAppData();
            }}
          />
        )}
        {adminTab === 'customers' && <AdminCustomers currency={currency} />}
        {adminTab === 'reports' && <AdminReports currency={currency} />}
      </AdminLayout>
    );
  }

  const isFiltered =
    selectedCategoryId !== null ||
    searchQuery.trim().length > 0 ||
    isVegetarian ||
    isSpicy ||
    isBestseller;

  // Customer Landing Page View (Taste-Skill Place System: offwhite-bottle-yellow + Outfit)
  return (
    <div className="min-h-screen bg-[#f7f7f7] dark:bg-[#0d2a1c] text-[#0d2a1c] dark:text-[#f7f7f7] flex flex-col transition-colors">
      
      <Navbar settings={settings} />

      <main id="top" className="flex-1">
        
        {/* A. Hero Section */}
        {activeSections.hero && <HeroSection settings={settings} />}

        {/* Dynamic All-Menu-On-One-Page Section with Animated Card Listing */}
        <section id="menu" className="py-20 bg-[#ebebeb] dark:bg-[#1c3629] border-b border-[#0d2a1c]/12 dark:border-white/15">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-[#f6e016] text-[#0d2a1c] text-xs font-semibold uppercase tracking-wider mb-2">
                  {isAr ? 'القائمة الكاملة' : 'Complete Menu'}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-[#0d2a1c] dark:text-[#f7f7f7]">
                  {t('nav.menu')}
                </h2>
              </div>
              <p className="text-base text-[#5f6b64] dark:text-[#97a39c] tabular-nums">
                {isAr
                  ? `${filteredProducts.length} صنف متاح في صفحة واحدة`
                  : `${filteredProducts.length} dishes & drinks on one page`}
              </p>
            </div>

            {/* B. Food Categories Bar */}
            {activeSections.categories && (
              <CategoryBar
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />
            )}

            {/* D. Advanced Search & Filtering */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isVegetarian={isVegetarian}
              onToggleVegetarian={() => setIsVegetarian(!isVegetarian)}
              isSpicy={isSpicy}
              onToggleSpicy={() => setIsSpicy(!isSpicy)}
              isBestseller={isBestseller}
              onToggleBestseller={() => setIsBestseller(!isBestseller)}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* C. Dynamic Menu Products Grid (Grouped by Category when viewing All Menu) */}
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-10 h-10 border-2 border-[#0d2a1c] dark:border-[#f6e016] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm font-medium text-[#5f6b64]">{t('common.loading')}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-white dark:bg-[#0d2a1c] border border-[#0d2a1c]/12 dark:border-white/15 p-8">
                <p className="text-base font-medium text-[#0d2a1c] dark:text-[#f7f7f7]">
                  {t('menu.noProductsFound')}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setSearchQuery('');
                    setIsVegetarian(false);
                    setIsSpicy(false);
                    setIsBestseller(false);
                  }}
                  className="taste-btn mt-4 px-5 py-2.5 bg-[#0d2a1c] dark:bg-[#f6e016] text-[#f7f7f7] dark:text-[#0d2a1c] font-medium text-sm cursor-pointer"
                >
                  {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
                </button>
              </div>
            ) : !isFiltered && categories.length > 0 ? (
              <div className="space-y-14 pt-4">
                {categories.map(cat => {
                  const catProducts = filteredProducts.filter(p => p.category_id === cat.id);
                  if (catProducts.length === 0) return null;
                  return (
                    <div key={cat.id} className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-[#0d2a1c]/15 dark:border-white/15">
                        <div>
                          <h3 className="font-display text-2xl sm:text-3xl text-[#0d2a1c] dark:text-[#f7f7f7]">
                            {isAr ? cat.name_ar : cat.name}
                          </h3>
                          {(cat.description || cat.description_ar) && (
                            <p className="text-sm text-[#5f6b64] dark:text-[#97a39c] mt-1">
                              {isAr ? (cat.description_ar || cat.description) : cat.description}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-medium px-2.5 py-1 bg-white dark:bg-[#0d2a1c] border border-[#0d2a1c]/12 dark:border-white/15 tabular-nums self-start sm:self-auto">
                          {catProducts.length} {isAr ? 'أصناف' : (catProducts.length === 1 ? 'item' : 'items')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {catProducts.map((product, idx) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            currency={currency}
                            onOpenDetails={setSelectedProduct}
                            index={idx}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
                {filteredProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    onOpenDetails={setSelectedProduct}
                    index={idx}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* G. Additional Landing Page Sections */}
        {activeSections.bestsellers && (
          <BestSellersSection
            products={products.filter(p => p.is_bestseller)}
            currency={currency}
            onOpenDetails={setSelectedProduct}
          />
        )}

        {/* Dealt Culinary Craftsmanship Moment (Taste-Skill) */}
        <section id="craft">
          <ChefMomentSection />
        </section>

        {activeSections.offers && (
          <SpecialOffersSection />
        )}

        {activeSections.about && <AboutSection settings={settings} />}

        {activeSections.gallery && <GallerySection />}

        {activeSections.reviews && (
          <ReviewsSection
            reviews={reviews}
            onReviewSubmitted={fetchAppData}
          />
        )}

        {activeSections.contact && <LocationHoursSection settings={settings} />}

      </main>

      {/* Footer */}
      <Footer settings={settings} />

      {/* E. Product Details & Customization Modal */}
      <ProductModal
        product={selectedProduct}
        currency={currency}
        onClose={() => setSelectedProduct(null)}
      />

      {/* F. Cart Drawer & Checkout */}
      <CartDrawer currency={currency} />
      <CheckoutModal currency={currency} />

      {/* Admin Login Modal (Accessible via #admin) */}
      <AdminLogin
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <RestaurantApp />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
