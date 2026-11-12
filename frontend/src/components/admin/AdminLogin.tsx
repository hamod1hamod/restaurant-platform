import React, { useState } from 'react';
import { X, ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onSuccess }) => {
  const { language } = useLanguage();
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
      window.location.hash = '#admin';
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.hash = '';
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#0d2a1c] border border-black/15 dark:border-white/15 p-6 sm:p-8 space-y-6 text-[#0d2a1c] dark:text-white"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleCancel}
          className="taste-btn absolute top-4 right-4 rtl:right-auto rtl:left-4 w-9 h-9 flex items-center justify-center border border-black/15 dark:border-white/15 text-[#5f6b64] hover:text-[#0d2a1c] dark:hover:text-white cursor-pointer"
          title="Return to Website"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-2 pt-2">
          <div className="w-11 h-11 bg-[#ebebeb] dark:bg-[#1c3629] border border-black/12 dark:border-white/12 text-[#0d2a1c] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-display text-2xl text-[#0d2a1c] dark:text-white">
            {isAr ? 'إدارة مطعم وكافيه خطاب' : 'Khatab Restaurant & Café Admin'}
          </h2>
          <p className="text-sm text-[#5f6b64] dark:text-[#a3a3a3]">
            {isAr ? 'سجل دخولك لإدارة القائمة والأسعار والطلبات' : 'Sign in to manage categories, dishes, prices, and orders.'}
          </p>
        </div>

        {/* Default Credentials Helper */}
        <div className="p-3.5 bg-[#ebebeb] dark:bg-[#1c3629] border border-black/12 dark:border-white/12 text-xs flex items-center justify-between">
          <div>
            <span className="font-medium block text-[#5f6b64]">{isAr ? 'بيانات الدخول الافتراضية:' : 'Default Credentials'}</span>
            <span className="font-mono font-semibold text-[#0d2a1c] dark:text-white">admin / admin123</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setUsername('admin');
              setPassword('admin123');
            }}
            className="taste-btn px-3 py-1.5 bg-[#0d2a1c] dark:bg-white text-white dark:text-[#0d2a1c] font-medium text-xs cursor-pointer"
          >
            {isAr ? 'ملء تلقائي' : 'Auto Fill'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3] mb-1">
              {isAr ? 'اسم المستخدم أو البريد' : 'Username or Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-[#5f6b64]" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rtl:pl-4 rtl:pr-10 rounded-[2px] bg-[#ebebeb] dark:bg-[#1c3629] border border-black/15 dark:border-white/15 text-sm focus:outline-none focus:border-[#0d2a1c]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#5f6b64] dark:text-[#a3a3a3] mb-1">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-[#5f6b64]" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rtl:pl-4 rtl:pr-10 rounded-[2px] bg-[#ebebeb] dark:bg-[#1c3629] border border-black/15 dark:border-white/15 text-sm focus:outline-none focus:border-[#0d2a1c]"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-[#ebebeb] border border-[#0d2a1c] text-[#0d2a1c] text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="taste-btn w-full h-12 bg-[#0d2a1c] hover:bg-[#1c3629] text-white font-medium text-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? '...' : (isAr ? 'تسجيل الدخول' : 'Sign In')}
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="text-xs text-[#5f6b64] hover:text-[#0d2a1c] dark:hover:text-white transition-colors cursor-pointer"
            >
              {isAr ? '← العودة للموقع الإلكتروني' : '← Return to Customer Website'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
