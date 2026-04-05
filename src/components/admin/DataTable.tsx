'use client';

import { useState } from 'react';
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

function DetailField({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <dt className="text-xs text-gray-400 uppercase tracking-wide">{label}</dt>
      <dd className="text-sm text-gray-800 mt-0.5">{value ?? '-'}</dd>
    </div>
  );
}

const labelMap: Record<string, string> = {
  current_occ: 'Current Occupation',
  current_occ_specify: 'Occupation (Other)',
  housing: 'Housing',
  income: 'Monthly Income (THB)',
  chronic_disease: 'Chronic Disease',
  saliva_medication: 'Saliva Medication Effect',
  sugar_frequency: 'Sugar Frequency',
  brushing_freq: 'Brushing Frequency',
  fluoride_use: 'Fluoride Use',
  active_decay: 'Active Decay',
  decay_tooth_number: 'Decay Tooth #',
  plaque_16b: 'Plaque 16(B)',
  plaque_11la: 'Plaque 11(B)',
  plaque_26b: 'Plaque 26(B)',
  plaque_46li: 'Plaque 46(L)',
  plaque_31la: 'Plaque 31(B)',
  plaque_36li: 'Plaque 36(L)',
  calculated_sohi: 'S-OHI',
  appliances: 'Appliances',
  condition_improved: 'Condition Improved',
  saliva_amount: 'Saliva Amount (5min)',
  buffer_capacity: 'Buffer Capacity',
  plaque_acid: 'Plaque Acid',
};

function DetailPanel({ row }: { row: AssessmentRecord }) {
  const sections = [
    {
      title: 'Part 1: Economic / Social',
      fields: ['current_occ', 'current_occ_specify', 'housing', 'income'],
    },
    {
      title: 'Part 2: Medical',
      fields: ['chronic_disease', 'saliva_medication'],
    },
    {
      title: 'Part 3: Behavioral',
      fields: ['sugar_frequency', 'brushing_freq', 'fluoride_use'],
    },
    {
      title: 'Part 4: Oral Health',
      fields: ['active_decay', 'decay_tooth_number', 'plaque_16b', 'plaque_11la', 'plaque_26b', 'plaque_46li', 'plaque_31la', 'plaque_36li', 'calculated_sohi', 'appliances', 'condition_improved'],
    },
    {
      title: 'Part 5 & 6: Salivary & Plaque',
      fields: ['saliva_amount', 'buffer_capacity', 'plaque_acid'],
    },
  ];

  return (
    <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
      {/* General info row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-5 pb-4 border-b border-gray-200">
        <DetailField label="Personal ID" value={row.personal_id} />
        <DetailField label="School" value={row.school} />
        <DetailField label="Survey Round" value={row.survey_round} />
        <DetailField label="Gender" value={row.gender} />
        <DetailField label="Occupation" value={row.occupation} />
        <DetailField label="Date of Birth" value={row.dob} />
      </div>

      {/* Sections */}
      {sections.map(section => (
        <div key={section.title} className="mb-4">
          <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">{section.title}</h4>
          <dl className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-3">
            {section.fields.map(field => (
              <DetailField
                key={field}
                label={labelMap[field] || field}
                value={row[field as keyof AssessmentRecord] as string | number | null}
              />
            ))}
          </dl>
        </div>
      ))}

      {/* Risk result */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-3">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Risk Level:</span>
        <RiskBadge level={row.risk_level} />
        <span className="text-xs text-gray-400 ml-auto">ID: {row.id}</span>
      </div>
    </div>
  );
}

export default function DataTable({ data, selectedIds, onToggle, onToggleAll }: DataTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const isSelected = selectedIds.has(row.id);
            const isExpanded = expandedId === row.id;
            return (
              <tr key={row.id} className="contents">
                <td colSpan={11} className="p-0">
                  <table className="w-full">
                    <tbody>
                      <tr
                        className={`border-b border-gray-100 transition-colors cursor-pointer ${
                          isSelected ? 'bg-red-50 hover:bg-red-100' : isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setExpandedId(isExpanded ? null : row.id)}
                      >
                        <td className="py-3 px-4 w-10" onClick={e => e.stopPropagation()}>
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
                        <td className="py-3 px-4 text-gray-400">
                          <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={11}>
                            <DetailPanel row={row} />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
