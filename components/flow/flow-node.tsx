'use client';

import React, { useState } from 'react';
import { FlowNode as FlowNodeType, NodeType } from '@/types';
import { NODE_CONFIGS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { HelpCircle, Edit2, Check, X } from 'lucide-react';

// ============================================
// Node Shape Component
// ============================================

interface NodeShapeProps {
  type: NodeType;
  children: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
}

const NodeShape: React.FC<NodeShapeProps> = ({
  type,
  children,
  isSelected,
  onClick,
}) => {
  const config = NODE_CONFIGS[type] || NODE_CONFIGS.action;

  const baseClasses = cn(
    'transition-all duration-200 cursor-pointer',
    isSelected && 'ring-2 ring-offset-2 ring-offset-[#0A0A0F] ring-indigo-500/50'
  );

  switch (config.shape) {
    case 'rounded-rect':
      return (
        <div
          onClick={onClick}
          className={cn(
            baseClasses,
            'px-6 py-4 rounded-xl border-2 min-w-[160px] max-w-[400px] w-fit text-center hover:border-slate-500 transition-all'
          )}
          style={{ 
            backgroundColor: config.bgColor, 
            color: config.textColor,
            borderColor: config.color,
            borderWidth: '2px'
          }}
        >
          {children}
        </div>
      );

    case 'diamond':
      return (
        <div onClick={onClick} className={cn(baseClasses, 'relative flex items-center justify-center')}>
          <div
            className="min-w-[144px] min-h-[144px] max-w-[300px] max-h-[300px] w-fit h-fit rotate-45 rounded-sm border-2 hover:border-slate-500 transition-all p-4"
            style={{
              backgroundColor: config.bgColor,
              borderColor: config.color,
              borderWidth: '2px',
              aspectRatio: '1 / 1'
            }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center text-center px-4 py-4"
            style={{ color: config.textColor }}
          >
            <span className="text-sm font-medium leading-snug block -rotate-45 break-words max-w-full">
              {children}
            </span>
          </div>
        </div>
      );

    case 'parallelogram':
      return (
        <div
          onClick={onClick}
          className={cn(
            baseClasses,
            'px-6 py-4 border-2 transform skew-x-[-15deg] min-w-[160px] max-w-[400px] w-fit rounded-sm hover:border-slate-500 transition-all'
          )}
          style={{ 
            backgroundColor: config.bgColor, 
            color: config.textColor,
            borderColor: config.color,
            borderWidth: '2px'
          }}
        >
          <span className="block skew-x-[15deg] text-center break-words">{children}</span>
        </div>
      );

    case 'cylinder':
      return (
        <div onClick={onClick} className={cn(baseClasses, 'relative')}>
          <div
            className="min-w-[128px] min-h-[96px] w-fit h-fit rounded-xl border-2 relative overflow-hidden hover:border-slate-500 transition-all py-2"
            style={{
              backgroundColor: config.bgColor,
              borderColor: config.color,
              borderWidth: '2px'
            }}
          >
            {/* Top ellipse effect for 3D cylinder look - plus visible */}
            <svg
              className="absolute top-0 left-0 w-full h-6"
              viewBox="0 0 128 24"
              fill="none"
            >
              <ellipse
                cx="64"
                cy="12"
                rx="64"
                ry="8"
                fill={config.color}
                opacity="0.25"
              />
            </svg>
            <div className="flex items-center justify-center min-h-[calc(100%-24px)] pt-1 px-4 pb-1">
              <span
                className="text-sm font-medium text-center leading-snug break-words"
                style={{ color: config.textColor }}
              >
                {children}
              </span>
            </div>
          </div>
        </div>
      );

    case 'icon':
      return (
        <div onClick={onClick} className={cn(baseClasses, 'flex flex-col items-center')}>
          <div
            className="w-16 h-16 rounded-full border-2 flex items-center justify-center hover:border-slate-500 transition-all"
            style={{
              backgroundColor: config.bgColor,
              borderColor: config.color,
              borderWidth: '2px'
            }}
          >
            <HelpCircle 
              className="w-8 h-8" 
              style={{ color: config.color }}
            />
          </div>
          <span
            className="text-xs font-medium mt-2 text-center max-w-[120px]"
            style={{ color: config.textColor }}
          >
            {children}
          </span>
        </div>
      );

    default:
      return (
        <div
          onClick={onClick}
          className={cn(
            baseClasses,
            'px-6 py-4 rounded-xl border-2 min-w-[160px] max-w-[400px] w-fit text-center hover:border-slate-500 transition-all'
          )}
          style={{
            backgroundColor: config.bgColor,
            borderColor: config.color,
            color: config.textColor,
            borderWidth: '2px'
          }}
        >
          {children}
        </div>
      );
  }
};

// ============================================
// Flow Node Component
// ============================================

interface FlowNodeProps {
  node: FlowNodeType;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  featureId: string;
  onUpdateNode: (featureId: string, nodeId: string, updates: { label?: string; details?: string[] }) => void;
}

export const FlowNode: React.FC<FlowNodeProps> = ({
  node,
  isSelected,
  onSelect,
  featureId,
  onUpdateNode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(node.label);
  const [editDetails, setEditDetails] = useState(node.details?.join('\n') || '');
  const config = NODE_CONFIGS[node.type] || NODE_CONFIGS.action;

  const handleSave = () => {
    const detailsArray = editDetails.trim() 
      ? editDetails.split('\n').filter(d => d.trim())
      : undefined;
    
    onUpdateNode(featureId, node.id, {
      label: editLabel.trim(),
      details: detailsArray,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditLabel(node.label);
    setEditDetails(node.details?.join('\n') || '');
    setIsEditing(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col items-center flex-shrink-0 relative z-50">
        <div
          className="px-6 py-4 rounded-xl border-2 min-w-[200px] max-w-[500px] w-fit bg-slate-900 border-indigo-500 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Label</label>
              <input
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSave();
                  } else if (e.key === 'Escape') {
                    handleCancel();
                  }
                }}
              />
            </div>
            {node.type === 'description' && (
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Details (one per line)</label>
                <textarea
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                  rows={4}
                  placeholder="Detail 1&#10;Detail 2&#10;Detail 3"
                />
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="p-1.5 hover:bg-slate-800 rounded transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={handleSave}
                className="p-1.5 hover:bg-indigo-600 rounded transition-colors"
                title="Save"
              >
                <Check className="w-4 h-4 text-indigo-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center flex-shrink-0 group relative">
      <NodeShape
        type={node.type}
        isSelected={isSelected}
        onClick={() => onSelect?.(node.id)}
      >
        <div 
          className="flex flex-col items-center gap-1 relative w-full"
          onDoubleClick={handleDoubleClick}
        >
          <span className="text-sm font-semibold break-words text-center leading-relaxed w-full px-1">
            {node.label}
          </span>
          {node.type === 'description' && node.details && node.details.length > 0 && (
            <div className="mt-2 pt-2 border-t border-current/20 w-full">
              <ul className="text-xs text-left space-y-1 px-2" style={{ color: config.textColor, opacity: 0.8 }}>
                {node.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start break-words">
                    <span className="mr-2 flex-shrink-0">•</span>
                    <span className="break-words">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="absolute -top-2 -right-2 p-1.5 bg-slate-800 border border-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-700"
              title="Edit"
            >
              <Edit2 className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>
      </NodeShape>
    </div>
  );
};
