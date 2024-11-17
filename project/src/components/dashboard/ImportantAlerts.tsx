import React from 'react';
import { AlertCircle, UserMinus, AlertTriangle } from 'lucide-react';

interface ImportantAlertsProps {
  expiringSubscriptions: Array<{
    traineeName: string;
    daysRemaining: number;
  }>;
  inactiveTrainees: Array<{
    name: string;
    lastActive: string;
  }>;
  lowAttendance: Array<{
    traineeName: string;
    attendanceRate: number;
  }>;
}

function ImportantAlerts({ expiringSubscriptions, inactiveTrainees, lowAttendance }: ImportantAlertsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <AlertCircle className="w-5 h-5 ml-2 text-red-500" />
        تنبيهات هامة
      </h2>
      
      <div className="space-y-6">
        {/* Expiring Subscriptions */}
        {expiringSubscriptions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">اشتراكات تنتهي قريباً</h3>
            <div className="space-y-2">
              {expiringSubscriptions.map((sub, index) => (
                <div key={index} className="flex items-center text-sm bg-yellow-50 p-2 rounded-lg">
                  <AlertTriangle className="w-4 h-4 ml-2 text-yellow-500" />
                  <span>
                    اشتراك <span className="font-medium">{sub.traineeName}</span> ينتهي خلال {sub.daysRemaining} يوم
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inactive Trainees */}
        {inactiveTrainees.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">متدربين غير نشطين</h3>
            <div className="space-y-2">
              {inactiveTrainees.map((trainee, index) => (
                <div key={index} className="flex items-center text-sm bg-red-50 p-2 rounded-lg">
                  <UserMinus className="w-4 h-4 ml-2 text-red-500" />
                  <span>
                    {trainee.name} لم يحضر منذ {trainee.lastActive}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Attendance */}
        {lowAttendance.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">نسبة حضور منخفضة</h3>
            <div className="space-y-2">
              {lowAttendance.map((trainee, index) => (
                <div key={index} className="flex items-center text-sm bg-orange-50 p-2 rounded-lg">
                  <AlertTriangle className="w-4 h-4 ml-2 text-orange-500" />
                  <span>
                    {trainee.traineeName} - نسبة الحضور {trainee.attendanceRate}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {expiringSubscriptions.length === 0 && 
         inactiveTrainees.length === 0 && 
         lowAttendance.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            لا توجد تنبيهات هامة حالياً
          </p>
        )}
      </div>
    </div>
  );
}

export default ImportantAlerts;