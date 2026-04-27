import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleRoute from './components/RoleRoute';
import UserNavbar from './components/UserNavbar';
import AuthorityNavbar from './components/AuthorityNavbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/user/UserHome';
import AuthorityDashboard from './pages/authority/AuthorityDashboard';
import PolicyManager from './pages/authority/PolicyManager';

import './i18n';

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-slate-50">
    <UserNavbar />
    <main>{children}</main>
  </div>
);

const AuthorityLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-slate-50">
    <AuthorityNavbar />
    <main>{children}</main>
  </div>
);

const SmartRedirect: React.FC = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) return <Home />;
  if (role === 'authority') return <Navigate to="/authority/dashboard" replace />;
  return <Navigate to="/user/home" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SmartRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/user/home"
        element={
          <RoleRoute requiredRole="user">
            <UserLayout>
              <UserHome />
            </UserLayout>
          </RoleRoute>
        }
      />

      <Route
        path="/authority/dashboard"
        element={
          <RoleRoute requiredRole="authority">
            <AuthorityLayout>
              <AuthorityDashboard />
            </AuthorityLayout>
          </RoleRoute>
        }
      />
      <Route
        path="/authority/policies"
        element={
          <RoleRoute requiredRole="authority">
            <AuthorityLayout>
              <PolicyManager />
            </AuthorityLayout>
          </RoleRoute>
        }
      />

      <Route path="/policies" element={<Navigate to="/user/home" replace />} />
      <Route path="/dashboard" element={<Navigate to="/authority/dashboard" replace />} />
      <Route path="/add-policy" element={<Navigate to="/authority/policies" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;