import { Metadata } from 'next';
import SidebarWithDashboard from '@/components/dashboard/SidebarWithDashboard';
import { generateRWAMetadata } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateRWAMetadata({
    page: 'dashboard',
    data: {
      title: 'Insurance Dashboard',
      description: 'Manage your tokenized asset insurance policies, claims, and coverage.',
    },
  });
}

export default function DashboardPage() {
  return <SidebarWithDashboard />;
}