import React from 'react';
import { Filter } from 'lucide-react';

interface MemberFiltersProps {
  selectedGender: 'all' | 'male' | 'female';
  onGenderChange: (gender: 'all' | 'male' | 'female') => void;
}

function MemberFilters({ selectedGender, onGenderChange }: MemberFiltersProps) {
  return (
    <div className="flex items-center space-x-4 space-x-reverse">
      <div className="flex items-center">
        <Filter className="w-5 h-5 ml-2 text-gray-400" />
        <select
          value={selectedGender}
          onChange={(e) => onGenderChange(e.target.value as 'all' | 'male' | 'female')}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">جميع الأعضاء</option>
          <option value="male">رجال</option>
          <option value="female">نساء</option>
        </select>
      </div>
    </div>
  );
}

export default MemberFilters;