import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package } from '../../types';

const subscriptionSchema = z.object({
  packageId: z.string().min(1, 'يرجى اختيار الباقة'),
  startDate: z.string().min(1, 'يرجى تحديد تاريخ البدء'),
  paymentMethod: z.enum(['cash', 'card', 'bank_transfer']),
  notes: z.string().optional(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionAssignmentProps {
  packages: Package[];
  onSubmit: (data: SubscriptionFormData) => void;
  onCancel: () => void;
}

function SubscriptionAssignment({ packages, onSubmit, onCancel }: SubscriptionAssignmentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          اختر الباقة
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
          طريقة الدفع
        </label>
        <select
          {...register('paymentMethod')}
          className="w-full p-2 border rounded-lg"
        >
          <option value="cash">نقداً</option>
          <option value="card">بطاقة ائتمان</option>
          <option value="bank_transfer">تحويل بنكي</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ملاحظات
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="flex justify-end space-x-4 space-x-reverse">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          تأكيد الاشتراك
        </button>
      </div>
    </form>
  );
}

export default SubscriptionAssignment;