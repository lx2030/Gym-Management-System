import React, { useState } from 'react';
import { Users, Search, Filter, Plus } from 'lucide-react';
import MembersList from '../components/members/MembersList';
import MemberFilters from '../components/members/MemberFilters';
import MemberForm from '../components/members/MemberForm';
import MemberDetails from '../components/members/MemberDetails';
import { User, Subscription } from '../types';

// Mock data for demonstration
const MOCK_MEMBERS: User[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    role: 'user',
    gender: 'male',
    phone: '0501234567',
  },
  {
    id: '2',
    name: 'سارة أحمد',
    email: 'sara@example.com',
    role: 'user',
    gender: 'female',
    phone: '0507654321',
  },
];

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    userId: '1',
    packageId: '1',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-02-01'),
    status: 'active',
    paymentStatus: 'paid',
  },
];

function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  const filteredMembers = MOCK_MEMBERS.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = selectedGender === 'all' || member.gender === selectedGender;
    return matchesSearch && matchesGender;
  });

  const handleMemberSubmit = (data: any) => {
    console.log('Member data:', data);
    setShowForm(false);
  };

  const handleMemberSelect = (member: User) => {
    setSelectedMember(member);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="ml-2" />
          إدارة الأعضاء
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 ml-2" />
          إضافة عضو جديد
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">
            {selectedMember ? 'تعديل عضو' : 'إضافة عضو جديد'}
          </h2>
          <MemberForm
            member={selectedMember || undefined}
            onSubmit={handleMemberSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedMember(null);
            }}
          />
        </div>
      ) : selectedMember ? (
        <MemberDetails
          member={selectedMember}
          subscriptions={MOCK_SUBSCRIPTIONS.filter(
            (sub) => sub.userId === selectedMember.id
          )}
        />
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث عن عضو..."
                className="w-full pr-10 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <MemberFilters
              selectedGender={selectedGender}
              onGenderChange={setSelectedGender}
            />
          </div>

          <MembersList
            members={filteredMembers}
            onMemberSelect={handleMemberSelect}
          />
        </div>
      )}
    </div>
  );
}

export default Members;