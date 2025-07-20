'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/app/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  currentFile?: File | null;
  accept?: Record<string, string[]>;
  maxSize?: number;
  label?: string;
  optional?: boolean;
}

export function FileUpload({
  onFileSelect,
  currentFile,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
  maxSize = 5 * 1024 * 1024, // 5MB
  label,
  optional = false,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`Le fichier est trop volumineux. Taille maximale: ${maxSize / 1024 / 1024}MB`);
      } else {
        setError('Type de fichier non accepté');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileSelect(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const removeFile = () => {
    onFileSelect(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="form-label">
          {label} {optional && <span className="text-gray-500">(optionnel)</span>}
        </label>
      )}
      
      {!currentFile && !preview ? (
        <div
          {...getRootProps()}
          className={cn(
            'dropzone',
            isDragActive && 'dropzone-active',
            error && 'border-red-500'
          )}
        >
          <input {...getInputProps()} />
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? 'Déposez le fichier ici...'
              : 'Glissez-déposez un fichier ici, ou cliquez pour sélectionner'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, GIF jusqu'à {maxSize / 1024 / 1024}MB
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <img
              src={preview || URL.createObjectURL(currentFile!)}
              alt="Aperçu"
              className="w-full h-48 object-cover"
            />
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {currentFile?.name || 'Fichier sélectionné'}
          </p>
        </div>
      )}
      
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
