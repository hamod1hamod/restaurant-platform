import React, { useState } from 'react';
import { X, ShieldCheck, Lock, User, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose }) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';
  const { login, setIsAdminView } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.login(username, password);
      login(res.access_token, res.user);
      setIsAdminView(true);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.hash = '';
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-950 p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          title="Return to Website"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm ring-1 ring-blue-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {isAr ? 'دخول لوحة التحكم والإدارة' : 'Restaurant Admin Login'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'سجل دخولك لإدارة القائمة والأسعار والطلبات وقاعدة البيانات' : 'Sign in to manage categories, menu dishes, prices, and database'}
          </p>
        </div>

        {/* Demo Credentials Helper Pill in Dark Blue style */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
          <div>
            <span className="font-bold block">{isAr ? 'بيانات الدخول الافتراضية:' : 'Default Credentials:'}</span>
            <span className="font-mono text-blue-700 dark:text-blue-300">admin / admin123</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setUsername('admin');
              setPassword('admin123');
            }}
            className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 shadow-xs cursor-pointer"
          >
            {isAr ? 'ملء تلقائي' : 'Auto Fill'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isAr ? 'اسم المستخدم أو البريد' : 'Username or Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-blue-500" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-blue-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-blue-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-blue-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-500 hover:to-indigo-700 text-white font-extrabold text-sm shadow-md shadow-blue-900/30 transition-all active:scale-98 cursor-pointer disabled:opacity-50 ring-1 ring-blue-400/30"
          >
            {loading ? '...' : (isAr ? 'تسجيل الدخول' : 'Sign In')}
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              {isAr ? '← العودة للموقع الإلكتروني' : '← Return to Customer Website'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
