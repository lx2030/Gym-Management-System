import React, { useState, useRef } from 'react';
import { Settings as SettingsIcon, Upload, X } from 'lucide-react';
import { useAtom } from 'jotai';
import { settingsAtom } from '../atoms/settings';

function Settings() {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      localStorage.setItem('gymSettings', JSON.stringify(settings));
      alert('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح');
      return;
    }

    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // إنشاء canvas لتغيير حجم الصورة
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // تعيين الأبعاد المطلوبة
        canvas.width = 400;
        canvas.height = 400;
        
        if (ctx) {
          // رسم الصورة بالحجم الجديد
          ctx.drawImage(img, 0, 0, 400, 400);
          
          // تحويل الصورة إلى Base64
          const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
          
          setSettings(prev => ({
            ...prev,
            logo: resizedImage
          }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setSettings(prev => ({
      ...prev,
      logo: undefined
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <SettingsIcon className="ml-2" />
          الإعدادات
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Logo Upload Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">شعار النادي</h2>
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="relative w-40 h-40">
                  {settings.logo ? (
                    <>
                      <img
                        src={settings.logo}
                        alt="شعار النادي"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-100 inline-block"
                  >
                    اختيار صورة
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    يجب أن تكون الصورة بحجم 400×400 بكسل كحد أقصى
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">إعدادات النادي</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم النادي
                  </label>
                  <input
                    type="text"
                    name="gymName"
                    className="w-full p-2 border rounded-lg"
                    value={settings.gymName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full p-2 border rounded-lg"
                    value={settings.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-2 border rounded-lg"
                    value={settings.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="w-full p-2 border rounded-lg"
                    value={settings.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">إعدادات النظام</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="enableNotifications"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={settings.enableNotifications}
                    onChange={handleChange}
                  />
                  <label htmlFor="notifications" className="mr-2 text-sm text-gray-700">
                    تفعيل الإشعارات
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoRenewal"
                    name="enableAutoRenewal"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={settings.enableAutoRenewal}
                    onChange={handleChange}
                  />
                  <label htmlFor="autoRenewal" className="mr-2 text-sm text-gray-700">
                    تفعيل التجديد التلقائي للاشتراكات
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isSaving}
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Settings;