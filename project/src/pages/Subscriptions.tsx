import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, Filter } from 'lucide-react';
import { Subscription, User, Package } from '../types';
import { getAllSubscriptions, cancelSubscription } from '../services/subscriptions';
import { getAllUsers } from '../services/users';
import { getAllPackages } from '../services/packages';

function Subscriptions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [loadedSubscriptions, loadedUsers, loadedPackages] = await Promise.all([
        getAllSubscriptions(),
        getAllUsers(),
        getAllPackages(),
      ]);
      setSubscriptions(loadedSubscriptions);
      setUsers(loadedUsers);
      setPackages(loadedPackages);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const user = users.find(u => u.id === sub.userId);
    const pkg = packages.find(p => p.id === sub.packageId);
    
    return matchesStatus && (
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  async function handleCancelSubscription(id: string) {
    if (confirm('هل أنت متأكد من إلغاء هذا الاشتراك؟')) {
      try {
        await cancelSubscription(id);
        await loadData();
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        alert('حدث خطأ أثناء إلغاء الاشتراك');
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <ClipboardList className="ml-2" />
          إدارة الاشتراكات
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن اشتراك..."
              className="w-full pr-10 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center">
              <Filter className="w-5 h-5 ml-2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'expired')}
                className="border rounded-lg px-3 py-2"
              >
                <option value="all">جميع الاشتراكات</option>
                <option value="active">النشطة</option>
                <option value="expired">المنتهية</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  العضو
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الباقة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  تاريخ البدء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  تاريخ الانتهاء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  حالة الدفع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map((subscription) => {
                const user = users.find(u => u.id === subscription.userId);
                const pkg = packages.find(p => p.id === subscription.packageId);
                return (
                  <tr key={subscription.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user?.name || 'غير معروف'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {pkg?.name || 'غير معروف'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(subscription.startDate).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(subscription.endDate).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subscription.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : subscription.status === 'expired'
                          ? 'bg-red-100 text-red-800'
                          : subscription.status === 'cancelled'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {subscription.status === 'active'
                          ? 'نشط'
                          : subscription.status === 'expired'
                          ? 'منتهي'
                          : subscription.status === 'cancelled'
                          ? 'ملغي'
                          : 'معلق'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subscription.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {subscription.paymentStatus === 'paid' ? 'مدفوع' : 'معلق'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {subscription.status === 'active' && (
                        <button
                          onClick={() => handleCancelSubscription(subscription.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          إلغاء الاشتراك
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Subscriptions;