'use client';

import React, { DragEvent, ChangeEvent, RefObject } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadedImage } from '@/types';

// ============================================
// Drop Zone Component
// ============================================

interface DropZoneProps {
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  images: UploadedImage[];
  onRemoveImage: (id: string) => void;
  className?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onDrop,
  onDragOver,
  onClick,
  fileInputRef,
  onFileSelect,
  images,
  onRemoveImage,
  className,
}) => {
  return (
    <div className={className}>
      {/* Drop Area */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={onClick}
        className={cn(
          'border-2 border-dashed border-white/10 rounded-xl p-8',
          'text-center cursor-pointer',
          'hover:border-violet-500/50 hover:bg-violet-500/5 transition-all'
        )}
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
          onChange={onFileSelect}
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
              <span className="flex-1 text-sm text-slate-300 truncate">
                {img.name}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveImage(img.id);
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
  );
};
