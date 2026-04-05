export interface AssessmentFormData {
  personal_id: string;
  school: string;
  survey_round: number;
  patient_name: string;
  gender: string;
  occupation: string;
  dob: string;
  age_years: number | null;
  age_months: number | null;

  current_occ: string;
  current_occ_specify: string;
  housing: string;
  income: string;

  chronic_disease: string;
  saliva_medication: string;

  sugar_frequency: string;
  brushing_freq: string;
  fluoride_use: string;

  active_decay: string;
  decay_tooth_number: string;
  plaque_16b: number | null;
  plaque_11la: number | null;
  plaque_26b: number | null;
  plaque_46li: number | null;
  plaque_31la: number | null;
  plaque_36li: number | null;
  calculated_sohi: number | null;
  appliances: string;
  condition_improved: string;

  saliva_amount: string;
  buffer_capacity: string;
  plaque_acid: string;

  risk_level: string;
}

export interface AssessmentRecord extends AssessmentFormData {
  id: string;
  created_at: string;
}

export const initialFormData: AssessmentFormData = {
  personal_id: '',
  school: '',
  survey_round: 1,
  patient_name: '',
  gender: '',
  occupation: '',
  dob: '',
  age_years: null,
  age_months: null,
  current_occ: '',
  current_occ_specify: '',
  housing: '',
  income: '',
  chronic_disease: '',
  saliva_medication: '',
  sugar_frequency: '',
  brushing_freq: '',
  fluoride_use: '',
  active_decay: '',
  decay_tooth_number: '',
  plaque_16b: null,
  plaque_11la: null,
  plaque_26b: null,
  plaque_46li: null,
  plaque_31la: null,
  plaque_36li: null,
  calculated_sohi: null,
  appliances: 'no',
  condition_improved: '',
  saliva_amount: '',
  buffer_capacity: '',
  plaque_acid: '',
  risk_level: '',
};
