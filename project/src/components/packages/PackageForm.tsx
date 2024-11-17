import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package } from '../../types';

const packageSchema = z.object({
  name: z.string().min(3, 'اسم الباقة يجب أن يكون 3 أحرف على الأقل'),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  price: z.number().min(1, 'السعر يجب أن يكون أكبر من صفر'),
  duration: z.number().min(1, 'المدة يجب أن تكون أكبر من صفر'),
  category: z.string().min(1, 'يجب اختيار الفئة'),
});

type PackageFormData = z.infer<typeof packageSchema>;

interface PackageFormProps {
  package?: Package;
  onSubmit: (data: PackageFormData) => void;
  onCancel: () => void;
}

const CATEGORIES = ['شهري', 'فصلي', 'سنوي', 'خاص'];

function PackageForm({ package: initialPackage, onSubmit, onCancel }: PackageFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: initialPackage || {
      price: 0,
      duration: 30,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسم الباقة
          </label>
          <input
            type="text"
            {...register('name')}
            className="w-full p-2 border rounded-lg"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الفئة
          </label>
          <select {...register('category')} className="w-full p-2 border rounded-lg">
            <option value="">اختر الفئة</option>
            {CATEGORIES.map((category) => (
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
            السعر (ر.س)
          </label>
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            className="w-full p-2 border rounded-lg"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المدة (بالأيام)
          </label>
          <input
            type="number"
            {...register('duration', { valueAsNumber: true })}
            className="w-full p-2 border rounded-lg"
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
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
          {initialPackage ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
}

export default PackageForm;