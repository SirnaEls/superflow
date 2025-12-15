'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, ArrowUp, X } from 'lucide-react';
import { InputMode, UploadedImage } from '@/types';
import { useImageUpload, usePlan } from '@/hooks';
import Link from 'next/link';

interface ChatBarProps {
  onGenerate: (text: string, images: UploadedImage[], mode: InputMode) => Promise<void>;
  isGenerating: boolean;
  error: string | null;
}

export function ChatBar({ onGenerate, isGenerating, error }: ChatBarProps) {
  const [textInput, setTextInput] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { plan, remainingGenerations, canGenerate: canGenerateFlow, limits } = usePlan();
  
  const {
    images,
    fileInputRef,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    removeImage,
    openFilePicker,
  } = useImageUpload();

  // Listen to sidebar width changes
  useEffect(() => {
    const handleSidebarToggle = (event: Event) => {
      const customEvent = event as CustomEvent<{ isCollapsed: boolean }>;
      setSidebarWidth(customEvent.detail.isCollapsed ? 64 : 256);
    };

    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('sidebar-collapsed');
        const isCollapsed = saved === 'true';
        setSidebarWidth(isCollapsed ? 64 : 256);
      }
    };

    // Get initial sidebar width
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      const isCollapsed = saved === 'true';
      setSidebarWidth(isCollapsed ? 64 : 256);
    }

    window.addEventListener('sidebar-toggle', handleSidebarToggle);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarToggle);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'fit-content';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 200;
      if (scrollHeight <= maxHeight) {
        textareaRef.current.style.height = 'fit-content';
      } else {
        textareaRef.current.style.height = `${maxHeight}px`;
      }
    }
  }, [textInput]);

  const canGenerate = (textInput.trim().length > 0 || images.length > 0) && canGenerateFlow;

  const handleGenerate = () => {
    if (!canGenerate || isGenerating) return;
    onGenerate(textInput, images, images.length > 0 ? 'image' : 'text');
    setTextInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div 
      className="fixed bottom-0 right-0 z-50 transition-all duration-300 py-4"
      style={{ left: `${sidebarWidth}px` }}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Usage Info */}
        {limits.generationsPerMonth !== -1 && (
          <div className="mb-3 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60">
            {remainingGenerations > 0 ? (
              <span>
                {remainingGenerations} {remainingGenerations === 1 ? 'generation' : 'generations'} remaining this month
              </span>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-red-400">Monthly limit reached</span>
                <Link href="/upgrade" className="text-indigo-400 hover:text-indigo-300 underline">
                  Upgrade
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Images Preview */}
        {images.length > 0 && (
          <div className="mb-3 flex gap-2 flex-wrap">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative group"
              >
                <img
                  src={img.data}
                  alt={img.name}
                  className="w-16 h-16 object-cover rounded-lg border border-white/10"
                />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-[#F0EEE9]" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Chat Bar - Pill Shape */}
        <div 
          className="relative flex items-center bg-[#363636] rounded-full px-2 py-2 min-h-[56px] gap-2"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Left: Add/Attachment Button */}
          <button
            onClick={openFilePicker}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors flex-shrink-0"
            title="Add attachment"
          >
            <Plus className="w-5 h-5 text-[#F0EEE9]" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Center: Text Input */}
          <div className="flex-1 mx-2 flex items-center">
            <textarea
              ref={textareaRef}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your user flow or paste your post-its..."
              className="w-full bg-transparent text-white placeholder:text-white/50 focus:outline-none resize-none text-sm leading-5 py-2.5"
              style={{ 
                height: 'fit-content',
                width: '100%',
                minHeight: '40px',
                maxHeight: '200px'
              }}
              rows={1}
            />
          </div>

          {/* Right: Send Button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className="w-10 h-10 rounded-full bg-[#424242] hover:bg-[#4a4a4a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
            title="Send"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5 text-[#F0EEE9]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
