import React from 'react';
import { cn } from '@/lib/utils';

// ============================================
// Card Component
// ============================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'bg-white/[0.02] backdrop-blur border border-white/5 rounded-2xl',
        className
      )}
    >
      {children}
    </div>
  );
};

// ============================================
// Card Header
// ============================================

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  action,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b border-white/5',
        className
      )}
    >
      <div className="flex items-center gap-2">{children}</div>
      {action}
    </div>
  );
};

// ============================================
// Card Content
// ============================================

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
}) => {
  return <div className={cn('p-6', className)}>{children}</div>;
};

// ============================================
// Card Title
// ============================================

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  icon,
}) => {
  return (
    <h2
      className={cn(
        'text-lg font-semibold flex items-center gap-2',
        className
      )}
    >
      {icon}
      {children}
    </h2>
  );
};
