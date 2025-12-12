'use client';

import { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import { Card, CardTitle, Button, Textarea, ToggleGroup } from '@/components/ui';
import { InputMode, UploadedImage } from '@/types';
import { useImageUpload } from '@/hooks';

interface InputPanelProps {
  onGenerate: (textInput: string, images: UploadedImage[], mode: InputMode) => Promise<void>;
  isGenerating: boolean;
  error: string | null;
  initialText?: string;
}

const INPUT_MODE_OPTIONS = [
  { value: 'text' as InputMode, label: 'Text', icon: <FileText className="w-4 h-4" /> },
  { value: 'image' as InputMode, label: 'Screenshot', icon: <ImageIcon className="w-4 h-4" /> },
];

export function InputPanel({ onGenerate, isGenerating, error, initialText = '' }: InputPanelProps) {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState(initialText);
  
  const {
    images,
    fileInputRef,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    removeImage,
    openFilePicker,
  } = useImageUpload();

  const canGenerate = inputMode === 'text' ? textInput.trim() : images.length > 0;

  const handleGenerate = () => {
    onGenerate(textInput, images, inputMode);
  };

  return (
    <Card className="p-6">
      <CardTitle className="mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-violet-400" />
        Import Post-its
      </CardTitle>

      {/* Mode Toggle */}
      <ToggleGroup
        options={INPUT_MODE_OPTIONS}
        value={inputMode}
        onChange={(value) => setInputMode(value as InputMode)}
        className="mb-4"
      />

      {/* Text Input Mode */}
      {inputMode === 'text' && (
        <Textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={`Paste your post-it content here...

Example:
Feature: Login
- User enters email
- User enters password
- System validates credentials
- Redirect to dashboard`}
          className="h-64"
        />
      )}

      {/* Image Input Mode */}
      {inputMode === 'image' && (
        <div>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={openFilePicker}
            className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all"
          >
            <ImageIcon className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm text-slate-400 mb-1">
              Drop screenshots here or click to upload
            </p>
            <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Uploaded Images Preview */}
          {images.length > 0 && (
            <div className="mt-4 space-y-2">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="flex items-center gap-3 p-2 bg-white/5 rounded-lg group"
                >
                  <img
                    src={img.data}
                    alt={img.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span className="flex-1 text-sm text-slate-300 truncate">{img.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!canGenerate}
        isLoading={isGenerating}
        size="lg"
        className="mt-6 w-full"
      >
        <Sparkles className="w-5 h-5" />
        {isGenerating ? 'Analyzing...' : 'Generate User Flows'}
      </Button>
    </Card>
  );
}
