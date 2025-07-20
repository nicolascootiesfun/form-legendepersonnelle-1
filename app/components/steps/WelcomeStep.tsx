'use client';

import React from 'react';
import { StepProps } from '@/app/types';
import { StepNavigation } from '@/app/components/StepNavigation';

export function WelcomeStep({ formData, updateFormData, onNext, onBack }: StepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const canGoNext = formData.childFirstName.trim() !== '' && formData.childAge > 0 && formData.childAge <= 18;

  return (
    <div className="step-container">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary-blue mb-4">
          Bienvenue dans la création de votre histoire personnalisée
        </h1>
        <p className="text-gray-600">
          Commençons par quelques informations sur votre enfant
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div>
          <label htmlFor="childFirstName" className="form-label">
            Prénom de l'enfant
          </label>
          <input
            type="text"
            id="childFirstName"
            value={formData.childFirstName}
            onChange={(e) => updateFormData({ childFirstName: e.target.value })}
            className="form-input"
            placeholder="Entrez le prénom"
            required
          />
        </div>

        <div>
          <label htmlFor="childAge" className="form-label">
            Âge de l'enfant
          </label>
          <input
            type="number"
            id="childAge"
            value={formData.childAge || ''}
            onChange={(e) => updateFormData({ childAge: parseInt(e.target.value) || 0 })}
            className="form-input"
            placeholder="Entrez l'âge"
            min="1"
            max="18"
            required
          />
          {formData.childAge > 18 && (
            <p className="error-message">L'âge doit être entre 1 et 18 ans</p>
          )}
        </div>

        <StepNavigation
          currentStep={1}
          totalSteps={7}
          onNext={onNext}
          onBack={onBack}
          canGoNext={canGoNext}
        />
      </form>
    </div>
  );
}
