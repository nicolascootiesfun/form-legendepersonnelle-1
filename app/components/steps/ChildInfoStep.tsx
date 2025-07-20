'use client';

import React, { useState } from 'react';
import { StepProps, PERSONALITY_TRAITS } from '@/app/types';
import { StepNavigation } from '@/app/components/StepNavigation';
import { FileUpload } from '@/app/components/FileUpload';
import { cn } from '@/app/lib/utils';

export function ChildInfoStep({ formData, updateFormData, onNext, onBack }: StepProps) {
  const [showOtherInput, setShowOtherInput] = useState(
    formData.personalityTraits.includes('autre')
  );

  const handleTraitToggle = (trait: string) => {
    const currentTraits = formData.personalityTraits || [];
    let newTraits: string[];

    if (currentTraits.includes(trait)) {
      newTraits = currentTraits.filter(t => t !== trait);
      if (trait === 'autre') {
        setShowOtherInput(false);
        updateFormData({ otherPersonalityTrait: '' });
      }
    } else {
      newTraits = [...currentTraits, trait];
      if (trait === 'autre') {
        setShowOtherInput(true);
      }
    }

    updateFormData({ personalityTraits: newTraits });
  };

  const handlePhotoToggle = (checked: boolean) => {
    updateFormData({ 
      preferNoPhoto: checked,
      childPhoto: checked ? null : formData.childPhoto 
    });
  };

  const canGoNext = formData.personalityTraits.length > 0 && 
    (formData.preferNoPhoto || formData.childPhoto !== undefined);

  return (
    <div className="step-container">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary-blue mb-4">
          Informations sur {formData.childFirstName}
        </h2>
        <p className="text-gray-600">
          Aidez-nous à mieux connaître votre enfant pour créer une histoire qui lui ressemble
        </p>
      </div>

      <form className="space-y-8">
        {/* Personality traits */}
        <div>
          <label className="form-label mb-4 block">
            Traits de personnalité de {formData.childFirstName} (sélectionnez plusieurs)
          </label>
          <div className="option-grid">
            {PERSONALITY_TRAITS.map((trait) => (
              <label
                key={trait}
                className={cn(
                  'option-item',
                  formData.personalityTraits.includes(trait) && 'option-item-selected'
                )}
              >
                <input
                  type="checkbox"
                  checked={formData.personalityTraits.includes(trait)}
                  onChange={() => handleTraitToggle(trait)}
                  className="checkbox-custom"
                />
                <span className="capitalize">{trait}</span>
              </label>
            ))}
          </div>
          
          {showOtherInput && (
            <div className="mt-4">
              <input
                type="text"
                value={formData.otherPersonalityTrait || ''}
                onChange={(e) => updateFormData({ otherPersonalityTrait: e.target.value })}
                className="form-input"
                placeholder="Précisez le trait de personnalité"
              />
            </div>
          )}
        </div>

        {/* Photo upload */}
        <div>
          <FileUpload
            label={`Photo de ${formData.childFirstName}`}
            onFileSelect={(file) => updateFormData({ childPhoto: file })}
            currentFile={formData.childPhoto}
            optional={true}
          />
          
          <label className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              checked={formData.preferNoPhoto}
              onChange={(e) => handlePhotoToggle(e.target.checked)}
              className="checkbox-custom"
            />
            <span className="text-sm">Je préfère ne pas envoyer de photo</span>
          </label>
        </div>

        {/* Additional characteristics */}
        <div>
          <label htmlFor="additionalCharacteristics" className="form-label">
            Caractéristiques supplémentaires (séparées par des virgules)
          </label>
          <textarea
            id="additionalCharacteristics"
            value={formData.additionalCharacteristics}
            onChange={(e) => updateFormData({ additionalCharacteristics: e.target.value })}
            className="form-input min-h-[100px]"
            placeholder="Ex: aime les dinosaures, joue au football, a peur du noir..."
          />
        </div>

        {/* Physical description */}
        <div>
          <label htmlFor="physicalDescription" className="form-label">
            Description physique
          </label>
          <textarea
            id="physicalDescription"
            value={formData.physicalDescription}
            onChange={(e) => updateFormData({ physicalDescription: e.target.value })}
            className="form-input min-h-[120px]"
            placeholder="Décrivez l'apparence physique de votre enfant (couleur des cheveux, des yeux, taille, etc.)"
          />
        </div>

        <StepNavigation
          currentStep={3}
          totalSteps={7}
          onNext={onNext}
          onBack={onBack}
          canGoNext={canGoNext}
        />
      </form>
    </div>
  );
}
