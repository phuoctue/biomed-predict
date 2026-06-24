import React from 'react';

export type RoleType = 'doctor' | 'pharmacist' | 'admin';

interface RoleTabsProps {
  activeRole: RoleType;
  onChange: (role: RoleType) => void;
}

export const RoleTabs: React.FC<RoleTabsProps> = ({ activeRole, onChange }) => {
  const roles: { id: RoleType; label: string }[] = [
    { id: 'doctor', label: 'Bác sĩ' },
    { id: 'pharmacist', label: 'Dược sĩ' },
    { id: 'admin', label: 'Quản trị' },
  ];

  return (
    <div className="w-full grid grid-cols-3 gap-1 border-b border-slate-100 pb-2 mb-6 text-center text-xs sm:text-sm font-medium text-slate-400">
      {roles.map((r) => {
        const isActive = activeRole === r.id;
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onChange(r.id)}
            className={`pb-2 transition-all relative ${isActive ? 'text-blue-600 font-semibold' : 'hover:text-slate-600'}`}
          >
            {r.label}
            {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
          </button>
        );
      })}
    </div>
  );
};
