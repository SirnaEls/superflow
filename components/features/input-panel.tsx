'use client';

import React from 'react';
import { Upload, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';
import { InputMode, UploadedImage } from '@/types';
import {
  Card,
  CardContent,
  CardTitle,
  Button,
  Textarea,
  ToggleGroup,
  DropZone,
  Alert,
} from '@/components/ui';
import { useImageUpload } from '@/hooks';

// ============================================
// Input Panel Component
// ============================================

interface InputPanelProps {
  inputMode: InputMode;
  onInputModeChange: (mode: InputMode) => void;
  textInput: string;
  onTextInputChange: (value: string) => void;
  onGenerate: (images: UploadedImage[]) => void;
  isGenerating: boolean;
  error: string | null;
}

const INPUT_MODE_OPTIONS = [
  { value: 'text', label: 'Text', icon: <FileText className="w-4 h-4" /> },
  {
    value: 'image',
    label: 'Screenshot',
    icon: <ImageIcon className="w-4 h-4" />,
  },
];

const PLACEHOLDER_TEXT = `Paste your post-it content here...

Example:
Feature: Login
- User enters email
- User enters password
- System validates credentials
- Redirect to dashboard`;

export const InputPanel: React.FC<InputPanelProps> = ({
  inputMode,
  onInputModeChange,
  textInput,
  onTextInputChange,
  onGenerate,
  isGenerating,
  error,
}) => {
  const {
    images,
    fileInputRef,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    removeImage,
    openFilePicker,
  } = useImageUpload();

  const canGenerate =
    inputMode === 'text' ? textInput.trim().length > 0 : images.length > 0;

  const handleGenerateClick = () => {
    onGenerate(images);
  };

  return (
    <Card>
      <CardContent>
        <CardTitle icon={<Upload className="w-5 h-5 text-violet-400" />}>
          Import Post-its
        </CardTitle>

        {/* Mode Toggle */}
        <ToggleGroup
          options={INPUT_MODE_OPTIONS}
          value={inputMode}
          onChange={(v) => onInputModeChange(v as InputMode)}
          className="mt-4 mb-4"
        />

        {/* Text Input Mode */}
        {inputMode === 'text' && (
          <Textarea
            value={textInput}
            onChange={(e) => onTextInputChange(e.target.value)}
            placeholder={PLACEHOLDER_TEXT}
            className="h-64"
          />
        )}

        {/* Image Input Mode */}
        {inputMode === 'image' && (
          <DropZone
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={openFilePicker}
            fileInputRef={fileInputRef}
            onFileSelect={handleFileSelect}
            images={images}
            onRemoveImage={removeImage}
          />
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="error" className="mt-4">
            {error}
          </Alert>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerateClick}
          disabled={isGenerating || !canGenerate}
          isLoading={isGenerating}
          leftIcon={!isGenerating && <Sparkles className="w-5 h-5" />}
          className="mt-6 w-full"
          size="lg"
        >
          {isGenerating ? 'Analyzing...' : 'Generate User Flows'}
        </Button>
      </CardContent>
    </Card>
  );
};
