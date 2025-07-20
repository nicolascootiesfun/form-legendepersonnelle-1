'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear form data after successful submission
    const timer = setTimeout(() => {
      // Optional: redirect to home after some time
      // router.push('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-light-blue flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-primary-blue mb-4">
            Merci pour votre demande !
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Votre histoire personnalisée est en cours de création. 
            Nous vous l'enverrons par email dès qu'elle sera prête.
          </p>
          
          <div className="bg-light-blue rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-dark-blue mb-2">
              Que se passe-t-il maintenant ?
            </h2>
            <ul className="text-left text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="text-primary-blue mr-2">✓</span>
                Notre équipe créative génère votre histoire unique
              </li>
              <li className="flex items-start">
                <span className="text-primary-blue mr-2">✓</span>
                Les illustrations personnalisées sont créées
              </li>
              <li className="flex items-start">
                <span className="text-primary-blue mr-2">✓</span>
                Vous recevrez l'histoire complète par email sous 24-48h
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Vous avez des questions ? Contactez-nous à{' '}
              <a href="mailto:support@fabluo.com" className="text-primary-blue hover:underline">
                support@fabluo.com
              </a>
            </p>
            
            <Link
              href="/"
              className="inline-block btn-secondary"
            >
              Créer une nouvelle histoire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
