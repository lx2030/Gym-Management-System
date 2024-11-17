import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '../../types';

const userSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  username: z.string().min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').optional(),
  role: z.enum(['admin', 'user']),
  phone: z.string().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
  gender: z.enum(['male', 'female']),
  emergencyContact: z.string().min(10, 'رقم الطوارئ يجب أن يكون 10 أرقام على الأقل'),
  address: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل'),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user || {
      role: 'user',
      gender: 'male',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الاسم <span className="text-red-500">*</span>
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
            اسم المستخدم <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('username')}
            className="w-full p-2 border rounded-lg"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور {!user && <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full p-2 border rounded-lg"
            placeholder={user ? 'اتركه فارغاً إذا لم ترد تغييره' : ''}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الصلاحية <span className="text-red-500">*</span>
          </label>
          <select {...register('role')} className="w-full p-2 border rounded-lg">
            <option value="user">مستخدم</option>
            <option value="admin">مدير</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رقم الهاتف <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full p-2 border rounded-lg"
            maxLength={10}
            placeholder="05xxxxxxxx"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الجنس <span className="text-red-500">*</span>
          </label>
          <select {...register('gender')} className="w-full p-2 border rounded-lg">
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رقم الطوارئ <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('emergencyContact')}
            className="w-full p-2 border rounded-lg"
            maxLength={10}
            placeholder="05xxxxxxxx"
          />
          {errors.emergencyContact && (
            <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            العنوان <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('address')}
            className="w-full p-2 border rounded-lg"
            placeholder="المدينة، الحي، الشارع"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4 space-x-reverse">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          disabled={isSubmitting}
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'جاري الحفظ...' : user ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
}

export default UserForm;