import React, { useState } from 'react';
import { X, Lock, Key, AlertCircle } from 'lucide-react';
import { DataService } from '../../services/dataService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setError('');
    setLoading(true);

    try {
      const valid = await DataService.verifyAdminPassword(password);
      if (valid) {
        onSuccess();
        onClose();
      } else {
        setError('كلمة المرور غير صحيحة، حاول مرة أخرى');
      }
    } catch {
      setError('حدث خطأ أثناء التحقق من كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemo = () => {
    setPassword('admin123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-[#13221a] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-white/10">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                تسجيل الدخول للإدارة
              </h3>
              <p className="text-xs text-slate-400">لوحة تحكم وتعديل قائمة الطعام</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              كلمة مرور المشرف (Admin Password)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور..."
                className="w-full h-12 px-4 ps-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Key className="w-4 h-4 text-slate-400 absolute top-4 start-4" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-cyan-50/70 dark:bg-cyan-950/40 rounded-xl border border-cyan-100 dark:border-cyan-900/40 flex items-center justify-between text-xs text-cyan-800 dark:text-cyan-300">
            <span>كلمة المرور الافتراضية: <strong>admin123</strong></span>
            <button
              type="button"
              onClick={handleUseDemo}
              className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-[#0b1b2b] rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
            >
              استخدام تلقائي
            </button>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#0b1b2b] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
            >
              {loading ? 'جاري التحقق...' : 'دخول الإدارة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
