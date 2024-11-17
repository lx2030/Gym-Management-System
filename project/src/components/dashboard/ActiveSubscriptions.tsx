import React, { useMemo } from 'react';
import { User, Subscription, Package, Product } from '../../types';
import { Ban, Plus, AlertCircle } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import SubscriptionDialog from '../trainees/SubscriptionDialog';

interface ActiveSubscriptionsProps {
  subscriptions: Subscription[];
  trainees: User[];
  packages: Package[];
  deliveryProducts: Product[];
  onCancelSubscription: (subscriptionId: string) => void;
  onAddSubscription: (data: any) => void;
}

function ActiveSubscriptions({ 
  subscriptions, 
  trainees, 
  packages,
  deliveryProducts,
  onCancelSubscription,
  onAddSubscription 
}: ActiveSubscriptionsProps) {
  const [filterStatus, setFilterStatus] = React.useState<'active' | 'expired' | 'expiring' | 'all'>('active');
  const [showSubscriptionDialog, setShowSubscriptionDialog] = React.useState(false);
  const [selectedTraineeId, setSelectedTraineeId] = React.useState<string | null>(null);

  const getSubscriptionStatus = (subscription: Subscription) => {
    const today = new Date();
    const endDate = new Date(subscription.endDate);
    const daysRemaining = differenceInDays(endDate, today);

    if (daysRemaining < 0) return 'expired';
    if (daysRemaining <= 7) return 'expiring';
    return subscription.status;
  };

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      const status = getSubscriptionStatus(sub);
      if (filterStatus === 'all') return true;
      if (filterStatus === 'active') return status === 'active';
      if (filterStatus === 'expired') return status === 'expired';
      if (filterStatus === 'expiring') return status === 'expiring';
      return true;
    });
  }, [subscriptions, filterStatus]);

  // Get trainees without active subscriptions
  const inactiveTrainees = useMemo(() => {
    const activeTraineeIds = new Set(
      subscriptions
        .filter(sub => getSubscriptionStatus(sub) === 'active')
        .map(sub => sub.userId)
    );
    return trainees.filter(trainee => !activeTraineeIds.has(trainee.id));
  }, [trainees, subscriptions]);

  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const days = differenceInDays(end, today);
    return days;
  };

  const getStatusDisplay = (subscription: Subscription) => {
    const days = getDaysRemaining(subscription.endDate);
    const status = getSubscriptionStatus(subscription);

    if (status === 'expired') {
      return {
        text: 'منتهي',
        class: 'bg-red-100 text-red-800'
      };
    }
    if (status === 'expiring') {
      return {
        text: `ينتهي خلال ${days} يوم`,
        class: 'bg-yellow-100 text-yellow-800'
      };
    }
    return {
      text: `متبقي ${days} يوم`,
      class: 'bg-green-100 text-green-800'
    };
  };

  const handleAddSubscription = (traineeId: string) => {
    setSelectedTraineeId(traineeId);
    setShowSubscriptionDialog(true);
  };

  const handleSubscriptionSubmit = async (data: any) => {
    try {
      const selectedPackage = packages.find(p => p.id === data.packageId);
      if (!selectedPackage) {
        throw new Error('الباقة غير موجودة');
      }

      const startDate = new Date(data.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + selectedPackage.duration);

      await onAddSubscription({
        ...data,
        status: 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      setShowSubscriptionDialog(false);
      setSelectedTraineeId(null);
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('حدث خطأ أثناء إنشاء الاشتراك');
    }
  };

  return (
    <div className="space-y-6">
      {/* Inactive Trainees Section */}
      {inactiveTrainees.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">المتدربين غير المشتركين</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المتدرب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    رقم الهاتف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inactiveTrainees.map((trainee) => (
                  <tr key={trainee.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {trainee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {trainee.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleAddSubscription(trainee.id)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Plus className="w-5 h-5 ml-1" />
                        إضافة اشتراك
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Subscriptions Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">الاشتراكات</h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'active' | 'expired' | 'expiring' | 'all')}
            className="border rounded-lg px-3 py-2"
          >
            <option value="active">النشطة</option>
            <option value="expiring">تنتهي قريباً</option>
            <option value="expired">المنتهية</option>
            <option value="all">جميع الاشتراكات</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  المتدرب
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
                const trainee = trainees.find(t => t.id === subscription.userId);
                const pkg = packages.find(p => p.id === subscription.packageId);
                const status = getStatusDisplay(subscription);
                return (
                  <tr key={subscription.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {trainee?.name || 'غير معروف'}
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.class}`}>
                        {status.text}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSubscriptionStatus(subscription) !== 'expired' ? (
                        <button
                          onClick={() => onCancelSubscription(subscription.id)}
                          className="flex items-center text-red-600 hover:text-red-800"
                          title="إلغاء الاشتراك"
                        >
                          <Ban className="w-5 h-5 ml-1" />
                          إلغاء
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddSubscription(subscription.userId)}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Plus className="w-5 h-5 ml-1" />
                          تجديد
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

      {showSubscriptionDialog && (
        <SubscriptionDialog
          packages={packages}
          trainees={trainees}
          subscriptions={subscriptions}
          deliveryProducts={deliveryProducts}
          selectedTraineeId={selectedTraineeId}
          onSubmit={handleSubscriptionSubmit}
          onClose={() => {
            setShowSubscriptionDialog(false);
            setSelectedTraineeId(null);
          }}
        />
      )}
    </div>
  );
}

export default ActiveSubscriptions;