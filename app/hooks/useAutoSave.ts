import { useEffect, useRef } from 'react';
import { useFormStore } from '@/app/store/formStore';
import { debounce } from '@/app/lib/utils';

export function useAutoSave() {
  const { formData, saveToSupabase, sessionId } = useFormStore();
  const debouncedSave = useRef(
    debounce(() => {
      if (sessionId) {
        saveToSupabase();
      }
    }, 1000)
  );

  useEffect(() => {
    debouncedSave.current();
  }, [formData]);

  return null;
}
