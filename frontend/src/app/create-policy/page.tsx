import { PolicyCreationForm } from '@/components/PolicyCreationForm';
import { generateRWAMetadata } from '@/utils/seo';

export async function generateMetadata() {
  return generateRWAMetadata({
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