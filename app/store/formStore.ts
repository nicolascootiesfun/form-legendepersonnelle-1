import { create } from 'zustand';
import { FormData } from '@/app/types';
import { supabase } from '@/app/lib/supabase';

interface FormStore {
  formData: FormData;
  currentStep: number;
  sessionId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  updateFormData: (data: Partial<FormData>) => void;
  setCurrentStep: (step: number) => void;
  setSessionId: (id: string) => void;
  saveToSupabase: () => Promise<void>;
  loadFromSupabase: (sessionId: string) => Promise<void>;
  resetForm: () => void;
}

const initialFormData: FormData = {
  childFirstName: '',
  childAge: 0,
  email: '',
  phoneNumber: '',
  personalityTraits: [],
  preferNoPhoto: false,
  additionalCharacteristics: '',
  physicalDescription: '',
  heroImageValidated: false,
  selectedCharacters: [],
  characterDetails: {},
  storyStyle: '',
  theme: '',
};

export const useFormStore = create<FormStore>((set, get) => ({
  formData: initialFormData,
  currentStep: 1,
  sessionId: null,
  isLoading: false,
  isSaving: false,

  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
    // Trigger auto-save
    get().saveToSupabase();
  },

  setCurrentStep: (step) => set({ currentStep: step }),
  setSessionId: (id) => set({ sessionId: id }),

  saveToSupabase: async () => {
    const { sessionId, formData, currentStep } = get();
    if (!sessionId) return;

    set({ isSaving: true });

    try {
      const { error } = await supabase
        .from('form_submissions')
        .upsert({
          user_session_id: sessionId,
          step_number: currentStep,
          form_data: formData,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_session_id',
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving to Supabase:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  loadFromSupabase: async (sessionId: string) => {
    set({ isLoading: true });

    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('user_session_id', sessionId)
        .single();

      if (error) throw error;

      if (data) {
        set({
          formData: data.form_data,
          currentStep: data.step_number,
          sessionId: sessionId,
        });
      }
    } catch (error) {
      console.error('Error loading from Supabase:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      currentStep: 1,
      sessionId: null,
    });
  },
}));
