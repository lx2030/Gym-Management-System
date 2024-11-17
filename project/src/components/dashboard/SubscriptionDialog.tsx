import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, User, Subscription } from '../../types';
import { AlertCircle } from 'lucide-react';

const subscriptionSchema = z.object({
  userId: z.string().min(1, 'يرجى اختيار المتدرب'),
  packageId: z.string().min(1, 'يرجى اختيار الباقة'),
  startDate: z.string().min(1, 'يرجى تحديد تاريخ البدء'),
  paymentStatus: z.enum(['paid', 'pending']),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionDialogProps {
  packages: Package[];
  trainees: User[];
  subscriptions: Subscription[];
  selectedTraineeId: string | null;
  onSubmit: (data: SubscriptionFormData) => void;
  onClose: () => void;
}

function SubscriptionDialog({ 
  packages, 
  trainees, 
  subscriptions, 
  selectedTraineeId,
  onSubmit, 
  onClose 
}: SubscriptionDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      userId: selectedTraineeId || '',
      startDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'paid',
    },
  });

  const selectedUserId = watch('userId');

  // Check if selected user has active subscription
  const hasActiveSubscription = useMemo(() => {
    if (!selectedUserId) return false;
    return subscriptions.some(
      sub => sub.userId === selectedUserId && sub.status === 'active'
    );
  }, [selectedUserId, subscriptions]);

  // Filter out trainees who already have active subscriptions
  const availableTrainees = useMemo(() => {
    if (selectedTraineeId) {
      return trainees.filter(t => t.id === selectedTraineeId);
    }
    return trainees.filter(trainee => {
      const hasActive = subscriptions.some(
        sub => sub.userId === trainee.id && sub.status === 'active'
      );
      return !hasActive || trainee.id === selectedUserId;
    });
  }, [trainees, subscriptions, selectedUserId, selectedTraineeId]);

  const handleFormSubmit = (data: SubscriptionFormData) => {
    if (hasActiveSubscription) {
      alert('هذا المتدرب لديه اشتراك نشط بالفعل');
      return;
    }
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">إضافة اشتراك جديد</h2>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المتدرب
            </label>
            <select
              {...register('userId')}
              className="w-full p-2 border rounded-lg"
              disabled={!!selectedTraineeId}
            >
              <option value="">اختر المتدرب</option>
              {availableTrainees.map((trainee) => (
                <option key={trainee.id} value={trainee.id}>
                  {trainee.name}
                </option>
              ))}
            </select>
            {errors.userId && (
              <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>
            )}
          </div>

          {hasActiveSubscription && (
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg text-yellow-800">
              <AlertCircle className="w-5 h-5 ml-2 flex-shrink-0" />
              <p className="text-sm">هذا المتدرب لديه اشتراك نشط بالفعل</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الباقة
            </label>
            <select
              {...register('packageId')}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">اختر الباقة</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - {pkg.price} ر.س
                </option>
              ))}
            </select>
            {errors.packageId && (
              <p className="text-red-500 text-sm mt-1">{errors.packageId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تاريخ البدء
            </label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full p-2 border rounded-lg"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              حالة الدفع
            </label>
            <select
              {...register('paymentStatus')}
              className="w-full p-2 border rounded-lg"
            >
              <option value="paid">مدفوع</option>
              <option value="pending">معلق</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 space-x-reverse mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={hasActiveSubscription}
            >
              تأكيد الاشتراك
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubscriptionDialog;