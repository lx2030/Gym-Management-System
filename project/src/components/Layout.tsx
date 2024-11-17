import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { 
  LayoutDashboard, 
  Users,
  UserCog,
  Package, 
  ClipboardList, 
  DollarSign,
  Receipt,
  ShoppingBag,
  Settings as SettingsIcon,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { sidebarOpenAtom } from '../atoms/layout';
import { authAtom } from '../atoms/auth';
import { logout } from '../services/auth';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'لوحة التحكم', roles: ['admin', 'user'] },
  { path: '/trainees', icon: Users, label: 'المتدربين', roles: ['admin', 'user'] },
  { path: '/users', icon: UserCog, label: 'المستخدمين', roles: ['admin'] },
  { path: '/packages', icon: Package, label: 'الباقات', roles: ['admin', 'user'] },
  { path: '/subscriptions', icon: ClipboardList, label: 'الاشتراكات', roles: ['admin', 'user'] },
  { path: '/finance', icon: DollarSign, label: 'المالية', roles: ['admin'] },
  { path: '/expenses', icon: Receipt, label: 'المصروفات', roles: ['admin'] },
  { path: '/products', icon: ShoppingBag, label: 'المنتجات', roles: ['admin', 'user'] },
  { path: '/settings', icon: SettingsIcon, label: 'الإعدادات', roles: ['admin'] },
];

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(sidebarOpenAtom);
  const [auth, setAuth] = useAtom(authAtom);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAuth({ user: null, token: null });
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(
    item => item.roles.includes(auth.user?.role || 'user')
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-l">
          <div className="flex items-center justify-between mb-6 px-2">
            <h1 className="text-xl font-bold">نادي الملاكمة</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <ul className="space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-lg ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 ml-3" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:mr-64">
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-sm text-gray-700">{auth.user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <LogOut className="w-5 h-5 ml-1" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;