'use client';

import { useSearchParams } from 'next/navigation';
import { FormWizard } from './components/FormWizard';
import { Suspense } from 'react';

function FormContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  return <FormWizard sessionId={token || undefined} email={email || undefined} />;
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <FormContent />
    </Suspense>
  );
}
