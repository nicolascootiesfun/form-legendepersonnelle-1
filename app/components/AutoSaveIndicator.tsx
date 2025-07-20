'use client';

import React from 'react';
import { useFormStore } from '@/app/store/formStore';

export function AutoSaveIndicator() {
  const isSaving = useFormStore((state) => state.isSaving);

  if (!isSaving) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center space-x-2">
      <svg className="loading-spinner h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="text-sm text-gray-600">Sauvegarde automatique...</span>
    </div>
  );
}
