import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from '../atoms/auth';
import { settingsAtom } from '../atoms/settings';
import { LoginCredentials } from '../types/auth';
import { login } from '../services/auth';

const loginSchema = z.object({
  username: z.string().min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = LoginCredentials & { rememberMe?: boolean };

function Login() {
  const navigate = useNavigate();
  const [, setAuth] = useAtom(authAtom);
  const [settings] = useAtom(settingsAtom);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: localStorage.getItem('rememberedUsername') || '',
      rememberMe: !!localStorage.getItem('rememberedUsername'),
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      setAuth({
        user: response.user,
        token: response.token,
      });

      // حفظ البيانات في localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // حفظ اسم المستخدم إذا تم اختيار تذكر كلمة المرور
      if (data.rememberMe) {
        localStorage.setItem('rememberedUsername', data.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }

      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          {settings.logo ? (
            <img
              src={settings.logo}
              alt="شعار النادي"
              className="w-32 h-32 mx-auto mb-4 rounded-full shadow-lg object-cover"
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=400&h=400&fit=crop"
              alt="شعار النادي"
              className="w-32 h-32 mx-auto mb-4 rounded-full shadow-lg object-cover"
            />
          )}
          <h1 className="text-2xl font-bold">{settings.gymName}</h1>
          <p className="text-gray-600 mt-2">تسجيل الدخول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المستخدم
            </label>
            <input
              type="text"
              {...register('username')}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل اسم المستخدم"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              {...register('rememberMe')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="rememberMe" className="mr-2 text-sm text-gray-700">
              تذكرني
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;