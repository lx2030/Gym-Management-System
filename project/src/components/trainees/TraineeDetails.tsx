import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { User, Subscription } from '../../types';
import { Clock, CreditCard, Package, Edit2, Trash2, Plus } from 'lucide-react';

interface TraineeDetailsProps {
  trainee: User;
  subscriptions: Subscription[];
  onEdit: () => void;
  onDelete: () => void;
  onAddSubscription: () => void;
}

function TraineeDetails({ trainee, subscriptions, onEdit, onDelete, onAddSubscription }: TraineeDetailsProps) {
  const activeSubscription = subscriptions.find(sub => sub.status === 'active');

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'تاريخ غير صالح';
    }
  };

  return (
    <div className="space-y-6">
      {/* Trainee Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold">معلومات المتدرب</h2>
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={onEdit}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <Edit2 className="w-4 h-4 ml-1" />
              تعديل
            </button>
            <button
              onClick={onDelete}
              className="flex items-center text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 ml-1" />
              حذف
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">الاسم</p>
            <p className="font-medium">{trainee.name}</p>
          </div>
          {trainee.email && (
            <div>
              <p className="text-sm text-gray-500">البريد الإلكتروني</p>
              <p className="font-medium">{trainee.email}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">رقم الهاتف</p>
            <p className="font-medium">{trainee.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">الجنس</p>
            <p className="font-medium">{trainee.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">رقم الطوارئ</p>
            <p className="font-medium">{trainee.emergencyContact}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">العنوان</p>
            <p className="font-medium">{trainee.address}</p>
          </div>
        </div>
      </div>

      {/* Subscriptions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">الاشتراكات</h2>
          <button
            onClick={onAddSubscription}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 ml-1" />
            إضافة اشتراك جديد
          </button>
        </div>

        {activeSubscription ? (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">الاشتراك الحالي</h3>
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
                    {formatDate(activeSubscription.endDate)}
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
        ) : (
          <p className="text-gray-500 mb-6">لا يوجد اشتراك نشط</p>
        )}

        <h3 className="text-lg font-medium mb-4">سجل الاشتراكات</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(subscription.startDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(subscription.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      subscription.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : subscription.status === 'expired'
                        ? 'bg-red-100 text-red-800'
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TraineeDetails;