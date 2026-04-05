'use client';

interface RiskResultProps {
  riskLevel: string;
}

export default function RiskResult({ riskLevel }: RiskResultProps) {
  if (!riskLevel) return null;

  const config = {
    LOW: { bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-600', label: 'LOW' },
    MODERATE: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-600', label: 'MODERATE' },
    HIGH: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600', label: 'HIGH' },
  }[riskLevel] ?? { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-600', label: riskLevel };

  return (
    <div className={`mt-6 p-5 rounded-xl border-2 ${config.bg} ${config.border} text-center`}>
      <p className="text-sm font-medium text-gray-500 mb-1">CARIES RISK LEVEL</p>
      <p className={`text-3xl font-bold ${config.text}`}>{config.label}</p>
    </div>
  );
}
