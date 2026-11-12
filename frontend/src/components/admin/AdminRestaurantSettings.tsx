import React, { useState, useEffect } from 'react';
import {
  Save, Store, Palette, Sliders, MapPin, Phone, MessageCircle,
  Clock, DollarSign, Upload, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { RestaurantSettings } from '../../types';

interface AdminRestaurantSettingsProps {
  onSettingsUpdated: () => void;
}

export const AdminRestaurantSettings: React.FC<AdminRestaurantSettingsProps> = ({ onSettingsUpdated }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [addressAr, setAddressAr] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [currency, setCurrency] = useState('EGP');
  const [minOrderValue, setMinOrderValue] = useState<number>(15.0);
  const [deliveryFee, setDeliveryFee] = useState<number>(3.50);

  // Visual Customization States
  const [heroTitle, setHeroTitle] = useState('');
  const [heroTitleAr, setHeroTitleAr] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroSubtitleAr, setHeroSubtitleAr] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#ea580c');

  const [activeSections, setActiveSections] = useState<Record<string, boolean>>({
    hero: true,
    categories: true,
    menu: true,
    bestsellers: true,
    offers: true,
    gallery: true,
    reviews: true,
    about: true,
    contact: true
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await api.getSettings();
      setSettings(data);
      setName(data.name);
      setNameAr(data.name_ar);
      setDescription(data.description);
      setDescriptionAr(data.description_ar);
      setPhone(data.phone);
      setWhatsapp(data.whatsapp);
      setEmail(data.email);
      setAddress(data.address);
      setAddressAr(data.address_ar);
      setOpeningHours(data.opening_hours);
      setGoogleMapsUrl(data.google_maps_url);
      setCurrency(data.currency || 'EGP');
      setMinOrderValue(data.min_order_value);
      setDeliveryFee(data.delivery_fee);
      setHeroTitle(data.hero_title);
      setHeroTitleAr(data.hero_title_ar);
      setHeroSubtitle(data.hero_subtitle);
      setHeroSubtitleAr(data.hero_subtitle_ar);
      setHeroImage(data.hero_image);
      setLogoUrl(data.logo_url || '');
      setPrimaryColor(data.primary_color || '#ea580c');
      if (data.active_sections_json) {
        try {
          setActiveSections(JSON.parse(data.active_sections_json));
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      const payload: Partial<RestaurantSettings> = {
        name,
        name_ar: nameAr,
        description,
        description_ar: descriptionAr,
        phone,
        whatsapp,
        email,
        address,
        address_ar: addressAr,
        opening_hours: openingHours,
        google_maps_url: googleMapsUrl,
        currency,
        min_order_value: Number(minOrderValue),
        delivery_fee: Number(deliveryFee),
        hero_title: heroTitle,
        hero_title_ar: heroTitleAr,
        hero_subtitle: heroSubtitle,
        hero_subtitle_ar: heroSubtitleAr,
        hero_image: heroImage,
        logo_url: logoUrl || undefined,
        primary_color: primaryColor,
        active_sections_json: JSON.stringify(activeSections)
      };

      await api.updateSettings(payload);
      setSuccessMsg(true);
      onSettingsUpdated();
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (key: string) => {
    setActiveSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            {isAr ? 'إعدادات المطعم وتخصيص الصفحة الرئيسية' : 'Restaurant Profile & Visual Landing Customizer'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {isAr ? 'التحكم الكامل في هوية المطعم، ألوان الصفحة، البانر، وساعات العمل' : 'Customize branding, contact information, hero imagery, colors, and landing sections'}
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isAr ? 'تم حفظ التعديلات بنجاح!' : 'Changes saved successfully!'}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* General Identity */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <Store className="w-5 h-5 text-orange-600" />
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
              {isAr ? 'الهوية والبيانات الأساسية' : 'General Restaurant Information'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'اسم المطعم (English)' : 'Restaurant Name (English)'} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'اسم المطعم (عربي)' : 'Restaurant Name (Arabic)'} *
              </label>
              <input
                type="text"
                required
                value={nameAr}
                onChange={e => setNameAr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'وصف المطعم (English)' : 'Restaurant Story / Tagline (English)'}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'وصف المطعم (عربي)' : 'Restaurant Story / Tagline (Arabic)'}
              </label>
              <textarea
                rows={2}
                value={descriptionAr}
                onChange={e => setDescriptionAr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'رقم الهاتف' : 'Telephone'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'رقم الواتساب' : 'WhatsApp Number'}
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'ساعات العمل' : 'Opening Hours'}
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={e => setOpeningHours(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'العنوان (English)' : 'Physical Address (English)'}
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'العنوان (عربي)' : 'Physical Address (Arabic)'}
              </label>
              <input
                type="text"
                value={addressAr}
                onChange={e => setAddressAr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>
        </div>

        {/* Financial & Delivery Policy */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
              {isAr ? 'سياسة الأسعار ورسوم التوصيل' : 'Pricing & Delivery Policy'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'رمز العملة' : 'Currency Symbol'}
              </label>
              <input
                type="text"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                placeholder="EGP / SAR / USD"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'رسوم التوصيل' : 'Delivery Fee'} ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                value={deliveryFee}
                onChange={e => setDeliveryFee(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'الحد الأدنى لطلب التوصيل' : 'Minimum Order for Delivery'} ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                value={minOrderValue}
                onChange={e => setMinOrderValue(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>
        </div>

        {/* Visual Landing Page Customization */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <Palette className="w-5 h-5 text-orange-600" />
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
              {isAr ? 'تخصيص الواجهة والصور والبنرات' : 'Visual Hero & Section Controls'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'عنوان الهيرو الرئيسي (English)' : 'Hero Title (English)'}
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={e => setHeroTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'عنوان الهيرو الرئيسي (عربي)' : 'Hero Title (Arabic)'}
              </label>
              <input
                type="text"
                value={heroTitleAr}
                onChange={e => setHeroTitleAr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'وصف الهيرو الفرعي (English)' : 'Hero Subtitle (English)'}
              </label>
              <textarea
                rows={2}
                value={heroSubtitle}
                onChange={e => setHeroSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {isAr ? 'وصف الهيرو الفرعي (عربي)' : 'Hero Subtitle (Arabic)'}
              </label>
              <textarea
                rows={2}
                value={heroSubtitleAr}
                onChange={e => setHeroSubtitleAr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              {isAr ? 'رابط صورة خلفية الهيرو' : 'Hero Background Image URL'}
            </label>
            <input
              type="url"
              value={heroImage}
              onChange={e => setHeroImage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Section Active Toggles */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-xs text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              {isAr ? 'إظهار / إخفاء أقسام الصفحة الرئيسية' : 'Enable / Disable Homepage Sections'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {Object.entries(activeSections).map(([secKey, isActive]) => (
                <label key={secKey} className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleSection(secKey)}
                    className="rounded text-orange-600"
                  />
                  <span className="font-bold capitalize">{secKey}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm sm:text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? '...' : (isAr ? 'حفظ كافة إعدادات المطعم' : 'Save All Restaurant Settings')}</span>
        </button>

      </form>
    </div>
  );
};
