import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { User, Subscription } from '../../types';
import { Clock, CreditCard, Package } from 'lucide-react';

interface MemberDetailsProps {
  member: User;
  subscriptions: Subscription[];
}

function MemberDetails({ member, subscriptions }: MemberDetailsProps) {
  const activeSubscription = subscriptions.find(sub => sub.status === 'active');

  return (
    <div className="space-y-6">
      {/* Member Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">معلومات العضو</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">الاسم</p>
            <p className="font-medium">{member.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">البريد الإلكتروني</p>
            <p className="font-medium">{member.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">الجنس</p>
            <p className="font-medium">{member.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">رقم الهاتف</p>
            <p className="font-medium">{member.phone}</p>
          </div>
        </div>
      </div>

      {/* Active Subscription */}
      {activeSubscription && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">الاشتراك الحالي</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-blue-500 ml-2" />
              <div>
                <p className="text-sm text-gray-500">الباقة</p>
                <p className="font-medium">الباقة الشهرية</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-green-500 ml-2" />
              <div>
                <p className="text-sm text-gray-500">تاريخ الانتهاء</p>
                <p className="font-medium">
                  {format(new Date(activeSubscription.endDate), 'dd MMMM yyyy', { locale: ar })}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-yellow-500 ml-2" />
              <div>
                <p className="text-sm text-gray-500">حالة الدفع</p>
                <p className="font-medium">
                  {activeSubscription.paymentStatus === 'paid' ? 'مدفوع' : 'معلق'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscription History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">سجل الاشتراكات</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    الباقة الشهرية
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {format(new Date(subscription.startDate), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {format(new Date(subscription.endDate), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subscription.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : subscription.status === 'expired'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {subscription.status === 'active'
                        ? 'نشط'
                        : subscription.status === 'expired'
                        ? 'منتهي'
                        : 'معلق'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MemberDetails;