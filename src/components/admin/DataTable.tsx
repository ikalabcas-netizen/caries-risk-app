'use client';

import { AssessmentRecord } from '@/lib/types';

interface DataTableProps {
  data: AssessmentRecord[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}

function RiskBadge({ level }: { level: string }) {
  const config = {
    LOW: 'bg-emerald-100 text-emerald-800',
    MODERATE: 'bg-amber-100 text-amber-800',
    HIGH: 'bg-red-100 text-red-800',
  }[level] || 'bg-gray-100 text-gray-800';

  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${config}`}>{level}</span>;
}

export default function DataTable({ data, selectedIds, onToggle, onToggleAll }: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No assessments found</p>
      </div>
    );
  }

  const allSelected = data.length > 0 && data.every(row => selectedIds.has(row.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="py-3 px-4 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleAll}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">#</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Personal ID</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Patient Name</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">School</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Round</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Age</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">S-OHI</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const isSelected = selectedIds.has(row.id);
            return (
              <tr
                key={row.id}
                className={`border-b border-gray-100 transition-colors cursor-pointer ${
                  isSelected ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'
                }`}
                onClick={() => onToggle(row.id)}
              >
                <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(row.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </td>
                <td className="py-3 px-4 text-gray-400">{i + 1}</td>
                <td className="py-3 px-4 text-gray-600">
                  {new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="py-3 px-4 text-gray-600 font-mono">{row.personal_id || '-'}</td>
                <td className="py-3 px-4 font-medium text-gray-800">{row.patient_name}</td>
                <td className="py-3 px-4 text-gray-600">{row.school || '-'}</td>
                <td className="py-3 px-4 text-gray-600 text-center">{row.survey_round ?? '-'}</td>
                <td className="py-3 px-4 text-gray-600">
                  {row.age_years !== null ? `${row.age_years}y ${row.age_months ?? 0}m` : '-'}
                </td>
                <td className="py-3 px-4 text-gray-600">{row.calculated_sohi ?? '-'}</td>
                <td className="py-3 px-4"><RiskBadge level={row.risk_level} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
