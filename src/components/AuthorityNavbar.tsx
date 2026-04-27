import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, FileText, LogOut, Shield } from 'lucide-react';
import { logoutUser } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

const AuthorityNavbar: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login', { replace: true });
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Admin';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/authority/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900">PoliVoice</span>
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Authority</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            <Link
              to="/authority/dashboard"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/authority/dashboard') ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              {t('dashboard')}
            </Link>
            <Link
              to="/authority/policies"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/authority/policies') ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-4 w-4" />
              Policies
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" />
                ) : (
                  initials
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">{displayName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </div>

        <div className="sm:hidden border-t border-gray-100 flex">
          <Link to="/authority/dashboard" className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${isActive('/authority/dashboard') ? 'text-green-700' : 'text-gray-500'}`}>
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Link>
          <Link to="/authority/policies" className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${isActive('/authority/policies') ? 'text-green-700' : 'text-gray-500'}`}>
            <FileText className="h-4 w-4" />
            Policies
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AuthorityNavbar;
