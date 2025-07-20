'use client';

import React from 'react';
import { StepProps, CHARACTER_OPTIONS } from '@/app/types';
import { StepNavigation } from '@/app/components/StepNavigation';
import { FileUpload } from '@/app/components/FileUpload';
import { cn } from '@/app/lib/utils';

export function CharactersStep({ formData, updateFormData, onNext, onBack }: StepProps) {
  const handleCharacterToggle = (character: string) => {
    const currentCharacters = formData.selectedCharacters || [];
    let newCharacters: string[];

    if (currentCharacters.includes(character)) {
      newCharacters = currentCharacters.filter(c => c !== character);
      // Remove character details when deselected
      const newDetails = { ...formData.characterDetails };
      delete newDetails[character];
      updateFormData({ 
        selectedCharacters: newCharacters,
        characterDetails: newDetails
      });
    } else {
      newCharacters = [...currentCharacters, character];
      updateFormData({ selectedCharacters: newCharacters });
    }
  };

  const updateCharacterDetail = (
    character: string, 
    field: 'name' | 'description' | 'photo', 
    value: string | File | null
  ) => {
    const currentDetails = formData.characterDetails || {};
    updateFormData({
      characterDetails: {
        ...currentDetails,
        [character]: {
          ...currentDetails[character],
          [field]: value,
        },
      },
    });
  };

  const canGoNext = formData.selectedCharacters.length > 0;

  return (
    <div className="step-container">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary-blue mb-4">
          Personnages additionnels
        </h2>
        <p className="text-gray-600">
          Qui d'autre apparaîtra dans l'histoire de {formData.childFirstName} ?
        </p>
      </div>

      <div className="space-y-8">
        {/* Character selection */}
        <div>
          <label className="form-label mb-4 block">
            Sélectionnez les personnages à inclure
          </label>
          <div className="option-grid">
            {CHARACTER_OPTIONS.map((character) => (
              <label
                key={character}
                className={cn(
                  'option-item',
                  formData.selectedCharacters.includes(character) && 'option-item-selected'
                )}
              >
                <input
                  type="checkbox"
                  checked={formData.selectedCharacters.includes(character)}
                  onChange={() => handleCharacterToggle(character)}
                  className="checkbox-custom"
                />
                <span>{character}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Character details for each selected character */}
        {formData.selectedCharacters.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-dark-blue">
              Détails des personnages
            </h3>
            
            {formData.selectedCharacters.map((character) => (
              <div key={character} className="card space-y-4">
                <h4 className="font-medium text-primary-blue">{character}</h4>
                
                <div>
                  <label className="form-label">
                    Nom du {character.toLowerCase()}
                  </label>
                  <input
                    type="text"
                    value={formData.characterDetails[character]?.name || ''}
                    onChange={(e) => updateCharacterDetail(character, 'name', e.target.value)}
                    className="form-input"
                    placeholder={`Nom du ${character.toLowerCase()}`}
                  />
                </div>

                <FileUpload
                  label={`Photo du ${character.toLowerCase()} (optionnel)`}
                  onFileSelect={(file) => updateCharacterDetail(character, 'photo', file)}
                  currentFile={formData.characterDetails[character]?.photo}
                  optional={true}
                />

                <div>
                  <label className="form-label">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={formData.characterDetails[character]?.description || ''}
                    onChange={(e) => updateCharacterDetail(character, 'description', e.target.value)}
                    className="form-input min-h-[80px]"
                    placeholder={`Décrivez le ${character.toLowerCase()} (apparence, personnalité...)`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <StepNavigation
          currentStep={5}
          totalSteps={7}
          onNext={onNext}
          onBack={onBack}
          canGoNext={canGoNext}
        />
      </div>
    </div>
  );
}
