import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Check, X, Image as ImageIcon,
  FolderTree, ArrowUpDown, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Category } from '../../types';

export const AdminCategories: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [icon, setIcon] = useState('Utensils');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [parentId, setParentId] = useState<number | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories(true); // include inactive
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setNameAr('');
    setDescription('');
    setDescriptionAr('');
    setImageUrl('');
    setIcon('Utensils');
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setParentId(undefined);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setNameAr(cat.name_ar || cat.name || '');
    setDescription(cat.description || '');
    setDescriptionAr(cat.description_ar || '');
    setImageUrl(cat.image_url || '');
    setIcon(cat.icon || 'Utensils');
    setDisplayOrder(cat.display_order || 0);
    setIsActive(cat.is_active ?? true);
    setParentId(cat.parent_id);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nameAr.trim()) return;

    setSaving(true);
    try {
      const payload: Partial<Category> = {
        name,
        name_ar: nameAr,
        description,
        description_ar: descriptionAr,
        image_url: imageUrl || undefined,
        icon,
        display_order: Number(displayOrder),
        is_active: isActive,
        parent_id: parentId || undefined
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, payload);
      } else {
        await api.createCategory(payload);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا القسم وكافة أصنافه؟' : 'Are you sure you want to delete this category?')) return;
    try {
      await api.deleteCategory(id);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      await api.updateCategory(cat.id, { is_active: !cat.is_active });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            {isAr ? 'إدارة أقسام قائمة الطعام' : 'Menu Category Management'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {isAr ? 'إنشاء وتعديل وإعادة ترتيب الأقسام الرئيسية والفرعية' : 'Create, organize, and toggle live food categories'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة قسم جديد' : 'Add New Category'}</span>
        </button>
      </div>

      {/* Categories Table / List */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">{isAr ? 'الترتيب' : 'Order'}</th>
                <th className="py-3.5 px-6">{isAr ? 'الصورة' : 'Visual'}</th>
                <th className="py-3.5 px-6">{isAr ? 'الاسم (إنجليزي / عربي)' : 'Category Name'}</th>
                <th className="py-3.5 px-6">{isAr ? 'الأصناف' : 'Dishes'}</th>
                <th className="py-3.5 px-6">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-6 text-right rtl:text-left">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-zinc-400">
                    #{cat.display_order}
                  </td>
                  <td className="py-4 px-6">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                        <FolderTree className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 block">
                      {cat.name}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">
                      {cat.name_ar}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-orange-600 dark:text-orange-400">
                    {cat.product_count || 0} {isAr ? 'طبق' : 'items'}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                        cat.is_active
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {cat.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{cat.is_active ? (isAr ? 'نشط' : 'Active') : (isAr ? 'مخفي' : 'Hidden')}</span>
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right rtl:text-left space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
              {editingCategory ? (isAr ? 'تعديل القسم' : 'Edit Category') : (isAr ? 'إضافة قسم جديد' : 'New Category')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    {isAr ? 'اسم القسم (English)' : 'Name (English)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Artisan Pizzas"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    {isAr ? 'اسم القسم (عربي)' : 'Name (Arabic)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={e => setNameAr(e.target.value)}
                    placeholder="مثال: بيتزا إيطالية"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  {isAr ? 'الوصف (English)' : 'Description (English)'}
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Woodfired crusts with organic tomatoes"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  {isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}
                </label>
                <input
                  type="text"
                  value={descriptionAr}
                  onChange={e => setDescriptionAr(e.target.value)}
                  placeholder="عجينة إيطالية مخبوزة على الحطب"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              {/* Image URL & Upload */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  {isAr ? 'رابط الصورة أو رفع ملف' : 'Category Image URL or Upload'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-900 dark:text-zinc-100"
                  />
                  <label className="px-3 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 text-xs font-bold cursor-pointer transition-colors">
                    <span>{uploadingImage ? '...' : (isAr ? 'رفع ملف' : 'Upload')}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    {isAr ? 'الترتيب' : 'Display Order'}
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={e => setDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_active_cat"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <label htmlFor="is_active_cat" className="text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                    {isAr ? 'تفعيل وظهور القسم' : 'Active & Visible'}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                {saving ? '...' : (isAr ? 'حفظ القسم' : 'Save Category')}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
