import React from 'react';
import { Users, UserCheck, Package, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalTrainees: number;
    activeMembers: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    subscriptionRevenue: number;
    productRevenue: number;
    expensesByCategory: Record<string, number>;
    expiringSubscriptions: number;
  };
}

function DashboardStats({ stats }: DashboardStatsProps) {
  const netIncome = stats.monthlyRevenue - stats.monthlyExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 bg-purple-100 rounded-full">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div className="mr-4">
            <h3 className="text-gray-500 text-sm">إجمالي المتدربين</h3>
            <p className="text-2xl font-semibold">{stats.totalTrainees}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <UserCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div className="mr-4">
            <h3 className="text-gray-500 text-sm">المتدربين المشتركين</h3>
            <p className="text-2xl font-semibold">{stats.activeMembers}</p>
            <p className="text-sm text-gray-500">
              {stats.subscriptionRevenue.toLocaleString()} ر.س من الاشتراكات
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 bg-red-100 rounded-full">
            <Package className="w-6 h-6 text-red-600" />
          </div>
          <div className="mr-4">
            <h3 className="text-gray-500 text-sm">الاشتراكات المنتهية</h3>
            <p className="text-2xl font-semibold">{stats.activeSubscriptions}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 bg-yellow-100 rounded-full">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="mr-4">
            <h3 className="text-gray-500 text-sm">صافي الدخل الشهري</h3>
            <p className={`text-2xl font-semibold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netIncome.toLocaleString()} ر.س
            </p>
            <div className="text-sm text-gray-500">
              <span className="text-green-600">+{stats.monthlyRevenue.toLocaleString()}</span>
              {' / '}
              <span className="text-red-600">-{stats.monthlyExpenses.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 bg-orange-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
          <div className="mr-4">
            <h3 className="text-gray-500 text-sm">اشتراكات قاربت على الانتهاء</h3>
            <p className="text-2xl font-semibold">{stats.expiringSubscriptions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;