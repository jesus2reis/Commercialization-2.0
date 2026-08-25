import React from 'react';

interface StatusBadgeProps {
  value: boolean;
  onClick?: () => void;
  interactive?: boolean;
  size?: 'sm' | 'md';
  trueLabel?: string;
  falseLabel?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  value,
  onClick,
  interactive = false,
  size = 'md',
  trueLabel = 'Yes',
  falseLabel = 'No'
}) => {
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[11px]' 
    : 'px-2.5 py-1 text-xs';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      className={`inline-flex items-center justify-center font-bold rounded-md transition-all select-none whitespace-nowrap ${sizeClasses} ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'
      } ${
        value
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/80 shadow-xs'
          : 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs'
      }`}
      title={interactive ? `Click to switch to ${value ? falseLabel : trueLabel}` : undefined}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 inline-block" style={{ backgroundColor: value ? '#059669' : '#e11d48' }} />
      {value ? trueLabel : falseLabel}
    </button>
  );
};
