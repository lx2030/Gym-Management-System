import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '../../types';

const memberSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  phone: z.string()
    .min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل')
    .regex(/^[0-9]+$/, 'رقم الهاتف يجب أن يحتوي على أرقام فقط'),
  gender: z.enum(['male', 'female']),
  birthDate: z.string().optional(),
  emergencyContact: z.string()
    .min(10, 'رقم الطوارئ يجب أن يكون 10 أرقام على الأقل')
    .regex(/^[0-9]+$/, 'رقم الطوارئ يجب أن يحتوي على أرقام فقط'),
  address: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل'),
  notes: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface MemberFormProps {
  member?: User;
  onSubmit: (data: MemberFormData) => void;
  onCancel: () => void;
}

function MemberForm({ member, onSubmit, onCancel }: MemberFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: member || {
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
            placeholder="أدخل الاسم الكامل"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-2 border rounded-lg"
            placeholder="optional@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رقم الهاتف <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full p-2 border rounded-lg"
            placeholder="05xxxxxxxx"
            maxLength={10}
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
            تاريخ الميلاد
          </label>
          <input
            type="date"
            {...register('birthDate')}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رقم الطوارئ <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('emergencyContact')}
            className="w-full p-2 border rounded-lg"
            placeholder="05xxxxxxxx"
            maxLength={10}
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ملاحظات
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full p-2 border rounded-lg"
            placeholder="أي ملاحظات إضافية..."
          />
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
          {member ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
}

export default MemberForm;