import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Lock,
  Unlock,
  Plus,
  ArrowUpDown,
  UtensilsCrossed,
  Phone,
  MapPin,
  Clock,
  Check,
  X,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { Category, MenuItem, ItemSize, CartItem } from './types';
import { DataService } from './services/dataService';
import { CategoryCard } from './components/CategoryCard';
import { MenuItemCard } from './components/MenuItemCard';
import { CategoryModal } from './components/admin/CategoryModal';
import { ItemModal } from './components/admin/ItemModal';
import { PhotoChangeModal } from './components/PhotoChangeModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

export const App: React.FC = () => {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Selected Category (null = All or first category)
  const [activeCategoryId, setActiveCategoryId] = useState<string>('cat-grills');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Admin Mode
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // CRUD Modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoCategory, setPhotoCategory] = useState<Category | null>(null);

  // Backend connection status
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // ---------------------------------------------------------------------------
  // Data Loading
  // ---------------------------------------------------------------------------
  const loadData = async () => {
    setLoading(true);
    try {
      const connected = await DataService.isBackendReachable();
      setIsBackendConnected(connected);

      const [loadedCats, loadedItems] = await Promise.all([
        DataService.getCategories(),
        DataService.getItems()
      ]);

      setCategories(loadedCats);
      setItems(loadedItems);

      if (loadedCats.length > 0 && !activeCategoryId) {
        setActiveCategoryId(loadedCats[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setIsAdmin(DataService.isAdminAuthenticated());
  }, []);

  // ---------------------------------------------------------------------------
  // Filtering & Computed Data
  // ---------------------------------------------------------------------------
  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === activeCategoryId) || categories[0];
  }, [categories, activeCategoryId]);

  const displayedItems = useMemo(() => {
    let result = items;
    if (activeCategoryId && activeCategoryId !== 'all') {
      result = result.filter((i) => i.category_id === activeCategoryId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.name_en && i.name_en.toLowerCase().includes(q)) ||
          (i.description && i.description.toLowerCase().includes(q))
      );
    }
    return result;
  }, [items, activeCategoryId, searchQuery]);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, ci) => sum + ci.selectedSize.price * ci.quantity, 0);
  }, [cart]);

  const cartTotalItems = useMemo(() => {
    return cart.reduce((sum, ci) => sum + ci.quantity, 0);
  }, [cart]);

  // ---------------------------------------------------------------------------
  // Cart Actions
  // ---------------------------------------------------------------------------
  const handleAddToCart = (item: MenuItem, selectedSize: ItemSize) => {
    setCart((prev) => {
      const key = `${item.id}-${selectedSize.name}`;
      const existing = prev.find((ci) => ci.id === key);
      if (existing) {
        return prev.map((ci) =>
          ci.id === key ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { id: key, item, selectedSize, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((ci) => {
          if (ci.id === cartItemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setOrderPlaced(false);
      setIsCartOpen(false);
    }, 2500);
  };

  // ---------------------------------------------------------------------------
  // Category & Item Selection
  // ---------------------------------------------------------------------------
  const handleSelectCategory = (category: Category) => {
    setActiveCategoryId(category.id);
    // Smooth scroll to items section
    const itemsElem = document.getElementById('menu-items-section');
    if (itemsElem) {
      itemsElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChangePhotoClick = (category: Category) => {
    setPhotoCategory(category);
    setIsPhotoModalOpen(true);
  };

  const handleSaveCategoryPhoto = async (catId: string, newUrl: string) => {
    await DataService.updateCategory(catId, { image_url: newUrl });
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, image_url: newUrl } : c))
    );
  };

  // ---------------------------------------------------------------------------
  // Admin Operations (CRUD)
  // ---------------------------------------------------------------------------
  const handleSaveCategory = async (catData: Partial<Category>) => {
    if (editingCategory) {
      const updated = await DataService.updateCategory(editingCategory.id, catData);
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...updated } : c))
      );
    } else {
      const created = await DataService.createCategory(catData as any);
      setCategories((prev) => [...prev, created]);
    }
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id: string) => {
    await DataService.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setItems((prev) => prev.filter((i) => i.category_id !== id));
    if (activeCategoryId === id) {
      setActiveCategoryId(categories.find((c) => c.id !== id)?.id || '');
    }
  };

  const handleSaveItem = async (itemData: Partial<MenuItem>) => {
    if (editingItem) {
      const updated = await DataService.updateItem(editingItem.id, itemData);
      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...i, ...updated } : i))
      );
    } else {
      const created = await DataService.createItem(itemData as any);
      setItems((prev) => [...prev, created]);
    }
    setEditingItem(null);
    // Update category item count
    setCategories((prev) =>
      prev.map((c) => {
        const cItems = items.filter((i) => i.category_id === c.id);
        return { ...c, item_count: cItems.length };
      })
    );
  };

  const handleDeleteItem = async (id: string) => {
    await DataService.deleteItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAdminLogout = () => {
    DataService.logoutAdmin();
    setIsAdmin(false);
    setIsAdminView(false);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div dir="rtl" className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased selection:bg-cyan-500 selection:text-white">
      {/* =========================================================================
          1. TOP NAVIGATION & HEADER BAR
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0d2a1c] to-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-md ring-2 ring-emerald-500/20">
              خ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  مطعم وكافيه خطاب
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                  مفتوح الآن
                </span>
              </div>
              <p className="text-xs text-slate-400">قائمة الطعام الرقمية الرسمية • الزمالك، القاهرة</p>
            </div>
          </div>

          {/* Center/Actions: Mode Toggle & Cart Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Backend connection pill */}
            <div
              title={isBackendConnected ? 'الواجهة متصلة بخادم Node.js المحلي' : 'الواجهة تعمل بالوضع المحلي Local-First (جاهز للنشر على GitHub Pages)'}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                isBackendConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-cyan-50 text-cyan-800 border-cyan-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-cyan-500'}`} />
              <span>{isBackendConnected ? 'خادم Node.js متصل' : 'Local-First'}</span>
            </div>

            {/* Admin Toggle Button */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAdminView(!isAdminView)}
                  className={`h-10 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all border ${
                    isAdminView
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>{isAdminView ? 'عرض القائمة للعملاء' : 'لوحة الإدارة ⚙️'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleAdminLogout}
                  title="تسجيل خروج من الإدارة"
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 flex items-center justify-center cursor-pointer border border-slate-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="h-10 px-3 sm:px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-200"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">لوحة الإدارة</span>
                <span className="sm:hidden">إدارة</span>
              </button>
            )}

            {/* Shopping Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative h-10 px-4 rounded-xl bg-[#0d2a1c] hover:bg-[#1a4430] text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span>الطلب</span>
              {cartTotalItems > 0 && (
                <span className="px-2 py-0.5 bg-cyan-400 text-slate-950 font-black text-xs rounded-full tabular-nums">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. ADMIN DASHBOARD VIEW (WHEN ACTIVE)
         ========================================================================= */}
      {isAdmin && isAdminView ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                <h2 className="text-2xl font-bold text-slate-900">لوحة تحكم الإدارة الشاملة</h2>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                إضافة وتعديل وحذف الأقسام والأصناف مع تحديد الأحجام والأسعار المتعددة
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setIsCategoryModalOpen(true);
                }}
                className="h-10 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة قسم جديد</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setIsItemModalOpen(true);
                }}
                className="h-10 px-4 rounded-xl bg-[#0d2a1c] hover:bg-[#1a4430] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة صنف جديد</span>
              </button>
            </div>
          </div>

          {/* Quick Management Table for Categories */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>إدارة أقسام القائمة</span>
              <span className="text-xs font-normal text-slate-400">({categories.length} أقسام)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 bg-slate-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={cat.image_url} alt={cat.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{cat.icon} {cat.name}</h4>
                      <p className="text-xs text-slate-400 truncate">{cat.description || 'بدون وصف'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg cursor-pointer"
                      title="تعديل"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="حذف"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : null}

      {/* =========================================================================
          3. CUSTOMER-FACING PUBLIC MENU VIEW
         ========================================================================= */}
      {(!isAdmin || !isAdminView) && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* Hero Welcome Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d2a1c] to-[#16442f] text-white p-6 sm:p-10 shadow-lg">
            <div className="relative z-10 max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>أشهى المأكولات والمشويات المصرية</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                أهلاً بكم في مطعم خطاب
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                تصفح قائمة الطعام الشاملة، اختر أحجام الأطباق المفضلة، واطلب مباشرة أونلاين بكل سهولة وسرعة.
              </p>

              {/* Search Bar Input */}
              <div className="pt-2">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن طبق، برجر، بيتزا، كباب، عصير..."
                    className="w-full h-12 px-4 ps-11 rounded-2xl bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-300 focus:placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all border border-white/20"
                  />
                  <Search className="w-5 h-5 text-slate-300 absolute top-3.5 start-3.5 pointer-events-none" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute top-3.5 end-3 text-slate-300 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute top-0 end-0 -mt-10 -me-10 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          </section>

          {/* =====================================================================
              SECTION 1: CATEGORY CARDS (THE EXACT CARDS FROM USER'S IMAGE)
             ===================================================================== */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>أقسام قائمة الطعام</span>
                  <span className="text-base text-cyan-600 font-bold">({categories.length} أقسام)</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  انقر على أي قسم لعرض كافة أصنافه بالأسعار والأحجام المتوفرة
                </p>
              </div>

              {/* Quick Tab Pills for Horizontal Scrolling */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveCategoryId('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    activeCategoryId === 'all'
                      ? 'bg-[#0d2a1c] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  الكل ({items.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                      activeCategoryId === cat.id
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* The 4-column responsive grid matching the image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  isActive={activeCategoryId === cat.id}
                  onSelect={handleSelectCategory}
                  onChangePhoto={handleChangePhotoClick}
                  isRTL={true}
                />
              ))}
            </div>
          </section>

          {/* =====================================================================
              SECTION 2: DYNAMICALLY LOADED ITEMS DISPLAY
             ===================================================================== */}
          <section id="menu-items-section" className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-700 flex items-center justify-center text-xl font-bold">
                  {activeCategory?.icon || '🍽️'}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>
                      {activeCategoryId === 'all'
                        ? 'كافة الأصناف والمأكولات'
                        : `أصناف قسم: ${activeCategory?.name || ''}`}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold tabular-nums">
                      {displayedItems.length} صنف
                    </span>
                  </h3>
                  {activeCategory?.description && activeCategoryId !== 'all' && (
                    <p className="text-xs text-slate-500 mt-0.5">{activeCategory.description}</p>
                  )}
                </div>
              </div>

              {/* Admin quick add item button */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsItemModalOpen(true);
                  }}
                  className="h-9 px-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة صنف لهذا القسم</span>
                </button>
              )}
            </div>

            {/* Empty State */}
            {displayedItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
                <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-lg font-bold text-slate-700">لا توجد أصناف متطابقة حالياً</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  جرب تغيير كلمات البحث أو اختر قسماً آخر من الأقسام أعلاه.
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    إعادة ضبط البحث
                  </button>
                )}
              </div>
            ) : (
              /* Grid of Menu Item Cards with Dynamic Sizes & Prices */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {displayedItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    currencySymbol="ج.م"
                    onAddToCart={handleAddToCart}
                    isAdmin={isAdmin}
                    onEdit={(itm) => {
                      setEditingItem(itm);
                      setIsItemModalOpen(true);
                    }}
                    onDelete={(itm) => handleDeleteItem(itm.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {/* =========================================================================
          4. FOOTER
         ========================================================================= */}
      <footer className="mt-20 bg-white border-t border-slate-200 py-10 text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-base">مطعم وكافيه خطاب</span>
              <span className="text-xs text-slate-400">| Khatab Restaurant & Café</span>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                <span>الزمالك، القاهرة</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-500" />
                <span dir="ltr">+20 100 234 5678</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-500" />
                <span>يومياً: 10:00 ص - 2:00 ص</span>
              </span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()} مطعم وكافيه خطاب.</span>
            <span>تصميم وبناء خفيف وسريع بنية Minimalist Local-First SPA.</span>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          5. CART DRAWER (SLIDE-OVER)
         ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-lg text-slate-900">سلة الطلبات ({cartTotalItems})</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="p-5 flex-1 overflow-y-auto divide-y divide-slate-100">
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-600">سلة الطلبات فارغة</p>
                  <p className="text-xs text-slate-400">اختر أطباقك المفضلة من القائمة وأضفها هنا.</p>
                </div>
              ) : (
                cart.map((ci) => (
                  <div key={ci.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-slate-800 truncate">{ci.item?.name || 'صنف'}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">
                          {ci.selectedSize?.name || 'حجم عادي'}
                        </span>
                        <span className="tabular-nums font-bold text-cyan-600">
                          {ci.selectedSize?.price || 0} ج.م
                        </span>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateCartQty(ci.id, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold tabular-nums">
                        {ci.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateCartQty(ci.id, 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-200 space-y-3 bg-slate-50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">الإجمالي النهائي:</span>
                  <span className="font-extrabold text-xl text-slate-900 tabular-nums">
                    {cartSubtotal} ج.م
                  </span>
                </div>

                {orderPlaced ? (
                  <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>تم تأكيد طلبك بنجاح! شكراً لك</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20 active:scale-98 transition-all"
                  >
                    <span>تأكيد الطلب الآن ({cartSubtotal} ج.م)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          6. MODALS
         ========================================================================= */}
      {/* Category CRUD Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        category={editingCategory}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
      />

      {/* Item CRUD Modal */}
      <ItemModal
        isOpen={isItemModalOpen}
        item={editingItem}
        categories={categories}
        defaultCategoryId={activeCategoryId !== 'all' ? activeCategoryId : categories[0]?.id}
        currencySymbol="ج.م"
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
      />

      {/* Quick Photo Changer Modal */}
      <PhotoChangeModal
        isOpen={isPhotoModalOpen}
        category={photoCategory}
        onClose={() => {
          setIsPhotoModalOpen(false);
          setPhotoCategory(null);
        }}
        onSavePhoto={handleSaveCategoryPhoto}
      />

      {/* Admin Login Gate Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsAdmin(true);
          setIsAdminView(true);
        }}
      />
    </div>
  );
};

export default App;
