import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTransaction } from '../../services/transactions';

const transactionSchema = z.object({
  type: z.enum(['subscription', 'product', 'expense']),
  amount: z.number().min(0.01, 'المبلغ يجب أن يكون أكبر من صفر'),
  description: z.string().min(3, 'الوصف يجب أن يكون 3 أحرف على الأقل'),
  category: z.string().min(1, 'يرجى اختيار الفئة'),
  date: z.string().min(1, 'يرجى تحديد التاريخ'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
}

const TRANSACTION_CATEGORIES = {
  subscription: ['شهري', 'فصلي', 'سنوي'],
  product: ['معدات', 'ملابس', 'مكملات غذائية'],
  expense: ['رواتب', 'صيانة', 'إيجار', 'مرافق', 'معدات', 'تسويق', 'أخرى'],
};

function TransactionForm({ onSubmit, onCancel }: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      type: 'subscription',
    },
  });

  const selectedType = watch('type');

  const handleFormSubmit = async (data: TransactionFormData) => {
    try {
      // Convert amount to negative for expenses
      const amount = data.type === 'expense' ? -Math.abs(data.amount) : Math.abs(data.amount);
      
      await createTransaction({
        type: data.type,
        amount,
        date: new Date(data.date).toISOString(),
        description: data.description,
        category: data.category,
        userId: null,
      });

      onSubmit(data);
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('حدث خطأ أثناء إنشاء المعاملة');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نوع المعاملة
          </label>
          <select
            {...register('type')}
            className="w-full p-2 border rounded-lg"
          >
            <option value="subscription">اشتراك</option>
            <option value="product">مبيعات</option>
            <option value="expense">مصروفات</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المبلغ (ر.س)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            className="w-full p-2 border rounded-lg"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الفئة
          </label>
          <select
            {...register('category')}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">اختر الفئة</option>
            {TRANSACTION_CATEGORIES[selectedType].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            التاريخ
          </label>
          <input
            type="date"
            {...register('date')}
            className="w-full p-2 border rounded-lg"
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الوصف
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full p-2 border rounded-lg"
            placeholder="تفاصيل المعاملة..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
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
          إضافة المعاملة
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;