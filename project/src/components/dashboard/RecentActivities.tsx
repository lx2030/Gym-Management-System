import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Activity, Receipt, UserPlus } from 'lucide-react';

interface RecentActivity {
  id: string;
  type: 'subscription' | 'transaction';
  description: string;
  time: string;
}

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

function RecentActivities({ activities }: RecentActivitiesProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'subscription':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'transaction':
        return <Receipt className="w-5 h-5 text-green-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ar });
    } catch (error) {
      return 'تاريخ غير صالح';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">النشاطات الأخيرة</h2>
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
              <div className="ml-3">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(activity.time)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">لا توجد نشاطات حديثة</p>
      )}
    </div>
  );
}

export default RecentActivities;