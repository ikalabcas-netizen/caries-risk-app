import { AssessmentFormData } from './types';

export interface RiskResult {
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  activePaths: string[];
  riskColor: string;
  finalNodeId: string;
}

export function calculateSOHI(values: (number | null)[]): number | null {
  const valid = values.filter((v): v is number => v !== null && v >= 0 && v <= 3);
  if (valid.length === 0) return null;
  return parseFloat((valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1));
}

export function calculateRiskLevel(data: AssessmentFormData): RiskResult {
  const q5 = data.saliva_medication;
  const q6 = data.sugar_frequency;
  const q7 = data.brushing_freq;
  const q8 = data.fluoride_use;
  const q9 = data.active_decay;
  const q10 = data.calculated_sohi ?? 0;
  const q11 = data.appliances;
  const q11b = data.condition_improved;
  const q12 = data.saliva_amount;
  const q13 = data.buffer_capacity;
  const q14 = data.plaque_acid;
  const q1 = data.current_occ;
  const q2 = data.housing;
  const q3 = data.income;
  const q4 = data.chronic_disease;

  const hasOralFactor = q9 === 'multiple' || q10 > 2 || q11 === 'yes';

  let keyRiskCount = 0;
  if (q5 === 'yes') keyRiskCount++;
  if (q6 === 'between_more_2') keyRiskCount++;
  if (q13 === '<5') keyRiskCount++;
  if (q14 === 'lightblue') keyRiskCount++;

  const hasProtectiveRegular =
    q6 === 'in_meals' || q7 === '>2' || q8 === 'regular' ||
    q12 === '>5.0' || q13 === '>6' || q14 === 'pink';

  const hasGeneralRisk =
    q1 === 'other' || q2 === 'unknown' ||
    q3 === '<5000' || q3 === 'unknown' ||
    q4 === 'yes' || q7 === '<1' || q8 === 'no' || q12 === '<3.5';

  let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
  let riskColor = '';
  const activePaths: string[] = [];
  let finalNodeId = '';

  if (hasOralFactor) {
    activePaths.push('p_oral_y');
    if (keyRiskCount >= 2) {
      activePaths.push('p_key_l_y');
      riskLevel = 'HIGH'; riskColor = '#e74c3c'; finalNodeId = 't_high_1';
    } else {
      activePaths.push('p_key_l_n');
      if (q11b === 'yes') {
        activePaths.push('p_imp_y');
        riskLevel = 'MODERATE'; riskColor = '#f39c12'; finalNodeId = 't_mod_1';
      } else {
        activePaths.push('p_imp_n');
        riskLevel = 'HIGH'; riskColor = '#e74c3c'; finalNodeId = 't_high_2';
      }
    }
  } else {
    activePaths.push('p_oral_n');
    if (keyRiskCount >= 2) {
      activePaths.push('p_key_r_y');
      if (hasProtectiveRegular) {
        activePaths.push('p_prot_r1_reg');
        riskLevel = 'MODERATE'; riskColor = '#f39c12'; finalNodeId = 't_mod_2';
      } else {
        activePaths.push('p_prot_r1_irreg');
        riskLevel = 'HIGH'; riskColor = '#e74c3c'; finalNodeId = 't_high_3';
      }
    } else {
      activePaths.push('p_key_r_n');
      if (hasGeneralRisk) {
        activePaths.push('p_risk_y');
        if (hasProtectiveRegular) {
          activePaths.push('p_prot_r2_reg');
          riskLevel = 'LOW'; riskColor = '#2ecc71'; finalNodeId = 't_low_2';
        } else {
          activePaths.push('p_prot_r2_irreg');
          riskLevel = 'MODERATE'; riskColor = '#f39c12'; finalNodeId = 't_mod_3';
        }
      } else {
        activePaths.push('p_risk_n');
        riskLevel = 'LOW'; riskColor = '#2ecc71'; finalNodeId = 't_low_1';
      }
    }
  }

  return { riskLevel, activePaths, riskColor, finalNodeId };
}
