'use client';

interface PlaqueIndexGridProps {
  values: {
    plaque_16b: number | null;
    plaque_11la: number | null;
    plaque_26b: number | null;
    plaque_46li: number | null;
    plaque_31la: number | null;
    plaque_36li: number | null;
  };
  sohi: number | null;
  onChange: (field: string, value: number | null) => void;
}

const teeth = [
  [
    { key: 'plaque_16b', label: '16(B)' },
    { key: 'plaque_11la', label: '11(B)' },
    { key: 'plaque_26b', label: '26(B)' },
  ],
  [
    { key: 'plaque_46li', label: '46(L)' },
    { key: 'plaque_31la', label: '31(B)' },
    { key: 'plaque_36li', label: '36(L)' },
  ],
];

export default function PlaqueIndexGrid({ values, sohi, onChange }: PlaqueIndexGridProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex flex-col md:flex-row gap-5 items-start">
        <table className="border-collapse border border-gray-800 bg-white" style={{ width: '60%', minWidth: 240 }}>
          <tbody>
            {teeth.map((row, ri) => (
              <tr key={ri}>
                {row.map(tooth => (
                  <td key={tooth.key} className="border border-gray-800 relative h-16 w-1/3 p-1">
                    <span className="absolute top-1 left-1 text-xs text-gray-500">{tooth.label}</span>
                    <input
                      type="number"
                      min={0}
                      max={3}
                      step={0.1}
                      value={values[tooth.key as keyof typeof values] ?? ''}
                      onChange={e => {
                        const v = e.target.value === '' ? null : parseFloat(e.target.value);
                        onChange(tooth.key, v);
                      }}
                      className="w-full mt-5 text-center bg-transparent border-none text-base focus:outline-none focus:border-b-2 focus:border-blue-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="text-sm text-gray-700 space-y-1.5">
          <li><strong>0</strong> = No plaque</li>
          <li><strong>1</strong> = present &lt; 1/3</li>
          <li><strong>2</strong> = present 1/3 - 2/3</li>
          <li><strong>3</strong> = present &gt; 2/3</li>
        </ul>
      </div>
      <div className="mt-3 text-center bg-blue-50 p-2.5 rounded text-base">
        S-OHI: <span className="font-bold text-orange-600">{sohi !== null ? sohi : '--'}</span>
      </div>
    </div>
  );
}
