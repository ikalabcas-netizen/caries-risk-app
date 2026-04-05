'use client';

interface FlowchartSVGProps {
  activePaths: string[];
  riskColor: string;
  finalNodeId: string;
}

interface PathDef {
  id: string;
  d: string;
  label: string;
  labelX: number;
  labelY: number;
}

const paths: PathDef[] = [
  { id: 'p_oral_y', d: 'M 400,52 C 400,75 200,75 200,88', label: 'Yes', labelX: 300, labelY: 62 },
  { id: 'p_oral_n', d: 'M 400,52 C 400,75 600,75 600,88', label: 'No', labelX: 500, labelY: 62 },
  { id: 'p_key_l_y', d: 'M 200,132 C 200,160 100,160 100,178', label: 'Yes (≥ 2)', labelX: 140, labelY: 152 },
  { id: 'p_key_l_n', d: 'M 200,132 C 200,160 300,160 300,178', label: 'No (≤ 1)', labelX: 260, labelY: 152 },
  { id: 'p_imp_y', d: 'M 300,222 C 300,250 240,250 240,268', label: 'Yes', labelX: 260, labelY: 242 },
  { id: 'p_imp_n', d: 'M 300,222 C 300,250 360,250 360,268', label: 'No', labelX: 340, labelY: 242 },
  { id: 'p_key_r_y', d: 'M 600,132 C 600,160 500,160 500,178', label: 'Yes (≥ 2)', labelX: 540, labelY: 152 },
  { id: 'p_key_r_n', d: 'M 600,132 C 600,160 700,160 700,178', label: 'No (≤ 1)', labelX: 660, labelY: 152 },
  { id: 'p_prot_r1_reg', d: 'M 500,222 C 500,250 440,250 440,268', label: 'Regular', labelX: 460, labelY: 242 },
  { id: 'p_prot_r1_irreg', d: 'M 500,222 C 500,250 560,250 560,268', label: 'Irreg/No', labelX: 545, labelY: 242 },
  { id: 'p_risk_y', d: 'M 700,222 C 700,250 640,250 640,268', label: 'Some', labelX: 660, labelY: 242 },
  { id: 'p_risk_n', d: 'M 700,222 C 700,250 760,250 760,268', label: 'None', labelX: 740, labelY: 242 },
  { id: 'p_prot_r2_reg', d: 'M 640,312 C 640,340 580,340 580,358', label: 'Regular', labelX: 600, labelY: 332 },
  { id: 'p_prot_r2_irreg', d: 'M 640,312 C 640,340 700,340 700,358', label: 'Irreg/No', labelX: 685, labelY: 332 },
];

interface DecisionNode {
  x: number; y: number; line1: string; line2?: string;
}

const decisionNodes: DecisionNode[] = [
  { x: 400, y: 30, line1: 'Oral Factors?' },
  { x: 200, y: 110, line1: 'Key Risk ≥ 2?' },
  { x: 600, y: 110, line1: 'Key Risk ≥ 2?' },
  { x: 300, y: 200, line1: 'Condition', line2: 'Improved?' },
  { x: 500, y: 200, line1: 'Protective', line2: 'Factors?' },
  { x: 700, y: 200, line1: 'Any Risk', line2: 'Factors?' },
  { x: 640, y: 290, line1: 'Protective', line2: 'Factors?' },
];

interface TermNode {
  id: string; x: number; y: number; label: string;
  defaultFill: string; defaultText: string; stroke: string;
}

const termNodes: TermNode[] = [
  { id: 't_high_1', x: 100, y: 200, label: 'HIGH', defaultFill: '#fdedec', defaultText: '#e74c3c', stroke: '#e74c3c' },
  { id: 't_mod_1', x: 240, y: 290, label: 'MODERATE', defaultFill: '#fef5e7', defaultText: '#f39c12', stroke: '#f39c12' },
  { id: 't_high_2', x: 360, y: 290, label: 'HIGH', defaultFill: '#fdedec', defaultText: '#e74c3c', stroke: '#e74c3c' },
  { id: 't_mod_2', x: 440, y: 290, label: 'MODERATE', defaultFill: '#fef5e7', defaultText: '#f39c12', stroke: '#f39c12' },
  { id: 't_high_3', x: 560, y: 290, label: 'HIGH', defaultFill: '#fdedec', defaultText: '#e74c3c', stroke: '#e74c3c' },
  { id: 't_low_1', x: 760, y: 290, label: 'LOW', defaultFill: '#e8f8f5', defaultText: '#2ecc71', stroke: '#2ecc71' },
  { id: 't_low_2', x: 580, y: 380, label: 'LOW', defaultFill: '#e8f8f5', defaultText: '#2ecc71', stroke: '#2ecc71' },
  { id: 't_mod_3', x: 700, y: 380, label: 'MODERATE', defaultFill: '#fef5e7', defaultText: '#f39c12', stroke: '#f39c12' },
];

export default function FlowchartSVG({ activePaths, riskColor, finalNodeId }: FlowchartSVGProps) {
  const getMarker = (pathId: string) => {
    if (!activePaths.includes(pathId)) return 'url(#arrow-inactive)';
    if (riskColor === '#2ecc71') return 'url(#arrow-low)';
    if (riskColor === '#f39c12') return 'url(#arrow-mod)';
    return 'url(#arrow-high)';
  };

  return (
    <svg viewBox="0 0 860 420" className="w-full bg-white border border-gray-200 rounded-xl">
      <defs>
        <marker id="arrow-inactive" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#ccc" /></marker>
        <marker id="arrow-low" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#2ecc71" /></marker>
        <marker id="arrow-mod" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#f39c12" /></marker>
        <marker id="arrow-high" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#e74c3c" /></marker>
      </defs>

      {paths.map(p => (
        <g key={p.id}>
          <path
            d={p.d}
            fill="none"
            stroke={activePaths.includes(p.id) ? riskColor : '#ccc'}
            strokeWidth={activePaths.includes(p.id) ? 4 : 2}
            markerEnd={getMarker(p.id)}
            style={{ transition: 'stroke 0.4s ease, stroke-width 0.4s ease' }}
          />
          <text x={p.labelX} y={p.labelY} fontSize="11" fill="#555" textAnchor="middle" fontWeight="bold">{p.label}</text>
        </g>
      ))}

      {decisionNodes.map((n, i) => (
        <g key={i} transform={`translate(${n.x}, ${n.y})`}>
          <rect x="-60" y="-22" width="120" height="44" rx="5" fill="#ecf0f1" stroke="#bdc3c7" strokeWidth="2" />
          {n.line2 ? (
            <>
              <text y="-4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2c3e50">{n.line1}</text>
              <text y="12" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2c3e50">{n.line2}</text>
            </>
          ) : (
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2c3e50">{n.line1}</text>
          )}
        </g>
      ))}

      {termNodes.map(n => {
        const isActive = n.id === finalNodeId;
        const w = n.label === 'MODERATE' ? 100 : 90;
        return (
          <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
            <rect
              x={-w / 2} y="-18" width={w} height="36" rx="4"
              fill={isActive ? riskColor : n.defaultFill}
              stroke={n.stroke} strokeWidth="2"
              style={{ transition: 'fill 0.4s ease' }}
            />
            <text y="5" textAnchor="middle" fontSize="13" fontWeight="bold"
              fill={isActive ? '#fff' : n.defaultText}
              style={{ transition: 'fill 0.4s ease' }}
            >{n.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
