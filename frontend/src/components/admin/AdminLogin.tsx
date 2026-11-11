import React, { useState } from 'react';
import { X, ShieldCheck, Lock, User, AlertCircle, Sparkles } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            {isAr ? 'دخول لوحة التحكم' : 'Restaurant Admin Login'}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {isAr ? 'سجل دخولك لإدارة القائمة والأسعار والطلبات الحية' : 'Sign in to manage categories, menu dishes, prices, and orders'}
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-xs text-orange-800 dark:text-orange-300 flex items-center justify-between">
          <div>
            <span className="font-bold block">{isAr ? 'بيانات الدخول الافتراضية التجريبية:' : 'Default Demo Credentials:'}</span>
            <span className="font-mono">admin / admin123</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setUsername('admin');
              setPassword('admin123');
            }}
            className="px-2.5 py-1 rounded-lg bg-orange-600 text-white font-bold text-[11px] hover:bg-orange-700"
          >
            {isAr ? 'ملء تلقائي' : 'Auto Fill'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              {isAr ? 'اسم المستخدم أو البريد' : 'Username or Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {loading ? '...' : (isAr ? 'تسجيل الدخول' : 'Sign In')}
          </button>
        </form>
      </div>
    </div>
  );
};
