'use client';

import React, { useState } from 'react';
import { StepProps, THEMES, THEME_PROBLEMS } from '@/app/types';
import { StepNavigation } from '@/app/components/StepNavigation';
import { cn } from '@/app/lib/utils';
import { useFormStore } from '@/app/store/formStore';

export function ThemeStep({ formData, updateFormData, onNext, onBack }: StepProps) {
  const [showCustomProblem, setShowCustomProblem] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleThemeSelect = (theme: string) => {
    updateFormData({ 
      theme, 
      problem: '', 
      customProblem: '' 
    });
    setShowCustomProblem(false);
  };

  const handleProblemSelect = (problem: string) => {
    if (problem === 'Autre') {
      setShowCustomProblem(true);
      updateFormData({ problem });
    } else {
      setShowCustomProblem(false);
      updateFormData({ problem, customProblem: '' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Trigger story generation webhook
      const webhookUrl = process.env.N8N_STORY_GENERATION_WEBHOOK || '/api/generate-story';
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: useFormStore.getState().sessionId,
          formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      // Navigate to success page or show completion message
      onNext();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = formData.theme !== '' && 
    (formData.theme === 'seulement du divertissement' || 
     (formData.problem && formData.problem !== '') || 
     (formData.problem === 'Autre' && formData.customProblem && formData.customProblem !== ''));

  const showProblems = formData.theme && 
    formData.theme !== 'seulement du divertissement' && 
    formData.theme !== 'Autre';

  const problems = showProblems ? THEME_PROBLEMS[formData.theme] || [] : [];

  return (
    <div className="step-container">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary-blue mb-4">
          Thématique de l'histoire
        </h2>
        <p className="text-gray-600">
          Choisissez le thème principal de l'histoire
        </p>
      </div>

      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Theme selection */}
        <div>
          <label className="form-label mb-4 block">
            Thème principal
          </label>
          <div className="space-y-3">
            {THEMES.map((theme) => (
              <label
                key={theme}
                className={cn(
                  'block p-4 rounded-lg border-2 cursor-pointer transition-all',
                  formData.theme === theme
                    ? 'border-primary-blue bg-light-blue'
                    : 'border-gray-200 hover:border-primary-blue'
                )}
              >
                <input
                  type="radio"
                  name="theme"
                  value={theme}
                  checked={formData.theme === theme}
                  onChange={() => handleThemeSelect(theme)}
                  className="sr-only"
                />
                <span className="font-medium">{theme}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom theme input */}
        {formData.theme === 'Autre' && (
          <div className="fade-in">
            <label htmlFor="customTheme" className="form-label">
              Précisez le thème
            </label>
            <input
              type="text"
              id="customTheme"
              value={formData.customProblem || ''}
              onChange={(e) => updateFormData({ customProblem: e.target.value })}
              className="form-input"
              placeholder="Décrivez le thème souhaité"
            />
          </div>
        )}

        {/* Problem selection */}
        {showProblems && problems.length > 0 && (
          <div className="fade-in">
            <label className="form-label mb-4 block">
              Problématique spécifique (optionnel)
            </label>
            <div className="space-y-2">
              {problems.map((problem) => (
                <label
                  key={problem}
                  className={cn(
                    'block p-3 rounded-lg border cursor-pointer transition-all',
                    formData.problem === problem
                      ? 'border-primary-blue bg-light-blue'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <input
                    type="radio"
                    name="problem"
                    value={problem}
                    checked={formData.problem === problem}
                    onChange={() => handleProblemSelect(problem)}
                    className="sr-only"
                  />
                  <span className="text-sm">{problem}</span>
                </label>
              ))}
              <label
                className={cn(
                  'block p-3 rounded-lg border cursor-pointer transition-all',
                  formData.problem === 'Autre'
                    ? 'border-primary-blue bg-light-blue'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <input
                  type="radio"
                  name="problem"
                  value="Autre"
                  checked={formData.problem === 'Autre'}
                  onChange={() => handleProblemSelect('Autre')}
                  className="sr-only"
                />
                <span className="text-sm">Autre</span>
              </label>
            </div>
          </div>
        )}

        {/* Custom problem input */}
        {showCustomProblem && (
          <div className="fade-in">
            <label htmlFor="customProblem" className="form-label">
              Décrivez la problématique
            </label>
            <textarea
              id="customProblem"
              value={formData.customProblem || ''}
              onChange={(e) => updateFormData({ customProblem: e.target.value })}
              className="form-input min-h-[100px]"
              placeholder="Décrivez la situation ou le défi que votre enfant rencontre"
            />
          </div>
        )}

        <StepNavigation
          currentStep={7}
          totalSteps={7}
          onNext={handleSubmit}
          onBack={onBack}
          canGoNext={canGoNext}
          isLastStep={true}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
