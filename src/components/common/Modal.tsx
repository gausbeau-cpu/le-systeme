import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0A18]/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={cn(
          'relative w-full rounded-3xl bg-[#140F26]/95 border border-[#A87FE8]/30 shadow-[0_20px_60px_rgba(13,10,24,0.8)] backdrop-blur-2xl z-10 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 p-6 sm:p-8',
          maxWidthClasses[maxWidth]
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight font-jost">{title}</h2>
            {subtitle && <p className="text-xs text-[#A87FE8]/80 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
};
