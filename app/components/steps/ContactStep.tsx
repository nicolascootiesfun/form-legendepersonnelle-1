'use client';

import React, { useState } from 'react';
import { StepProps } from '@/app/types';
import { StepNavigation } from '@/app/components/StepNavigation';
import { validateEmail, validatePhone, formatPhoneNumber } from '@/app/lib/utils';

export function ContactStep({ formData, updateFormData, onNext, onBack }: StepProps) {
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    updateFormData({ email });
    
    if (email && !validateEmail(email)) {
      setEmailError('Adresse email invalide');
    } else {
      setEmailError('');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    const formatted = formatPhoneNumber(phone);
    updateFormData({ phoneNumber: formatted });
    
    if (phone && !validatePhone(phone)) {
      setPhoneError('Numéro de téléphone invalide (format: +33 6 12 34 56 78)');
    } else {
      setPhoneError('');
    }
  };

  const canGoNext = 
    validateEmail(formData.email) && 
    validatePhone(formData.phoneNumber) &&
    !emailError && 
    !phoneError;

  return (
    <div className="step-container">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary-blue mb-4">
          Vos coordonnées
        </h2>
        <p className="text-gray-600">
          Ces informations nous permettront de vous envoyer l'histoire générée
        </p>
      </div>

      <form className="space-y-6 max-w-md mx-auto">
        <div>
          <label htmlFor="email" className="form-label">
            Votre adresse email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleEmailChange}
            className="form-input"
            placeholder="exemple@email.com"
            required
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="form-label">
            Votre numéro de téléphone
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            className="form-input"
            placeholder="+33 6 12 34 56 78"
            required
          />
          {phoneError && <p className="error-message">{phoneError}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Format français avec indicatif +33
          </p>
        </div>

        <div className="bg-light-blue p-4 rounded-lg">
          <p className="text-sm text-dark-blue">
            <strong>Protection des données :</strong> Vos informations sont sécurisées et ne seront utilisées que pour l'envoi de votre histoire personnalisée.
          </p>
        </div>

        <StepNavigation
          currentStep={2}
          totalSteps={7}
          onNext={onNext}
          onBack={onBack}
          canGoNext={canGoNext}
        />
      </form>
    </div>
  );
}
