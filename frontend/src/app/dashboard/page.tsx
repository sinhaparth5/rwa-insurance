import { InsuranceDashboard } from '@/components/insurance/InsuranceDashboard';
import { generateBlockDAGMetadata } from '@/utils/seo';

export async function generateMetadata() {
  return generateBlockDAGMetadata({
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

// app/create-policy/page.tsx - Policy creation page
import { PolicyCreationForm } from '@/components/PolicyCreationForm';
import { generateBlockDAGMetadata } from '@/utils/seo';

export async function generateMetadata() {
  return generateBlockDAGMetadata({
    page: 'create-policy',
    data: {
      title: 'Create Insurance Policy',
      description: 'Create a new insurance policy for your tokenized assets with AI risk assessment.',
    },
  });
}

export default function CreatePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <PolicyCreationForm />
      </div>
    </div>
  );
}