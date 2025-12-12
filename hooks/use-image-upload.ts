'use client';

import { useState, useCallback, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadedImage } from '@/types';
import { generateId, fileToBase64 } from '@/lib/utils';

interface UseImageUploadReturn {
  images: UploadedImage[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  openFilePicker: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));

    for (const file of imageFiles) {
      try {
        const data = await fileToBase64(file);
        setImages((prev) => [
          ...prev,
          {
            id: generateId(),
            name: file.name,
            data,
          },
        ]);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(Array.from(e.target.files));
      }
    },
    [processFiles]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files) {
        processFiles(Array.from(e.dataTransfer.files));
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    images,
    fileInputRef,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    removeImage,
    clearImages,
    openFilePicker,
  };
};
