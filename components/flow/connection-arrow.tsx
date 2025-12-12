import React from 'react';

// ============================================
// Connection Arrow Component (FigJam Style)
// ============================================

interface ConnectionArrowProps {
  label?: string;
  direction?: 'right' | 'down';
}

export const ConnectionArrow: React.FC<ConnectionArrowProps> = ({
  label,
  direction = 'right',
}) => {
  if (direction === 'down') {
    return (
      <div className="flex flex-col items-center py-2">
        <div className="w-0.5 h-6 bg-[#8E8E93]" />
        {label && (
          <span className="text-xs text-[#6E6E73] px-1 bg-[#F7F5F3] rounded">
            {label}
          </span>
        )}
        <div className="w-0.5 h-6 bg-[#8E8E93]" />
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="rotate-90"
        >
          <path
            d="M6 0L11.196 9H0.804L6 0Z"
            fill="#8E8E93"
            transform="rotate(90 6 6)"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex items-center px-3 relative flex-shrink-0">
      {/* Arrow line */}
      <div className="w-20 h-px bg-slate-700/60 relative">
        {/* Arrow head */}
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1"
        >
          <path
            d="M0 0L8 4L0 8V0Z"
            fill="#71717A"
          />
        </svg>
      </div>
      {label && (
        <span className="text-xs text-slate-400 px-2 py-1 bg-slate-900/50 rounded-md ml-2 whitespace-nowrap border border-slate-800/50">
          {label}
        </span>
      )}
    </div>
  );
};
