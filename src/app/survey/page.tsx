import SurveyForm from '@/components/survey/SurveyForm';

export const metadata = {
  title: 'Caries Risk Assessment',
  description: 'Dental Caries Risk Estimator - Chulalongkorn University',
};

export default function SurveyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 px-4">
      <SurveyForm />
    </main>
  );
}
