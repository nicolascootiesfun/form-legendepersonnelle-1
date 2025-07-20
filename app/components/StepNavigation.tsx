'use client';

import React from 'react';
import { cn } from '@/app/lib/utils';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  canGoNext: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  canGoNext,
  isLastStep = false,
  isSubmitting = false,
}: StepNavigationProps) {
  return (
    <div className="mt-8 space-y-4">
      {/* Progress bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      {/* Step indicator */}
      <p className="text-center text-sm text-gray-600">
        Étape {currentStep} sur {totalSteps}
      </p>
      
      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          disabled={currentStep === 1}
          className={cn(
            'btn-secondary',
            currentStep === 1 && 'invisible'
          )}
        >
          Retour
        </button>
        
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext || isSubmitting}
          className="btn-primary flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <svg className="loading-spinner" fill="none" viewBox="0 0 24 24">
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
              <span>Traitement...</span>
            </>
          ) : (
            <span>{isLastStep ? 'Terminer' : 'Suivant'}</span>
          )}
        </button>
      </div>
    </div>
  );
}
