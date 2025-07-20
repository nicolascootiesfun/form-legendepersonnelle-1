'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { StepProps } from '@/app/types';
import { StepNavigation } from '@/app/components/StepNavigation';
import { supabase } from '@/app/lib/supabase';
import { useFormStore } from '@/app/store/formStore';

export function ImageGenerationStep({ formData, updateFormData, onNext, onBack }: StepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(formData.generatedHeroImageUrl || null);
  const sessionId = useFormStore((state) => state.sessionId);

  useEffect(() => {
    if (!imageUrl && !isGenerating && sessionId) {
      generateHeroImage();
    }
  }, [sessionId]);

  const generateHeroImage = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Trigger N8N webhook
      const webhookUrl = process.env.N8N_IMAGE_GENERATION_WEBHOOK || '/api/generate-image';
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          formData: {
            childFirstName: formData.childFirstName,
            childAge: formData.childAge,
            personalityTraits: formData.personalityTraits,
            physicalDescription: formData.physicalDescription,
            additionalCharacteristics: formData.additionalCharacteristics,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to trigger image generation');
      }

      // Poll Supabase for the generated image
      const pollInterval = setInterval(async () => {
        const { data, error } = await supabase
          .from('generated_images')
          .select('*')
          .eq('user_session_id', sessionId)
          .eq('image_type', 'hero')
          .single();

        if (error) {
          console.error('Polling error:', error);
          return;
        }

        if (data && data.status === 'generated' && data.image_url) {
          clearInterval(pollInterval);
          setImageUrl(data.image_url);
          updateFormData({ generatedHeroImageUrl: data.image_url });
          setIsGenerating(false);
        } else if (data && data.status === 'error') {
          clearInterval(pollInterval);
          setError('Une erreur est survenue lors de la génération de l\'image');
          setIsGenerating(false);
        }
      }, 2000); // Poll every 2 seconds

      // Stop polling after 60 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isGenerating) {
          setError('La génération de l\'image prend plus de temps que prévu. Veuillez réessayer.');
          setIsGenerating(false);
        }
      }, 60000);

    } catch (err) {
      console.error('Error generating image:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setIsGenerating(false);
    }
  };

  const handleValidate = () => {
    updateFormData({ heroImageValidated: true });
  };

  const canGoNext = formData.heroImageValidated && imageUrl !== null;

  return (
    <div className="step-container">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary-blue mb-4">
          Création du héros de l'histoire
        </h2>
        <p className="text-gray-600">
          Nous générons une image personnalisée de {formData.childFirstName} en héros
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {isGenerating && (
          <div className="text-center py-12">
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
            <p className="text-lg text-gray-600">Génération de l'image en cours...</p>
            <p className="text-sm text-gray-500 mt-2">Cela peut prendre quelques instants</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={generateHeroImage}
              className="btn-secondary mt-4"
              disabled={isGenerating}
            >
              Réessayer
            </button>
          </div>
        )}

        {imageUrl && !isGenerating && (
          <div className="space-y-6 fade-in">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
              <Image
                src={imageUrl}
                alt={`${formData.childFirstName} en héros`}
                fill
                className="object-cover"
                priority
              />
            </div>

            {!formData.heroImageValidated && (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Voici {formData.childFirstName} transformé en héros ! 
                  Validez cette image pour continuer.
                </p>
                <button
                  onClick={handleValidate}
                  className="btn-primary"
                >
                  Valider cette image
                </button>
              </div>
            )}

            {formData.heroImageValidated && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-600 font-medium">
                  ✓ Image validée ! Vous pouvez continuer.
                </p>
              </div>
            )}
          </div>
        )}

        <StepNavigation
          currentStep={4}
          totalSteps={7}
          onNext={onNext}
          onBack={onBack}
          canGoNext={canGoNext}
        />
      </div>
    </div>
  );
}
