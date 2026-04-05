'use client';

import { useState } from 'react';
import { AssessmentFormData, initialFormData } from '@/lib/types';
import { calculateRiskLevel, calculateSOHI, RiskResult as RiskResultType } from '@/lib/risk-calculator';
import PlaqueIndexGrid from './PlaqueIndexGrid';
import RiskResult from './RiskResult';
import FlowchartSVG from './FlowchartSVG';

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-blue-700 mt-8 mb-4 pb-2 border-b border-gray-200">{children}</h3>;
}

function KeyRiskBadge() {
  return <span className="ml-2 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">KEY RISK</span>;
}

function RadioOption({ name, value, label, checked, onChange }: {
  name: string; value: string; label: string; checked: boolean; onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm">
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)}
        className="w-4 h-4 text-blue-600" />
      {label}
    </label>
  );
}

export default function SurveyForm() {
  const [form, setForm] = useState<AssessmentFormData>(initialFormData);
  const [result, setResult] = useState<RiskResultType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: string | number | null) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setResult(null);
    setSubmitted(false);
  };

  const updatePlaque = (field: string, value: number | null) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      const sohi = calculateSOHI([
        next.plaque_16b, next.plaque_11la, next.plaque_26b,
        next.plaque_46li, next.plaque_31la, next.plaque_36li,
      ]);
      return { ...next, calculated_sohi: sohi };
    });
    setResult(null);
  };

  const calculateAge = (dob: string) => {
    if (!dob) return { age_years: null, age_months: null };
    const d = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - d.getFullYear();
    let months = today.getMonth() - d.getMonth();
    if (today.getDate() < d.getDate()) months--;
    if (months < 0) { years--; months += 12; }
    if (years < 0) { years = 0; months = 0; }
    return { age_years: years, age_months: months };
  };

  const handleCalculate = () => {
    if (!form.patient_name.trim()) {
      setError('Please enter patient name');
      return;
    }
    setError('');
    const r = calculateRiskLevel(form);
    setResult(r);
    setForm(prev => ({ ...prev, risk_level: r.riskLevel }));
  };

  const handleSubmit = async () => {
    if (!result) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialFormData);
    setResult(null);
    setSubmitted(false);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Dental Caries Risk Estimator</h1>
        <p className="text-sm text-gray-500 mt-1">Assoc.Prof. Palinee Desomboonrat - Department of Community Dentistry, Faculty of Dentistry, Chulalongkorn University</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {/* Student / Survey Info */}
        <SectionHeading>Student & Survey Information</SectionHeading>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Personal ID (Student Card) *</label>
              <input type="text" value={form.personal_id} onChange={e => update('personal_id', e.target.value)}
                placeholder="e.g. 6701234"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School *</label>
              <input type="text" value={form.school} onChange={e => update('school', e.target.value)}
                placeholder="School name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Survey Round *</label>
              <select value={form.survey_round} onChange={e => update('survey_round', parseInt(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value={1}>Round 1</option>
                <option value={2}>Round 2</option>
                <option value={3}>Round 3</option>
                <option value={4}>Round 4</option>
                <option value={5}>Round 5</option>
              </select>
            </div>
          </div>
        </div>

        {/* General Information */}
        <SectionHeading>General Information</SectionHeading>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
            <input type="text" value={form.patient_name} onChange={e => update('patient_name', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select value={form.gender} onChange={e => update('gender', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <input type="text" value={form.occupation} onChange={e => update('occupation', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input type="date" value={form.dob} onChange={e => {
                const ages = calculateAge(e.target.value);
                setForm(prev => ({ ...prev, dob: e.target.value, ...ages }));
              }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age (Years)</label>
              <input type="number" value={form.age_years ?? ''} readOnly className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age (Months)</label>
              <input type="number" value={form.age_months ?? ''} readOnly className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Part 1 */}
        <SectionHeading>Part 1: Economic, Social, and Educational Factors</SectionHeading>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">1. Current Occupation:</label>
            <div className="flex flex-wrap gap-4">
              <RadioOption name="current_occ" value="employee" label="Employee Group" checked={form.current_occ === 'employee'} onChange={v => update('current_occ', v)} />
              <RadioOption name="current_occ" value="labor" label="Labor Group" checked={form.current_occ === 'labor'} onChange={v => update('current_occ', v)} />
              <RadioOption name="current_occ" value="other" label="Other:" checked={form.current_occ === 'other'} onChange={v => update('current_occ', v)} />
              {form.current_occ === 'other' && (
                <input type="text" value={form.current_occ_specify} onChange={e => update('current_occ_specify', e.target.value)}
                  placeholder="Specify..." className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">2. Housing Conditions:</label>
            <div className="flex flex-wrap gap-4">
              <RadioOption name="housing" value="own" label="Own house" checked={form.housing === 'own'} onChange={v => update('housing', v)} />
              <RadioOption name="housing" value="rent" label="Rent a house" checked={form.housing === 'rent'} onChange={v => update('housing', v)} />
              <RadioOption name="housing" value="unknown" label="Unknown" checked={form.housing === 'unknown'} onChange={v => update('housing', v)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">3. Monthly Family Income (THB):</label>
            <div className="flex flex-wrap gap-4">
              <RadioOption name="income" value=">15000" label="> 15,000" checked={form.income === '>15000'} onChange={v => update('income', v)} />
              <RadioOption name="income" value="5000-15000" label="5,000 - 15,000" checked={form.income === '5000-15000'} onChange={v => update('income', v)} />
              <RadioOption name="income" value="<5000" label="< 5,000" checked={form.income === '<5000'} onChange={v => update('income', v)} />
              <RadioOption name="income" value="unknown" label="Unknown" checked={form.income === 'unknown'} onChange={v => update('income', v)} />
            </div>
          </div>
        </div>

        {/* Part 2 */}
        <SectionHeading>Part 2: Medical and Medication Factors</SectionHeading>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">4. Are there any chronic diseases affecting oral health?</label>
            <div className="flex gap-6">
              <RadioOption name="chronic_disease" value="no" label="No" checked={form.chronic_disease === 'no'} onChange={v => update('chronic_disease', v)} />
              <RadioOption name="chronic_disease" value="yes" label="Yes" checked={form.chronic_disease === 'yes'} onChange={v => update('chronic_disease', v)} />
            </div>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              5. Does any condition or medication affect saliva composition, volume, or secretion?
              <KeyRiskBadge />
            </label>
            <div className="flex gap-6">
              <RadioOption name="saliva_medication" value="no" label="No" checked={form.saliva_medication === 'no'} onChange={v => update('saliva_medication', v)} />
              <RadioOption name="saliva_medication" value="yes" label="Yes" checked={form.saliva_medication === 'yes'} onChange={v => update('saliva_medication', v)} />
            </div>
          </div>
        </div>

        {/* Part 3 */}
        <SectionHeading>Part 3: Behavioral Factors</SectionHeading>
        <div className="space-y-5">
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              6. Frequency of consuming snacks and sugary drinks (24 hours recall):
              <KeyRiskBadge />
            </label>
            <select value={form.sugar_frequency} onChange={e => update('sugar_frequency', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select frequency...</option>
              <option value="in_meals">In meals</option>
              <option value="between_1_2">Between meals 1-2 times a day</option>
              <option value="between_more_2">Between meals more than 2 times a day</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">7. Frequency of brushing:</label>
              <select value={form.brushing_freq} onChange={e => update('brushing_freq', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select...</option>
                <option value=">2">&gt; 2 times a day</option>
                <option value="1">Once a day</option>
                <option value="<1">Less than once a day</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">8. History of fluoride or calcium phosphate use:</label>
              <select value={form.fluoride_use} onChange={e => update('fluoride_use', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select...</option>
                <option value="regular">Regular use</option>
                <option value="irregular">Irregular use</option>
                <option value="no">No use</option>
              </select>
            </div>
          </div>
        </div>

        {/* Part 4 */}
        <SectionHeading>Part 4: Oral Health Factors</SectionHeading>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">9. Is there any active tooth decay?</label>
            <div className="flex flex-wrap gap-4 mb-2">
              <RadioOption name="active_decay" value="no" label="No decay" checked={form.active_decay === 'no'} onChange={v => update('active_decay', v)} />
              <RadioOption name="active_decay" value="one" label="One tooth" checked={form.active_decay === 'one'} onChange={v => update('active_decay', v)} />
              <RadioOption name="active_decay" value="multiple" label="Two or more teeth" checked={form.active_decay === 'multiple'} onChange={v => update('active_decay', v)} />
            </div>
            <input type="text" value={form.decay_tooth_number} onChange={e => update('decay_tooth_number', e.target.value)}
              placeholder="Specify tooth number(s)..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">10. Plaque index (Debris index - S-OHI):</label>
            <PlaqueIndexGrid
              values={{
                plaque_16b: form.plaque_16b,
                plaque_11la: form.plaque_11la,
                plaque_26b: form.plaque_26b,
                plaque_46li: form.plaque_46li,
                plaque_31la: form.plaque_31la,
                plaque_36li: form.plaque_36li,
              }}
              sohi={form.calculated_sohi}
              onChange={updatePlaque}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">11. Dentures or orthodontic appliances?</label>
            <select value={form.appliances} onChange={e => update('appliances', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">11b. Has the condition in the oral cavity improved compared to the previous assessment?</label>
            <div className="flex gap-6">
              <RadioOption name="condition_improved" value="yes" label="Yes (Improved)" checked={form.condition_improved === 'yes'} onChange={v => update('condition_improved', v)} />
              <RadioOption name="condition_improved" value="no" label="No / Not Applicable" checked={form.condition_improved === 'no'} onChange={v => update('condition_improved', v)} />
            </div>
          </div>
        </div>

        {/* Part 5 & 6 */}
        <SectionHeading>Part 5 & 6: Salivary & Plaque Tests</SectionHeading>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">12. Amount of saliva during stimulation (5 mins):</label>
            <select value={form.saliva_amount} onChange={e => update('saliva_amount', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select...</option>
              <option value=">5.0">&gt; 5.0 ml</option>
              <option value="3.5-5.0">3.5 - 5.0 ml</option>
              <option value="<3.5">&lt; 3.5 ml</option>
            </select>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              13. Buffer capacity of saliva:
              <KeyRiskBadge />
            </label>
            <select value={form.buffer_capacity} onChange={e => update('buffer_capacity', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select...</option>
              <option value=">6">pH &gt; 6</option>
              <option value="5-6">pH 5-6</option>
              <option value="<5">pH &lt; 5</option>
            </select>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              14. Ability of plaque to produce acid:
              <KeyRiskBadge />
            </label>
            <select value={form.plaque_acid} onChange={e => update('plaque_acid', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select color...</option>
              <option value="pink">Pink</option>
              <option value="purple">Purple</option>
              <option value="lightblue">Light blue</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <button onClick={handleCalculate}
          className="w-full mt-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl transition-colors shadow-lg shadow-blue-200">
          Calculate Caries Risk Level
        </button>

        {result && (
          <>
            <RiskResult riskLevel={result.riskLevel} />
            <div className="mt-6">
              <h3 className="text-center text-gray-600 font-semibold mb-3">Risk Assessment Logic Flow</h3>
              <FlowchartSVG activePaths={result.activePaths} riskColor={result.riskColor} finalNodeId={result.finalNodeId} />
            </div>

            {!submitted ? (
              <button onClick={handleSubmit} disabled={submitting}
                className="w-full mt-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold text-lg rounded-xl transition-colors shadow-lg shadow-emerald-200">
                {submitting ? 'Saving...' : 'Save Assessment'}
              </button>
            ) : (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-medium">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Assessment saved successfully!
                </div>
                <button onClick={handleReset}
                  className="block mx-auto mt-4 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
                  New Assessment
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
