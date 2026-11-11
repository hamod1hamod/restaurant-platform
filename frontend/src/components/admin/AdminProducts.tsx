import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Copy, Eye, EyeOff, Search,
  SlidersHorizontal, Upload, X, Check, Flame, Leaf, Award, Star, Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Product, Category, ProductSize, ProductExtra } from '../../types';

interface AdminProductsProps {
  currency: string;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ currency }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields (15 fields specified in requirements)
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [productType, setProductType] = useState('Food'); // Food, Drinks, Desserts, Snacks, Combos, Special Offers
  const [basePrice, setBasePrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [ingredientsAr, setIngredientsAr] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [prepTimeMins, setPrepTimeMins] = useState<number>(15);
  const [calories, setCalories] = useState<number | ''>('');

  // Flags & Badges
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [isBestseller, setIsBestseller] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isVegetarian, setIsVegetarian] = useState<boolean>(false);
  const [isSpicy, setIsSpicy] = useState<boolean>(false);

  // Dynamic Sizes and Extras
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [extras, setExtras] = useState<ProductExtra[]>([]);

  // Size helper input
  const [newSizeName, setNewSizeName] = useState('');
  const [newSizeNameAr, setNewSizeNameAr] = useState('');
  const [newSizePrice, setNewSizePrice] = useState<number>(0);

  // Extra helper input
  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraNameAr, setNewExtraNameAr] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState<number>(0);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodsData, catsData] = await Promise.all([
        api.getProducts(),
        api.getCategories(true)
      ]);
      setProducts(prodsData);
      setCategories(catsData);
      if (catsData.length > 0 && !categoryId) {
        setCategoryId(catsData[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setNameAr('');
    setDescription('');
    setDescriptionAr('');
    setCategoryId(categories[0]?.id || 1);
    setProductType('Food');
    setBasePrice(10.0);
    setDiscountPrice('');
    setImageUrl('');
    setIngredients('');
    setIngredientsAr('');
    setDisplayOrder(products.length + 1);
    setPrepTimeMins(15);
    setCalories('');
    setIsAvailable(true);
    setIsFeatured(false);
    setIsBestseller(false);
    setIsNew(false);
    setIsVegetarian(false);
    setIsSpicy(false);
    setSizes([
      { name: 'Regular', name_ar: 'عادي', price: 10.0, is_default: true }
    ]);
    setExtras([]);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setNameAr(p.name_ar);
    setDescription(p.description || '');
    setDescriptionAr(p.description_ar || '');
    setCategoryId(p.category_id);
    setProductType(p.product_type || 'Food');
    setBasePrice(p.base_price);
    setDiscountPrice(p.discount_price ?? '');
    setImageUrl(p.image_url || '');
    setIngredients(p.ingredients || '');
    setIngredientsAr(p.ingredients_ar || '');
    setDisplayOrder(p.display_order || 0);
    setPrepTimeMins(p.prep_time_mins || 15);
    setCalories(p.calories ?? '');
    setIsAvailable(p.is_available);
    setIsFeatured(p.is_featured);
    setIsBestseller(p.is_bestseller);
    setIsNew(p.is_new);
    setIsVegetarian(p.is_vegetarian);
    setIsSpicy(p.is_spicy);
    setSizes(p.sizes ? [...p.sizes] : []);
    setExtras(p.extras ? [...p.extras] : []);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const res = await api.uploadImage(e.target.files[0]);
      setImageUrl(res.url);
    } catch (err: any) {
      alert(err.message || 'Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddSize = () => {
    if (!newSizeName.trim()) return;
    setSizes(prev => [
      ...prev,
      {
        name: newSizeName,
        name_ar: newSizeNameAr || newSizeName,
        price: Number(newSizePrice),
        is_default: prev.length === 0
      }
    ]);
    setNewSizeName('');
    setNewSizeNameAr('');
    setNewSizePrice(0);
  };

  const handleRemoveSize = (index: number) => {
    setSizes(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddExtra = () => {
    if (!newExtraName.trim()) return;
    setExtras(prev => [
      ...prev,
      {
        name: newExtraName,
        name_ar: newExtraNameAr || newExtraName,
        price: Number(newExtraPrice),
        max_quantity: 1,
        is_available: true
      }
    ]);
    setNewExtraName('');
    setNewExtraNameAr('');
    setNewExtraPrice(0);
  };

  const handleRemoveExtra = (index: number) => {
    setExtras(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nameAr.trim()) return;

    setSaving(true);
    try {
      const payload = {
        name,
        name_ar: nameAr,
        description,
        description_ar: descriptionAr,
        category_id: Number(categoryId),
        product_type: productType,
        base_price: Number(basePrice),
        discount_price: discountPrice === '' ? null : Number(discountPrice),
        image_url: imageUrl || undefined,
        ingredients,
        ingredients_ar: ingredientsAr,
        display_order: Number(displayOrder),
        prep_time_mins: Number(prepTimeMins),
        calories: calories === '' ? null : Number(calories),
        is_available: isAvailable,
        is_featured: isFeatured,
        is_bestseller: isBestseller,
        is_new: isNew,
        is_vegetarian: isVegetarian,
        is_spicy: isSpicy,
        sizes,
        extras
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الصنف نهائياً؟' : 'Are you sure you want to permanently delete this product?')) return;
    try {
      await api.deleteProduct(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await api.duplicateProduct(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate product');
    }
  };

  const handleToggleAvailability = async (id: number) => {
    try {
      await api.toggleProductAvailability(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered list
  const filteredProducts = products.filter(p => {
    const matchesSearch = search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.name_ar.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'all' || p.category_id === Number(selectedCategoryFilter);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            {isAr ? 'إدارة المأكولات والمشروبات' : 'Food & Beverage Menu Manager'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {isAr ? 'التحكم الكامل في الأسعار، الأحجام، الإضافات، والتوفر اللحظي' : 'Full CRUD, dynamic variants, extras, multi-pricing & stock control'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة صنف جديد' : 'Add New Product'}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث بالاسم...' : 'Search dish by name...'}
            className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <select
          value={selectedCategoryFilter}
          onChange={e => setSelectedCategoryFilter(e.target.value)}
          className="w-full sm:w-56 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none"
        >
          <option value="all">{isAr ? 'جميع الأقسام' : 'All Categories'}</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {isAr ? c.name_ar : c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">{isAr ? 'الصورة' : 'Item'}</th>
                <th className="py-3.5 px-6">{isAr ? 'القسم والنوع' : 'Category'}</th>
                <th className="py-3.5 px-6">{isAr ? 'السعر' : 'Price'}</th>
                <th className="py-3.5 px-6">{isAr ? 'الأحجام والإضافات' : 'Variants'}</th>
                <th className="py-3.5 px-6">{isAr ? 'الشارات' : 'Badges'}</th>
                <th className="py-3.5 px-6">{isAr ? 'التوفر' : 'Availability'}</th>
                <th className="py-3.5 px-6 text-right rtl:text-left">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredProducts.map(p => {
                const cat = categories.find(c => c.id === p.category_id);
                const catName = cat ? (isAr ? cat.name_ar : cat.name) : 'Unassigned';

                return (
                  <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                        />
                        <div>
                          <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 block">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            {p.name_ar}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 block">
                        {catName}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400">
                        {p.product_type}
                      </span>
                    </td>

                    <td className="py-3.5 px-6">
                      <div className="flex flex-col">
                        <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                          {currency} {(p.discount_price ?? p.base_price).toFixed(2)}
                        </span>
                        {p.discount_price && (
                          <span className="text-[10px] text-zinc-400 line-through">
                            {currency} {p.base_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="block text-zinc-600 dark:text-zinc-300">
                        {p.sizes?.length || 0} {isAr ? 'أحجام' : 'sizes'}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {p.extras?.length || 0} {isAr ? 'إضافات' : 'extras'}
                      </span>
                    </td>

                    <td className="py-3.5 px-6">
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {p.is_bestseller && <span className="px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 text-[10px] font-bold">Best</span>}
                        {p.is_featured && <span className="px-1.5 py-0.5 rounded-sm bg-orange-100 text-orange-800 text-[10px] font-bold">Feat</span>}
                        {p.is_new && <span className="px-1.5 py-0.5 rounded-sm bg-sky-100 text-sky-800 text-[10px] font-bold">New</span>}
                        {p.is_vegetarian && <span className="px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 text-[10px] font-bold">Veg</span>}
                        {p.is_spicy && <span className="px-1.5 py-0.5 rounded-sm bg-rose-100 text-rose-800 text-[10px] font-bold">Spicy</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <button
                        onClick={() => handleToggleAvailability(p.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer ${
                          p.is_available
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        {p.is_available ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{p.is_available ? (isAr ? 'متوفر' : 'In Stock') : (isAr ? 'غير متوفر' : 'Sold Out')}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-6 text-right rtl:text-left space-x-1.5 rtl:space-x-reverse">
                      <button
                        onClick={() => handleDuplicate(p.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Duplicate Product"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-orange-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal (15 fields with Variants and Extras) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {editingProduct ? (isAr ? 'تعديل بيانات الوجبة' : 'Edit Menu Dish') : (isAr ? 'إضافة وجبة أو مشروب جديد' : 'Add New Menu Item')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Fields: Name EN & AR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    1. {isAr ? 'اسم الصنف (English)' : 'Product Name (English)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Truffle Angus Burger"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    2. {isAr ? 'اسم الصنف (عربي)' : 'Product Name (Arabic)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={e => setNameAr(e.target.value)}
                    placeholder="مثال: برجر أنجوس بالكمأة"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Descriptions EN & AR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    3. {isAr ? 'الوصف (English)' : 'Description (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Delicious juicy patty with melted cheese..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    4. {isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionAr}
                    onChange={e => setDescriptionAr(e.target.value)}
                    placeholder="لحم بقري فاخر مع جبن الغرويير المعتق..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Category & Product Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    5. {isAr ? 'القسم' : 'Category'} *
                  </label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {isAr ? c.name_ar : c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    6. {isAr ? 'نوع الصنف' : 'Product Type'}
                  </label>
                  <select
                    value={productType}
                    onChange={e => setProductType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Food">Food</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Combos">Combos</option>
                    <option value="Special Offers">Special Offers</option>
                  </select>
                </div>
              </div>

              {/* Regular Price & Discount Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    7. {isAr ? 'السعر الأساسي' : 'Regular Price'} ({currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={basePrice}
                    onChange={e => setBasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    8. {isAr ? 'سعر الخصم' : 'Discount Price'} ({currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={discountPrice}
                    onChange={e => setDiscountPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="Leave empty if no discount"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    15. {isAr ? 'ترتيب الظهور' : 'Display Order'}
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={e => setDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Product Images (Field 9) */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  9. {isAr ? 'صورة المنتج' : 'Product Image (URL or File Upload)'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImage ? '...' : (isAr ? 'رفع صورة' : 'Upload')}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Ingredients EN & AR (Field 11) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    11. {isAr ? 'المكونات (English)' : 'Ingredients (English)'}
                  </label>
                  <input
                    type="text"
                    value={ingredients}
                    onChange={e => setIngredients(e.target.value)}
                    placeholder="Angus beef, aged cheese, brioche..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    {isAr ? 'المكونات (عربي)' : 'Ingredients (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={ingredientsAr}
                    onChange={e => setIngredientsAr(e.target.value)}
                    placeholder="لحم أنجوس، جبن معتق، خبز بريوش..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Sizes Management (Field 10) */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                    10. {isAr ? 'إدارة الأحجام والأسعار' : 'Manage Available Sizes & Pricing'}
                  </h4>
                  <span className="text-[11px] text-zinc-400">
                    {sizes.length} {isAr ? 'أحجام مضافة' : 'sizes configured'}
                  </span>
                </div>

                {/* Sizes List */}
                <div className="space-y-2">
                  {sizes.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold">{s.name}</span>
                        <span className="text-zinc-400">({s.name_ar})</span>
                        {s.is_default && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">Default</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-orange-600 dark:text-orange-400">{currency} {s.price.toFixed(2)}</span>
                        <button type="button" onClick={() => handleRemoveSize(idx)} className="text-rose-500 hover:text-rose-700">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Size Row */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <input
                    type="text"
                    value={newSizeName}
                    onChange={e => setNewSizeName(e.target.value)}
                    placeholder="Size name (e.g. Large)"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100"
                  />
                  <input
                    type="text"
                    value={newSizeNameAr}
                    onChange={e => setNewSizeNameAr(e.target.value)}
                    placeholder="اسم الحجم (مثال: كبير)"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={newSizePrice}
                    onChange={e => setNewSizePrice(parseFloat(e.target.value) || 0)}
                    placeholder="Price"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="py-2 px-3 rounded-xl bg-zinc-900 dark:bg-zinc-700 text-white font-bold text-xs hover:bg-orange-600 transition-colors"
                  >
                    + {isAr ? 'إضافة حجم' : 'Add Size'}
                  </button>
                </div>
              </div>

              {/* Extras Management (Field 12) */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                    12. {isAr ? 'إدارة الإضافات والخيارات' : 'Manage Extras & Add-ons'}
                  </h4>
                  <span className="text-[11px] text-zinc-400">
                    {extras.length} {isAr ? 'إضافات مضافة' : 'extras configured'}
                  </span>
                </div>

                {/* Extras List */}
                <div className="space-y-2">
                  {extras.map((ex, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold">{ex.name}</span>
                        <span className="text-zinc-400">({ex.name_ar})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-orange-600 dark:text-orange-400">+{currency} {ex.price.toFixed(2)}</span>
                        <button type="button" onClick={() => handleRemoveExtra(idx)} className="text-rose-500 hover:text-rose-700">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Extra Row */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <input
                    type="text"
                    value={newExtraName}
                    onChange={e => setNewExtraName(e.target.value)}
                    placeholder="Extra (e.g. Extra Cheese)"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100"
                  />
                  <input
                    type="text"
                    value={newExtraNameAr}
                    onChange={e => setNewExtraNameAr(e.target.value)}
                    placeholder="إضافة (مثال: جبن إضافي)"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={newExtraPrice}
                    onChange={e => setNewExtraPrice(parseFloat(e.target.value) || 0)}
                    placeholder="Extra Price"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddExtra}
                    className="py-2 px-3 rounded-xl bg-zinc-900 dark:bg-zinc-700 text-white font-bold text-xs hover:bg-orange-600 transition-colors"
                  >
                    + {isAr ? 'إضافة خيار' : 'Add Extra'}
                  </button>
                </div>
              </div>

              {/* Status & Badges (Fields 13 & 14) */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-xs text-zinc-700 dark:text-zinc-300">
                  13 & 14. {isAr ? 'حالة التوفر والشارات الترويجية' : 'Availability & Promotional Badges'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                    <input type="checkbox" checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} className="rounded text-orange-600" />
                    <span className="font-bold">{isAr ? 'متوفر بالمخزون' : 'In Stock (Available)'}</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                    <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="rounded text-orange-600" />
                    <span className="font-bold">{isAr ? 'طبق مميز' : 'Featured Dish'}</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                    <input type="checkbox" checked={isBestseller} onChange={e => setIsBestseller(e.target.checked)} className="rounded text-orange-600" />
                    <span className="font-bold">{isAr ? 'الأكثر طلباً' : 'Best Seller'}</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                    <input type="checkbox" checked={isNew} onChange={e => setIsNew(e.target.checked)} className="rounded text-orange-600" />
                    <span className="font-bold">{isAr ? 'صنف جديد' : 'New Dish'}</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                    <input type="checkbox" checked={isVegetarian} onChange={e => setIsVegetarian(e.target.checked)} className="rounded text-orange-600" />
                    <span className="font-bold">{isAr ? 'نباتي' : 'Vegetarian'}</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                    <input type="checkbox" checked={isSpicy} onChange={e => setIsSpicy(e.target.checked)} className="rounded text-orange-600" />
                    <span className="font-bold">{isAr ? 'حار' : 'Spicy'}</span>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-lg transition-all cursor-pointer"
              >
                {saving ? '...' : (isAr ? 'حفظ الصنف في القائمة' : 'Save Product to Live Menu')}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
