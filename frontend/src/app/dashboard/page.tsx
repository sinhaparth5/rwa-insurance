import { InsuranceDashboard } from '@/components/insurance/InsuranceDashboard';
import { generateRWAMetadata } from '@/utils/seo';

export async function generateMetadata() {
  return generateRWAMetadata({
    page: 'dashboard',
    data: {
      title: 'Insurance Dashboard',
      description: 'Manage your tokenized asset insurance policies, claims, and coverage.',
    },
  });
}

export default function DashboardPage() {
  return <InsuranceDashboard />;
}