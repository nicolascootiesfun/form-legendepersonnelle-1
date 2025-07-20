'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStore } from '@/app/store/formStore';
import { WelcomeStep } from './steps/WelcomeStep';
import { ContactStep } from './steps/ContactStep';
import { ChildInfoStep } from './steps/ChildInfoStep';
import { ImageGenerationStep } from './steps/ImageGenerationStep';
import { CharactersStep } from './steps/CharactersStep';
import { StoryStyleStep } from './steps/StoryStyleStep';
import { ThemeStep } from './steps/ThemeStep';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { useAutoSave } from '@/app/hooks/useAutoSave';

interface FormWizardProps {
  sessionId?: string;
  email?: string;
}

export function FormWizard({ sessionId, email }: FormWizardProps) {
  const router = useRouter();
  const { 
    formData, 
    currentStep, 
    updateFormData, 
    setCurrentStep, 
    setSessionId,
    loadFromSupabase,
    isLoading 
  } = useFormStore();

  useAutoSave();

  useEffect(() => {
    if (sessionId) {
      setSessionId(sessionId);
      loadFromSupabase(sessionId);
    }
    if (email && !formData.email) {
      updateFormData({ email });
    }
  }, [sessionId, email]);

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 7) {
      // Navigate to success page after final step
      router.push('/success');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="loading-spinner mx-auto mb-4" fill="none" viewBox="0 0 24 24">
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
          <p className="text-gray-600">Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  const stepProps = {
    formData,
    updateFormData,
    onNext: handleNext,
    onBack: handleBack,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-light-blue">
      <div className="container mx-auto py-8">
        {currentStep === 1 && <WelcomeStep {...stepProps} />}
        {currentStep === 2 && <ContactStep {...stepProps} />}
        {currentStep === 3 && <ChildInfoStep {...stepProps} />}
        {currentStep === 4 && <ImageGenerationStep {...stepProps} />}
        {currentStep === 5 && <CharactersStep {...stepProps} />}
        {currentStep === 6 && <StoryStyleStep {...stepProps} />}
        {currentStep === 7 && <ThemeStep {...stepProps} />}
      </div>
      <AutoSaveIndicator />
    </div>
  );
}
