'use client';

import React from 'react';
import Image from 'next/image';
import { StepProps, STORY_STYLES } from '@/app/types';
import { StepNavigation } from '@/app/components/StepNavigation';
import { cn } from '@/app/lib/utils';

export function StoryStyleStep({ formData, updateFormData, onNext, onBack }: StepProps) {
  const availableStyles = STORY_STYLES.filter(
    style => !('minAge' in style) || !style.minAge || formData.childAge >= style.minAge
  );

  const handleStyleSelect = (styleValue: string) => {
    updateFormData({ storyStyle: styleValue });
  };

  const canGoNext = formData.storyStyle !== '';

  return (
    <div className="step-container">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary-blue mb-4">
          Style de l'histoire
        </h2>
        <p className="text-gray-600">
          Quel type d'aventure souhaitez-vous pour {formData.childFirstName} ?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {availableStyles.map((style) => (
          <button
            key={style.value}
            type="button"
            onClick={() => handleStyleSelect(style.value)}
            className={cn(
              'relative rounded-lg overflow-hidden transition-all hover:shadow-lg',
              'border-2',
              formData.storyStyle === style.value
                ? 'border-primary-blue shadow-lg'
                : 'border-gray-200 hover:border-primary-blue'
            )}
          >
            {style.image ? (
              <div className="relative h-48 w-full">
                <Image
                  src={style.image}
                  alt={style.label}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-4 left-4 right-4 text-white font-bold text-lg">
                  {style.label}
                </h3>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center bg-light-blue">
                <h3 className="text-dark-blue font-bold text-lg px-4">
                  {style.label}
                </h3>
              </div>
            )}
            
            {formData.storyStyle === style.value && (
              <div className="absolute top-2 right-2 bg-primary-blue text-white rounded-full p-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {formData.childAge < 12 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Certains styles sont réservés aux enfants de plus de 11 ans</p>
        </div>
      )}

      <StepNavigation
        currentStep={6}
        totalSteps={7}
        onNext={onNext}
        onBack={onBack}
        canGoNext={canGoNext}
      />
    </div>
  );
}
